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
				// window.localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
				try	{
					await this.$login();
				} catch (e) {
					this.$router.push('/');
				}
			}
		}
	}
</script>

<style lang="scss">
</style>
