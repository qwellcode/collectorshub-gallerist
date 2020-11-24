<template>
	<loader v-if="loading" />
	<div v-else class="row clearfix">
		<div class="col-lg-12 col-md-12">

			<div class="card">
				<div class="header">
					<h2>My Galleries</h2>
					<nuxt-link to="/gallery-manage" class="btn btn-primary newGallery">Create Gallery</nuxt-link>
				</div>
				<div class="body">
					<div v-if="rows.length" class="table-responsive">
						<div class="search">
							<label>Search: <input v-model="filter" class="form-control" placeholder=""></label>
						</div>
						<datatable class="table table-hover table-custom spacing5" :columns="columns" :data="rows" :filter="filter" :per-page="10">
							<template scope="{ row }">
								<tr @click="viewGallery(row.slug)">
									<td style="text-align: left;" v-html="row.cover"></td>
									<td>{{ row.title }}</td>
									<td>{{ row.create_date }}</td>
									<td>{{ row.last_update }}</td>
								</tr>
							</template>
						</datatable>
						<datatable-pager class="table-pagination" v-model="page" type="abbreviated"></datatable-pager>
					</div>
					<div v-else>
						<p class="text-center mb-0">You don't have any Galleries for now. You can create one <nuxt-link to="/gallery-manage">here</nuxt-link>.</p>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import moment from 'moment';
	import Loader from "../../components/Global/Loader";

	export default {
		middleware: ['requireLogin', 'OpenSea'],

		components: {Loader},

		data: () => {
			return {
				loading: true,
				filter: '',
				page: 1,
				columns: [
					{label: 'Cover', field: 'cover', interpolate: true},
					{label: 'Title', field: 'title'},
					{label: 'Created On', field: 'create_date'},
					{label: 'Last Updated', field: 'last_update'}
				],
				rows: [],
			}
		},

		async mounted() {
			let galleries = await this.$axios.$get(`/galleries?user.username=${this.$store.state.account.address}&_sort=updated_at:DESC`);

			galleries = galleries.map(gallery => {
				gallery.assets = JSON.parse(gallery.assets);
				return gallery;
			});

			galleries = galleries.map(async gallery => {
				const ret = _.first(await this.$axios.$get(`/inventory-items?token_id=${gallery.assets[0].tokenId}&token_address=${gallery.assets[0].tokenAddress}`));
				return {
					id: gallery.id,
					cover: `<img src="${ret ? ret.image_small : ''}">`,
					slug: gallery.slug,
					title: gallery.name,
					description: gallery.description,
					create_date: moment(gallery.created_at).format('YYYY-MM-DD HH:mm:ss'),
					last_update: moment(gallery.updated_at).format('YYYY-MM-DD HH:mm:ss'),
				}
			});

			galleries = await Promise.all(galleries);
			this.rows = galleries;
			this.loading = false;
		},

		methods: {
			viewGallery(gallery_id) {
				this.$router.push(`/gallery/${gallery_id}`);
			}
		}
	}


</script>


<style lang="scss" scoped>
	.table {
		tr {
			cursor: pointer;
		}
	}
</style>
