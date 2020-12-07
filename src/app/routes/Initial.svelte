<style>
</style>

<script>
	import { onMount, getContext } from 'svelte';
	import { Wave } from 'svelte-loading-spinners';
	import * as R from 'ramda';
	// component
	import Stock from '../components/initial/Stock.svelte';
	// util
	import dbUtil from '../util/db';
	// constants
	import { DB, DB_STOCK_CODE, IPC_INIT_STOCK_CODE } from '../constants';

	let isStockCodeChecking = true;
	let db = getContext(DB);
	let stockCodeList = [];

	onMount(async () => {
		db = await db;
		const isCodeListExist = (await dbUtil.getTotalCounts(db, DB_STOCK_CODE)) !== 0;
		if (!isCodeListExist) {
			const stockCodeRes = await window.ipcRenderer.invoke(IPC_INIT_STOCK_CODE).catch((error) => {
				window.alert(error);
				console.error(error);
			});
			if (!R.isEmpty(stockCodeRes)) {
				stockCodeList = stockCodeRes.sort((x, y) => x.code - y.code);
				const initCodeResult = await dbUtil.storeBatchData(db, { store: DB_STOCK_CODE, data: stockCodeRes });
				!R.isEmpty(initCodeResult) && (isStockCodeChecking = false);
			}
		} else {
			stockCodeList = await dbUtil.getAllItems(db, DB_STOCK_CODE);
			stockCodeList = stockCodeList.sort((x, y) => x.code - y.code);
			isStockCodeChecking = false;
		}
	});
</script>

<div class="pageWrapper">
	{#if isStockCodeChecking}
		<Wave />
		<div>
			<h1>環境設定中, 請稍後...</h1>
		</div>
	{:else}
		<Stock stockCodeList="{stockCodeList}" />
	{/if}
</div>
