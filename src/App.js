import { useCallback, useEffect, useState } from "react";
import "./App.css"
import Web3, { ProviderError } from "web3";
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null
  })

  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(null)
  const [shouldReload, reload] = useState(false)

  const canConnectToContract = account && web3Api.contract
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])

  const setAccountListener = provider => {
    provider.on("accountChanged",  _=> window.location.reload());
    provider.on("chainChanged",  _=> window.location.reload());
    
    
    provider._jsonRpcConnection.events.on("notification", payload => {
      const { method } = payload

      if (method === "metamask_unlockStateChanged") {
        setAccount(null)
      }
    })
    
  }

  useEffect(()=>{
    const loadProvider = async () => {
      // with metamask we have access to window.ethereum and to window.web3
      // metamask injects a global API into the website
      // this API allows websites to request users, accounts, read data to the blockchain,
      // sign messages and transactions

      console.log(window.web3);
      console.log(window.ethereum);

      // let provider = null;
      const provider = await detectEthereumProvider()
      const contract = await loadContract("Faucet",provider)

      if (provider){
        // provider.request({method: "eth_requestAccounts"})
        // const contract = await loadContract("Faucet",provider)
        setAccountListener(provider)
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true
        })
      } else {
        setWeb3Api(api => ({...api, isProviderLoaded: true}))
        console.error("please install metamask")
      }

      // if (window.ethereum) {
      //   provider = window.ethereum;

      //   try{
      //     await provider.request({method:"eth_requestAccounts"});
      //   } catch {
      //     console.error("user denied account access")
      //   }
      // } else if (window.web3){
      //   provider = window.web3.currentProvider;
      // } else if (!process.env.production) {
      //   provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
      // }

      
    }

    console.log(web3Api.web)

    loadProvider()
  },[])

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.target)
      setBalance(web3.utils.fromWei(balance,"ether"))
    }

    web3Api.contract && loadBalance()
  },[web3Api.web3, shouldReload])

  useEffect(() => {
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }

    web3Api.web3 && getAccounts()
  },[web3Api.web3])

  const addFunds = useCallback(async() => {
    const { contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")

    })
    reloadEffect()
  },[web3Api, account, reloadEffect])

  const withdraw = async () => {
    const { contract, web3 } = web3Api
    const withdrawAmount = web3.utils.toWei("0.1","ether")
    await contract.withdraw({
      from: account,
    })
    reloadEffect()
  }

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        {web3Api.isProviderLoaded ?
          <div className="is-flex is-align-items-center">
            <span>
              <strong className="mr-2">Account: </strong>
            </span>
              { account? 
              <div>{account}</div> :
              !web3Api.provider ?
              <>
              <div className="notification is-warning is-small is-rounded">
                Wallet is not detected!{` `}
                <a rel="noreferrer" target="_blank" href="https://docs.metamask.io">
                  Install Metamask
                </a>
              </div>
              </> 
              : <button 
              className="button is-small" 
              onClick={() => web3Api.provider.request({method: "eth_requestAccounts"})}
              >
                Connect Wallet 
                </button>
              }
          </div> :
          <span>Looking for Web3...</span>
        }

        <div className="balance-view is-size-2 my-4">
          Current Balance: <strong>{balance}</strong> ETH
        </div>
        {!canConnectToContract &&
         <i className="is-block">
          Connect to Ganache
         </i>
        }
        <button
        disabled={!canConnectToContract} 
          onClick={addFunds}
          className="button is-link mr-2">Donate 1 eth</button>
        <button
          disabled={!canConnectToContract}
          onClick={withdraw}
          className="button is-primary">Withdraw 0.1 eth</button>
      </div>
    </div>
  );
}

export default App;