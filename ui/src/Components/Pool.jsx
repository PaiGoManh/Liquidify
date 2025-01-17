import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { abi as contractABI } from '../Liquidity.json';

const Pool = () => {
  const [pools, setPools] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  const contractAddress = "0x53f1e235929dFBaA28bFb962D12B56f8fc48Cc12"; // Replace with your contract address

  const fetchPools = async () => {
    if (contract) {
      try {
        const filter = contract.filters.LiquidityAdded();
        const events = await contract.queryFilter(filter);

        const newPools = await Promise.all(
          events.map(async (event) => {
            // Extract the necessary data from the event
            const amount1 = event.args.amount1.toString();
            const amount2 = event.args.amount2.toString();
            const reserve1 = event.args.reserve1.toString();
            const reserve2 = event.args.reserve2.toString();
            const totalShares = event.args.totalShares.toString();

            // Fetch token names
            const token1Address = await contract.token1();
            const token2Address = await contract.token2();

            const token1 = new ethers.Contract(token1Address, ["function symbol() view returns (string)", "function name() view returns (string)"], provider);
            const token2 = new ethers.Contract(token2Address, ["function symbol() view returns (string)", "function name() view returns (string)"], provider);

            const token1Name = await token1.name();
            const token2Name = await token2.name();

            const pool = {
              user: event.args.user,
              amount1: ethers.utils.formatUnits(amount1, 18),
              amount2: ethers.utils.formatUnits(amount2, 18),
              totalShares: ethers.utils.formatUnits(totalShares, 18),
              token1Name,
              token2Name,
              name: `Pool ${event.args.user}`,
              network: "Ethereum",
              reserve1,
              reserve2,
            };

            return pool;
          })
        );

        setPools(newPools);
      } catch (error) {
        console.error("Error fetching pools:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    }
  };

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
      fetchPools();
    }
  }, [contract]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading liquidity pools...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2 bg-white text-black"></div>
        <Link to="/add">
          <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Liquidity
          </button>
        </Link>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-white text-black">
            <th className="px-4 py-2 border">User</th>
            <th className="px-4 py-2 border">Amount 1</th>
            <th className="px-4 py-2 border">Amount 2</th>
            <th className="px-4 py-2 border">Token 1 Name</th>
            <th className="px-4 py-2 border">Token 2 Name</th>
            <th className="px-4 py-2 border">Total Shares</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pools.length > 0 ? (
            pools.map((pool, index) => (
              <tr key={index} className="bg-gray-600">
                <td className="px-4 py-2 border">{pool.user}</td>
                <td className="px-4 py-2 border">{pool.amount1}</td>
                <td className="px-4 py-2 border">{pool.amount2}</td>
                <td className="px-4 py-2 border">{pool.token1Name}</td>
                <td className="px-4 py-2 border">{pool.token2Name}</td>
                <td className="px-4 py-2 border">{pool.totalShares}</td>
                <td className="px-4 py-2 border">
                  <Link
                    to={`/pool/${pool.user}`}
                    state={pool} // Passing the pool data as state
                  >
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-4 py-2 text-center border">No liquidity pools found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Pool;
