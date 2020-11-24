<template>
	<div class="page-loader-wrapper">
		<div class="d-flex justify-content-center align-items-center h-100">
			<img src="~/assets/images/loading.gif" alt="">
		</div>
	</div>
</template>

<script>
	export default {
		name: 'loader',
		data: () => {
			return {}
		}
	}
</script>

<style lang="scss" scoped>
	.page-loader-wrapper {
		z-index: 100;
		background-color: #333;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>
