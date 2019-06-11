import { ethers } from 'ethers';

import utility from './utility';

const trading = {
  getGas: async () => {
    const url = 'https://ethgasstation.info/json/ethgasAPI.json';
    const response = await fetch(url);
    const data = await response.json();
    const gasGwei = data.safeLow / 10;
    const gasWei = ethers.utils.bigNumberify(gasGwei * 1e9);
    return gasWei;
  },
  setAllowance: async(tokenContract, exchangeAddress, provider, handler) => {
    const uintMax = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
    const gasPrice = await trading.getGas();
    const txOptions = {
      gasPrice,
    };
    const status = await tokenContract.approve(exchangeAddress, uintMax, txOptions);
    handler('send_approve', status.hash);
    // wait for mining to finish
    const receipt = await utility.waitForReceipt(status.hash, provider);
    // mined
    handler('mined_approve', status.hash);
    return true;
  },
  wrap: async(wethContract, amount, provider, handler) => {
    if (amount == 0) {
      return true;
    }
    const value = ethers.utils.bigNumberify(amount.toString());
    const gasPrice = await trading.getGas();
    const txOptions = {
      value,
      gasPrice,
    };
    const status = await wethContract.deposit(txOptions);

    handler('send_wrap', status.hash);
    const receipt = await utility.waitForReceipt(status.hash, provider);
    // wrap mined
    handler('mined_wrap', status.hash);
    return true;
  },
  unwrap: async(wethContract, amount) => {
    if (amount == 0) {
      return true;
    }
    const gasPrice = await trading.getGas();
    const txOptions = {
      gasPrice,
    };
    const amountNumber = ethers.utils.bigNumberify(amount.toString());
    const status = await wethContract.withdraw(amountNumber, txOptions);
    handler('send_unwrap', status.hash);
    const receipt = await utility.waitForReceipt(status.hash, provider);
    // wrap mined
    handler('mined_unwrap', status.hash);
    return true;
  },
  getTrade: async ({to, from, amount, dex}) => {
    const url = `https://api.dex.ag/trade?from=${from}&to=${to}&fromAmount=${amount}&dex=${dex||'best'}`;
    const response = await fetch(url);
    const trade = await response.json();
    return trade;
  },
  getPrice: async ({to, from, amount, dex}) => {
    const url = `https://api.dex.ag/price?from=${from}&to=${to}&fromAmount=${amount}&dex=${dex||'all'}`;
    const response = await fetch(url);
    const price = await response.json();
    return price;
  }
};

export default trading;
