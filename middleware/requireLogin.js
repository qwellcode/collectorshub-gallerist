export default function ({ route, store, redirect }) {
	if (!store.state.account.address || !store.state.account.user_id) {
		return redirect(`/login?redirect=${route.path}`);
	}
}
