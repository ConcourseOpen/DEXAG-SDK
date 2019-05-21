import { ethers } from 'ethers';

import erc20Abi from '../../abi/erc20.json';
import wethAbi from '../../abi/weth.json';

const utility = {
  promisify: (inner) => {
    return new Promise((resolve, reject) => {
      inner((err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  },
  waitForReceipt: async(hash, provider) => {
    let receipt = null;
    while (!receipt) {
      receipt = await provider.getTransactionReceipt(hash);
      await utility.sleep(2000);
    }
    return receipt;
  },
  getTokenContract: (trade, signer) => {
    const tokenAddress = trade.metadata.input.address;
    return new ethers.Contract(tokenAddress, erc20Abi, signer);
  },
  getWethContract: (signer) => {
    const wethTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    return new ethers.Contract(wethTokenAddress, wethAbi, signer);
  },
  getEtherToWrap(trade, provider, signer) {
    const wethTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    if (!trade.metadata.input) {
      return 0;
    }
    if (trade.metadata.input.address != wethTokenAddress) {
      return 0;
    }
    const wethAmount = trade.metadata.input.amount;
    const wethContract = new ethers.Contract(wethTokenAddress, erc20Abi, signer);
    let accountAddress;
    let wethBalance;
    const enoughWeth = signer.getAddress()
    .then(address => {
      accountAddress = address;
      return wethContract.balanceOf(accountAddress);
    })
    .then(balance => {
      wethBalance = balance;
      return provider.getBalance(accountAddress);
    })
    .then(balance => {
      if (wethBalance.gte(wethAmount)) {
        // Enough weth, no need to wrap
        return 0;
      }
      const totalBalance = balance.add(wethBalance);
      if (totalBalance.lt(wethAmount)) {
        // Insufficient balance
        return -1;
      }
      // eth to wrap = weth required for trade - weth balance
      const ethToWrap = wethBalance.sub(wethAmount).mul(-1);
      return ethToWrap.toString();
    });
    return enoughWeth;
  },
  handleReceipt: (status, receipt)=> {
    if(receipt.status=='0x1'){
      window.web3StatusHandler('mined_trade', status.hash);
    }else{
      window.web3StatusHandler('failed', status.hash);
    }
  },
  track: async(status, details, trade)=>{
    const response = await fetch('https://api.dex.ag/send_trade', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({status, details, trade})
    });
  },
  sleep: (ms)=> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

export default utility;
