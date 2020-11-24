<template>
	<nav class="navbar top-navbar">
		<div class="container-fluid">
			<div class="navbar-left">
				<div class="navbar-btn border-right-0">
					<nuxt-link to="/"><img src="~/assets/images/logo.png" alt="Oculux Logo" class="ml-3 logo"></nuxt-link>
					<button @click="toggleNavbar()" type="button" class="btn-toggle-offcanvas"><i class="lnr lnr-menu fa fa-bars"></i></button>
				</div>
			</div>

			<div @click="toggleNavbar()" class="backdrop-nav" :class="[{'active': leftNavActive}]"></div>

			<div class="navbar-right">
				<div id="navbar-menu">
					<ul class="nav navbar-nav">
						<li v-if="account.address" @click="copyToClipboard()" class="wallet-address"><span :data-clipboard-text="account.address" class="copy">{{ account.address }}</span>
						</li>
						<li>
							<nuxt-link v-if="!account.address" :to="'/login' + '?redirect=' + $router.currentRoute.path" class="icon-menu"><i class="icon-power"></i></nuxt-link>
							<nuxt-link v-else to="/logout" class="icon-menu"><i class="icon-power"></i></nuxt-link>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="progress-container">
			<div class="progress-bar" id="myBar"></div>
		</div>
	</nav>
</template>

<script>
	export default {
		data: () => {
			return {}
		},

		mounted() {
			const ClipboardJS = require( 'clipboard');
			const clipboard = new ClipboardJS('.copy');
		},

		computed: {
			account() {
				return this.$store.state.account;
			},
			leftNavActive: {
				get() {
					return this.$store.state.leftNavActive;
				},
				set(val) {
					this.$store.state.leftNavActive = val;
				}
			},
		},

		watch: {
			$route () {
				if ( this.$store && !this.$route.path.startsWith('/gallery/') ) {
					this.$store.state.activeGallery = null;
				}
			}
		},

		methods: {
			copyToClipboard() {
				this.$toast.show('Copied to Clipboard', {
					position: 'top-center',
					duration: 1500
				});
			},
			toggleNavbar() {
				this.leftNavActive === true ? this.leftNavActive = false : this.leftNavActive = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.backdrop-nav {
		background-color: rgba(black, .75);
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		display: none;

		&.active {
			display: block;
		}
	}

	.wallet-address {
		max-width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
	}

	.navbar.top-navbar {
		min-height: 45px;
	}
</style>
