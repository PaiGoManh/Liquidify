import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Token1ABI from "../TokenA.json";
import Token2ABI from "../TokenB.json";

// Addresses of the deployed contracts
const token1Address = "0xdCb6045799274EA34f4cfCa7e60880420F45bA58";
const token2Address = "0xdCbB470036E74c9DD7C1EAed43057A847bBCb1ed";

const TokenList = () => {
  const [provider, setProvider] = useState(null);
  const [token1Details, setToken1Details] = useState({});
  const [token2Details, setToken2Details] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        try {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
        } catch (err) {
          console.error("Error setting up provider:", err);
          setError("Failed to connect to Ethereum wallet.");
        }
      } else {
        setError("Please install MetaMask or another Ethereum wallet.");
      }
    };
    initProvider();
  }, []);

  const fetchTokenDetails = async () => {
    if (!provider) return;
    setLoading(true);
    setError("");
    try {
        // Token1 Contract
        const token1Contract = new ethers.Contract(token1Address, Token1ABI.abi, provider);
        const token1Name = await token1Contract.name();
        const token1Symbol = await token1Contract.symbol();
        const token1Balance = await token1Contract.balanceOf(token1Address);
        
        // Convert BigNumber to string (or integer if safe)
        const token1BalanceFormatted = token1Balance.toString();  // You can also use .toNumber() if the number fits
      
        // Token2 Contract
        const token2Contract = new ethers.Contract(token2Address, Token2ABI.abi, provider);
        const token2Name = await token2Contract.name();
        const token2Symbol = await token2Contract.symbol();
        const token2Balance = await token2Contract.balanceOf(token2Address);
      
        // Convert BigNumber to string (or integer if safe)
        const token2BalanceFormatted = token2Balance.toString();  // Same as above
      
        // Update state with fetched details
        setToken1Details({ 
          name: token1Name, 
          symbol: token1Symbol, 
          balance: token1BalanceFormatted  // Use formatted balance
        });
        setToken2Details({ 
          name: token2Name, 
          symbol: token2Symbol, 
          balance: token2BalanceFormatted  // Use formatted balance
        });
      } catch (err) {
        console.error("Error fetching token details:", err);
        setError("Failed to fetch token details. Check the console for errors.");
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-blue-600 text-white py-6 text-center">
        <h1 className="text-3xl font-bold">Token Details Viewer</h1>
        <button
          className={`mt-4 px-6 py-2 text-white font-medium rounded-lg ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
          }`}
          onClick={fetchTokenDetails}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Fetch Token Details"}
        </button>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </header>
      <main className="p-8">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Token 1 Details</h2>
          {token1Details.name ? (
            <ul className="space-y-2">
              <li>
                <strong>Name:</strong> {token1Details.name}
              </li>
              <li>
                <strong>Symbol:</strong> {token1Details.symbol}
              </li>
              <li>
                <strong>Balance:</strong> {token1Details.balance}
              </li>
            </ul>
          ) : (
            <p className="text-gray-500">No details available yet.</p>
          )}
        </div>
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Token 2 Details</h2>
          {token2Details.name ? (
            <ul className="space-y-2">
              <li>
                <strong>Name:</strong> {token2Details.name}
              </li>
              <li>
                <strong>Symbol:</strong> {token2Details.symbol}
              </li>
              <li>
                <strong>Balance:</strong> {token2Details.balance}
              </li>
            </ul>
          ) : (
            <p className="text-gray-500">No details available yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TokenList;
