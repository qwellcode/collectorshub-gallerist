export default (context, inject) => {
	const loadAssetsByContractAddress = (seaport, owner, contractAddresses, limit = 50, offset = 0) => {
		return new Promise(async (resolve, reject) => {
			try {
				context.store.state.fetchedAssets = 0;
				let fetched_assets = (await seaport.api.getAssets({
					asset_contract_addresses: contractAddresses,
					owner,
					limit,
					offset,
				}));
				let assets = [...fetched_assets.assets];

				console.log(`Fetched ${assets.length} Assets...`);
				context.store.state.fetchedAssets = assets.length;

				while (fetched_assets.assets.length === limit) {
					offset = offset + limit;
					fetched_assets = (await seaport.api.getAssets({
						asset_contract_addresses: contractAddresses,
						owner,
						limit,
						offset,
					}));
					assets = [...assets, ...fetched_assets.assets];

					console.log(`Fetched ${assets.length} Asset/s...`);
					context.store.state.fetchedAssets = assets.length;
				}

				return resolve(assets);
			} catch (e) {
				console.log(e);
				return reject(false);
			}
		});
	};
	inject('loadAssetsByContractAddress', loadAssetsByContractAddress)
}
