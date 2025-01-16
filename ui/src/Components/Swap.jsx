import React, { useState } from "react";

const Swap = () => {
  const [fromToken, setFromToken] = useState("BNB");
  const [toToken, setToToken] = useState("CAKE");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  return (
    <div className="flex justify-center items-center mt-[5%] -ml-[5%]">
      <div className="bg-white shadow-lg rounded-xl p-6 w-[400px]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button className="px-4 py-2 font-semibold text-purple-700 border-b-2 border-purple-700">
              Swap
            </button>
          </div>
          <div>
            <button className="text-gray-400">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        </div>

        {/* From Section */}
        <div className="mb-4">
          <label className="text-gray-600 text-sm">From</label>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mt-1">
            <div className="flex items-center gap-2">
              <img
                src={`https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=023`}
                alt="BNB"
                className="w-6 h-6"
              />
              <select
                className="bg-gray-100 text-sm font-medium"
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
              >
                <option value="BNB">BNB</option>
                <option value="ETH">ETH</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
            <input
              type="number"
              className="bg-transparent text-right text-gray-600 focus:outline-none w-[100px]"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center items-center mb-4">
          <button className="bg-gray-100 p-2 rounded-full shadow">
            <i className="fas fa-arrow-down text-gray-500"></i>
          </button>
        </div>

        {/* To Section */}
        <div className="mb-6">
          <label className="text-gray-600 text-sm">To</label>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mt-1">
            <div className="flex items-center gap-2">
              <img
                src={`https://cryptologos.cc/logos/pancakeswap-cake-logo.png?v=023`}
                alt="CAKE"
                className="w-6 h-6"
              />
              <select
                className="bg-gray-100 text-sm font-medium"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
              >
                <option value="CAKE">CAKE</option>
                <option value="BTC">BTC</option>
                <option value="USDC">USDC</option>
              </select>
            </div>
            <input
              type="number"
              className="bg-transparent text-right text-gray-600 focus:outline-none w-[100px]"
              placeholder="0.00"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Connect Wallet */}
        <div className="flex justify-center">
          <button className="bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-600">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
