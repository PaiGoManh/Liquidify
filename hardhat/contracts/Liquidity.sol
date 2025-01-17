// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LiquidityPool {
    IERC20 public token1;
    IERC20 public token2;

    uint256 public reserve1;
    uint256 public reserve2;
    uint256 public totalShares;
    mapping(address => uint256) public shares;

    uint256 public constant FEE = 3; // 0.3% fee

    // Event declarations
    event LiquidityAdded(address indexed user, uint256 amount1, uint256 amount2, uint256 shares, uint256 reserve1, uint256 reserve2, uint256 totalShares);
    event LiquidityRemoved(address indexed user, uint256 amount1, uint256 amount2, uint256 reserve1, uint256 reserve2, uint256 totalShares);
    event Swapped(address indexed user, address fromToken, uint256 amountIn, uint256 amountOut, uint256 reserve1, uint256 reserve2);

    constructor(address _token1, address _token2) {
        token1 = IERC20(_token1);
        token2 = IERC20(_token2);
    }

    // Add liquidity function
    function addLiquidity(uint256 amount1, uint256 amount2) external {
        require(amount1 > 0 && amount2 > 0, "Invalid amounts");

        if (totalShares == 0) {
            shares[msg.sender] = sqrt(amount1 * amount2);
        } else {
            uint256 share1 = (amount1 * totalShares) / reserve1;
            uint256 share2 = (amount2 * totalShares) / reserve2;
            shares[msg.sender] += (share1 < share2) ? share1 : share2;
        }

        totalShares += shares[msg.sender];
        reserve1 += amount1;
        reserve2 += amount2;

        token1.transferFrom(msg.sender, address(this), amount1);
        token2.transferFrom(msg.sender, address(this), amount2);

        emit LiquidityAdded(msg.sender, amount1, amount2, shares[msg.sender], reserve1, reserve2, totalShares);
    }

    // Remove liquidity function
    function removeLiquidity(uint256 share) external {
        require(share > 0 && shares[msg.sender] >= share, "Invalid share");

        uint256 amount1 = (share * reserve1) / totalShares;
        uint256 amount2 = (share * reserve2) / totalShares;

        shares[msg.sender] -= share;
        totalShares -= share;
        reserve1 -= amount1;
        reserve2 -= amount2;

        token1.transfer(msg.sender, amount1);
        token2.transfer(msg.sender, amount2);

        emit LiquidityRemoved(msg.sender, amount1, amount2, reserve1, reserve2, totalShares);
    }

    // Swap function
    function swap(address fromToken, uint256 amountIn) external {
        require(amountIn > 0, "Invalid amount");

        bool isToken1 = fromToken == address(token1);
        require(isToken1 || fromToken == address(token2), "Invalid token");

        IERC20 from = isToken1 ? token1 : token2;
        IERC20 to = isToken1 ? token2 : token1;
        uint256 reserveIn = isToken1 ? reserve1 : reserve2;
        uint256 reserveOut = isToken1 ? reserve2 : reserve1;

        uint256 amountInWithFee = (amountIn * (1000 - FEE)) / 1000; // 0.3% fee
        uint256 amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);

        require(amountOut > 0, "Insufficient output");

        from.transferFrom(msg.sender, address(this), amountIn);
        to.transfer(msg.sender, amountOut);

        if (isToken1) {
            reserve1 += amountIn;
            reserve2 -= amountOut;
        } else {
            reserve2 += amountIn;
            reserve1 -= amountOut;
        }

        emit Swapped(msg.sender, fromToken, amountIn, amountOut, reserve1, reserve2);
    }

    // Utility function to calculate square root
    function sqrt(uint256 x) private pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
