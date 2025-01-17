import React, { useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { TokenContext } from '../Context/TokenContext';
import { abi as Aabi } from '../TokenA.json';
import { abi as Babi } from '../TokenB.json';

const TokenPair = () => {
  const { tokens, setTokens } = useContext(TokenContext);

  const tokenAAddress = '0xA3183705B6A60A68EE15eF01714F5851C4720Bcf';
  const tokenBAddress = '0xEc73ef4F29373A492dB5350e925B8847334A8a84';

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const tokenAContract = new ethers.Contract(tokenAAddress, Aabi, provider);
        const tokenAName = await tokenAContract.name();
        const tokenASymbol = await tokenAContract.symbol();
        const tokenASupply = await tokenAContract.totalSupply();
        const tokenADecimals = await tokenAContract.decimals();

        const tokenBContract = new ethers.Contract(tokenBAddress, Babi, provider);
        const tokenBName = await tokenBContract.name();
        const tokenBSymbol = await tokenBContract.symbol();
        const tokenBSupply = await tokenBContract.totalSupply();
        const tokenBDecimals = await tokenBContract.decimals();

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
  }, [setTokens]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2 text-black">Token Pair</h3>
      <div className="flex items-center gap-4">
        <div className="p-2 border rounded-lg w-full text-black">
          {tokens.tokenA?.name || 'Loading...'} ({tokens.tokenA?.symbol || ''})
        </div>
        <span className="text-2xl text-black">+</span>
        <div className="p-2 border rounded-lg w-full text-black">
          {tokens.tokenB?.name || 'Loading...'} ({tokens.tokenB?.symbol || ''})
        </div>
      </div>
      <div className="mt-4 text-gray-700">
        <h4 className="font-semibold">Token A Details:</h4>
        <p>Total Supply: {tokens.tokenA?.totalSupply || 'Loading...'}</p>
        <p>Decimals: {tokens.tokenA?.decimals || 'Loading...'}</p>
      </div>
      <div className="mt-4 text-gray-700">
        <h4 className="font-semibold">Token B Details:</h4>
        <p>Total Supply: {tokens.tokenB?.totalSupply || 'Loading...'}</p>
        <p>Decimals: {tokens.tokenB?.decimals || 'Loading...'}</p>
      </div>
      <p className="text-sm text-gray-600 mt-2">V2 LP - 0.25% fee tier</p>
    </div>
  );
};

export default TokenPair;
