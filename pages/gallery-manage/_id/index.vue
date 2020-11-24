<template>
	<loader v-if="loading"/>

	<div v-else>
		<div class="row">
			<div class="col-12">
				<div class="card mb-n3">
					<div class="header d-flex justify-content-between pb-0">
						<div></div>
						<div class="action-buttons">
							<div class="create-gallery">
								<button v-if="!gallery" @click="createGallery()" class="btn btn-primary" :class="checkRequirements ? '' : 'disabled'">Create Gallery</button>
								<button v-else @click="updateGallery()" class="btn btn-primary">Update Gallery</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row clearfix">
			<div class="col-lg-6 col-md-12">

				<div class="card">
					<div class="header">
						<h2>Gallery Information</h2>
					</div>
					<div class="body">

						<div class="input-group mb-3">
							<div class="input-group-prepend">
								<span class="input-group-text" id="inputGroup-sizing-default">Name</span>
							</div>
							<input v-model="galleryName" name="title" value="Reneils Finest" type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">
						</div>

						<div class="input-group mb-0" :class="sortableItems.length ? 'mb-3' : ''">
							<div class="input-group-prepend">
								<span class="input-group-text" id="inputGroup-sizing-default">Description</span>
							</div>
							<input v-model="galleryDescription" value="Best Gallery EU" name="description" type="text" class="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default">
						</div>

						<div v-if="sortableItems.length" class="input-group input-group-title-image coverImage">
							<div class="input-group-prepend">
								<span class="input-group-text" id="inputGroup-sizing-default">Cover Image</span>
							</div>
							<div class="title-image">
								<img :src="sortableItems[0].image_url">
							</div>
						</div>

					</div>
				</div>

				<div class="card">
					<div class="header">
						<h2>Add Artworks</h2>
					</div>
					<div class="body">

						<div id="user-inventory-table" class="table-responsive">
							<div class="search">
								<label>Search: <input v-model="filter" class="form-control" placeholder=""></label>
							</div>
							<datatable class="table table-hover table-custom spacing5" :columns="columns" :data="assets" :filter="filter" :per-page="5">
								<template scope="{ row, columns }">
									<tr>
										<td v-html="row.cover"></td>
										<td class="ellipsis">{{ row.title }}</td>
										<td>{{ row.issued_on }}</td>
										<td @click="addAsset(row.tokenId, row.tokenAddress)" v-html="row.add"></td>
									</tr>
								</template>
							</datatable>
							<datatable-pager type="abbreviated" class="table-pagination"></datatable-pager>
						</div>

					</div>
				</div>

			</div>
			<div class="col-lg-6 col-md-12">

				<div class="card selected-assets">
					<div class="header">
						<h2>Contained Artworks</h2>
					</div>
					<div class="body">

						<draggable v-if="sortableItems.length" v-model="sortableItems" group="contained-artworks" @start="drag=true" @end="drag=false">
							<div v-for="(item, index) in sortableItems" :key="`contained_artworks_${index}`" class="contained-artwork">
								<div class="item-image">
									<img :src="item.image_url">
								</div>
								<div class="item-data">
									<h4>{{ item.title }}</h4>
									<p>Issued on {{ item.issuer }}</p>
									<template v-if="index === 0">
										<img class="first-item"
											 src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjUxMnB4IiB2aWV3Qm94PSIwIC0xMCA1MTEuOTg2ODUgNTExIiB3aWR0aD0iNTEycHgiPjxwYXRoIGQ9Im01MTAuNjUyMzQ0IDE4NS45MDIzNDRjLTMuMzUxNTYzLTEwLjM2NzE4OC0xMi41NDY4NzUtMTcuNzMwNDY5LTIzLjQyNTc4Mi0xOC43MTA5MzhsLTE0Ny43NzM0MzctMTMuNDE3OTY4LTU4LjQzMzU5NC0xMzYuNzY5NTMyYy00LjMwODU5My0xMC4wMjM0MzctMTQuMTIxMDkzLTE2LjUxMTcxOC0yNS4wMjM0MzctMTYuNTExNzE4cy0yMC43MTQ4NDQgNi40ODgyODEtMjUuMDIzNDM4IDE2LjUzNTE1NmwtNTguNDMzNTk0IDEzNi43NDYwOTQtMTQ3Ljc5Njg3NCAxMy40MTc5NjhjLTEwLjg1OTM3NiAxLjAwMzkwNi0yMC4wMzEyNSA4LjM0Mzc1LTIzLjQwMjM0NCAxOC43MTA5MzgtMy4zNzEwOTQgMTAuMzY3MTg3LS4yNTc4MTMgMjEuNzM4MjgxIDcuOTU3MDMxIDI4LjkwNjI1bDExMS42OTkyMTkgOTcuOTYwOTM3LTMyLjkzNzUgMTQ1LjA4OTg0NGMtMi40MTAxNTYgMTAuNjY3OTY5IDEuNzMwNDY4IDIxLjY5NTMxMyAxMC41ODIwMzEgMjguMDkzNzUgNC43NTc4MTMgMy40Mzc1IDEwLjMyNDIxOSA1LjE4NzUgMTUuOTM3NSA1LjE4NzUgNC44Mzk4NDQgMCA5LjY0MDYyNS0xLjMwNDY4NyAxMy45NDkyMTktMy44ODI4MTNsMTI3LjQ2ODc1LTc2LjE4MzU5MyAxMjcuNDIxODc1IDc2LjE4MzU5M2M5LjMyNDIxOSA1LjYwOTM3NiAyMS4wNzgxMjUgNS4wOTc2NTcgMjkuOTEwMTU2LTEuMzA0Njg3IDguODU1NDY5LTYuNDE3OTY5IDEyLjk5MjE4Ny0xNy40NDkyMTkgMTAuNTgyMDMxLTI4LjA5Mzc1bC0zMi45Mzc1LTE0NS4wODk4NDQgMTExLjY5OTIxOS05Ny45NDE0MDZjOC4yMTQ4NDQtNy4xODc1IDExLjM1MTU2My0xOC41MzkwNjMgNy45ODA0NjktMjguOTI1Nzgxem0wIDAiIGZpbGw9IiNmZmMxMDciLz48L3N2Zz4K"/>
									</template>
									<div @click="removeAsset(index)" class="remove">
										<i class="fa fa-trash-o"></i>
									</div>
								</div>
							</div>
						</draggable>
						<p v-else class="text-center mb-0">Please select some Artworks for your Gallery</p>

					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _ from 'lodash';
	import draggable from 'vuedraggable';
	import moment from "moment";
	import Loader from "../../../components/Global/Loader";

	export default {
		middleware: ['requireLogin', 'OpenSea'],

		components: {
			Loader,
			draggable,
		},

		async asyncData({params, $axios}) {
			if (params.id) {
				const gallery = await $axios.$get(`/galleries?slug=${params.id}`);
				return {gallery: gallery[0]}
			} else {
				return {gallery: undefined}
			}
		},

		data: () => {
			return {
				loading: true,
				galleryName: null,
				galleryDescription: null,
				filter: '',
				page: 1,
				columns: [
					{label: '', field: 'cover', interpolate: true, sortable: false},
					{label: 'Title', field: 'title'},
					{label: 'Issued On', field: 'issued_on'},
					{label: '', field: 'add', interpolate: true, sortable: false}
				],
				assets: [],
				sortableItems: []
			}
		},

		computed: {
			checkRequirements() {
				return (this.galleryName && this.galleryName.length !== 0) && (this.galleryDescription && this.galleryDescription.length !== 0) && this.sortableItems.length;
			}
		},

		async mounted() {
			if (!this.$store.state.account.inventory_updated) {
				return this.$router.push(`/inventory`);
			}

			const assets = await this.$axios.$get(`/inventory-items?user.username=${this.$store.state.account.address.toLowerCase()}&_limit=-1`);

			this.assets_raw = assets;

			this.assets = assets.map(asset => {
				if (asset.image) {
					return {
						tokenId: asset.token_id,
						tokenAddress: asset.token_address,
						cover: `<img src="${asset.image_small}">`,
						title: asset.name,
						issued_on: asset.collection_name,
						add: `<i class="icon-plus"></i>`
					};
				}
			});

			if (this.gallery) {
				const sortableItems = JSON.parse(this.gallery.assets);
				this.sortableItems = sortableItems.map(a => {
					const asset = this.assets_raw.find(asset => {
						return asset.token_id === a.tokenId && asset.token_address === a.tokenAddress;
					});
					if (asset && asset.image) {
						return {
							tokenId: a.tokenId,
							tokenAddress: a.tokenAddress,
							image_url: asset.image_small,
							title: asset.name,
							issuer: asset.collection_name,
						}
					} else {
						return {
							tokenId: '0',
							tokenAddress: '0',
							image_url: '',
							title: 'Removed Asset',
							issuer: 'This asset was removed.',
						}
					}
				});
				this.galleryName = this.gallery.name;
				this.galleryDescription = this.gallery.description;
			}
			this.assets = _.compact(this.assets);
			console.log(this.assets);
			this.loading = false;
		},

		watch: {
			filter() {
				this.page = 1;
				const ele = document.querySelector('#user-inventory-table nav ul li:first-of-type');
				ele.click();
			}
		},

		methods: {
			addAsset(tokenId, tokenAddress) {
				const asset = this.assets_raw.find(asset => {
					return asset.token_id === tokenId && asset.token_address === tokenAddress;
				});
				if (!asset) return;
				this.sortableItems.push({
					tokenId,
					tokenAddress,
					image_url: asset.image,
					title: asset.name,
					issuer: asset.collection_name,
				});
			},

			removeAsset(index) {
				this.sortableItems.splice(index, 1);
			},

			createGallery() {
				if (!this.sortableItems.length) return;
				if (!this.galleryName) return;
				if (!this.galleryDescription) return;
				let assets = this.sortableItems.map(asset => {
					return {
						tokenId: asset.tokenId,
						tokenAddress: asset.tokenAddress,
					}
				});
				assets = assets.filter(asset => asset.tokenId !== '0');
				this.$axios.$post(`/galleries`, {
					name: this.galleryName,
					description: this.galleryDescription,
					assets: JSON.stringify(assets),
					public: true,
					slug: ''
				}).then(gallery => {
					this.$store.state.account.galleries.unshift(gallery);
					this.$router.push(`/gallery/${gallery.slug}`);
				});
			},

			updateGallery() {
				if (!this.sortableItems.length) return;
				if (!this.galleryName) return;
				if (!this.galleryDescription) return;
				let assets = this.sortableItems.map(asset => {
					return {
						tokenId: asset.tokenId,
						tokenAddress: asset.tokenAddress,
					}
				});
				assets = assets.filter(asset => asset.tokenId !== '0');
				this.$axios.$put(`/galleries/${this.gallery.id}`, {
					name: this.galleryName,
					description: this.galleryDescription,
					assets: JSON.stringify(assets),
					public: true,
					slug: ''
				}).then(gallery => {
					this.$router.push(`/gallery/${gallery.slug}`);
				});
			},

		}
	}

</script>


<style lang="scss" scoped>

	.selected-assets {

		.body {
			max-height: calc(100vh - 175px);
			overflow-y: auto;
		}
	}

	td.ellipsis {
		max-width: 15em;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.input-group-title-image {

		.input-group-prepend, .title-image {
			width: 50%;
		}

		.input-group-text {
			width: 100%;
		}

		.title-image {
			text-align: center;
			padding: 1em;
			border: 1px solid #393d42;
		}
	}

	.contained-artwork {
		display: flex;
		margin-bottom: 1em;
		cursor: move;
		position: relative;

		&:last-of-type {
			margin-bottom: 0;
		}

		img {
			max-width: 7em;
			max-height: 5em;
			margin-right: 1em;
		}

		.first-item {
			position: absolute;
			left: -5px;
			top: -5px;
			width: 1em;
			height: 1em;
		}

		.remove {
			position: absolute;
			right: 0;
			font-size: 1.5em;
			top: calc((100% - 1.5em) / 2);
			cursor: pointer;
			color: #aa4b4b;
		}
	}

</style>
