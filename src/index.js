import { ethers } from 'ethers';

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
  const provider = new ethers.providers.Web3Provider(currentProvider);
  const signer = provider.getSigner();
  return new SDK(provider, signer);
}

class SDK {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
    this.statusHandler = () => {} // preset status handler
  }

  async getTrade({to, from, fromAmount, toAmount, limitAmount, dex}) {
    const trade = await api.getTrade({to, from, fromAmount, toAmount, limitAmount, dex});
    return trade
  }

  async getPrice({to, from, fromAmount, toAmount, dex}) {
    const trade = await api.getPrice({to, from, fromAmount, toAmount, dex});
    return trade
  }

  async trade(tx) {
    let {input, output, source, query} = tx.metadata;
    var details = {pair: {base:query.to, quote:query.from}, amount: query.fromAmount||query.toAmount, dex: source.dex, isBuying: true}
    this._sendTrade(tx, details);
  }

  async sendTrade(tx, details) {
    this._sendTrade(tx, details);
  }

  async validate(tx) {
    return validation.validate(tx, this.provider, this.signer, this.statusHandler);
  }

  async registerStatusHandler(handler) {
    this.statusHandler = handler;
  }

  async _sendTrade(trade, details) {
    const value = ethers.utils.bigNumberify(trade.trade.value);
    const tx = {
      to: trade.trade.to,
      data: trade.trade.data,
      value: value,
    };
    // Set gas and handle bancor exception
    const gasPrice = await api.getGas();
    if(details.dex!='bancor'){
      this.statusHandler('init');
      tx.gasPrice = gasPrice;
    }else{
      this.statusHandler('bancor_notice');
      const bancorGasPrice = ethers.utils.bigNumberify(trade.metadata.gasPrice);
      // Pick the smallest amount
      tx.gasPrice = bancorGasPrice.lte(gasPrice)
        ? bancorGasPrice
        : gasPrice;
    }
    const gasLimit = await web3.estimateGas(tx, this.provider, this.signer, this.statusHandler);
    tx.gasLimit = gasLimit;
    if (!gasLimit) {
      return;
    }
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
