import axios from 'axios';
import { ethers } from 'ethers';

const dexagClient = axios.create({
  baseURL: 'https://api.dex.ag/',
});

const api = {
  async getGas() {
    const url = 'https://ethgasstation.info/json/ethgasAPI.json';
    const response = await axios.get(url);
    const data = response.data;
    let gasData = data.fast;
    let gasWei = ethers.utils.bigNumberify(String((gasData / 10 + 0.12) * 1e9));
    gasWei = Number(gasWei.toString());
    return Math.round(gasWei);
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
