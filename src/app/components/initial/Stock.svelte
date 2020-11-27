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
	import { format } from 'date-fns';

	// component
	import ProgressBar from '../common/progressBar/Circle.svelte';

	// util
	import stockUtil from '../../util/stock';
	import { delay } from '../../util/common';

	// css
	import styled from './Initial.module.scss';

	export let stockCodeList;
	let db = getContext('db');
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
				const stockInfoRes = await window.ipcRenderer.invoke('initStockInfo', { code, days: 121 });
				if (!R.isEmpty(stockInfoRes)) {
					const stockInfo = stockInfoRes.slice(-1)[0];
					await db.stockInfos.create({
						code,
						date: stockInfo.date,
						priceInfo: stockUtil.getPriceInfo(stockInfo, stockInfoRes),
						volInfo: stockUtil.getVolInfo(stockInfo, stockInfoRes),
						flagInfo: stockUtil.getStockFlagType(stockInfo, stockInfoRes),
						reverseInfo: stockUtil.getStockReverseType(stockInfo, stockInfoRes),
						buySellInfo: stockUtil.getNetBuySellInfo(stockInfo, stockInfoRes),
						bsmInfo: stockUtil.getBSMInfo(stockInfo, stockInfoRes),
						booleanInfo: stockUtil.getBooleanInfo(stockInfoRes),
					});
				} else {
					removeCodeList.push(code);
				}
				await delay(200);
			}
			percent.set(Math.floor(((index + 1) / totalStocks) * 100));
			await initStockInfo(index + 1);
		} else {
			// 移除無資料的 code
			removeCodeList.forEach((code) => {
				db.stockCodes.remove(code);
			});
			push('/main');
		}
	};

	onMount(async () => {
		totalStocks = stockCodeList.length;
		db = await db.store;
		stockInfoList = await db.stockInfos.getAll();
		if (stockInfoList.length === totalStocks) {
			const checkDate = stockInfoList[0].date;
			const checkTime = format(new Date(), 'yyyy/MM/dd');
			// 開啟時間超過當天晚上六點半且 db table 資料日期不是當天的, 就抓取當天的
			if (new Date().valueOf() > new Date(`${checkTime} 18:30:00`).valueOf() && checkDate !== checkTime) {
				await db.stockInfos.removeAll();
				initStockInfo(0);
			} else {
				percent.set(100);
			}
		} else {
			initStockInfo(0);
		}
	});
	$: {
		if ($percent === 100) {
			push('/main');
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
		<p class="{styled.memo}">(各股抓取120天資料做建置)</p>
	</div>
</div>
