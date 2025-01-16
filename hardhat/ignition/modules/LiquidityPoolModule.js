const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("LiquidityPoolModule", (m) => {
  const token1 = m.getParameter("Token1Address", "0xdCb6045799274EA34f4cfCa7e60880420F45bA58"); 
  const token2 = m.getParameter("Token2Address", "0xdCbB470036E74c9DD7C1EAed43057A847bBCb1ed"); 

  const liquidityPool = m.contract("LiquidityPool", [token1, token2]);

  return { liquidityPool };
});
