<style>
	/* .pb-arc{
		stroke: ;
	} */
</style>

<script>
	import { onMount, getContext } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import * as R from 'ramda';
	import { fade } from 'svelte/transition';
	import { push } from 'svelte-spa-router';

	// component
	import ProgressBar from '../common/progressBar/Circle.svelte';

	// constants
	import { DB, DB_STOCK_INFO, DB_STOCK_CODE, IPC_INIT_STOCK_INFO } from '../../constants';

	// util
	import stockUtil from '../../util/stock';
	import { delay } from '../../util/common';

	// css
	import styled from './Initial.module.scss';
	import dbUtil from '../../util/db';

	export let stockCodeList;
	let db = getContext(DB);
	let totalStocks = 0;
	let stockInfoList;
	let stockCode;
	let percent = tweened(0, {
		duration: 200,
		easing: cubicOut,
	});
	let removeCodeList = [];
	const progressProps = {
		size: 200,
		strokeWidth: 20,
		circleOneStroke: '#aaa',
		circleTwoStroke: '#7ea9e1',
	};

	const initStockInfo = async (index) => {
		if (index < totalStocks) {
			const { code, name, category, marketType } = stockCodeList[index];
			stockCode = { code, name, category, marketType };
			// db table 沒有才去爬資料
			if (R.isNil(stockInfoList.find((stock) => stock.code === code))) {
				const stockInfoRes = await window.ipcRenderer.invoke(IPC_INIT_STOCK_INFO, { code, days: 241 }).catch((error) => {
					console.error(error);
					window.location.reload();
				});
				if (stockInfoRes.length === 241) {
					const stockInfo = stockInfoRes.slice(-1)[0];
					await dbUtil.setItem(db, {
						store: DB_STOCK_INFO,
						data: {
							code,
							name,
							category,
							marketType,
							date: stockInfo.date,
							sortPriority: !category ? 99 : 0,
							priceInfo: stockUtil.getPriceInfo(stockInfo, stockInfoRes),
							volInfo: stockUtil.getVolInfo(stockInfo, stockInfoRes),
							flagInfo: stockUtil.getStockFlagType(stockInfo, stockInfoRes),
							reverseInfo: stockUtil.getStockReverseType(stockInfo, stockInfoRes),
							buySellInfo: stockUtil.getNetBuySellInfo(stockInfo, stockInfoRes),
							bsmInfo: stockUtil.getBSMInfo(stockInfo, stockInfoRes),
							booleanInfo: stockUtil.getBooleanInfo(stockInfoRes),
							macdInfo: stockUtil.getMACDInfo(stockInfoRes),
						},
					});
				} else {
					removeCodeList.push(code);
				}
				await delay(300);
			}
			percent.set(Math.floor(((index + 1) / totalStocks) * 100));
			await initStockInfo(index + 1);
		} else {
			dbUtil.clearBatchData(db, { store: DB_STOCK_CODE, data: removeCodeList });
		}
	};

	onMount(async () => {
		totalStocks = stockCodeList.length;
		db = await db;
		stockInfoList = await dbUtil.getAllItems(db, DB_STOCK_INFO);
		if (stockInfoList.length === totalStocks) {
			percent.set(100);
		} else {
			initStockInfo(0);
		}
	});
	$: {
		if ($percent === 100) {
			setTimeout(() => {
				push('/main');
			}, 500);
		}
	}
</script>

<div class="{styled.stockWrapper}" transition:fade>
	<ProgressBar props="{progressProps}" progress="{percent}" />
	<div class="{styled.info}">
		{#if $percent !== 100}
			<p>{stockCode ? `${stockCode.name} (${stockCode.code})` : ''} 資料建置中...</p>
		{:else}
			<p>全部資料建置完成</p>
		{/if}
		<p class="{styled.memo}">(各股抓取240天資料做建置, 不滿240天暫不建檔)</p>
	</div>
</div>
