"use client";
import React, { useState } from "react";

import { useAccount } from "wagmi";
import {
  type ReadContractReturnType,
  getAccount,
  readContract,
  writeContract,
} from "@wagmi/core";
import { config } from "@/config/wagmi";
import toast from "react-hot-toast";
import { contract, uToken_ABI } from "@/contracts/uTokenFactory/contract";
import { parseEther } from "viem";
import { createWithdrawSignature } from "@/utils/createWithdrawSig";

export type CreateWithdrawSigData = {
  domainName: string;
  chainId: number | undefined;
  contractAddress: string;
  relayerAddress: string;
  amount: number;
  message: string;
};

type WithdrawData = {
  uTokenAddress: string;
  signer: string;
  amount: number;
  message: string;
  signature: string;
};

const GaslessWithdraw: React.FC = () => {
  const [tokensAmount, setTokensAmount] = useState<number>(0);
  const [isSignatureCreated, setIsSignatureCreated] = useState<boolean>(false);
  const [relayerAddress, setRelayerAddress] = useState<string>("");
  const [ERC20PermitAddress, setERC20PermitAddress] = useState<string>("");
  const [withdrawData, setWithdrawData] = useState<WithdrawData>({
    uTokenAddress: "",
    signer: "",
    amount: 0,
    message: "",
    signature: "",
  });

  const account = useAccount();
  const currentAccount = getAccount(config);

  const handleCreateSignature = async () => {
    const message = `I am authorizing relayer via MetaMask to perform "withdraw" transaction on my behalf, ensuring secure and efficient operations.`;
    try {
      const uTokenAddress: ReadContractReturnType = await readContract(config, {
        abi: uToken_ABI,
        address: (account.chainId === 5
          ? contract.goerli
          : contract.mumbai) as `0x${string}`,
        functionName: "get_uTokenAddressOfToken",
        args: [ERC20PermitAddress],
      });

      // collecting data for creation of signature
      const createWithdrawSigData: CreateWithdrawSigData = {
        domainName: "uTokenFactory",
        chainId: account.chainId,
        contractAddress:
          account.chainId === 5 ? contract.goerli : contract.mumbai,
        relayerAddress: relayerAddress,
        amount: Number(parseEther(String(tokensAmount))),
        message: message,
      };

      const signature = await createWithdrawSignature(createWithdrawSigData);

      setWithdrawData({
        ...withdrawData,
        uTokenAddress: uTokenAddress as string,
        signer: currentAccount.address as string,
        amount: Number(parseEther(String(tokensAmount))),
        message: message,
        signature: signature,
      });

      toast.success(`Signature created.\nSignature:${signature}`);
      setIsSignatureCreated(true);
    } catch (error) {
      toast.error(`Error while creating signature.\n ${error}`);
    }
  };

  const handleWithdraw = async () => {
    try {
      const result = await writeContract(config, {
        abi: uToken_ABI,
        address: (account.chainId === 5
          ? contract.goerli
          : contract.mumbai) as `0x${string}`,
        functionName: "withdrawWithPermit",
        args: [
          withdrawData.uTokenAddress,
          withdrawData.signer,
          withdrawData.amount,
          withdrawData.message,
          withdrawData.signature,
        ],
      });

      toast.success("Withdrawn successfully.");
      toast.success(`Transactions Hash: ${result}`);
      setIsSignatureCreated(false);
    } catch (error) {
      toast.error(`Error while Withdraw with Permit.\n${error}`);
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h1 className="text-2xl font-bold text-gray-200 mb-4">
        Gasless Withdraw
      </h1>

      <input
        type="text"
        value={ERC20PermitAddress}
        onChange={(e) => setERC20PermitAddress(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 text-slate-900 rounded-md w-full"
        placeholder="Token Address"
      />

      <input
        type="text"
        value={relayerAddress}
        onChange={(e) => setRelayerAddress(e.target.value)}
        className="mb-4 px-3 py-2 border border-gray-300 text-slate-900 rounded-md w-full"
        placeholder="Relayer Address"
      />

      <input
        type="number"
        value={tokensAmount}
        onChange={(e) => setTokensAmount(Number(e.target.value))}
        className="mb-4 px-3 py-2 border border-gray-300 text-slate-900 rounded-md w-full"
        placeholder="Amount to withdraw"
      />

      <div className="flex gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          onClick={handleCreateSignature}
          disabled={isSignatureCreated || !(account.status === "connected")}
        >
          Create Signature
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          onClick={handleWithdraw}
          disabled={!isSignatureCreated || !(account.status === "connected")}
        >
          Deposit
        </button>
      </div>
    </div>
  );
};

export default GaslessWithdraw;
