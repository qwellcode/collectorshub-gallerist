<template>
	<div class="block-header h-100">
		<loader/>
	</div>
</template>

<script>
	import Loader from "../components/Global/Loader";

	export default {
		components: {Loader},
		data: () => {
			return {}
		},

		async mounted() {
			if (process.client) {
				window.localStorage.clear();
				this.$store.state.account = {
					address: null,
					galleries: [],
				};
				this.$router.push('/');
			}
		}
	}
</script>

<style lang="scss">
</style>
