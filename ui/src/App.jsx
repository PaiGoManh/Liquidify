import React,{useState} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Swap from "./Components/Swap";
import TokenList from "./Components/TokenList";
import AddLiquidity from "./Components/AddLiquidity";
import RemoveLiquidity from "./Components/RemoveLiquidity";

const App = () => {
  const [walletAddress, setWalletAddress] = useState(""); 

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
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
        <div className="w-screen h-screen bg-blue-200">
          <div className="mx-[5%] py-[3%] flex text-white justify-between">
            <div className="font-bold text-3xl text-black">Peer2Play</div>
            <div className="flex gap-5 -mr-10">
              
              {/* <Link to="/token">
                <button className="w-[150px] h-10 bg-black ring-2 ring-white text-l font-bold  ">
                  Tokens
                </button>
              </Link> */}
              
              <Link to="/">
                <button className="w-[150px] h-10 bg-purple-700 ring-2 ring-purple-700 text-l font-bold rounded-full ">
                  Swap
                </button>
              </Link>
              <Link to="/add">
                <button className="w-[150px] h-10 bg-purple-700 ring-2 ring-purple-700 text-l font-bold rounded-full ">
                  Add Liquidity
                </button>
              </Link>

              <Link to="/remove">
                <button className="w-[150px] h-10 bg-purple-700 ring-2 ring-purple-700 text-l font-bold rounded-full ">
                  Remove Liquidity
                </button>
              </Link>
            </div>
            {walletAddress ? (
              <div className="-mr-10 w-[250px] h-10 bg-purple-700 text-white text-center flex items-center justify-center hover:bg-black">
                Connected: {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </div>
            ) : (
              <button
                className="w-[130px] h-10 bg-purple-700 ring-2 ring-purple-700 hover:bg-black"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
            )}
          </div>

          <div className="text-white mx-[5%]">
            <Routes>
              <Route path="/token" element={<TokenList />} />
              <Route path="/add" element={<AddLiquidity />} />
              <Route path="/" element={<Swap />} />
              <Route path="/remove" element={<RemoveLiquidity/>} />

            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
};

export default App;
