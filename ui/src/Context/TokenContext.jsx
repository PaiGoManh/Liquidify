// In TokenContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { abi as Aabi } from '../TokenA.json';
import { abi as Babi } from '../TokenB.json';

// Create the Token Context
export const TokenContext = createContext();

export const useTokens = () => useContext(TokenContext);

export const TokenProvider = ({ children }) => {
  const [tokens, setTokens] = useState({
    tokenA: { name: '', symbol: '', totalSupply: '', decimals: '' },
    tokenB: { name: '', symbol: '', totalSupply: '', decimals: '' },
  });

  const tokenAAddress = '0xA3183705B6A60A68EE15eF01714F5851C4720Bcf';
  const tokenBAddress = '0xEc73ef4F29373A492dB5350e925B8847334A8a84';

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        if (!window.ethereum) {
          console.error('Ethereum provider not found. Please install MetaMask.');
          return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tokenAContract = new ethers.Contract(tokenAAddress, Aabi, provider);
        const tokenBContract = new ethers.Contract(tokenBAddress, Babi, provider);

        const [tokenAName, tokenASymbol, tokenASupply, tokenADecimals] = await Promise.all([
          tokenAContract.name(),
          tokenAContract.symbol(),
          tokenAContract.totalSupply(),
          tokenAContract.decimals(),
        ]);

        // Fetch details for Token B
        const [tokenBName, tokenBSymbol, tokenBSupply, tokenBDecimals] = await Promise.all([
          tokenBContract.name(),
          tokenBContract.symbol(),
          tokenBContract.totalSupply(),
          tokenBContract.decimals(),
        ]);

        // Update context
        setTokens({
          tokenA: {
            name: tokenAName,
            symbol: tokenASymbol,
            totalSupply: ethers.utils.formatUnits(tokenASupply, tokenADecimals),
            decimals: tokenADecimals,
          },
          tokenB: {
            name: tokenBName,
            symbol: tokenBSymbol,
            totalSupply: ethers.utils.formatUnits(tokenBSupply, tokenBDecimals),
            decimals: tokenBDecimals,
          },
        });
      } catch (error) {
        console.error('Error fetching token details:', error);
      }
    };

    fetchTokenDetails();
  }, []);

  return (
    <TokenContext.Provider value={{ tokens, setTokens }}>
      {children}
    </TokenContext.Provider>
  );
};
