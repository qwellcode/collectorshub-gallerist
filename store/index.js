import { contracts } from '../allowed_contracts';

export const strict = false;

export const state = () => ({
	leftNavActive: false,
	initialized: {
		portfolio: true,
		account: true,
	},
	account: {
		address: null, // default address of logged in user ( if possible updated by OpenSea Data )
		galleries: [],
	},
	web3: null,
	provider: null,
	activeGallery: null,
	inventory_contracts: contracts,
	fetchedAssets: 0,
	error: undefined,
});

export const mutations = {
	setPortfolio (state, portfolio) {
		state.portfolio = portfolio;
		state.initialized.portfolio = true;
	},
}

export const actions = {
};
