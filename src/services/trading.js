import { ethers } from 'ethers';

import utility from './utility';
import { BigNumber as BN } from 'bignumber.js';


const trading = {
  getGas: async () => {
    return new Promise(resolve => {
      try {
        fetch('https://ethgasstation.info/json/ethgasAPI.json')
        .then(response => response.json())
        .then(data => {
          resolve(ethers.utils.bigNumberify(web3.toWei(data.fast / 10, 'gwei')));
        });
      } catch (err) {
        // default to 5 if error
        resolve(ethers.utils.bigNumberify(web3.toWei(5, 'gwei')));
      }
    });
  },
  setAllowance: async(tokenContract, exchangeAddress) => {
    const fast_gas = await trading.getGas();
    return new Promise(resolve => {
      try {
        const uintMax = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
        console.log(fast_gas);
        const promise = tokenContract.functions.approve(exchangeAddress, uintMax, {gasPrice: fast_gas});

        promise.then(function(status) {
          console.log(status);
          window.web3StatusHandler('send_trade', status.hash);

          utility.waitForReceipt(status.hash, function() {
            window.web3StatusHandler('mined_approve', status.hash);
            resolve(true);
          });
        }).catch(function(err) {
          resolve(false);
          console.log('Transaction rejected ' + err);
        });
      } catch (e) {
        resolve(false);
        console.log(e);
      }
    });
  },
  wrap: async(wethContract, amount) => {
    const fast_gas = await trading.getGas();
    return new Promise(resolve => {
    try {
      if (amount == 0) {
        resolve(true);
      } else {
        // show wrap init message
        window.web3StatusHandler('request_wrap');
        const value = ethers.utils.bigNumberify(amount);
        const txOptions = {
          value,
          gasPrice: fast_gas
        };
        const promise = wethContract.deposit(txOptions);

        // wrap sent
        promise.then(function(status) {
          window.web3StatusHandler('send_wrap', status.hash);
          utility.waitForReceipt(status.hash, function() {
            // wrap mined
            window.web3StatusHandler('mined_wrap', status.hash);
            resolve(true);
          });
        }).catch(function(err) {
          resolve(false);
        });
      }
    } catch (e) {
      resolve(false);
      console.log(e);
    }
    });
  },
  unwrap: (wethContract, amount) => {
    return new Promise(resolve => {
      try {
        if (amount == 0) {
          resolve(true);
        } else {
          const promise = wethContract.withdraw(amount);

          promise.then(function(status) {
            console.log(status);
            utility.waitForReceipt(status.hash, function() {
              resolve(true);
            });
          }).catch(function(err) {
            resolve(false);
          });
        }
      } catch(e) {
        resolve(false);
        console.log(e);
      }
    });
  },
  getTrade: async ({to, from, amount, dex}) => {
    return new Promise(resolve => {
      try {
        fetch(`https://api.dex.ag/trade?from=${from}&to=${to}&toAmount=${amount}&dex=${dex||'best'}`, { headers: {'Accept': 'application/json'} })
        .then(response => response.json())
        .then(data => {
          resolve(data);
        });
      } catch (err) {
        // default to 5 if error
        resolve('err')
        console.log('api error')
      }
    });
  },
  getPrice: async ({to, from, amount, dex}) => {
    return new Promise(resolve => {
      try {
        fetch(`https://api.dex.ag/price?from=${from}&to=${to}&toAmount=${amount}&dex=${dex||'all'}`, { headers: {'Accept': 'application/json'} })
        .then(response => response.json())
        .then(data => {
          resolve(data);
        });
      } catch (err) {
        // default to 5 if error
        resolve('err')
        console.log('api error')
      }
    });
  }
};

export default trading;
