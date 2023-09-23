// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";


contract Faucet is Owned, Logger, IFaucet {


    
    uint public numOfFunders;
    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;

    

    modifier limitWithdraw(uint withdrawAmount) {
        require(withdrawAmount <= 100000000000000000, "cannot withdraw more than 0.1 ether");
        _;
    }

   function addFunds() override payable external {
    address funder = msg.sender;

    if (!funders[funder]) {
        uint index = numOfFunders++;
        funders[funder] = true;
        lutFunders[index] = funder;
    }
   }

   function justTesting() external pure returns(uint) {
    return 2+2;
   }

   function getAllFunders() external view returns (address[] memory) {
    address[] memory _funders = new address[](numOfFunders);

    for (uint i =0; i < numOfFunders; i++) {
        _funders[i] = lutFunders[i];
    }

    return _funders;
   }

   function test1() external onlyOwner {
    //something that only the owner can access
   }
    
   function test2() external onlyOwner {
    //something that only the owner can access
   }


   function withdraw(uint withdrawAmount) override external limitWithdraw(withdrawAmount) {
     payable(msg.sender).transfer(withdrawAmount);
   }

   function getFunderAtIndex(uint8 index) external view returns(address) {
    return lutFunders[index];
   }

   receive() external payable{}

   function emitLog() public override pure returns(bytes32){
    return "Hello World";
   }

   //pure is stricter than view - pure won't even read the storage state

   // to talk to the node on the network you can make JSON-RPC http calls

//    const instance = await Faucet.deployed()
//    instance.addFunds()
//    instance.addFunds({from: accounts[0], value: "2000000000000000000"})
//    instance.addFunds({from: accounts[1], value: "2000000000000000000"})
//    instance.withdraw("100000000000000000", {from:accounts[1]})
//    instance.getFunderAtIndex(0)
//    instance.getAllFunders()


}