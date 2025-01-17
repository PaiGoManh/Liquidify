// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LiquidityPool is ReentrancyGuard {
    IERC20 public token1;
    IERC20 public token2;
    
    uint256 public totalShares; 
    mapping(address => uint256) public shares; 
    
    uint256 private constant MINIMUM_LIQUIDITY = 1000;
    
    event LiquidityAdded(address indexed provider, uint256 amount1, uint256 amount2, uint256 shares);
    event LiquidityRemoved(address indexed provider, uint256 amount1, uint256 amount2, uint256 shares);
    
    constructor(address _token1, address _token2) {
        require(_token1 != address(0) && _token2 != address(0), "Invalid token addresses");
        token1 = IERC20(_token1);
        token2 = IERC20(_token2);
    }
    
    function getReserves() public view returns (uint256 reserve1, uint256 reserve2) {
        reserve1 = token1.balanceOf(address(this));
        reserve2 = token2.balanceOf(address(this));
    }
    
    function addLiquidity(uint256 amount1, uint256 amount2) external nonReentrant returns (uint256 share) {
        require(amount1 > 0 && amount2 > 0, "Amounts must be greater than 0");
        
        require(token1.transferFrom(msg.sender, address(this), amount1), "Transfer of token1 failed");
        require(token2.transferFrom(msg.sender, address(this), amount2), "Transfer of token2 failed");
        
        if (totalShares == 0) {
            share = Math.sqrt(amount1 * amount2) - MINIMUM_LIQUIDITY;
            totalShares = share + MINIMUM_LIQUIDITY;
        } else {
            (uint256 reserve1, uint256 reserve2) = getReserves();
            share = Math.min(
                (amount1 * totalShares) / reserve1,
                (amount2 * totalShares) / reserve2
            );
        }
        
        require(share > 0, "Insufficient liquidity minted");
        shares[msg.sender] += share;
        
        emit LiquidityAdded(msg.sender, amount1, amount2, share);
    }
    
    function removeLiquidity(uint256 share) external nonReentrant returns (uint256 amount1, uint256 amount2) {
        require(share > 0 && shares[msg.sender] >= share, "Insufficient shares");
        
        (uint256 reserve1, uint256 reserve2) = getReserves();
        
        amount1 = (share * reserve1) / totalShares;
        amount2 = (share * reserve2) / totalShares;
        
        require(amount1 > 0 && amount2 > 0, "Insufficient liquidity burned");
        
        shares[msg.sender] -= share;
        totalShares -= share;
        
        require(token1.transfer(msg.sender, amount1), "Transfer of token1 failed");
        require(token2.transfer(msg.sender, amount2), "Transfer of token2 failed");
        
        emit LiquidityRemoved(msg.sender, amount1, amount2, share);
    }
}

library Math {
    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }
    
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}
