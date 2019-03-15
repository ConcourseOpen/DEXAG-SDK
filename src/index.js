import { ethers } from 'ethers';

export class DexAgSdk {
	constructor(provider) {
		this.provider = new ethers.providers.Web3Provider(provider);
		this.signer = this.provider.getSigner();
	}

	sendTrade(trade) {
		const value = ethers.utils.bigNumberify(trade.value);
		const tx = {
			to: trade.to,
			data: trade.data,
			value: value
		};
		this.signer.sendTransaction(tx);
	}
}
