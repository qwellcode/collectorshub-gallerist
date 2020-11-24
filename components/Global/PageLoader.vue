<template>
	<div class="page-loader-wrapper">
<!--		<div class="loader">-->
<!--			<div class="bar1"></div>-->
<!--			<div class="bar2"></div>-->
<!--			<div class="bar3"></div>-->
<!--			<div class="bar4"></div>-->
<!--			<div class="bar5"></div>-->
<!--		</div>-->
		<div class="d-flex justify-content-center align-items-center h-100">
			<img src="~/assets/images/loading.gif" alt="">
		</div>
	</div>
</template>

<script>
	export default {
		name: 'page-loader',
		data: () => {
			return {}
		}
	}
</script>

<style lang="scss" scoped>
	.page-loader-wrapper {
		background-color: #333;
	}
</style>
