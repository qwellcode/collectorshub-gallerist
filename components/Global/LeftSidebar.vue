<template>
	<div id="left-sidebar" class="sidebar" :class="[{'active': leftNavActive}]">
		<brand/>
		<div class="sidebar-scroll">
			<account v-if="account && account.address" :account="account"/>
			<nav id="left-sidebar-nav" class="sidebar-nav">

				<ul id="main-menu" class="metismenu">
					<li class="header d-flex flex-row align-items-center justify-content-between"><span>My Gallerist</span>
						<span>
							<nuxt-link class="p-0 d-inline-block" to="/gallery-manage">
									<i class="icon-plus m-0"></i>
								</nuxt-link>
						</span>
					</li>
					<nuxt-link to="/inventory" v-slot="{ href, route, navigate, isActive, isExactActive }">
						<li :class="[isActive && 'active', isExactActive && 'exact-active']">
							<nuxt-link :to="route">
								<i class="icon-diamond"></i><span>Inventory</span>
							</nuxt-link>
						</li>
					</nuxt-link>
					<nuxt-link to="/gallery-overview" v-slot="{ href, route, navigate, isActive, isExactActive }">
						<li :class="[isActive && 'active', isExactActive && 'exact-active']">
							<nuxt-link :to="route">
								<i class="icon-picture"></i><span>Galleries</span>
							</nuxt-link>
						</li>
					</nuxt-link>

					<ul aria-expanded="true" class="collapse in" style="">
						<!-- List all Galleriest of the user from API -->
						<nuxt-link v-for="(gallery, index) in account.galleries" v-if="index <= 5" :to="`/gallery/${gallery.slug}`">{{ gallery.name }}
						</nuxt-link>

						<!-- Link to Gallery Overview -->
						<nuxt-link v-if="account.galleries.length > 5" to="/gallery-overview">More..</nuxt-link>

					</ul>
					</li>
					<li class="header more">More Dapps</li>
					<li><a href="https://collectorshub.art/gallerist" target="_blank"><i class="icon-link"></i><span>Gallerist</span></a></li>
					<li><a href="https://collectorshub.art/auctioneer" target="_blank"><i class="icon-pointer"></i><span>Auctioneer</span></a></li>
					<li><a href="https://collectorshub.art/portfolio" target="_blank"><i class="icon-umbrella"></i><span>Portfolio</span></a></li>
					<!--<li><a href="app-inbox.html"><i class="icon-eyeglasses"></i><span>Appraiser (TBA)</span></a></li>-->

					<li class="header">Social Media</li>
					<li><a href="https://twitter.com/collectorshubA" target="_blank"><i class="icon-social-twitter"></i><span>Twitter</span></a></li>
					<li><a href="https://discord.gg/zbXKXV4" target="_blank"><i class="icon-users"></i><span>Discord</span></a></li>

				</ul>
			</nav>
		</div>
	</div>
</template>

<script>
	import Brand from "./Brand";
	import Account from "./Account";

	export default {
		components: {Account, Brand},
		data: () => {
			return {}
		},

		computed: {
			account() {
				return this.$store.state.account;
			},
			amount() {
				return this.$store.state.withdraw.amount;
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

		methods: {}
	}
</script>

<style lang="scss" scoped>
	a.active {
		color: #ffd400;

		&:before {
			width: 20px;
			background: #ffd400;
		}
	}
</style>
