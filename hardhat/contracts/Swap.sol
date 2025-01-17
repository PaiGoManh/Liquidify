// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenSwap is ReentrancyGuard {
    IERC20 public tokena;
    IERC20 public tokenb;

    event Swap(address indexed user, uint256 amountIn, uint256 amountOut, bool tokenaToTokenB);

    constructor(address _tokena, address _tokenb) {
        require(_tokena != address(0) && _tokenb != address(0), "Invalid token addresses");
        tokena = IERC20(_tokena);
        tokenb = IERC20(_tokenb);
    }

    function getReserves() public view returns (uint256 reserve1, uint256 reserve2) {
        reserve1 = tokena.balanceOf(address(this));
        reserve2 = tokenb.balanceOf(address(this));
    }

    function swap(uint256 amountIn, bool tokenaToTokenB) external nonReentrant returns (uint256 amountOut) {
        require(amountIn > 0, "Amount must be greater than 0");

        (uint256 reserve1, uint256 reserve2) = getReserves();

        if (tokenaToTokenB) {
            require(tokena.transferFrom(msg.sender, address(this), amountIn), "Transfer of tokena failed");
            uint256 amountInWithFee = amountIn * 997;
            amountOut = (amountInWithFee * reserve2) / ((reserve1 * 1000) + amountInWithFee);
            require(tokenb.transfer(msg.sender, amountOut), "Transfer of tokenb failed");
        } else {
            require(tokenb.transferFrom(msg.sender, address(this), amountIn), "Transfer of tokenb failed");
            uint256 amountInWithFee = amountIn * 997;
            amountOut = (amountInWithFee * reserve1) / ((reserve2 * 1000) + amountInWithFee);
            require(tokena.transfer(msg.sender, amountOut), "Transfer of tokena failed");
        }

        emit Swap(msg.sender, amountIn, amountOut, tokenaToTokenB);
    }
}
