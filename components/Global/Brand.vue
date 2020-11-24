<template>
	<div class="navbar-brand">
		<nuxt-link to="/"><img src="~/assets/qwellcode/logo.png" alt="Collctors Hub Logo" class="img-fluid"></nuxt-link>
		<button type="button" class="btn-toggle-offcanvas btn btn-sm float-right"><i class="lnr lnr-menu icon-close"></i></button>
	</div>
</template>

<script>
	export default {
		name: 'brand',
		data: () => {
			return {}
		}
	}
</script>

<style lang="scss" scoped>
	.navbar-brand {
		margin-top: 0 !important;
	}
</style>
