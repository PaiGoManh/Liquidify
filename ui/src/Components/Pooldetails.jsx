import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { abi as contractABI } from '../Liquidity.json';

const PoolDetails = () => {
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [amountToSwap, setAmountToSwap] = useState(0);
  const [selectedToken, setSelectedToken] = useState("TokenA"); // Default to TokenA
  const location = useLocation();
  const poolData = location.state;
  console.log(poolData);

  // Initialize the provider and contract (add your contract address and ABI here)
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractAddress = "0x53f1e235929dFBaA28bFb962D12B56f8fc48Cc12";  // Replace with actual contract address
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  // Swap functionality
  const handleSwap = async () => {
    try {
      if (amountToSwap <= 0) {
        alert("Please enter a valid amount.");
        return;
      }

      // Check which token the user wants to swap
      const fromToken = selectedToken === "TokenA" ? poolData.token1 : poolData.token2;
      const amountIn = ethers.utils.parseUnits(amountToSwap.toString(), 18); // Assuming 18 decimals

      // Call the swap function in the contract
      const tx = await contract.swap(fromToken, amountIn);
      await tx.wait();
      alert("Swap successful!");
      setIsSwapOpen(false);
    } catch (error) {
      console.error("Swap failed:", error);
      alert("Swap failed. Please try again.");
    }
  };

  const SwapModal = () =>
    isSwapOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Swap Tokens</h3>
            <button
              onClick={() => setIsSwapOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">From</label>
              <input
                type="number"
                placeholder="0.0"
                value={amountToSwap}
                onChange={(e) => setAmountToSwap(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-black"
              />
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-white bg-purple-700"
                onChange={(e) => setSelectedToken(e.target.value)}
              >
                <option value="TokenA">{poolData.token1Name}</option>
                <option value="TokenB">{poolData.token2Name}</option>
              </select>
            </div>
            <button className="w-full p-2 text-gray-600 hover:bg-gray-100 rounded">
              ↑↓
            </button>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">To</label>
              <input
                type="number"
                value={0.0}
                readOnly
                className="text-black w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                disabled
              >
                <option value={selectedToken === "TokenA" ? "TokenB" : "TokenA"}>
                  {selectedToken === "TokenA" ? poolData.token2Name : poolData.token1Name}
                </option>
              </select>
            </div>
            <button
              onClick={handleSwap}
              className="w-full bg-purple-700 text-white p-2 rounded hover:bg-pink-600 transition-colors"
            >
              Swap
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-[gold]"></div>
            <h1 className="text-2xl font-bold ml-2 text-black">
              {poolData.token1Name}/{poolData.token2Name}
            </h1>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsSwapOpen(true)}
            className="flex items-center px-4 py-2 bg-pink-50 text-pink-500 rounded hover:bg-pink-100 transition-colors"
          >
            ↑↓ Swap
          </button>
          <Link to='/add'>
            <button className="flex items-center px-4 py-2 bg-pink-50 text-pink-500 rounded hover:bg-pink-100 transition-colors">
              + Add liquidity
            </button>
          </Link>
          <Link to='/remove'>
            <button className="flex items-center px-4 py-2 bg-pink-50 text-pink-500 rounded hover:bg-pink-100 transition-colors">
              - Remove liquidity
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-black">Token A</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Token A:</strong> {poolData.token1Name}
            </p>
            <p className="text-gray-700">
              <strong>Reserve:</strong>{" "}
              {ethers.utils.formatUnits(poolData.reserve1, 18)}{" "}
              {poolData.token1Name}
            </p>
            <p className="text-gray-700">
              <strong>Amount:</strong> {poolData.amount1}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-black">Token B</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Token B:</strong> {poolData.token2Name}
            </p>
            <p className="text-gray-700">
              <strong>Reserve:</strong>{" "}
              {ethers.utils.formatUnits(poolData.reserve2, 18)}{" "}
              {poolData.token2Name}
            </p>
            <p className="text-gray-700">
              <strong>Amount:</strong> {poolData.amount2}
            </p>
            <p className="text-gray-700">
              <strong>Total Shares:</strong>{" "}
              {parseFloat(poolData.totalShares).toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      <SwapModal />
    </div>
  );
};

export default PoolDetails;
