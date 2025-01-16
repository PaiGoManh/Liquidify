import React,{useState} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddTokens from "./Components/AddTokens";
import LiquidityPool from "./Components/LiquidityPool";
import Swap from "./Components/Swap";

const App = () => {
  const [walletAddress, setWalletAddress] = useState(""); 

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request accounts from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log("Connected account:", accounts[0]);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      alert("MetaMask not found. Please install MetaMask to use this app.");
    }
  };
  return (
    <>
      <Router>
        <div className="w-screen h-screen bg-gray-800">
          <div className="mx-[5%] py-[3%] flex text-white justify-between">
            <div className="font-bold text-3xl ">Peer2Play</div>
            <div className="flex gap-5 ">
              {/* <Link to="/token">
                <button className="w-[150px] h-10 bg-black ring-2 ring-white text-l font-bold  ">
                  Add Tokens
                </button>
              </Link> */}
              
              <Link to="/swap">
                <button className="w-[150px] h-10 bg-black ring-2 ring-white text-l font-bold  ">
                  Swap
                </button>
              </Link>
              <Link to="/pool">
                <button className="w-[150px] h-10 bg-black ring-2 ring-white text-l font-bold  ">
                  Liquidity Pool
                </button>
              </Link>
            </div>
            {walletAddress ? (
              <div className="w-[250px] h-10 bg-green-500 text-white text-center flex items-center justify-center">
                Connected: {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </div>
            ) : (
              <button
                className="w-[130px] h-10 bg-blue-500 ring-2 ring-white"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>

          <div className="text-white mx-[5%]">
            <Routes>
              <Route path="/token" element={<AddTokens />} />
              <Route path="/pool" element={<LiquidityPool />} />
              <Route path="/swap" element={<Swap />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
};

export default App;
