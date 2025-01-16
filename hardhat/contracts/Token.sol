// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// First Token
contract Token1 is ERC20 {
    constructor() ERC20("Token1", "TK1") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function faucet(address recipient, uint256 amount) external {
        _mint(recipient, amount);
    }
}

// Second Token
contract Token2 is ERC20 {
    constructor() ERC20("Token2", "TK2") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function faucet(address recipient, uint256 amount) external {
        _mint(recipient, amount);
    }
}
