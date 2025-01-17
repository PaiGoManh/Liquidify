const { buildModule } = require('@nomicfoundation/ignition-core');

module.exports = buildModule('TokenADeployment', (m) => {
  // Deploy Token1
  const tokena = m.contract('TokenA');
  return { tokena };
});
