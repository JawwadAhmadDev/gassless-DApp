// Assuming this code is in a file named WalletConnect.js or similar in your Next.js project
'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import React from 'react';

function WalletConnect() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <>
    <div className="bg-gray-800 px-5 py-1">
      <div className="max-w-4xl mx-auto">
        {/* Account Status */}
        <div className="bg-gray-700 text-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Account</h2>
          <div>
            <p>Status: <span className="font-medium">{account.status}</span></p>
            <p>Addresses: <span className="font-medium">{JSON.stringify(account.addresses)}</span></p>
            <p>Chain ID: <span className="font-medium">{account.chainId}</span></p>
          </div>
          {account.status === 'connected' && (
            <button
              type="button"
              onClick={() => disconnect()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-150 ease-in-out"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Connect */}
        <div className="bg-gray-700 shadow rounded-lg px-3 py-4">
          <h2 className="text-xl font-semibold mb-4 text-white">Connect</h2>
          <div className="grid grid-cols-2 gap-4">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150 ease-in-out"
              >
                {connector.name}
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm">{status}</div>
          {error?.message && <div className="mt-2 text-sm text-red-400">{error.message}</div>}
        </div>
      </div>
    </div>
    </>
  );
}

export default WalletConnect;
