import { ethers } from 'ethers';

// Services
import validate from './services/validate';
import trading from './services/trading';
import utility from './services/utility';

function fromPrivateKey(privateKey) {
  const projectId = '135bcba44428495c86d17c754d38649d';
  const provider = new ethers.providers.InfuraProvider('homestead', projectId);
  const signer = new ethers.Wallet(privateKey, provider);
  return new DEXAG(provider, signer);
}

function fromProvider(currentProvider) {
  const provider = new ethers.providers.Web3Provider(currentProvider);
  const signer = provider.getSigner();
  return new DEXAG(provider, signer);
}

class DEXAG {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
    this.statusHandler = () => {} // preset status handler
  }

  async sendTrade(trade, details) {
    this.statusHandler('clear');
    const value = ethers.utils.bigNumberify(trade.trade.value);
    let status = {};
    const tx = {
      to: trade.trade.to,
      data: trade.trade.data,
      value: value,
      gasLimit: 500000
    };
    // Set gas and handle bancor exception
    if(details.dex!='bancor'){
      this.statusHandler('init');
      const gasPrice = await trading.getGas();
      tx.gasPrice = gasPrice;
    }else{
      this.statusHandler('bancor_notice');
      tx.gasPrice = ethers.utils.bigNumberify(trade.metadata.gasPrice);
    }
    // estimate gas
    try{
      const sender = await this.signer.getAddress();
      const estimateTx = { ...tx, from: sender };
      const estimate = await this.provider.estimateGas(estimateTx);
      tx.gasLimit = parseInt(estimate.toString())*1.2
    }catch(err){
      this.statusHandler('bad_tx');
      return;
    }
    // attempt sending trade
    try{
      status = await this.signer.sendTransaction(tx);
    }catch(err){
      // issue sending tx
      if(!window.ethereum.isImToken){
        this.statusHandler('rejected');
        return;
      }
      if (err.errorCode == 1001) {
        this.statusHandler('rejected');
        return;
      }
      if (typeof err.transactionHash == 'string'){
        status.hash = err.transactionHash
      }
    }
    // Trade sent
    this.statusHandler('send_trade', status.hash);
    const receipt = await utility.waitForReceipt(status.hash, this.provider);
    utility.track(status, details, trade)
    utility.handleReceipt(status, receipt, this.statusHandler);
  }

  async unwrap(amount) {
    const wethContract = utility.getWethContract(this.signer);
    trading.unwrap(wethContract, amount);
  }

  // Public Functions

  async getTrade({to, from, amount, dex}) {
    const trade = await trading.getTrade({to, from, amount, dex});
    return trade
  }

  async getPrice({to, from, amount, dex}) {
    const trade = await trading.getPrice({to, from, amount, dex});
    return trade
  }

  async trade(tx) {
    let {input, output, source, query} = tx.metadata;
    var details = {pair: {base:query.to, quote:query.from}, amount: query.fromAmount||query.toAmount, dex: source.dex, isBuying: true}
    this.sendTrade(tx, details)
  }

  async validate(tx) {
    if(this.provider) this.signer = this.provider.getSigner();
    return validate.web3(tx, this.provider, this.signer, this.statusHandler);
  }

  async registerStatusHandler(handler) {
    this.statusHandler = handler;
  }
}

export { fromPrivateKey, fromProvider, DEXAG };
