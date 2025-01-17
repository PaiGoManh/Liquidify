import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { abi as contractABI } from '../Liquidity.json';

const PoolDetails = () => {
  const { poolAddress } = useParams(); // Get the pool address from the URL params
  const navigate = useNavigate();

  const [poolData, setPoolData] = useState(null);
  const [token1Data, setToken1Data] = useState(null);
  const [token2Data, setToken2Data] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = "0x6B4ccdb95cb023b040A7c9aAc5dae986f8AC2976"; // Replace with your contract address

  useEffect(() => {
    const setupProvider = async () => {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      const liquidityPoolContract = new ethers.Contract(contractAddress, contractABI, signer);
      setProvider(web3Provider);
      setContract(liquidityPoolContract);
    };
    setupProvider();
  }, []);

  useEffect(() => {
    if (contract) {
      fetchPoolDetails();
    }
  }, [contract]);

  const fetchPoolDetails = async () => {
    const poolContract = new ethers.Contract(poolAddress, contractABI, provider);
    const reserves = await poolContract.getReserves();
    
    // Get token contract addresses from the liquidity pool contract
    const token1Address = await poolContract.token1();
    const token2Address = await poolContract.token2();

    // Get token data
    const token1 = new ethers.Contract(token1Address, ["function name() view returns (string)", "function symbol() view returns (string)", "function decimals() view returns (uint8)"], provider);
    const token2 = new ethers.Contract(token2Address, ["function name() view returns (string)", "function symbol() view returns (string)", "function decimals() view returns (uint8)"], provider);

    const token1Name = await token1.name();
    const token1Symbol = await token1.symbol();
    const token1Decimals = await token1.decimals();

    const token2Name = await token2.name();
    const token2Symbol = await token2.symbol();
    const token2Decimals = await token2.decimals();

    const liquidity = ethers.utils.formatUnits(reserves[0], token1Decimals); // Format according to token1 decimals

    setToken1Data({
      name: token1Name,
      symbol: token1Symbol,
      decimals: token1Decimals,
    });

    setToken2Data({
      name: token2Name,
      symbol: token2Symbol,
      decimals: token2Decimals,
    });

    setPoolData({
      address: poolAddress,
      liquidity,
      token1: token1Symbol,
      token2: token2Symbol,
      reserves: reserves.map((reserve, index) =>
        ethers.utils.formatUnits(reserve, index === 0 ? token1Decimals : token2Decimals)
      ),
    });
  };

  const addLiquidity = () => {
    navigate('/add'); // Navigate to Add Liquidity page
  };

  return (
    <div className="p-4 space-y-6">
      {poolData ? (
        <>
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{poolData.address}</h1>
              <p className="text-gray-500">Liquidity: {poolData.liquidity}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={addLiquidity} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Add Liquidity
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Pool Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Liquidity</span>
                <span>{poolData.liquidity} {poolData.token1}</span>
              </div>
              <div className="flex justify-between">
                <span>Token 1: {token1Data.name} ({token1Data.symbol})</span>
                <span>Reserves: {poolData.reserves[0]} {poolData.token1}</span>
              </div>
              <div className="flex justify-between">
                <span>Token 2: {token2Data.name} ({token2Data.symbol})</span>
                <span>Reserves: {poolData.reserves[1]} {poolData.token2}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading pool details...</p>
      )}
    </div>
  );
};

export default PoolDetails;
