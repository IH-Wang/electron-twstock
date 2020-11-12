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
	onMount(async () => {
		console.log(await db.store);
	});
</script>

<div class="wrapper">
	<Wave />
	<div>
		<h1>環境設定中, 請稍後...</h1>
	</div>
	<!-- <AddFavorite /> -->
</div>
