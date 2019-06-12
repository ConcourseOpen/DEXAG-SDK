import { ethers } from 'ethers';
import axios from 'axios';

import utility from './utility';

const trading = {
  getGas: async () => {
    const url = 'https://ethgasstation.info/json/ethgasAPI.json';
    const response = await axios.get(url);
    const data = response.data;
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
    const receipt = await provider.waitForTransaction(status.hash);
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
    const receipt = await provider.waitForTransaction(status.hash);
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
    const receipt = await provider.waitForTransaction(status.hash);
    // wrap mined
    handler('mined_unwrap', status.hash);
    return true;
  },
  getTrade: async (params) => {
    const dexagClient = axios.create({
      baseURL: 'https://api.dex.ag/',
    });
    const response = await dexagClient.get('/trade', params);
    const trade = response.data;
    return trade;
  },
  getPrice: async (params) => {
    const dexagClient = axios.create({
      baseURL: 'https://api.dex.ag/',
    });
    const response = await dexagClient.get('/trade', params);
    const price = response.data;
    return price;
  },
};

export default trading;
