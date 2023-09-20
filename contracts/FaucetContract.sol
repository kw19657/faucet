// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    
    address[] public funders;

   function addFunds() payable external {
    funders.push(msg.sender);
   }

   function justTesting() external pure returns(uint) {
    return 2+2;
   }

   function getAllFunders() public view returns(address[] memory) {
    return funders;
   }

   function getFunderAtIndex(uint8 index) external view returns(address) {
    address[] memory _funders = getAllFunders();
    return _funders[index];
   }

   //pure is stricter than view - pure won't even read the storage state

   // to talk to the node on the network you can make JSON-RPC http calls


}