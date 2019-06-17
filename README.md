## Documentation

See the [DEXAG Docs](https://docs.dex.ag).  
Try trading on [DEX.AG](https://dex.ag) or [DEX.AG Checkout](https://checkout.dex.ag)

## Installation
Install the package from [NPM](https://www.npmjs.com/package/dexag-sdk)

```
npm install dexag-sdk
```

## Usage
```
import DEXAG from 'dexag-sdk';
const sdk = DEXAG.fromProvider(window.ethereum);
```

## Get the best price for 1 DAI with ETH
```
// pass trade parameters to get the transaction data
const tx = await sdk.getTrade({to: 'DAI', from: 'ETH', toAmount: 1});
```

## Checkout
Initiate the checkout process to validate the clients balance, set token allowance, wrap ETH, track transaction mining, ect.
```
const valid = await sdk.validate(tx);
if (valid) {
  // transaction data is valid, trade
  sdk.trade(tx);
}
```

## Status Messages
Receive status messages as the client executes the trade
```
// get status messages as the client checks out
sdk.registerStatusHandler((status, data)=>{
  console.log(status, data)
});
```
