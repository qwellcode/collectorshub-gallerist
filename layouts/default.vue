<template>
	<div>
		<page-loader v-if="!initialized"/>
		<div id="wrapper">
			<left-sidebar/>
			<top-nav/>
			<div id="main-content">
				<div class="container-fluid">
					<nuxt/>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	.web3modal-modal-lightbox {
		z-index: 1000 !important
	}
</style>
<script>
	import LeftSidebar from "../components/Global/LeftSidebar";
	import TopNav from "../components/Global/TopNav";
	import PageLoader from "../components/Global/PageLoader";

	export default {
		components: {PageLoader, TopNav, LeftSidebar},

		computed: {
			initialized() {
				const initialized = this.$store.state.initialized;
				for (let o in initialized) {
					if (!initialized[o]) {
						return false;
					}
				}

				return true;
			},
		},

		async beforeMount() {
			if (process.client) {
				const signature = window.localStorage.getItem('signature');
				if (signature) {
					try	{
						await this.$login();
					} catch (e) {
						this.$router.push('/');
					}
				}
			}
		},

		mounted() {
			this.$axios.interceptors.request.use(request => {
				console.log('Starting Request', request.url, 'With baseURL:', request.baseURL)
				return request
			});
		}
	}
</script>

<style lang="scss">
	#WEB3_CONNECT_MODAL_ID, #WEB3_CONNECT_MODAL_ID .web3modal-modal-lightbox {
		z-index: 100000 !important;
	}

	#main-content {
		min-height: calc(100vh - 62px);
	}

	.btn.btn-lg {
		font-size: 1.1rem;
		height: 4.25rem;
		line-height: 4.25rem;
		color: white;
		letter-spacing: 0.04rem;
		padding: 0 2.5em;
	}
</style>
