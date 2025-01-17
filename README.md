# Liquidity Pool Smart Contract

This project is a **Decentralized Automated Market Maker (AMM)** implemented as a smart contract in Solidity. It allows users to add liquidity, remove liquidity, and swap tokens between two ERC-20 compatible tokens. This AMM applies a constant product formula and charges a fee for swaps, following the principles of decentralized exchanges like Uniswap.

---

## 🚀 Features

- **Liquidity Provision:**  
  Users can provide liquidity to the pool by depositing two tokens in a specified ratio, earning shares that represent their stake in the pool.

- **Liquidity Removal:**  
  Users can withdraw their liquidity from the pool, receiving their proportional share of both tokens.

- **Token Swapping:**  
  Users can swap between the two tokens in the pool with a 0.3% fee applied to each swap.

- **Fee Mechanism:**  
  A 0.3% fee is charged on swaps, which is retained in the pool to benefit liquidity providers.

- **Fair Share Calculation:**  
  Liquidity shares are calculated proportionally based on the constant product formula, ensuring fairness.

---

## 📝 Smart Contract Details

- **Token Compatibility:**  
  The pool supports any two ERC-20 tokens.

- **Mathematical Formula:**  
  The contract uses the constant product formula \( x \cdot y = k \), where \( x \) and \( y \) are the reserves of token1 and token2, respectively, and \( k \) is the constant product.

- **Fee Handling:**  
  Fees are subtracted before calculating the output amount during a swap.

- **Events:**
  - `LiquidityAdded`: Emitted when a user adds liquidity to the pool.
  - `LiquidityRemoved`: Emitted when a user removes liquidity from the pool.
  - `Swapped`: Emitted when a user swaps one token for another.

---

## 🛠️ Technology Stack

- **Frontend:** React.js
- **Blockchain Framework:** Hardhat
- **Ethereum Interaction:** Ethers.js
- **Backend Infrastructure:** Infura
- **Smart Contract Standards:** Solidity with OpenZeppelin libraries

---

## ⚙️ How It Works

### 1. Adding Liquidity
Users can deposit equal-value amounts of token1 and token2 into the pool, receiving shares proportional to their contribution.

### 2. Removing Liquidity
Users can redeem their shares to withdraw their proportional amounts of token1 and token2.

### 3. Token Swapping
Users can swap one token for another, subject to a 0.3% fee.



## 🛠️ Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/liquidity-pool
   cd liquidity-pool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the contract:
   ```bash
   npx hardhat compile
   ```

4. Deploy the contract:
   ```bash
   npx hardhat run scripts/deploy.js
   ```

---

## 💻 Example Usage

### Adding Liquidity
### Removing Liquidity
### Swapping Tokens


---

## 🌟 Future Enhancements

- Introduce advanced fee mechanisms to incentivize long-term liquidity provision.


---

## 🪪 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
