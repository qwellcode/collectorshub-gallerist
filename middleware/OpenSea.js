import * as Web3 from 'web3';
import {Network, OpenSeaPort} from 'opensea-js';

export default function ({ route, store, redirect }) {
	if ( process.client ) {
		if ( !store.state.account.address ) {
			const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/3b7ccf8625af4399bb6e8fe0d5cfcb15');

			store.state.seaport = new OpenSeaPort(provider, {
				apiKey: 'b701ba20d1be4e2cab724b6856abc94c',
				networkName: Network.Mainnet,
			});

			store.state.seaport_rinkeby = new OpenSeaPort(provider, {
				apiKey: 'b701ba20d1be4e2cab724b6856abc94c',
				networkName: Network.Rinkeby,
			});
		}
	}
}
