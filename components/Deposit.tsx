'use client'
// GaslessDeposit.tsx
import React, { useState } from 'react';

const GaslessDeposit: React.FC = () => {
    const [tokens, setTokens] = useState<number>(0);
    const [isSignatureCreated, setIsSignatureCreated] = useState<boolean>(false);

    const handleCreateSignature = () => {
        // Logic to create signature
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
                type="number" 
                value={tokens}
                onChange={(e) => setTokens(Number(e.target.value))}
                className="mb-4 px-3 py-2 border border-gray-300 text-slate-900 rounded-md"
                placeholder="Number of tokens"
            />
            
            <div className="flex gap-4">
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    onClick={handleCreateSignature}
                    disabled={isSignatureCreated}
                >
                    Create Signature
                </button>
                <button 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    onClick={handleDeposit}
                    disabled={!isSignatureCreated}
                >
                    Deposit
                </button>
            </div>
        </div>
    );
}

export default GaslessDeposit;
