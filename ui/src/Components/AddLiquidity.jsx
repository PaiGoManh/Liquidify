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
  const LIQUIDITY_POOL_ADDRESS = "0x53f1e235929dFBaA28bFb962D12B56f8fc48Cc12";

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
      await fetchBalances(accounts[0]);
    } else {
      alert('MetaMask is not installed!');
    }
  };

  const fetchBalances = async (userAccount) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const token1 = new ethers.Contract(TOKEN_A_ADDRESS, ["function balanceOf(address) view returns (uint256)"], provider);
    const token2 = new ethers.Contract(TOKEN_B_ADDRESS, ["function balanceOf(address) view returns (uint256)"], provider);

    const balance1 = await token1.balanceOf(userAccount);
    const balance2 = await token2.balanceOf(userAccount);

    setToken1Balance(ethers.utils.formatEther(balance1));
    setToken2Balance(ethers.utils.formatEther(balance2));
  };

  const ensureAllowance = async (tokenContract, spender, amount) => {
    const allowance = await tokenContract.allowance(account, spender);
    if (allowance.lt(amount)) {
      const tx = await tokenContract.approve(spender, amount);
      await tx.wait();
    }
  };

  const handleAddLiquidity = async () => {
    if (!account || !amount1 || !amount2) return;

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const token1 = new ethers.Contract(TOKEN_A_ADDRESS, [
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)"
      ], signer);

      const token2 = new ethers.Contract(TOKEN_B_ADDRESS, [
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)"
      ], signer);

      const liquidityPool = new ethers.Contract(LIQUIDITY_POOL_ADDRESS, [
        "function addLiquidity(uint256 amount1, uint256 amount2) external",
        "event LiquidityAdded(address indexed user, uint256 amount1, uint256 amount2, uint256 shares)"
      ], signer);

      const amount1Wei = ethers.utils.parseEther(amount1);
      const amount2Wei = ethers.utils.parseEther(amount2);

      await ensureAllowance(token1, LIQUIDITY_POOL_ADDRESS, amount1Wei);
      await ensureAllowance(token2, LIQUIDITY_POOL_ADDRESS, amount2Wei);

      const tx = await liquidityPool.addLiquidity(amount1Wei, amount2Wei);
      await tx.wait();

      navigate('/pool');
      setAmount1('');
      setAmount2('');
      await fetchBalances(account);
    } catch (error) {
      console.error('Error adding liquidity:', error);
      alert('Failed to add liquidity.');
    } finally {
      setLoading(false);
    }
  };

  // Listen for LiquidityAdded event
  useEffect(() => {
    if (!account) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const liquidityPool = new ethers.Contract(LIQUIDITY_POOL_ADDRESS, [
      "event LiquidityAdded(address indexed user, uint256 amount1, uint256 amount2, uint256 shares)",
      "event LiquidityRemoved(address indexed user, uint256 amount1, uint256 amount2)",
      "event Swapped(address indexed user, address fromToken, uint256 amountIn, uint256 amountOut)"
    ], provider);

    liquidityPool.on("LiquidityAdded", (user, amount1, amount2, shares) => {
      if (user.toLowerCase() === account.toLowerCase()) {
        console.log(`Liquidity added by ${user}: ${amount1} of Token 1 and ${amount2} of Token 2, Shares: ${shares}`);
      }
    });

    return () => {
      liquidityPool.removeAllListeners();
    };
  }, [account]);

  return (
    <div className="bg-blue-50 p-8 rounded-lg shadow-md max-w-xl mx-auto">
      <div className='flex justify-between items-center'>
        <h2 className="text-2xl font-semibold text-purple-800">Add Liquidity</h2>
        <button onClick={connectWallet} className="bg-purple-700 text-white px-4 py-2 rounded-lg my-4">
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>
      <div className='mt-5'>
        <label className='text-black'>Token A (<span>Balance:{token1Balance}</span>)</label>
        <input
          type="number"
          placeholder="Amount for Token A"
          value={amount1}
          onChange={(e) => setAmount1(e.target.value)}
          className="block p-2 border my-2 text-black"
        />
        <label className='text-black'>Token B (Balance:{token2Balance})</label>
        <input
          type="number"
          placeholder="Amount for Token B"
          value={amount2}
          onChange={(e) => setAmount2(e.target.value)}
          className="block p-2 border my-2 text-black"
        />
        <button
          onClick={handleAddLiquidity}
          className={`bg-purple-700 text-white px-4 py-2 rounded-lg mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Adding Liquidity...' : 'Add Liquidity'}
        </button>
      </div>
    </div>
  );
};

export default AddLiquidity;
