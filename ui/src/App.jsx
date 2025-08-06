import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Swap from "./Components/Swap";
import TokenList from "./Components/TokenList";
import AddLiquidity from "./Components/AddLiquidity";
import RemoveLiquidity from "./Components/RemoveLiquidity";
import Pool from "./Components/Pool";
import PoolDetails from "./Components/Pooldetails";
import ContactUs from "./Components/ContactUs";
import { TokenProvider } from './Context/TokenContext';

const App = () => {
  return (
    <>
      <TokenProvider>
        <Router>
          <div className="w-screen h-screen bg-blue-200 flex flex-col">
            <div className="mx-[5%] py-[3%] flex justify-between items-center text-white">
              <div className="font-bold text-3xl text-black">Peer2Play</div>
              <div className="flex flex-1 justify-center gap-6">
                {/* Centered Swap and Pool buttons */}
                <Link to="/">
                  <button className="w-[150px] h-10 bg-purple-700 ring-2 ring-purple-700 text-lg font-bold rounded-full hover:bg-purple-800 transition">
                    Swap
                  </button>
                </Link>

                <Link to="/pool">
                  <button className="w-[150px] h-10 bg-purple-700 ring-2 ring-purple-700 text-lg font-bold rounded-full hover:bg-purple-800 transition">
                    Pool
                  </button>
                </Link>
              </div>

              {/* Contact Us button styled differently, on the right side */}
              <div>
                <Link to="/contact">
                  <button className="w-[150px] h-10 bg-yellow-400 text-black font-semibold rounded-md shadow-md hover:bg-yellow-300 transition">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>

            <div className="text-white mx-[5%] flex-grow overflow-auto">
              <Routes>
                <Route path="/token" element={<TokenList />} />
                <Route path="/add" element={<AddLiquidity />} />
                <Route path="/" element={<Swap />} />
                <Route path="/remove" element={<RemoveLiquidity />} />
                <Route path="/pool" element={<Pool />} />
                <Route path="/pool/:poolAddress" element={<PoolDetails />} />
                <Route path="/contact" element={<ContactUs />} />
              </Routes>
            </div>
          </div>
        </Router>
      </TokenProvider>
    </>
  );
};

export default App;
