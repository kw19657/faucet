
import contract from "@truffle/contract"
//importing contract from node modules

export const loadContract = async (name, provider) => {
    const res = await fetch(`/contracts/${name}.json`)
    const Artifact = res.json()

    const _contract = contract(Artifact)
    _contract.setProvider(provider)

    let deployedContract = null

    try {
        deployedContract = await _contract.deployed()

    } catch {
        console.error("you are connected to the wrong network")
    }


    return deployedContract

   }