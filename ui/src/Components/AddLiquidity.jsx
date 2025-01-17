import React from "react";

const AddLiquidity = () => {
  return (
    <div className="bg-blue-50 p-8 rounded-lg shadow-md max-w-xl h-[500px] mx-auto">
      <h2 className="text-2xl font-semibold text-purple-800 mb-4">Add Liquidity</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-black">Choose Token Pair</h3>
        <div className="flex items-center gap-4">
          <select
            className="p-2 border rounded-lg w-full text-black"
            name="tokenA"
            defaultValue="TokenA"
          >
            <option value="TokenA">Token A</option>
            <option value="TokenB">Token B</option>
          </select>
          <span className="text-2xl text-black">+</span>
          <select
            className="p-2 border rounded-lg w-full text-black"
            name="tokenB"
            defaultValue="TokenB"
          >
            <option value="TokenA">Token A</option>
            <option value="TokenB">Token B</option>
          </select>
        </div>
        <p className="text-sm text-gray-600 mt-2">V2 LP - 0.25% fee tier</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-black">Deposit Amount</h3>
        <div className="flex gap-5">
          <div className="relative">
            <label className="block mb-1 text-gray-700">Token A</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg text-black"
              placeholder="Enter amount"
            />
          </div>
          <div className="relative">
            <label className="block mb-1 text-gray-700">Token B</label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg text-black"
              placeholder="Enter amount"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <div>
          <p className="text-gray-600">Your position will appear here.</p>
          <p className="text-gray-400 text-sm">Min Price: 0.0 / Max Price: 0.0</p>
        </div>
        <button className="bg-purple-700 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
          Add Liquidity
        </button>
      </div>
    </div>
  );
};

export default AddLiquidity;
