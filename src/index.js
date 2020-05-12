import { ethers } from 'ethers';

import UncheckedSigner from './signer';

// Services
import validation from './services/validation';
import api from './services/api';
import web3 from './services/web3';
import utility from './services/utility';

function fromPrivateKey(privateKey) {
  const projectId = '135bcba44428495c86d17c754d38649d';
  const provider = new ethers.providers.InfuraProvider('homestead', projectId);
  const signer = new ethers.Wallet(privateKey, provider);
  return new SDK(provider, signer);
}

function fromProvider(currentProvider) {
  if (!currentProvider) {
    return new SDK();
  }
  const provider = new ethers.providers.Web3Provider(currentProvider);
  const innerSigner = provider.getSigner();
  const signer = new UncheckedSigner(innerSigner);
  return new SDK(provider, signer);
}

class SDK {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
    this.statusHandler = () => {};
  }

  async getTrade(params) {
    const trade = await api.getTrade(params);
    return trade;
  }

  async getPrice(params) {
    const trade = await api.getPrice(params);
    return trade;
  }

  async trade(tx) {
    const { source, query } = tx.metadata;
    const details = {pair: {base:query.to, quote:query.from}, amount: query.fromAmount||query.toAmount, dex: source.dex, isBuying: true};
    await this._sendTrade(tx, details);
  }

  async sendTrade(tx, details) {
    await this._sendTrade(tx, details);
  }

  async validate(tx) {
    if (!(this.provider) || !(this.signer)) {
      this.statusHandler('web3_undefined');
      return;
    }
    return await validation.validate(tx, this.provider, this.signer, this.statusHandler);
  }

  async registerStatusHandler(handler) {
    this.statusHandler = handler;
  }

  async _sendTrade(trade, details) {
    if (!(this.provider) || !(this.signer)) {
      this.statusHandler('web3_undefined');
      return;
    }
    const value = ethers.utils.bigNumberify(trade.trade.value);
    const tx = {
      to: trade.trade.to,
      data: trade.trade.data,
      value: value,
    };
    // Set gas and handle bancor exception
    const gasPrice = await api.getGas(trade.metadata);
    tx.gasPrice = gasPrice;
    if (trade.metadata.gasPrice) {
      this.statusHandler('bancor_notice');
      const bancorGasPrice = ethers.utils.bigNumberify(trade.metadata.gasPrice);
      if (bancorGasPrice.lte(gasPrice)) {
        tx.gasPrice = bancorGasPrice;
      }
    }
    const gasLimit = await web3.estimateGas(tx, this.provider, this.signer, this.statusHandler);
    tx.gasLimit = gasLimit;
    if (!gasLimit) {
      return;
    }
    console.log('sending trade', tx);
    const status = await web3.sendTrade(tx, this.provider, this.signer, this.statusHandler);
    if (!status) {
      return;
    }
    api.track(status, details, trade);
  }
}

const DEXAG = {
  fromPrivateKey,
  fromProvider,
};

export default DEXAG;
