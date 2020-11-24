<template>
	<div class="container">
		<div class="home-page">
			<div>
				<img src="~/assets/qwellcode/logo.png" alt="Collctors Hub Logo" class="img-fluid logo">
				<div class="title">Gallerist</div>
				<div class="row">
					<div class="col-12 col-md-8 offset-md-2">
						<p class="text">Gallerist helps collectors to organize and showcase art in a single place thats been collected across different NFT platforms.</p>
						<template v-if="$store.state.account.address">
							<div class="row">
								<div class="col-12">
									<div class="row no-gutters">
										<div class="col-12 col-lg-6 p-1">
											<nuxt-link to="/inventory" class="btn btn-primary btn-lg w-100"><i class="icon-diamond mr-1"></i> Inventory</nuxt-link>
										</div>
										<div class="col-12 col-lg-6 p-1">
											<nuxt-link to="/gallery-overview" class="btn btn-primary btn-lg w-100"><i class="icon-picture mr-1"></i> Galleries</nuxt-link>
										</div>
									</div>
								</div>
							</div>
						</template>
						<template v-else>
							<nuxt-link to="/login" class="btn btn-primary btn-lg"><i class="icon-power mr-1"></i> Login</nuxt-link>
						</template>
						<p v-if="$store.state.error" class="mt-5">{{ $store.state.error }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		components: {
		}
	}
</script>

<style lang="scss" scoped>
	.home-page {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		min-height: 80vh;

		.logo {
			max-width: 280px;
		}

		.title {
			cursor: default;
			text-align: center;
			box-sizing: inherit;
			padding: 0;
			border: 0;
			font: inherit;
			vertical-align: baseline;
			font-weight: 300;
			margin: 0 0 1.5rem 0;
			text-transform: uppercase;
			letter-spacing: 0.05em;
			font-style: normal;
			color: #ffffff;
			line-height: 1.3;
			font-size: 6em;

			@media (max-width: 575px) {
				font-size: 3rem;
			}

			&:after {
				content: '';
				background-color: #ffffff;
				display: block;
				height: 3px;
				margin: 2rem auto;
				width: 4rem;
			}
		}

		.text {
			color: #ffffff;
			cursor: default;
			text-align: center;
			box-sizing: inherit;
			padding: 0;
			border: 0;
			font-size: 1.2rem;
			vertical-align: baseline;
			margin: 0 0 2.5rem 0;
			margin-bottom: 2.5rem;

			@media (max-width: 575px) {
				font-size: 1rem;
			}
		}
	}
</style>
