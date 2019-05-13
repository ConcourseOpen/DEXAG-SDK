import BigNumber from 'bignumber.js';

import utility from './utility';

const account = {
  getERC20Balance: async (trade, provider, signer) => {
    const tokenContract = utility.getTokenContract(trade, signer);
    const address = await provider.getSigner().getAddress();

    return new Promise(resolve => {
      // get balance for token
      const promise = tokenContract.functions.balanceOf(address);
      promise.then(function(tokenBalance) {
        const tokenAmount = trade.metadata.input.amount;
        // check if insufficient funds
        resolve(tokenBalance.gte(tokenAmount));
      }).catch(function(err) {
        console.log(err);
        resolve(false);
      });
    });
  },
  getETHBalance: async(trade) => {
    const address = window.web3.eth.accounts[0];
    const wei = utility.promisify(cb => web3.eth.getBalance(address, cb));
    try {
      const ethBalance = await wei;
      const ethAmount = trade.trade.value;
      return (ethBalance.gte(ethAmount));
    } catch (err) {
      console.log(err);
      return false;
    }
  }
};

export default account;
