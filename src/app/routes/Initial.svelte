<style>
</style>

<script>
	import { onMount, getContext } from 'svelte';
	import { Wave } from 'svelte-loading-spinners';
	import * as R from 'ramda';
	import Stock from '../components/initial/Stock.svelte';
	const db = getContext('db');
	let isStockCodeChecking = true;
	let stockCodeList = [];

	onMount(async () => {
		const store = await db.store;

		const checkTimer = setInterval(async () => {
			const stockCodes = await store.stockCodes.getAll();
			if (!R.isEmpty(stockCodes)) {
				clearInterval(checkTimer);
				stockCodeList = stockCodes.sort((x, y) => x.code - y.code);
				isStockCodeChecking = false;
			}
		}, 500);
	});
</script>

<div class="pegeWrapper">
	{#if isStockCodeChecking}
		<Wave />
		<div>
			<h1>環境設定中, 請稍後...</h1>
		</div>
	{:else}
		<Stock stockCodeList="{stockCodeList}" />
	{/if}
</div>
