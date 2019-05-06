import { ethers } from 'ethers';

// Services
import validate from './services/validate';
import trading from './services/trading';
import utility from './services/utility';

export class DexAgSdk {

	constructor() {
		if (!window.web3) window.web3 = {};
		let { currentProvider } = window.web3;
		if (!currentProvider) return; // exit if no web3 found
		this.provider = new ethers.providers.Web3Provider(currentProvider);
		this.signer = this.provider.getSigner();
		window.web3StatusHandler = ()=>{} // preset status handler
	}

	async sendTrade(trade, details) {
		const value = ethers.utils.bigNumberify(trade.value);
		let status = {};
		const tx = {
			to: trade.to,
			data: trade.data,
			value: value,
			gasLimit: 500000
		};
		// Set gas and handle bancor exception
		if(details.dex!='bancor'){
			window.web3StatusHandler('init');
			const fast_gas = await trading.getGas();
			tx.gasPrice = fast_gas;
		}else{
			window.web3StatusHandler('bancor_notice');
			tx.gasPrice = ethers.utils.bigNumberify(trade.metadata.gasPrice);
		}
		// estimate gas
		try{
			const sender = await this.signer.getAddress();
			const estimateTx = { ...tx, from: sender };
			const estimate = await this.provider.estimateGas(estimateTx);
			tx.gasLimit = parseInt(estimate.toString())*1.2
		}catch(err){
			window.web3StatusHandler('bad_tx');
			return;
		}
		// attempt sending trade
		try{
			status = await this.signer.sendTransaction(tx);
		}catch(err){
			// issue sending tx
			if(!window.ethereum.isImToken){
				window.web3StatusHandler('rejected');
				return;
			}else if (typeof err.transactionHash == 'string'){
				status.hash = err.transactionHash
			}
		}
		// Trade sent
		window.web3StatusHandler('send_trade', status.hash);
		const receipt = await utility.waitForReceipt(status.hash, this.provider);
		utility.track(status, details)
		utility.handleReceipt(status, receipt);
	}

	async unwrap(amount) {
		const wethContract = utility.getWethContract(this.signer);
		trading.unwrap(wethContract, amount);
	}

	// Public Functions

	async getBest({to, from, amount}) {
		const bestTrade = await trading.getBest({to, from, amount});
		return bestTrade
	}

	async tradeOrder({tx}) {
		let {input, output, source} = tx.metadata;
		var details = {pair: {base:'test_base', quote:'test_quote'}, amount: 1, dex: source.dex, isBuying: true}
		this.sendTrade(tx, details)
	}

	async validateWeb3(trade) {
		if(this.provider) this.signer = this.provider.getSigner();
		return validate.web3(trade, this.provider, this.signer);
	}

	async registerStatusHandler(handler) {
		window.web3StatusHandler = handler;
	}

}
