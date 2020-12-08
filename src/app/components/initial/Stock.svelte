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
	import { format, differenceInDays } from 'date-fns';

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

	const checkStockInfoList = async (db, checkDate) => {
		const checkTime = format(new Date(), 'yyyy/MM/dd');
		const checkDiffDays = differenceInDays(new Date(checkTime), new Date(checkDate));
		// 開啟時間超過當天晚上六點半且 db table 資料日期不是當天的, 就抓取當天的
		if (
			checkDiffDays > 1 ||
			(new Date().valueOf() > new Date(`${checkTime} 18:30:00`).valueOf() && checkDiffDays === 1)
		) {
			const newStockInfoList = await window.ipcRenderer
				.invoke(IPC_INIT_STOCK_INFO, { code: 2330, days: 1 })
				.catch((error) => {
					console.error(error);
					window.location.reload();
				});
			if (newStockInfoList[0].date !== checkDate) {
				await dbUtil.clearStore(db, DB_STOCK_INFO);
				return false;
			}
		} else {
			return true;
		}
	};

	const initStockInfo = async (index) => {
		if (index < totalStocks) {
			const { code, name, category, marketType } = stockCodeList[index];
			stockCode = { code, name, category, marketType };
			// db table 沒有才去爬資料
			if (R.isNil(stockInfoList.find((stock) => stock.code === code))) {
				const stockInfoRes = await window.ipcRenderer
					.invoke(IPC_INIT_STOCK_INFO, { code, days: 121 })
					.catch((error) => {
						console.error(error);
						window.location.reload();
					});
				if (!R.isEmpty(stockInfoRes)) {
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
			const isNewDate = await checkStockInfoList(db, stockInfoList[0].date);
			isNewDate ? percent.set(100) : initStockInfo(0);
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
		<p class="{styled.memo}">(各股抓取120天資料做建置)</p>
	</div>
</div>
