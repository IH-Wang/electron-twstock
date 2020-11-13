<style>
	.wrapper {
		display: flex;
		height: inherit;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}
</style>

<script>
	import { onMount, getContext } from 'svelte';
	import { Wave } from 'svelte-loading-spinners';
	// import AddFavorite from '../components/initial/AddFavorite.svelte';
	const db = getContext('db');
	// let i = 0;
	onMount(async () => {
		const store = await db.store;
		console.log(await store.stockCodes.getAll());
		if (window.ipcRenderer) {
			const res = await window.ipcRenderer.invoke('initStockInfo', { code: 4906, days: 121 });
			console.log(res);
		}
	});
</script>

<div class="wrapper">
	<Wave />
	<div>
		<h1>環境設定中, 請稍後...</h1>
	</div>
	<!-- <AddFavorite /> -->
</div>
