import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const RemoveLiquidity = () => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [percentage, setPercentage] = useState(50);
  const [userShares, setUserShares] = useState('0');
  const [withdrawAmount1, setWithdrawAmount1] = useState('0');
  const [withdrawAmount2, setWithdrawAmount2] = useState('0');

  const LIQUIDITY_POOL_ADDRESS = "0x6B4ccdb95cb023b040A7c9aAc5dae986f8AC2976";
  const TOKEN_A_ADDRESS = "0xA3183705B6A60A68EE15eF01714F5851C4720Bcf";
  const TOKEN_B_ADDRESS = "0xEc73ef4F29373A492dB5350e925B8847334A8a84";

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        await fetchUserShares(accounts[0]);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const fetchUserShares = async (userAccount) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const liquidityPool = new ethers.Contract(LIQUIDITY_POOL_ADDRESS, [
        "function shares(address) view returns (uint256)",
        "function getReserves() view returns (uint256, uint256)",
        "function totalShares() view returns (uint256)"
      ], provider);

      const shares = await liquidityPool.shares(userAccount);
      const [reserve1, reserve2] = await liquidityPool.getReserves();
      const totalShares = await liquidityPool.totalShares();

      setUserShares(ethers.utils.formatEther(shares));

      const sharesToWithdraw = shares.mul(percentage).div(100);
      const amount1 = reserve1.mul(sharesToWithdraw).div(totalShares);
      const amount2 = reserve2.mul(sharesToWithdraw).div(totalShares);

      setWithdrawAmount1(ethers.utils.formatEther(amount1));
      setWithdrawAmount2(ethers.utils.formatEther(amount2));
    } catch (error) {
      console.error('Error fetching user shares:', error);
    }
  };

  const handlePercentageChange = async (newPercentage) => {
    setPercentage(newPercentage);
    if (account) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const liquidityPool = new ethers.Contract(LIQUIDITY_POOL_ADDRESS, [
          "function shares(address) view returns (uint256)",
          "function getReserves() view returns (uint256, uint256)",
          "function totalShares() view returns (uint256)"
        ], provider);

        const shares = await liquidityPool.shares(account);
        const [reserve1, reserve2] = await liquidityPool.getReserves();
        const totalShares = await liquidityPool.totalShares();

        const sharesToWithdraw = shares.mul(newPercentage).div(100);
        const amount1 = reserve1.mul(sharesToWithdraw).div(totalShares);
        const amount2 = reserve2.mul(sharesToWithdraw).div(totalShares);

        setWithdrawAmount1(ethers.utils.formatEther(amount1));
        setWithdrawAmount2(ethers.utils.formatEther(amount2));
      } catch (error) {
        console.error('Error calculating withdraw amounts:', error);
      }
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!account || percentage === 0) return;

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const liquidityPool = new ethers.Contract(LIQUIDITY_POOL_ADDRESS, [
        "function shares(address) view returns (uint256)",
        "function removeLiquidity(uint256) external returns (uint256, uint256)"
      ], signer);

      const userSharesBN = await liquidityPool.shares(account);
      const sharesToWithdraw = userSharesBN.mul(percentage).div(100);

      const tx = await liquidityPool.removeLiquidity(sharesToWithdraw);
      await tx.wait();

      await fetchUserShares(account);
      setLoading(false);
    } catch (error) {
      console.error('Error removing liquidity:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchUserShares(account);
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

      <div className="mb-2">
        <h3 className="text-lg font-medium mb-2 text-black">Token Pair</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-black bg-yellow-300 w-10 h-10 rounded-full flex items-center justify-center">
              <span>🪙</span>
            </div>
            <span className="text-black">Token A</span>
          </div>
          <span className="text-2xl">+</span>
          <div className="flex items-center gap-2">
            <div className="bg-green-300 w-10 h-10 rounded-full flex items-center justify-center">
              <span>🪙</span>
            </div>
            <span className="text-black">Token B</span>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between">
          <h3 className="text-md font-medium mb-2 text-black">Your Liquidity</h3>
          <span className="text-sm text-gray-600">Total Shares: {userShares}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={(e) => handlePercentageChange(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-gray-600 mt-2 text-sm">Selected: {percentage}%</p>
      </div>

      <div className="mb-3">
        <h3 className="text-md font-medium mb-2 text-black">Withdraw Amount</h3>
        <div className="flex justify-between">
          <span className="text-black">Token A: {withdrawAmount1}</span>
          <span className="text-black">Token B: {withdrawAmount2}</span>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          className={`bg-purple-700 text-white px-6 py-3 rounded-lg w-full ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-800'
          }`}
          onClick={handleRemoveLiquidity}
          disabled={loading || !account || percentage === 0}
        >
          {loading ? 'Removing Liquidity...' : 'Remove Liquidity'}
        </button>
      </div>
    </div>
  );
};

export default RemoveLiquidity;
