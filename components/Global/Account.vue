<template>
	<div class="user-account">
		<div v-if="account.profile_img_url" class="user_div">
			<img :src="account.profile_img_url" class="user-photo" alt="User Profile Picture">
		</div>
		<div class="dropdown">
			<span>Welcome,</span>
			<p class="user-name"><strong>{{ account.user && account.user.username ? account.user.username : account.address }}</strong></p>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'account',
		props: {
			account: {
				required: true
			}
		},
		data: () => {
			return {}
		}
	}
</script>

<style lang="scss" scoped>
	.user-name {
		max-width: 160px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
