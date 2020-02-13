import axios from 'axios';
import { ethers } from 'ethers';

import utility from './utility';

const dexagClient = axios.create({
  baseURL: 'https://api-v2.dex.ag/',
});

const api = {
  async getGas(metadata) {
    const url = 'https://ethgasstation.info/json/ethgasAPI.json';
    const response = await axios.get(url);
    const data = response.data;
    let gasData = data.fast;
    // Up gas price for non bancor transactions - by 0.6 gwei
    try{
      if(!metadata.source.liquidity.bancor && metadata.query.dex!='bancor'){
        gasData+=10;
      }
    }catch(err){
      try{
        if(metadata.source==undefined && metadata.query.dex!='bancor'){
          gasData+=10;
        }
      }catch(err){}
    }
    const gasWei = ethers.utils.bigNumberify(gasData).mul(1e9).div(10);
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
      baseURL: 'https://api-v2.dex.ag/',
    });
    const response = await dexagClient.get('/trade', { params });
    const trade = response.data;
    return trade;
  },
  async getTradeAndSend(params) {
    const dexagClient = axios.create({
      baseURL: 'https://api-v2.dex.ag/',
    });
    const response = await dexagClient.get('/tradeAndSend', { params });
    const trade = response.data;
    return trade;
  },
  async getSend(params) {
    const dexagClient = axios.create({
      baseURL: 'https://api-v2.dex.ag/',
    });
    const response = await dexagClient.get('/send', { params });
    const send = response.data;
    return send;
  },
  async getPrice(params) {
    const dexagClient = axios.create({
      baseURL: 'https://api-v2.dex.ag/',
    });
    const response = await dexagClient.get('/price', { params });
    const price = response.data;
    return price;
  },
};

export default api;
