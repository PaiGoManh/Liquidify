import React from "react";

const RemoveLiquidity = () => {
  return (
    <div className="bg-blue-50 p-8 rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-purple-800 mb-4">Remove Liquidity</h2>
      
      <div className="mb-2">
        <h3 className="text-lg font-medium mb-2 text-black">Token Pair</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-black bg-yellow-300 w-10 h-10 rounded-full flex items-center justify-center">
              <span>🪙</span>
            </div>
            <span className="text-black ">Token A</span>
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
        <h3 className="text-md font-medium mb-2 text-black ">Your Liquidity</h3>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="50"
          className="w-full"
        />
        <p className="text-gray-600 mt-2 text-sm">Selected: 50%</p>
      </div>

      <div className="mb-2">
        <h3 className="text-md font-medium mb-2 text-black ">Withdraw Amount</h3>
        <div className="flex gap-5">
          <div className="relative">
            <label className="block mb-1 text-gray-700 text-md">Token A</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Withdraw amount"
              readOnly
            />
          </div>
          <div className="relative">
            <label className="block mb-1 text-gray-700">Token B</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg"
              placeholder="Withdraw amount"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-lg">
          Remove Liquidity
        </button>
      </div>
    </div>
  );
};

export default RemoveLiquidity;
