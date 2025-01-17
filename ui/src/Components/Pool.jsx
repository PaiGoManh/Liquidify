import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { abi as contractABI } from '../Liquidity.json';

const Pool = () => {
  const [pools, setPools] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  const contractAddress = "0x6B4ccdb95cb023b040A7c9aAc5dae986f8AC2976"; // Replace with your contract address

  const fetchPools = async () => {
    if (contract) {
      try {
        // Filter for the LiquidityAdded event
        const filter = contract.filters.LiquidityAdded();
        const events = await contract.queryFilter(filter);
  
        const newPools = await Promise.all(
          events.map(async (event) => {
            // Get the token addresses from the contract
            const token1Address = await contract.token1();
            const token2Address = await contract.token2();
  
            // Fetch token names and symbols
            const token1 = new ethers.Contract(token1Address, ["function symbol() view returns (string)", "function name() view returns (string)"], provider);
            const token2 = new ethers.Contract(token2Address, ["function symbol() view returns (string)", "function name() view returns (string)"], provider);
  
            const token1Symbol = await token1.symbol();
            const token1Name = await token1.name();
            const token2Symbol = await token2.symbol();
            const token2Name = await token2.name();
  
            // Prepare the pool data
            const pool = {
              name: `Pool ${event.args.provider}`,
              network: "Ethereum",
              tokens: `${token1Name} (${token1Symbol}), ${token2Name} (${token2Symbol})`,
              liquidity: ethers.utils.formatUnits(event.args.amount1, 18), // Assuming amount1 is the liquidity for token1
              apr: "15%", // Set your APR calculation logic here
              address: event.address, // The contract address for the pool
            };
  
            return pool;
          })
        );
  
        // Update state with the new pool data
        setPools(newPools);
      } catch (error) {
        console.error("Error fetching pools:", error);
      }
    }
  };
  

  useEffect(() => {
    // Initialize the provider and contract
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
    fetchPools();
  }, [contract]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2 bg-white text-black">
        </div>
        <Link to="/add">
          <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Liquidity
          </button>
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-white text-black">
            <th className="px-4 py-2 border">Pool Name</th>
            <th className="px-4 py-2 border">Network</th>
            <th className="px-4 py-2 border">Tokens</th>
            <th className="px-4 py-2 border">Liquidity</th>
            <th className="px-4 py-2 border">APR</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool, index) => (
            <tr key={index} className="bg-gray-600">
              <td className="px-4 py-2 border">{pool.name}</td>
              <td className="px-4 py-2 border">{pool.network}</td>
              <td className="px-4 py-2 border">{pool.tokens}</td>
              <td className="px-4 py-2 border">{pool.liquidity}</td>
              <td className="px-4 py-2 border">{pool.apr}</td>
              <td className="px-4 py-2 border">
                <Link to={`/pool/${pool.address}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    View Details
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pool;
