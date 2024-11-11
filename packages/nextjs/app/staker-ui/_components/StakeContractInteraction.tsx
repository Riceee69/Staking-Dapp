"use client";

import { ETHToPrice } from "./EthToPrice";
import { formatEther, parseEther } from "viem";
import { useDeployedContractInfo, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";
import {useState} from 'react';

export const StakeContractInteraction = () => {
  const { data: StakerContract } = useDeployedContractInfo("Staker");
  const { data: ExampleExternalContact } = useDeployedContractInfo("ExampleExternalContract");
  const { data: stakerContractBalance } = useWatchBalance({
    address: StakerContract?.address,
  });
  const { data: exampleExternalContractBalance } = useWatchBalance({
    address: ExampleExternalContact?.address,
  });
  const [etherValue, setEtherValue] = useState<string>("");

  //Contract Read Actions
  const { data: isStakingCompleted } = useScaffoldReadContract({
    contractName: "ExampleExternalContract",
    functionName: "completed",
    watch: true,
  });

  const { writeContractAsync } = useScaffoldWriteContract("Staker");

  return (
    <div className="flex items-center flex-col flex-grow w-full px-4 gap-12">
      {isStakingCompleted && (
        <div className="flex flex-col items-center gap-2 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 mt-12 w-full max-w-lg">
          <p className="block m-0 font-semibold">
            {" "}
            🎉 &nbsp; Staking App triggered `ExampleExternalContract` &nbsp; 🎉{" "}
          </p>
          <div className="flex items-center">
            <ETHToPrice
              value={exampleExternalContractBalance ? formatEther(exampleExternalContractBalance.value) : undefined}
              className="text-[1rem]"
            />
            <p className="block m-0 text-lg -ml-1">staked !!</p>
          </div>
        </div>
      )}
      <div
        className={`flex flex-col items-center space-y-8 bg-base-100 shadow-lg shadow-secondary border-8 border-secondary rounded-xl p-6 w-full max-w-lg ${
          !isStakingCompleted ? "mt-24" : ""
        }`}
      >
        <div className="flex flex-col items-center shrink-0 w-full">
          <p className="block text-xl mt-0 mb-1 font-semibold">Total Staked</p>
          <div className="flex space-x-2">
            {<ETHToPrice value={stakerContractBalance ? formatEther(stakerContractBalance.value) : undefined} />}
          </div>
        </div>
        <div className="flex flex-col space-y-5">
          <div className="flex space-x-7">
            <button
              className="btn btn-primary uppercase"
              onClick={async () => {
                try {
                  await writeContractAsync({ functionName: "execute" });
                } catch (err) {
                  console.error("Error calling execute function");
                }
              }}
            >
              Execute!
            </button>
            <button
              className="btn btn-primary uppercase"
              onClick={async () => {
                try {
                  await writeContractAsync({ functionName: "withdraw" });
                } catch (err) {
                  console.error("Error calling withdraw function");
                }
              }}
            >
              Withdraw
            </button>
          </div>
          <button
            className="btn btn-primary uppercase"
            onClick={async () => {
              try {
                if(etherValue !== "0" && etherValue !== ""){
                await writeContractAsync({ functionName: "stake", value: parseEther(etherValue) });
                }else{
                  window.alert("No ETH to Stake!!!")
                }
              } catch (err) {
                console.error("Error calling stake function");
              }
            }}
          >
            🔏 Stake 
            <input
              type="text"
              value={etherValue}
              onChange={(e) => setEtherValue(e.target.value)} 
              onClick={
                (event) => event.stopPropagation()
              }
              placeholder="0"
              className="input input-bordered"
              style={{
                width: "60px",
                height: "30px", 
                textAlign: "center",
              }}
            />
            ether!
          </button>
        </div>
      </div>
    </div>
  );
};
