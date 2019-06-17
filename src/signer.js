import { ethers } from 'ethers';

class UncheckedSigner extends ethers.Signer {
  constructor(signer) {
    super();
    ethers.utils.defineReadOnly(this, 'signer', signer);
    ethers.utils.defineReadOnly(this, 'provider', signer.provider);
  }

  getAddress() {
    return this.signer.getAddress();
  }

  getBalance() {
    return this.signer.getBalance();
  }

  signMessage(message) {
    return this.signer.signMessage(message);
  }

  async sendTransaction(transaction) {
    const hash = await this.signer.sendUncheckedTransaction(transaction);
    const response = {
      hash: hash,
      nonce: null,
      gasLimit: null,
      gasPrice: null,
      data: null,
      value: null,
      chainId: null,
      confirmations: 0,
      from: null,
      wait: confirmations => {
        return this.signer.provider.waitForTransaction(hash, confirmations);
      }
    };
    return response;
  }
}

export default UncheckedSigner;
