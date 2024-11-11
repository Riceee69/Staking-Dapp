"use client";

import { StakeContractInteraction } from "./staker-ui/_components/StakeContractInteraction";
import type { NextPage } from "next";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

const StakerUI: NextPage = () => {
  const { data: StakerContract } = useDeployedContractInfo("Staker");
  return <StakeContractInteraction key={StakerContract?.address} />;
};

export default StakerUI;


