## Documentation

See the [DEXAG Docs](https://docs.dex.ag).  
Try trading on [DEX.AG](https://dex.ag) or [DEX.AG Checkout](https://checkout.dex.ag)

## Installation

Install the package with:
```
npm install dexag --save
```

## Usage
```
import {DEXAG} from 'dexag-sdk'
const sdk = new DEXAG();
```

## Buy 1 DAI with ETH
```
// trade contains all details to execute the trade
let trade = await sdk.getBest({to: 'DAI', from: 'ETH', amount: 1})
```

## Checkout
Initiate the checkout process to validate the clients balance, set token allowance, wrap ETH, track transaction mining, ect.
```
const valid = await sdk.validateWeb3(trade);
if (valid) {
	// web3 is valid, trade order
	sdk.tradeOrder({tx: trade});
}
```
