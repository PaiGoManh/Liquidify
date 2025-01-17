import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useTokens } from '../Context/TokenContext';
import { useNavigate } from 'react-router-dom';

const AddLiquidity = () => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [token1Balance, setToken1Balance] = useState('0');
  const [token2Balance, setToken2Balance] = useState('0');
  const { tokens } = useTokens();
  const navigate = useNavigate();

  const TOKEN_A_ADDRESS = "0xA3183705B6A60A68EE15eF01714F5851C4720Bcf";
  const TOKEN_B_ADDRESS = "0xEc73ef4F29373A492dB5350e925B8847334A8a84";
  const LIQUIDITY_POOL_ADDRESS = "0x6B4ccdb95cb023b040A7c9aAc5dae986f8AC2976";

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        setAccount(accounts[0]);
        await fetchBalances(accounts[0]);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const fetchBalances = async (userAccount) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const token1 = new ethers.Contract(TOKEN_A_ADDRESS, [
        "function balanceOf(address) view returns (uint256)"
      ], provider);
      const token2 = new ethers.Contract(TOKEN_B_ADDRESS, [
        "function balanceOf(address) view returns (uint256)"
      ], provider);

      const balance1 = await token1.balanceOf(userAccount);
      const balance2 = await token2.balanceOf(userAccount);

      setToken1Balance(ethers.utils.formatEther(balance1));
      setToken2Balance(ethers.utils.formatEther(balance2));
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const handleAddLiquidity = async () => {
    if (!account || !amount1 || !amount2) return;

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const token1 = new ethers.Contract(TOKEN_A_ADDRESS, [
        "function approve(address spender, uint256 amount) returns (bool)"
      ], signer);
      const token2 = new ethers.Contract(TOKEN_B_ADDRESS, [
        "function approve(address spender, uint256 amount) returns (bool)"
      ], signer);
      const liquidityPool = new ethers.Contract(LIQUIDITY_POOL_ADDRESS, [
        "function addLiquidity(uint256 amount1, uint256 amount2) external returns (uint256)"
      ], signer);

      const amount1Wei = ethers.utils.parseEther(amount1);
      const amount2Wei = ethers.utils.parseEther(amount2);
      
      await token1.approve(LIQUIDITY_POOL_ADDRESS, amount1Wei);
      await token2.approve(LIQUIDITY_POOL_ADDRESS, amount2Wei);

      const tx = await liquidityPool.addLiquidity(amount1Wei, amount2Wei);
      await tx.wait();

      navigate('/pool');

      setAmount1('');
      setAmount2('');
      await fetchBalances(account);
      setLoading(false);
    } catch (error) {
      console.error('Error adding liquidity:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchBalances(account);
    }
  }, [account]);

  return (
    <div className="bg-blue-50 p-8 rounded-lg shadow-md max-w-xl h-[500px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-purple-800">Add Liquidity</h2>
        <button
          onClick={connectWallet}
          className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm"
        >
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-black">Tokens</h3>
        <div className="">
          <div className="p-2 border rounded-lg w-full text-black">{tokens.tokenA?.name}({tokens.tokenA?.symbol})</div>
          <div className="p-2 border rounded-lg w-full text-black">{tokens.tokenB?.name}({tokens.tokenB?.symbol})</div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-black">Deposit Amount</h3>
        <div className="flex gap-5">
          <div className="relative">
            <div className="flex justify-between">
              <label className="block mb-1 text-gray-700">Token A</label>
              <span className="text-sm text-gray-500">{token1Balance}</span>
            </div>
            <input
              type="number"
              className="w-full p-3 border rounded-lg text-black"
              placeholder="Enter amount"
              value={amount1}
              onChange={(e) => setAmount1(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="flex justify-between">
              <label className="block mb-1 text-gray-700">Token B</label>
              <span className="text-sm text-gray-500">{token2Balance}</span>
            </div>
            <input
              type="number"
              className="w-full p-3 border rounded-lg text-black"
              placeholder="Enter amount"
              value={amount2}
              onChange={(e) => setAmount2(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          className={`bg-purple-700 text-white px-6 py-3 rounded-lg w-full ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-800'
          }`}
          onClick={handleAddLiquidity}
          disabled={loading || !account || !amount1 || !amount2}
        >
          {loading ? 'Adding Liquidity...' : 'Add Liquidity'}
        </button>
      </div>
    </div>
  );
};

export default AddLiquidity;
