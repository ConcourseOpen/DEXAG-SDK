import utility from './utility';

const account = {
  getERC20Balance: async (trade, signer) => {
    const tokenContract = utility.getTokenContract(trade, signer);
    const address = await signer.getAddress();
    const tokenBalance = await tokenContract.balanceOf(address);
    const tokenAmount = trade.metadata.input.amount;
    return tokenBalance.gte(tokenAmount);
  },
  getETHBalance: async(trade, signer) => {
    const ethBalance = await signer.getBalance();
    const ethAmount = trade.trade.value;
    return ethBalance.gte(ethAmount);
  }
};

export default account;
