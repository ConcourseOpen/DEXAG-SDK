import { ethers } from 'ethers';

import erc20Abi from '../../abi/erc20.json';
import wethAbi from '../../abi/weth.json';

const utility = {
  getTokenContract: (trade, signer) => {
    const tokenAddress = trade.metadata.input.address;
    return new ethers.Contract(tokenAddress, erc20Abi, signer);
  },
  getWethContract: (signer) => {
    const wethTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    return new ethers.Contract(wethTokenAddress, wethAbi, signer);
  },
  async getEtherToWrap(trade, provider, signer) {
    const wethTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    if (!trade.metadata.input) {
      return 0;
    }
    if (trade.metadata.input.address != wethTokenAddress) {
      return 0;
    }
    const wethAmount = trade.metadata.input.amount;
    const wethContract = new ethers.Contract(wethTokenAddress, erc20Abi, signer);
    const accountAddress = await signer.getAddress();
    const wethBalance = await wethContract.balanceOf(accountAddress);
    const balance = await signer.getBalance();
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
  },
  handleReceipt: (status, receipt, handler)=> {
    if(receipt.status=='0x1'){
      handler('mined_trade', status.hash);
    }else{
      handler('failed', status.hash);
    }
  },
};

export default utility;
