// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;  //Do not change the solidity version as it negativly impacts submission grading

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {
  mapping (address => uint256) balanceOf;
  mapping (address => uint256) initialDepositTime;
  uint256 public depositTimeEnd;
  uint256 public withdrawalTimeEnd;
  uint256 public rewardPerSecond = 0.1 ether;
  address owner;

  uint256 public time;

  ExampleExternalContract public exampleExternalContract;

  event Stake(address indexed sender, uint256 value);
  event Withdrawal(address indexed to, uint256 value);
  event Executed(address indexed sender, uint256 value);

  modifier depositPeriodEnded(bool status){
    if(status){
      require(block.timestamp >= depositTimeEnd, "Deposit Period is not over");
    }else{
      require(block.timestamp < depositTimeEnd, "Deposit period is over");
    }
    _;
  }

  modifier withdrawalPeriodEnded(bool status){
    if(status){
      require(block.timestamp >= withdrawalTimeEnd, "Withdrawal period is not over");
    }else{
      require(block.timestamp < withdrawalTimeEnd, "Withdrawal period is over");
    }
    _;
  }

  modifier notCompleted {
    bool completed = exampleExternalContract.completed();
    require(!completed, "Staking is Over!!!");
    _;
  }

  constructor(address exampleExternalContractAddress) {
      exampleExternalContract = ExampleExternalContract(exampleExternalContractAddress);
      depositTimeEnd = block.timestamp + 100;
      withdrawalTimeEnd = block.timestamp + 200;
      owner = 0x33a9715041FfFD413BB13c5E653cE19EdDf71F78;
  }

 function stake() public payable depositPeriodEnded(false) withdrawalPeriodEnded(false) notCompleted{
    if(initialDepositTime[msg.sender] == 0){
      initialDepositTime[msg.sender] = block.timestamp;
    }

    balanceOf[msg.sender] += msg.value;
    emit Stake(msg.sender, msg.value);
  }

  function withdraw() public depositPeriodEnded(true) withdrawalPeriodEnded(false) notCompleted{
    require(balanceOf[msg.sender] > 0, "User hasn't deposited any money");
    
    uint256 withdrawalAmount = balanceOf[msg.sender] +
    (block.timestamp - initialDepositTime[msg.sender]) * rewardPerSecond;

    (bool success, bytes memory data) = msg.sender.call{value: withdrawalAmount}("");
    require(success, "Transfer failed");

    balanceOf[msg.sender] = 0;
    emit Withdrawal(msg.sender, withdrawalAmount);
  }

  function execute() public withdrawalPeriodEnded(true) notCompleted {
    uint256 contractBalance = address(this).balance;

    exampleExternalContract.complete{value: contractBalance}();
    emit Executed(address(this), contractBalance);
  }

  function getTime() public{
    time = block.timestamp;
  }

  function extract() public {
    require(msg.sender == owner, "Permission denied");

    exampleExternalContract.withdraw(address(this));
  }

  receive() external payable {
    // This function allows the contract to receive Ether
  }

  
}
