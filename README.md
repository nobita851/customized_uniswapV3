# Introduction of Dynamic Fees in Uniswap v3

## Overview
This update introduces a dynamic fee mechanism to Uniswap v3, inspired by Nezlobin's directional fee model. The dynamic fee functionality adjusts the protocol fee based on the direction and magnitude of price changes, enabling a more adaptive and responsive pricing model. This change aims to improve capital efficiency, address sudden market movements, and align fees more closely with the volatility of the traded assets.

---

## Key Additions

### 1. Dynamic Fee Toggle
- **Variable:** `bool public dynamicFeeEnabled`
  - Enables or disables the dynamic fee mechanism. The feature can be toggled by the factory owner using the `enableDynamicFee` function.

### 2. Base Fee
- **Variable:** `uint24 public baseFee`
  - The base fee serves as the starting point for fee calculations when the dynamic fee mechanism is active.

### 3. Dynamic Fee Data Structure
- **Struct:** `DynamicFeeData`
  - `uint96 lastRecordedBlock`: Tracks the last block where the fee calculation was updated.
  - `uint160 lastRecordedSqrtPriceX96`: Stores the last recorded square root price for calculating price changes.

- **Variable:** `DynamicFeeData public dynamicFeeData`

### 4. Dynamic Fee Calculation
- **Function:** `getFee(bool zeroForOne)`
  - Returns the fee applicable for a transaction. If `dynamicFeeEnabled` is false, it defaults to the current static fee. If enabled, the fee is dynamically calculated using `_getDynamicFee`.

- **Internal Function:** `_getDynamicFee(bool zeroForOne)`
  - Dynamically adjusts the fee based on the percentage change in price. 
  - Fees are increased or decreased depending on whether the price is moving up or down, respectively:
    - **Upward Price Movement:** Higher fees for "sell" transactions (to deter arbitrageurs) and lower fees for "buy" transactions.
    - **Downward Price Movement:** Higher fees for "buy" transactions and lower fees for "sell" transactions.
  - The adjustment is based on the percentage change in price (`changeInPricePercentage`) scaled by the base fee.

### 5. Toggle Function
- **Function:** `enableDynamicFee(bool enabled)`
  - Enables or disables the dynamic fee mechanism. Callable only by the factory owner.

---

## Dynamic Fee Calculation Formula

The dynamic fee is calculated as follows:

1. **Compute the percentage change in price (`changeInPricePercentage`)**:
   ```
   changeInPricePercentage = ((currentPrice^2 - lastPrice^2) * 10^6) / lastPrice^2
   ```

2. **Calculate the fee adjustment (`feeChange`)**:
   ```
   feeChange = (baseFee * 9 * 10^5 * changeInPricePercentage) / 10^{12}
   ```

3. **Apply the adjustment**:
   - **For upward price movements (zeroForOne = true):**
     ```
     newFee = max(baseFee - feeChange, baseFee / 10)
     ```
   - **For downward price movements (zeroForOne = false):**
     ```
     newFee = baseFee + feeChange
     ```

---

## Changes Made to Accommodate Contract Size

Due to EVM contract size limitations, the **flash loan feature** had to be removed to integrate the dynamic fee mechanism. The flash loan functionality was deemed non-essential compared to the potential benefits of a dynamic fee structure. 

Removing flash loans frees up the necessary space for dynamic fee logic while maintaining a robust and efficient trading mechanism. 

---

## Benefits of Dynamic Fees

1. **Capital Efficiency:** Encourages traders to provide liquidity during volatile periods, improving price discovery and reducing slippage.
2. **Directional Incentives:** Discourages arbitrage and speculative trading during significant price movements by increasing fees for trades that worsen the pool imbalance.
3. **Customizability:** Allows protocol governance to enable or disable the feature as market conditions or preferences evolve.

---

## References

Add a reference to [Nezlobin's tweet link here](https://x.com/0x94305/status/1674857993740111872).
