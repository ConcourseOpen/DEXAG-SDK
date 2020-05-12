import axios from 'axios';
import { ethers } from 'ethers';

import utility from './utility';

const dexagClient = axios.create({
  baseURL: 'https://api.dex.ag/',
});

const api = {
  async getGas(metadata) {
    const url = 'https://ethgasstation.info/json/ethgasAPI.json';
    const response = await axios.get(url);
    const data = response.data;
    let gasData = data.fast;
    const gasWei = ethers.utils.bigNumberify(gasData).div(10).plus(0.12).mul(1e9).toFixed(0);
    return gasWei;
  },
  async track(status, details, trade) {
    const data = {
      status,
      details,
      trade,
    };
    await dexagClient.post('/send_trade', data);
  },
  async getTrade(params) {
    const dexagClient = axios.create({
      baseURL: 'https://api.dex.ag/',
    });
    const response = await dexagClient.get('/trade', { params });
    const trade = response.data;
    return trade;
  },
  async getPrice(params) {
    const dexagClient = axios.create({
      baseURL: 'https://api.dex.ag/',
    });
    const response = await dexagClient.get('/price', { params });
    const price = response.data;
    return price;
  },
};

export default api;
