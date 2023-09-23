import { useEffect, useState } from "react";
import "./App.css"
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  })

  const [account, setAccount] = useState(null)

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
      const { contract } = await loadContract("Faucet",provider)

      if (provider){
        // provider.request({method: "eth_requestAccounts"})
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        })
      } else {
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
    const getAccounts = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }

    web3Api.web3 && getAccounts()
  },[web3Api.web3])

  return (
    <div className="faucet-wrapper">
      <div className="faucet">
        <div className="is-flex is-align-items-center">
          <span>
            <strong className="mr-2">Account: </strong>
          </span>
            { account? 
            <span>{account}</span>
            : <button 
            className="button is-small" 
            onClick={() => web3Api.provider.request({method: "eth_requestAccounts"})}
            >
               Connect Wallet </button>
            }
        </div>

        <div className="balance-view is-size-2 my-4">
          Current Balance: <strong>10 </strong> ETH
        </div>

        <button className="button is-link mr-2">Donate</button>
        <button className="button is-primary">Withdraw</button>
      </div>
    </div>
  );
}

export default App;