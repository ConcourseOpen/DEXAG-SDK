import utility from './utility';
import trading from './trading';
import account from './account';

const validation = {
  async validate(trade, provider, signer, handler) {
    handler('init');
    if (!trade) {
      return false;
    }
    const internalProvider = await _checkInternalProvider(provider);
    if (!internalProvider) {
      return false;
    }
    const balance = await _checkBalance(trade, provider, signer, handler);
    if (!balance) {
      return false;
    }
    const allowance = await _checkAllowance(trade, provider, signer, handler);
    if (!allowance) {
      return false;
    }
    return true;
  }
}

async function _checkInternalProvider(provider) {
  const internalProvider = provider._web3Provider;
  if (!internalProvider) {
    // Internal provider not found
    console.log('internal provider not found');
    return true;
  }

  if (!internalProvider.selectedAddress) {
    try {
      await internalProvider.enable();
    } catch (e) {
      // user rejected
      handler('connect_rejected');
      return false;
    }
  }

  // Auto unlock didnt work, wallet is still locked
  if (!internalProvider.selectedAddress) {
    handler('unlock_wallet');
    return false;
  }

  if (internalProvider.networkVersion != "1") {
    handler('network');
    return false;
  }
  return true;
}

async function _checkBalance(trade, provider, signer, handler) {
  // check if ether balance is insufficient
  const etherToWrap = await utility.getEtherToWrap(trade, provider, signer);
  if (etherToWrap == -1) {
    handler('balance');
    return false;
  }
  // wrap ether if necessary
  const wethContract = utility.getWethContract(signer);
  const wrapping = await trading.wrap(wethContract, etherToWrap, provider, handler);
  if (!wrapping) return false;

  // Check if balance is insufficient
  const balance = trade.metadata.query.from =='ETH'
    ? await account.getETHBalance(trade, signer)
    : await account.getERC20Balance(trade, signer);
  if (!balance) {
    handler('balance');
    return false;
  }
  return true;
}

async function _checkAllowance(trade, provider, signer, handler) {
  if (!trade.metadata.input) {
    return true;
  }
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
    handler('allowance');
    const trading_allowance = await trading.setAllowance(tokenContract, exchangeAddress, provider, handler);
    // check if token allowance is not set
    if (!trading_allowance) {
      return false;
    }
  }
  return true;
}

export default validation;
