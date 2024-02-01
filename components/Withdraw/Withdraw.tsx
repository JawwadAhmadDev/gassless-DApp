'use client'
// GaslessWithdraw.tsx
import React, { useState } from 'react';

const GaslessWithdraw: React.FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [isSignatureCreated, setIsSignatureCreated] = useState<boolean>(false);

    const handleCreateSignature = () => {
        // Logic to create signature
        setIsSignatureCreated(true);
    };

    const handleWithdraw = () => {
        // Logic for withdrawal
        console.log(`Withdrawing ${amount} tokens`);
    };

    return (
        <div className="flex flex-col items-center justify-center p-5">
            <h1 className="text-2xl font-bold text-gray-200 mb-4">Gasless Withdraw</h1>
            
            <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mb-4 px-3 py-2 border border-gray-300 text-slate-900 rounded-md w-full"
                placeholder="Amount to withdraw"
            />
            
            <div className="flex gap-4">
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleCreateSignature}
                    disabled={isSignatureCreated}
                >
                    Create Signature
                </button>
                <button 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleWithdraw}
                    disabled={!isSignatureCreated}
                >
                    Withdraw
                </button>
            </div>
        </div>
    );
}

export default GaslessWithdraw;
