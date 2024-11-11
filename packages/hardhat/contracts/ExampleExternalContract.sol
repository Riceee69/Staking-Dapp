// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;  //Do not change the solidity version as it negativly impacts submission grading

import "./Staker.sol";

contract ExampleExternalContract {

  bool public completed;

  function complete() public payable {
    completed = true;
  }

  function withdraw(address stakingContract) public{
    (bool success, bytes memory data) = address(stakingContract).call{value: address(this).balance}("");
    require(success, "Transfer failed");

    completed = false;
  }
}
