import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { abi as contractABI } from '../Liquidity.json';

const CONTRACT_ADDRESS = "0x53f1e235929dFBaA28bFb962D12B56f8fc48Cc12";

const RemoveLiquidity = () => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(50);
  const [userShares, setUserShares] = useState('0');
  const [withdrawAmount1, setWithdrawAmount1] = useState('0');
  const [withdrawAmount2, setWithdrawAmount2] = useState('0');
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
      } else {
        throw new Error('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    }
  };

  const fetchPoolData = async (userAccount) => {
    if (!userAccount) return;
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const liquidityPool = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

      const [
        userSharesBN,
        reserve1BN,
        reserve2BN,
        totalSharesBN
      ] = await Promise.all([
        liquidityPool.shares(userAccount),
        liquidityPool.reserve1(),
        liquidityPool.reserve2(),
        liquidityPool.totalShares()
      ]);

      setUserShares(ethers.utils.formatEther(userSharesBN));

      // Only calculate withdrawal amounts if user has shares
      if (!userSharesBN.isZero()) {
        const sharesToWithdraw = userSharesBN.mul(percentage).div(100);
        const amount1 = reserve1BN.mul(sharesToWithdraw).div(totalSharesBN);
        const amount2 = reserve2BN.mul(sharesToWithdraw).div(totalSharesBN);

        setWithdrawAmount1(ethers.utils.formatEther(amount1));
        setWithdrawAmount2(ethers.utils.formatEther(amount2));
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error fetching pool data:', error);
      setError('Failed to fetch pool data. Please check your connection and try again.');
    }
  };

  const handlePercentageChange = async (newPercentage) => {
    if (!account || !isInitialized) return;
    
    setPercentage(newPercentage);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const liquidityPool = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

      const [userSharesBN, reserve1BN, reserve2BN, totalSharesBN] = await Promise.all([
        liquidityPool.shares(account),
        liquidityPool.reserve1(),
        liquidityPool.reserve2(),
        liquidityPool.totalShares()
      ]);

      if (!userSharesBN.isZero()) {
        const sharesToWithdraw = userSharesBN.mul(newPercentage).div(100);
        const amount1 = reserve1BN.mul(sharesToWithdraw).div(totalSharesBN);
        const amount2 = reserve2BN.mul(sharesToWithdraw).div(totalSharesBN);

        setWithdrawAmount1(ethers.utils.formatEther(amount1));
        setWithdrawAmount2(ethers.utils.formatEther(amount2));
      }
    } catch (error) {
      console.error('Error calculating withdraw amounts:', error);
      setError('Failed to calculate withdrawal amounts');
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!account || percentage === 0 || !isInitialized) return;

    try {
      setLoading(true);
      setError('');
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const liquidityPool = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const userSharesBN = await liquidityPool.shares(account);
      const sharesToWithdraw = userSharesBN.mul(percentage).div(100);

      // Estimate gas to check if transaction will fail
      try {
        await liquidityPool.estimateGas.removeLiquidity(sharesToWithdraw);
      } catch (error) {
        throw new Error('Transaction will fail. Please check your shares and try again.');
      }

      const tx = await liquidityPool.removeLiquidity(sharesToWithdraw);
      await tx.wait();

      // Refresh data after successful removal
      await fetchPoolData(account);
      setLoading(false);
      setPercentage(50);
    } catch (error) {
      console.error('Error removing liquidity:', error);
      setLoading(false);
      setError(error.message || 'Failed to remove liquidity');
    }
  };

  useEffect(() => {
    if (account) {
      fetchPoolData(account);
    }
  }, [account]);

  return (
    <div className="bg-blue-50 p-8 rounded-lg shadow-md max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-purple-800">Remove Liquidity</h2>
        <button
          onClick={connectWallet}
          className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm"
        >
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between">
          <h3 className="text-md font-medium mb-2 text-black">Your Shares</h3>
          <span className="text-sm text-gray-600">{userShares}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={(e) => handlePercentageChange(Number(e.target.value))}
          className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
          disabled={!isInitialized || !account}
        />
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">0%</span>
          <span className="text-sm text-purple-600 font-medium">{percentage}%</span>
          <span className="text-sm text-gray-600">100%</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg mb-6">
        <h3 className="text-md font-medium mb-3 text-black">You Will Receive</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Token 1</span>
            <span className="text-black font-medium">{withdrawAmount1}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Token 2</span>
            <span className="text-black font-medium">{withdrawAmount2}</span>
          </div>
        </div>
      </div>

      <button
        className={`w-full py-3 rounded-lg font-medium ${
          loading || !account || percentage === 0 || !isInitialized
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
        onClick={handleRemoveLiquidity}
        disabled={loading || !account || percentage === 0 || !isInitialized}
      >
        {loading ? 'Removing Liquidity...' : 'Remove Liquidity'}
      </button>
    </div>
  );
};

export default RemoveLiquidity;