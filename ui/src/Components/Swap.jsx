import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { abi as TOKEN_A_ABI } from '../TokenA.json';
import { abi as TOKEN_B_ABI } from '../TokenB.json';
import { abi as SWAP_CONTRACT_ABI } from '../Swap.json';


const Swap = () => {

  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState('TKA');
  const [toToken, setToToken] = useState('TKB');
  const [balances, setBalances] = useState({ TKA: '0', TKB: '0' });

  const TOKEN_A_ADDRESS = "0xA3183705B6A60A68EE15eF01714F5851C4720Bcf";
  const TOKEN_B_ADDRESS = "0xEc73ef4F29373A492dB5350e925B8847334A8a84";
  const SWAP_CONTRACT_ADDRESS = "0x149c5602Dec96B8c1Be58d3DB4F3f04244Cd2718";

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
      const tokenA = new ethers.Contract(TOKEN_A_ADDRESS, TOKEN_A_ABI, provider);
      const tokenB = new ethers.Contract(TOKEN_B_ADDRESS, TOKEN_B_ABI, provider);

      const balanceA = await tokenA.balanceOf(userAccount);
      const balanceB = await tokenB.balanceOf(userAccount);

      setBalances({
        TKA: ethers.utils.formatEther(balanceA),
        TKB: ethers.utils.formatEther(balanceB)
      });
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const calculateSwapOutput = async (inputAmount) => {
    if (!inputAmount || inputAmount === '0') {
      setToAmount('0');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const swapContract = new ethers.Contract(
        SWAP_CONTRACT_ADDRESS,
        SWAP_CONTRACT_ABI,
        provider
      );

      const [reserve1, reserve2] = await swapContract.getReserves();
      const amountIn = ethers.utils.parseEther(inputAmount);
      const amountInWithFee = amountIn.mul(997);
      
      let amountOut;
      if (fromToken === 'TKA') {
        amountOut = amountInWithFee.mul(reserve2)
          .div(reserve1.mul(1000).add(amountInWithFee));
      } else {
        amountOut = amountInWithFee.mul(reserve1)
          .div(reserve2.mul(1000).add(amountInWithFee));
      }

      setToAmount(ethers.utils.formatEther(amountOut));
    } catch (error) {
      console.error('Error calculating swap output:', error);
    }
  };

  const handleSwap = async () => {
    if (!account || !fromAmount) return;

    try {
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const swapContract = new ethers.Contract(
        SWAP_CONTRACT_ADDRESS,
        SWAP_CONTRACT_ABI,
        signer
      );
      
      const tokenContract = new ethers.Contract(
        fromToken === 'TKA' ? TOKEN_A_ADDRESS : TOKEN_B_ADDRESS,
        TOKEN_A_ABI, 
        signer
      );

      const amountIn = ethers.utils.parseEther(fromAmount);
      const approveTx = await tokenContract.approve(SWAP_CONTRACT_ADDRESS, amountIn);
      await approveTx.wait();

      const swapTx = await swapContract.swap(
        amountIn,
        fromToken === 'TKA'
      );
      await swapTx.wait();

      setFromAmount('');
      setToAmount('');
      await fetchBalances(account);
      setLoading(false);
    } catch (error) {
      console.error('Error performing swap:', error);
      setLoading(false);
    }
  };

  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
    setToAmount('');
  };

  useEffect(() => {
    if (fromAmount) {
      calculateSwapOutput(fromAmount);
    }
  }, [fromAmount, fromToken]);

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-purple-800">Swap</h2>
          <button
            onClick={connectWallet}
            className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm"
          >
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <label className="text-gray-600 text-sm font-medium">From</label>
            <span className="text-sm text-gray-500">
              Balance: {balances[fromToken]}
            </span>
          </div>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <select
              className="bg-gray-100 text-sm font-medium text-black focus:outline-none"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
            >
              <option value="TKA">TokenA</option>
              <option value="TKB">TokenB</option>
            </select>
            <input
              type="number"
              className="bg-transparent text-right text-gray-600 focus:outline-none w-[120px]"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-center items-center mb-6">
          <button 
            className="bg-purple-700 p-3 rounded-full shadow-md hover:bg-gray-300"
            onClick={handleSwitchTokens}
          >
            ↓
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <label className="text-gray-600 text-sm font-medium">To</label>
            <span className="text-sm text-gray-500">
              Balance: {balances[toToken]}
            </span>
          </div>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <select
              className="bg-gray-100 text-sm font-medium text-black focus:outline-none"
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
            >
              <option value="TKA">TokenA</option>
              <option value="TKB">TokenB</option>
            </select>
            <input
              type="text"
              className="bg-transparent text-right text-gray-600 focus:outline-none w-[120px]"
              placeholder="0.00"
              value={toAmount}
              readOnly
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            className={`w-full bg-purple-700 text-white py-3 px-8 rounded-lg font-semibold ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-800'
            }`}
            onClick={handleSwap}
            disabled={loading || !account || !fromAmount}
          >
            {loading ? 'Swapping...' : 'Swap'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Swap;