import utility from './utility';
import trading from './trading';
import account from './account';

const validate = {
  web3: async (trade, provider, signer) => {

    window.web3StatusHandler('init');

    // check that web3 exists
    if (window.web3 == undefined || Object.keys(window.web3).length == 0) {
      window.web3StatusHandler('web3_undefined');
      return false;
    }

    // ask user to unlock and connect
    if (window.web3 == undefined || window.web3.eth.accounts[0] == undefined) {
      try {
        await window.ethereum.enable();
      } catch (e) {
        // user rejected screen
        window.web3StatusHandler('connect_rejected');
        return false;
      }
    }

    // Auto unlock didnt work, wallet is still locked
    if(window.web3.eth.accounts[0] == undefined){
      window.web3StatusHandler('unlock_wallet');
      return;
    }

    // check web3 trading is supported for this dex
    if (trade.error == 'No trades') {
      return false;
    }

    if (web3.version.network != 1) {
      window.web3StatusHandler('network');
      return false;
    }

    // check if ether balance is insufficient
    const etherToWrap = await utility.getEtherToWrap(trade, provider, signer);
    if (etherToWrap == -1) {
      window.web3StatusHandler('balance');
      return false;
    }
    // wrap ether if necessary
    const wethContract = utility.getWethContract(signer);
    const wrapping = await trading.wrap(wethContract, etherToWrap, provider);
    if (!wrapping) return false;

    // Check if balance is insufficient
    let balance;
    try{
      if(trade.metadata.query.from!='ETH'){
        // erc20
        balance = await account.getERC20Balance(trade, provider, signer);
      }else{
        // eth
        try{
          balance = await account.getETHBalance(trade);
        }catch(err){
          console.log(err)
        }
      }
    }catch(err){
      console.log(err)
    }
    if (!balance) {
      window.web3StatusHandler('balance');
      return false;
    }

    if (trade.metadata.input) {
      // get contracts
      const tokenContract = utility.getTokenContract(trade, signer);
      const exchangeAddress = trade.metadata.input.spender;
      // get client address
      const address = await provider.getSigner().getAddress();
      // get allowances
      const allowance = await tokenContract.allowance(address, exchangeAddress);
      const tokenAmount = trade.metadata.input.amount;

      if (allowance.lt(tokenAmount)) {
        // allowance needs to be granted
        window.web3StatusHandler('allowance');
        const trading_allowance = await trading.setAllowance(tokenContract, exchangeAddress);
        // check if token allowance is not set
        if(!trading_allowance) return false;
      }
    }

    return true;
  }
};

export default validate;
