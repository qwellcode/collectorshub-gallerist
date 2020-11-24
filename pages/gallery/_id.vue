<template>

	<div>
		<div class="card">
			<div class="header">
				<div class="row w-100">
					<div class="col-xl-7 col-lg-6 px-4">
						<div class="">
							<h2>{{ gallery.name }}</h2>
							<p class="text-white mb-0">{{ gallery.description }}</p>
						</div>
					</div>
					<div class="col-xl-5 col-lg-6">
						<div class="action-buttons text-lg-right text-center">
							<button @click="photoswipe.isOpen = true" class="view-gallery-button btn mb-2 btn-warning rounded-0 font-weight-bold text-uppercase ml-3"><i class="fa fa-fw mr-2 fa-image"></i>View Gallery</button>
							<button class="btn mb-2 btn-primary">
								<ShareNetwork
									network="twitter"
									:url="fullURL"
									:title="gallery.name"
								>
									<i class="fa fa-fw fa-twitter"></i>
								</ShareNetwork>
							</button>
							<button class="btn mb-2 btn-primary">
								<ShareNetwork
									network="facebook"
									:url="fullURL"
									:title="gallery.name"
									:description="gallery.description"
								>
									<i class="fa fa-fw fa-facebook"></i>
								</ShareNetwork>
							</button>
							<button class="btn mb-2 btn-primary">
								<ShareNetwork
									class="d-block"
									style="width: 18px;"
									network="telegram"
									:url="fullURL"
									:title="gallery.name"
									:description="gallery.description"
								>
									<img style="width: 14px;" src="data:image/svg+xml;base64,PHN2ZyBpZD0iQm9sZCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjQgMjQiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTkuNDE3IDE1LjE4MS0uMzk3IDUuNTg0Yy41NjggMCAuODE0LS4yNDQgMS4xMDktLjUzN2wyLjY2My0yLjU0NSA1LjUxOCA0LjA0MWMxLjAxMi41NjQgMS43MjUuMjY3IDEuOTk4LS45MzFsMy42MjItMTYuOTcyLjAwMS0uMDAxYy4zMjEtMS40OTYtLjU0MS0yLjA4MS0xLjUyNy0xLjcxNGwtMjEuMjkgOC4xNTFjLTEuNDUzLjU2NC0xLjQzMSAxLjM3NC0uMjQ3IDEuNzQxbDUuNDQzIDEuNjkzIDEyLjY0My03LjkxMWMuNTk1LS4zOTQgMS4xMzYtLjE3Ni42OTEuMjE4eiIvPjwvc3ZnPg==" />
								</ShareNetwork>
							</button>
							<button class="btn mb-2 btn-primary">
								<ShareNetwork
									network="email"
									:url="fullURL"
									:title="gallery.name"
									:description="gallery.description"
								>
									<i class="fa fa-fw fa-envelope"></i>
								</ShareNetwork>
							</button>
							<button @click="copyToClipboard()" class="btn mb-2 btn-primary copy" :data-clipboard-text="fullURL">
								<i class="fa fa-fw fa-link"></i>
							</button>
							<template v-if="gallery.user.username === account.address">
								<nuxt-link :to="`/gallery-manage/${activeGallery}`" class="btn mb-2 btn-warning rounded-0 font-weight-bold text-uppercase ml-3">Edit</nuxt-link>
								<button @click="deleteGallery()" class="btn mb-2 btn-primary bg-danger border-danger">Delete</button>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div>

		<no-ssr>
			<v-photoswipe :isOpen="photoswipe.isOpen" :items="photoSwipeImages" :options="photoswipe.options" @close="hidePhotoSwipe"></v-photoswipe>
		</no-ssr>
		<div v-masonry item-selector=".grid-item" class="masonry-container">
			<div v-masonry-tile class="grid-item" :class="{'many-many': gallery.assets.length >= 9, 'many': gallery.assets.length >= 6}" :key="index" v-for="(asset, index) in gallery.assets" v-if="asset.image && asset.image_small">
				<div @click="toggleActiveClass($event)" class="flip-card">
					<div class="flip-card-inner">
						<div class="flip-card-front">
							<img class="rounded img-responsive" :src="asset.image_small" alt="">
						</div>
						<div class="flip-card-back">
							<div class="cardbackground" :style="`background-image:url('${asset.image_small}')`"></div>
							<div class="cardcontent">
								<h1>{{ asset.name }}</h1>
								<h2>{{ asset.collection_name }}</h2>
								<div class="btnHolder">
									<a @click="showPhotoSwipe(index)" class="light-link btn btn-primary">
										Inspect
									</a>
									<a :href="`https://opensea.io/assets/${asset.token_address}/${asset.token_id}`" target="_blank" class="btn btn-primary btn-secondary market">Market</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import _ from 'lodash';

	export default {
		middleware: ['OpenSea'],

		computed: {
			account() {
				return this.$store.state.account;
			},
			activeGallery() {
				return this.$store.state.activeGallery;
			},
			fullURL() {
				if (process.client) {
					return window.location.href;
				} else {
					return '';
				}
			}
		},

		mounted() {
			const ClipboardJS = require( 'clipboard');
			const clipboard = new ClipboardJS('.copy');
		},

		async asyncData({params, error, $axios, $getImageDimensions, store}) {
			let galleryImages = [];
			let photoSwipeImages = [];
			let gallery = await $axios.$get(`/galleries?slug=${params.id}`);
			if (!gallery || !gallery.length) return error({ statusCode: 404, message: 'Gallery not found' });
			gallery = gallery[0];
			gallery.assets = JSON.parse(gallery.assets);

			gallery.assets = gallery.assets.map(async asset => {
				return $axios.$get(`/inventory-items?token_id=${asset.tokenId}&token_address=${asset.tokenAddress}`);
			});

			gallery.assets = await Promise.all(gallery.assets);

			gallery.assets = gallery.assets.map(assets => {
				return assets[0];
			});

			gallery.assets = _.compact(gallery.assets);

			if (gallery.assets[0] === undefined) {
				return error({ statusCode: 404, message: 'Gallery not found' });
			}

			for (let i = 0; i < gallery.assets.length; i++) {
				try {
					const asset = gallery.assets[i];
					if (!asset) {
						gallery.assets.splice(i, 1);
						continue;
					}
					const dimensions = await $getImageDimensions(asset.image);
					photoSwipeImages.push({
						title: asset.name,
						w: dimensions.w * 5,
						h: dimensions.h * 5,
						src: asset.image
					});
					galleryImages.push({title: asset.name, url: asset.image});
				} catch (e) {
					// TODO: Let the API check if the owner of the asset is still correct, otherwise remove it from his inventory and the gallery
					console.log(e);
					store.state.error = e.message;
					gallery = gallery.assets.splice(i, 1);
					i--;
				}
			}

			if (params.id) store.state.activeGallery = params.id;

			return {
				galleryImages,
				photoSwipeImages,
				gallery,
			}
		},

		data() {
			return {
				lightGallery: {
					index: null,
				},
				photoswipe: {
					isOpen: false,
					isOpenGallery: false,
					options: {
						shareEl: false,
						index: 0,
						closeOnScroll: false
					},
					optionsGallery: {},
					// items: [] // by asyncData
				}
			}
		},

		head () {
			return {
				title: `${this.gallery.name} — Gallerist - Collectors Hub`,
				meta: [
					{ hid: 'title', name: 'title', content: `${this.gallery.name} — Gallerist - Collectors Hub` },
					{ hid: 'description', name: 'description', content: this.gallery.description },
					{ hid: 'og:type', property: 'og:type', content: 'website' },

					{ hid: 'og:url', property: 'og:type', content: this.$route.path },
					{ hid: 'og:title', property: 'og:title', content: `${this.gallery.name} — Gallerist - Collectors Hub` },
					{ hid: 'og:description', property: 'og:description', content: this.gallery.description },
					{ hid: 'og:image', property: 'og:image', content: this.gallery.assets[0].image },

					{ hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
					{ hid: 'twitter:url', property: 'twitter:url', content: this.$route.path },
					{ hid: 'twitter:title', property: 'twitter:title', content: `${this.gallery.name} — Gallerist - Collectors Hub` },
					{ hid: 'twitter:description', property: 'twitter:description', content: this.gallery.description },
					{ hid: 'twitter:image', property: 'twitter:image', content: this.gallery.assets[0].image },
				]
			}
		},

		methods: {
			showPhotoSwipe(index) {
				this.photoswipe.isOpen = true
				this.$set(this.photoswipe.options, 'index', index)
			},
			hidePhotoSwipe() {
				this.photoswipe.isOpen = false
			},
			deleteGallery() {
				this.$dialog.confirm('Are you sure you want to delete this gallery?').then(() => {
					this.$axios.$delete(`/galleries/${this.gallery.id}`).then(() => {
						this.$store.state.account.galleries = _.reject(this.$store.state.account.galleries, g => {
							return g.id === parseInt(this.gallery.id);
						});
						this.$router.push(`/gallery-overview`);
					});
				});
			},
			copyToClipboard() {
				this.$toast.show('Copied to Clipboard', {
					position: 'top-center',
					duration: 1500
				});
			},
			toggleActiveClass(e) {
				const ele = e.currentTarget;
				if (ele.classList.contains('active')) {
					return ele.classList.toggle('active');
				}
				document.querySelectorAll('.masonry-container .flip-card').forEach(element => {
					element.classList.remove('active');
				});
				ele.classList.toggle('active');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.grid-item {
		width: 25%;
		padding: 0 .5rem;
		margin-bottom: 1rem;
		z-index: 0;

		&.many-many, &.many {
			@media (min-width: 1921px) {
				width: 16.67%;
			}
		}

		@media (max-width: 1919px) {
			width: 33.33% !important;
		}

		@media (max-width: 1200px) {
			width: 50% !important;
		}

		@media (max-width: 576px) {
			width: 100% !important;
		}
	}

	.card .header {
		display: flex;
		justify-content: space-between;

		@media (max-width: 991px) {
			align-items: center;
			text-align: center;
			flex-direction: column;

			.action-buttons {
				margin-top: 1em;
			}
		}
	}

	.view-gallery-button {
		@media (max-width: 767px) {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			margin: 0 !important;
			width: 100%;
			padding: 1rem;
			z-index: 1;
		}
	}

	.flip-card {
		cursor: pointer;
	}
</style>
