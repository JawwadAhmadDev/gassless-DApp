'use client'
import { createPermitSignature } from '@/utils/createPermitSig';
import { useAccount } from 'wagmi';
import React, { useState } from 'react';
import { getAccount } from '@wagmi/core'
import { config } from '@/config/wagmi';
import { parseEther } from 'viem'


// types
export type PermitData = {
    currentAccount: string | undefined,
    domainName: string,
    chainId: number | undefined,
    contractAddress: string,
    spenderAddress: string,
    tokensAmount: number,
    nonce: number,
    deadline: number
}

const GaslessDeposit: React.FC = () => {
    const [tokens, setTokens] = useState<number>(0);
    const [isSignatureCreated, setIsSignatureCreated] = useState<boolean>(false);
    const [spenderAddress, setSpenderAddress] = useState<string>('');
    const [contractAddress, setContractAddress] = useState<string>('');

    const account = useAccount();
    const currentAccount = getAccount(config)


    const handleCreateSignature = () => {
        const nonces = 0; // get from contract function nonce(address)

        const permitData: PermitData = {
            currentAccount: currentAccount.address,
            domainName: "MyToken",
            chainId: account.chainId,
            contractAddress: contractAddress,
            spenderAddress: spenderAddress,
            tokensAmount: Number(parseEther(String(tokens))),
            nonce: nonces,
            deadline: 2661766724 // set hardly
        }

        // Logic to create signature
        createPermitSignature(permitData) 
        setIsSignatureCreated(true);
    };

    const handleDeposit = () => {
        // Logic for deposit
        console.log(`Depositing ${tokens} tokens`);
    };

    return (
        <div className="flex flex-col items-center justify-center p-5">
            <h1 className="text-2xl font-bold text-gray-200 mb-4">Gasless Deposit</h1>
            
            <input 
                type="text" 
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="mb-4 px-3 py-2 w-1/3 border border-gray-300 text-slate-900 rounded-md"
                placeholder="Token Address"
            />

            <div className='flex gap-2'>
            <input 
                type="number" 
                value={tokens}
                onChange={(e) => setTokens(Number(e.target.value))}
                className="mb-4 px-3 py-2 border border-gray-300 text-slate-900 rounded-md"
                placeholder="Number of tokens"
            />

            <input 
                type="text"
                value={spenderAddress}
                onChange={(e) => setSpenderAddress(e.target.value)}
                className="mb-4 px-3 py-2 border border-gray-300 text-slate-900 rounded-md w-full"
                placeholder="Spender address"
            />
            </div>
            
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
                    onClick={handleDeposit}
                    disabled={!isSignatureCreated || !(account.status === "connected")}
                >
                    Deposit
                </button>
            </div>
        </div>
    );
}

export default GaslessDeposit;
