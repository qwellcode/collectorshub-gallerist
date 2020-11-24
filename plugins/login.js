import Vue from 'vue';
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {Network, OpenSeaPort} from 'opensea-js';
import _ from 'lodash';

// const NFTPortfolioData = require('../contracts/build/contracts/ProjectP.json');

export default ({store, app: {$axios, router}}) => {
	Vue.prototype.$login = async () => {
		return new Promise(async (resolve, reject) => {
			// window.localStorage.clear();
			delete $axios.defaults.headers.common["Authorization"];

			try {
				const providerOptions = {
					portis: {
						package: Portis,
						options: {
							id: "944febce-6e64-405b-9f93-a7a9dbd71d96"
						}
					},
					walletconnect: {
						package: WalletConnectProvider,
						options: {
							infuraId: "0da9087262de4c87b41e903cace1595b"
						}
					}
				}

				let web3Modal = new Web3Modal({
					network: "rinkeby",
					cacheProvider: true,
					providerOptions: providerOptions
				});

				const url = router.history.current.fullPath.replace('/login?redirect=', '').replace(new RegExp('%2F', 'g'), '/');
				// if ( url === '/login' ) {
				// 	window.localStorage.clear();
				// 	store.state.account = {
				// 		address: null,
				// 		galleries: [],
				// 	};
				// 	console.log(`LocalStorage cleared...`);
				// 	web3Modal.clearCachedProvider();
				// }

				let provider = await web3Modal.connect();

				store.state.seaport = new OpenSeaPort(provider, {
					apiKey: 'b701ba20d1be4e2cab724b6856abc94c',
					networkName: Network.Mainnet,
				});

				store.state.seaport_rinkeby = new OpenSeaPort(provider, {
					apiKey: 'b701ba20d1be4e2cab724b6856abc94c',
					networkName: Network.Rinkeby,
				});

				let web3 = new Web3(provider);
				store.state.provider = provider;
				store.state.web3 = web3;

				const accounts = await web3.eth.getAccounts();

				if (!accounts || !accounts.length) {
					store.state.error = 'No wallet address found.';
					return reject(false);
				}

				store.state.account.address = accounts[0].toLowerCase();

				const response = await $axios.$get(`https://api.opensea.io/api/v1/accounts/?address=${store.state.account.address}`);
				let account = response.accounts.length ? response.accounts[0] : store.state.account;
				account.galleries = [];
				if ( response.accounts.length ) store.state.account = response.accounts[0];

				// Get User from API
				let signature = window.localStorage.getItem('signature');
				console.log(signature);
				signature = window.localStorage.getItem('signature') !== null ? window.localStorage.getItem('signature') : await store.state.web3.eth.personal.sign(store.state.web3.utils.fromUtf8(store.state.account.address.toLowerCase()), store.state.account.address.toLowerCase());

				window.localStorage.setItem('signature', signature);

				let user = undefined;

				const users = await $axios.$get(`/users?username=${store.state.account.address.toLowerCase()}`, {
					username: store.state.account.address.toLowerCase(),
					password: signature,
				});

				if (!users.length) {
					// register user
					console.log("Post Data Start");
					console.log(`username: ${store.state.account.address.toLowerCase()}`);
					console.log(`email: no-email@${store.state.account.address}.com`);
					console.log(`password: ${signature}`);
					console.log("Post Data End");
					user = await $axios.$post(`/auth/local/register`, {
						username: store.state.account.address.toLowerCase(),
						email: `no-email@${store.state.account.address}.com`,
						password: signature,
					});

					$axios.defaults.headers.common['Authorization'] = `Bearer ${user.jwt}`;
				} else {
					user = await $axios.$post(`/auth/local`, {
						identifier: store.state.account.address.toLowerCase(),
						password: signature,
					});

					$axios.defaults.headers.common['Authorization'] = `Bearer ${user.jwt}`;
				}

				console.log(user);
				console.log(url);
				store.state.account.user_id = user.user.id;
				store.state.account.inventory_updated = user.user.inventory_updated;
				console.log(user.galleries);
				store.state.account.galleries = _.orderBy(user.user.galleries, ['updated_at'], ['desc']);

				router.push(url === '/login' ? '/' : url);

				return resolve(true);
			} catch (e) {
				console.log(e);
				store.state.error = e.message ? e.message : '';
				return reject(false);
			}
		});
	}
}
