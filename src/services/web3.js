import { ethers } from 'ethers';

import api from './api';
import utility from './utility';

const web3 = {
  setAllowance: async(tokenContract, exchangeAddress, provider, handler) => {
    const uintMax = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
    const gasPrice = await api.getGas();
    const txOptions = {
      gasPrice,
    };
    const status = await tokenContract.approve(exchangeAddress, uintMax, txOptions);
    handler('send_approve', status.hash);
    // wait for mining to finish
    const receipt = await provider.waitForTransaction(status.hash);
    // mined
    handler('mined_approve', status.hash);
    return true;
  },
  wrap: async(wethContract, amount, provider, handler) => {
    if (amount == 0) {
      return true;
    }
    const value = ethers.utils.bigNumberify(amount.toString());
    const gasPrice = await api.getGas();
    const txOptions = {
      value,
      gasPrice,
    };
    const status = await wethContract.deposit(txOptions);

    handler('send_wrap', status.hash);
    const receipt = await provider.waitForTransaction(status.hash);
    // wrap mined
    handler('mined_wrap', status.hash);
    return true;
  },
  unwrap: async(wethContract, amount) => {
    if (amount == 0) {
      return true;
    }
    const gasPrice = await api.getGas();
    const txOptions = {
      gasPrice,
    };
    const amountNumber = ethers.utils.bigNumberify(amount.toString());
    const status = await wethContract.withdraw(amountNumber, txOptions);
    handler('send_unwrap', status.hash);
    const receipt = await provider.waitForTransaction(status.hash);
    // wrap mined
    handler('mined_unwrap', status.hash);
    return true;
  },
  estimateGas: async(trade, provider, signer, handler) => {
    try{
      const sender = await signer.getAddress();
      const estimateTx = { ...trade, from: sender };
      const estimate = await provider.estimateGas(estimateTx);
      return parseInt(estimate.toString()) * 1.2;
    }catch(err){
      handler('bad_tx');
      return;
    }
  },
  sendTrade: async(trade, signer, handler) => {
    try{
      const status = await signer.sendTransaction(trade);
      return status;
    }catch(err){
      // issue sending tx
      if(!window || !window.ethereum || !window.ethereum.isImToken){
        handler('rejected');
        return;
      }
      if (err.errorCode == 1001) {
        handler('rejected');
        return;
      }
      if (typeof err.transactionHash == 'string'){
        return {
          hash: err.transactionHash
        }
      }
    }
    return;
  },
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

export default web3;
