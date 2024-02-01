'use client'
// GaslessTransfer.tsx
import React, { useState } from 'react';

const GaslessTransfer: React.FC = () => {
    const [to, setTo] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [isSignatureCreated, setIsSignatureCreated] = useState<boolean>(false);

    const handleCreateSignature = () => {
        // Logic to create signature
        setIsSignatureCreated(true);
    };

    const handleTransfer = () => {
        // Logic for transfer
        console.log(`Transferring ${amount} tokens to ${to}`);
    };

    return (
        <div className="flex flex-col items-center justify-center p-5">
            <h1 className="text-2xl font-bold text-gray-200 mb-4">Gasless Transfer</h1>
            
            <input 
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="mb-4 px-3 py-2 border border-gray-300 text-slate-900 rounded-md w-full"
                placeholder="Recipient address"
            />

            <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="mb-4 px-3 py-2 border border-gray-300 text-slate-900 rounded-md w-full"
                placeholder="Amount"
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
                    onClick={handleTransfer}
                    disabled={!isSignatureCreated}
                >
                    Transfer
                </button>
            </div>
        </div>
    );
}

export default GaslessTransfer;
