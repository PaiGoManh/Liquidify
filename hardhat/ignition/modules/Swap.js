const { buildModule } = require('@nomicfoundation/ignition-core');

module.exports = buildModule("SwapModule", (m) => {
    const tokenAAddress = "0xA3183705B6A60A68EE15eF01714F5851C4720Bcf";
    const tokenBAddress = "0xEc73ef4F29373A492dB5350e925B8847334A8a84";

    const swap = m.contract("TokenSwap", [tokenAAddress, tokenBAddress]);

    return { swap };
});
