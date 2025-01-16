const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TokenModule", (m) => {
  const token1 = m.contract("Token1", [], {
  });

  const token2 = m.contract("Token2", [], {
  });

  return { token1, token2 };
});
