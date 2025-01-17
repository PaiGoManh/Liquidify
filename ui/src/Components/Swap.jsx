import React from "react";

const Swap = () => {
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-purple-800">Swap</h2>
        </div>

        {/* From Section */}
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-medium mb-1">From</label>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <select
              className="bg-gray-100 text-sm font-medium text-black focus:outline-none"
            >
              <option value="TK1">Token1</option>
              <option value="TK2">Token2</option>
            </select>
            <input
              type="number"
              className="bg-transparent text-right text-gray-600 focus:outline-none w-[120px]"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center items-center mb-6">
          <button className="bg-gray-200 p-3 rounded-full shadow-md">
            <i className="fas fa-arrow-down text-gray-500"></i>
          </button>
        </div>

        {/* To Section */}
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-medium mb-1">To</label>
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
            <select
              className="bg-gray-100 text-sm font-medium text-black focus:outline-none"
            >
              <option value="TK1">Token1</option>
              <option value="TK2">Token2</option>
            </select>
            <input
              type="text"
              className="bg-transparent text-right text-gray-600 focus:outline-none w-[120px]"
              placeholder="0.00"
              readOnly
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            className="bg-purple-700 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-800"
          >
            Swap
          </button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
