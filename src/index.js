import { ethers } from 'ethers';

import erc20Abi from '../abi/erc20.json';

export class DexAgSdk {
	constructor(provider) {
		this.provider = new ethers.providers.Web3Provider(provider);
		this.signer = this.provider.getSigner();
	}

	async checkAllowance(tradeMetadata) {
		if (!tradeMetadata.token) {
			return;
		}
		const tokenAddress = tradeMetadata.token.address;
		const exchangeAddress = tradeMetadata.token.spender;
		const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, this.provider);
		const address = await this.signer.getAddress();
		const allowance = await tokenContract.allowance(address, exchangeAddress)
		const tokenAmount = tradeMetadata.token.amount;
		return allowance.gte(tokenAmount);
	}

	async setAllowance(tradeMetadata) {
		if (!tradeMetadata.token) {
			return;
		}
		const uintMaxString = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
		const tokenAddress = tradeMetadata.token.address;
		const exchangeAddress = tradeMetadata.token.spender;
		const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, this.signer);
		const address = await this.signer.getAddress();
		const allowance = await tokenContract.approve(exchangeAddress, uintMaxString);
	}

	async sendTrade(trade) {
		const value = ethers.utils.bigNumberify(trade.value);
		const tx = {
			to: trade.to,
			data: trade.data,
			value: value
		};
		await this.signer.sendTransaction(tx);
	}
}
