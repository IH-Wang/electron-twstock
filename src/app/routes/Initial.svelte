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
	import { onMount, getContext, afterUpdate } from 'svelte';
	import { Wave } from 'svelte-loading-spinners';
	import * as R from 'ramda';
	import stockUtil from '../util/stock';
	// import AddFavorite from '../components/initial/AddFavorite.svelte';
	const db = getContext('db');
	let isStockCodeChecking = true;
	let stockCodeList = [];
	let totalStocks = 0;
	let stockInfo = [];
	let percent = 0;
	let stockCode;

	const initStockInfo = async (index) => {
		if (index < totalStocks) {
			const { code, name, category, marketType } = stockCodeList[index];

			stockCode = { code, name, category, marketType };
			console.log(stockCode);
			const stockInfoRes = await window.ipcRenderer.invoke('initStockInfo', { code, days: 121 });
			console.log('====================================');
			console.log(stockUtil.getNetBuySellInfo(stockInfoRes.slice(-1)[0], stockInfoRes));
			console.log(stockUtil.getBooleanInfo(stockInfoRes));
			console.log('====================================');
			percent = ((index + 1) / totalStocks) * 100;
			// i = index + 1;
			// await initStockInfo(index + 1);
		}
	};
	onMount(async () => {
		const store = await db.store;
		const stockCodes = await store.stockCodes.getAll();
		stockInfo = await store.stockInfos.getAll();
		const checkTimer = setInterval(async () => {
			if (!R.isEmpty(stockCodes)) {
				clearInterval(checkTimer);
				stockCodeList = stockCodes.sort((x, y) => x.code - y.code);
				totalStocks = stockCodeList.length;
				isStockCodeChecking = false;
			}
		}, 500);
		// const store = await db.store;
		// const stockCodes = await store.stockCodes.getAll();
		// if (R.isEmpty(stockCodes)) {
		// 	const stockCodeRes = await window.ipcRenderer.invoke('initStockCode');
		// 	console.log(stockCodeRes);
		// 	await store.stockCodes.create(stockCodeRes);
		// 	i++;
		// }
		// const stockInfos = await store.stockInfos.getAll();
		// if (R.isEmpty(stockInfos)) {
		// 	const stockCodes = await store.stockCodes.getAll();
		// 	console.log(stockCodes.length);
		// }
		// console.log(await store.stockCodes.getAll());
		// if (window.ipcRenderer) {
		// 	const res = await window.ipcRenderer.invoke('initStockInfo', { code: 4906, days: 121 });
		// 	console.log(res);
		// }
	});
	$: {
		if (!R.isEmpty(stockCodeList)) {
			if (R.isEmpty(stockInfo)) {
				initStockInfo(0);
			}
		}
	}
</script>

<div class="wrapper">
	{#if isStockCodeChecking}
		<Wave />
		<div>
			<h1>環境設定中, 請稍後...</h1>
		</div>
	{:else}
		<div>
			<p>{percent.toFixed(2)}%</p>
			{#if percent !== 100}
				<p>{stockCode.name} ({stockCode.code}) 資料建置中...</p>
			{:else}
				<div>
					<h1>全部資料建置完成</h1>
				</div>
			{/if}
			<p>(各股抓取120天資料做建置)</p>
		</div>
	{/if}

	<!-- <AddFavorite /> -->
</div>
