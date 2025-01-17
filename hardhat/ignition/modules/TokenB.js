const { buildModule } = require('@nomicfoundation/ignition-core');

module.exports = buildModule('TokenBDeployment', (m) => {
  // Deploy Token1
  const tokenb = m.contract('TokenB');
  return { tokenb };
});
