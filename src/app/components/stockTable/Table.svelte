<style>
	.red {
		color: red;
	}
	.green {
		color: green;
	}
</style>

<script>
	import { getContext, onMount } from 'svelte';
	import * as R from 'ramda';
	import { fade } from 'svelte/transition';
	import { format, differenceInDays } from 'date-fns';
	// util
	import { toCurrency, delay } from '../../util/common';
	import dbUtil from '../../util/db';
	import stockUtil from '../../util/stock';
	// constants
	import { DB, IPC_INIT_STOCK_INFO, DB_STOCK_INFO } from '../../constants';
	// component
	import LineBar from '../common/progressBar/LineBar.svelte';
	// store
	import MainStore from '../../stores/main.js';
	// css
	import styled from './Table.module.scss';

	export let stockInfoList = [];
	export let count = 0;
	export let filterProps = { marketType: '', category: -1, isFlagType: false, isReverseType: false };
	const flagInfoList = ['弱勢', '中等', '強勢'];
	let totalStock = 0;
	let db = getContext(DB);
	let isUpdating = false;
	let stockList = [];
	let progress = 0;
	onMount(async () => {
		db = await db;
		totalStock = await dbUtil.getTotalCounts(db, DB_STOCK_INFO);
	});
	const getRiseDropColor = (base, compare) => {
		if (base === compare) {
			return '';
		} else if (base > compare) {
			return 'red';
		} else {
			return 'green';
		}
	};
	const getBuySellDays = (days) => {
		if (days > 1) {
			return `連買 ${days} 天`;
		} else if (days < -1) {
			return `連賣 ${Math.abs(days)} 天`;
		} else {
			return '';
		}
	};
	const checkUpdate = async () => {
		if (isUpdating) {
			return;
		}
		const today = format(new Date(), 'yyyy/MM/dd');
		const checkDate = stockInfoList[0].date;
		const checkDiffDays = differenceInDays(new Date(today), new Date(checkDate));

		// 開啟時間超過當天晚上六點半且 db table 資料日期不是當天的, 就抓取當天的
		isUpdating = true;
		stockList = $MainStore.baseStockInfoList;
		await updateStockInfo(0);
		if (checkDiffDays >= 1 || new Date().valueOf() > new Date(`${today} 18:30:00`).valueOf()) {
			isUpdating = true;
			stockList = $MainStore.baseStockInfoList;
			await updateStockInfo(0);
		}
	};
	const updateStockInfo = async (index) => {
		if (index < totalStock) {
			const { code, name, category, marketType } = stockList[index];
			const stockInfoRes = await window.ipcRenderer.invoke(IPC_INIT_STOCK_INFO, { code, days: 241 }).catch((error) => {
				console.error(error);
				updateStockInfo(index);
			});
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
					kdInfo: stockUtil.getKDInfo(stockInfoRes),
				},
			});
			await delay(300);
			progress = Math.floor(((index + 1) / totalStock) * 1000) / 1000;
			await updateStockInfo(index + 1);
		} else {
			const updatedStockList = await dbUtil.getAllItems(db, DB_STOCK_INFO);
			MainStore.setBaseStockInfoList(updatedStockList);
			MainStore.resetFilter();
			setTimeout(() => {
				isUpdating = false;
				progress = 0;
				stockList = [];
			}, 2000);
		}
	};
</script>

<div class="w-full">
	<div class="flex flex-col my-2">
		<div class="align-middle inline-block w-full px-4">
			{#if !R.isEmpty(stockInfoList)}
				<div class="inline-flex my-1">
					<span>日期: {stockInfoList[0].date} | 符合筆數: {count} </span>
					<i
						class="material-icons mx-1   {isUpdating ? 'text-gray-300' : 'cursor-pointer hover:text-gray-500'}"
						on:click="{() => checkUpdate()}"
					>update</i>
				</div>
				{#if isUpdating}
					<span transition:fade="{{ duration: 200 }}">{progress !== 1 ? '更新股票資訊...' : '更新完成'}</span>
					<LineBar progressValue="{progress}" />
				{/if}
			{/if}
			<div class="{styled.tableWrapper} shadow overflow-auto w-full border-b border-gray-200 sm:rounded-lg">
				{#if R.isEmpty(stockInfoList)}
					<span>查無資料</span>
				{:else}
					<table class="{styled.table} min-w-full divide-y divide-gray-200">
						<thead>
							<tr class="{styled.tableHeader}">
								<th scope="col" class="text-center uppercase tracking-wider">股號</th>
								<th scope="col" class="text-center uppercase tracking-wider">名稱</th>
								<th scope="col" class="text-center uppercase tracking-wider">市場</th>
								<th scope="col" class="text-center uppercase tracking-wider">產業</th>
								<th scope="col" class="text-center uppercase tracking-wider">參考價</th>
								<th scope="col" class="text-center uppercase tracking-wider">開盤價</th>
								<th scope="col" class="text-center uppercase tracking-wider">收盤價</th>
								<th scope="col" class="text-center uppercase tracking-wider">最高</th>
								<th scope="col" class="text-center uppercase tracking-wider">最低</th>
								<th scope="col" class="text-center uppercase tracking-wider">漲跌</th>
								<th scope="col" class="text-center uppercase tracking-wider">漲跌幅</th>
								<th scope="col" class="text-center uppercase tracking-wider">振幅</th>
								<th scope="col" class="text-center uppercase tracking-wider">成交量</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>三大法人</p>
									<p>買賣超</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>三大法人</p>
									<p>持有</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>外資</p>
									<p>買賣超</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>外資</p>
									<p>持有</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>外資</p>
									<p>連買賣</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>投信</p>
									<p>買賣超</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>投信</p>
									<p>持有</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>投信</p>
									<p>連買賣</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>自營商</p>
									<p>買賣超</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>自營商</p>
									<p>持有</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>自營商</p>
									<p>連買賣</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>大戶</p>
									<p>買賣超</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">
									<p>大戶</p>
									<p>連買賣</p>
								</th>
								<th scope="col" class="text-center uppercase tracking-wider">融資增減</th>
								<th scope="col" class="text-center uppercase tracking-wider">融資餘額</th>
								<th scope="col" class="text-center uppercase tracking-wider">融券增減</th>
								<th scope="col" class="text-center uppercase tracking-wider">融券餘額</th>
								<th scope="col" class="text-center uppercase tracking-wider">融資使用率</th>
								<th scope="col" class="text-center uppercase tracking-wider">券資比</th>
								<th scope="col" class="text-center uppercase tracking-wider">均線</th>
								<th scope="col" class="text-center uppercase tracking-wider">布林通道</th>
								<th scope="col" class="text-center uppercase tracking-wider">MACD</th>
								{#if filterProps.isFlagType}
									<th scope="col" class="text-center uppercase tracking-wider">旗型</th>
								{/if}
								{#if filterProps.isReverseType}
									<th scope="col" class="text-center uppercase tracking-wider">破切</th>
								{/if}
							</tr>
						</thead>

						<tbody class="divide-y divide-gray-200 text-center">
							{#each stockInfoList as stock (stock.code)}
								<tr class="{styled.tableBody}" transition:fade="{{ duration: 200 }}">
									<td class="whitespace-nowrap text-sm text-gray-500">{stock.code}</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{stock.name}</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{stock.marketType}</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{stock.category}</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{toCurrency(stock.priceInfo.refPrice)}</td>
									<td
										class="whitespace-nowrap text-sm text-gray-500 {stock.priceInfo.endPrice === stock.priceInfo.startPrice && (stock.priceInfo.isLimitUp || stock.priceInfo.isLimitDown) ? (stock.priceInfo.isLimitUp ? styled.limitUp : styled.limitDown) : getRiseDropColor(stock.priceInfo.startPrice, stock.priceInfo.refPrice)}"
									>
										{toCurrency(stock.priceInfo.startPrice)}
									</td>
									<td
										class="whitespace-nowrap text-sm text-gray-500 {stock.priceInfo.isLimitUp ? styled.limitUp : stock.priceInfo.isLimitDown ? styled.limitDown : getRiseDropColor(stock.priceInfo.endPrice, stock.priceInfo.refPrice)}"
									>
										{toCurrency(stock.priceInfo.endPrice)}
									</td>
									<td
										class="whitespace-nowrap text-sm text-gray-500 {stock.priceInfo.endPrice === stock.priceInfo.maxPrice && (stock.priceInfo.isLimitUp || stock.priceInfo.isLimitDown) ? (stock.priceInfo.isLimitUp ? styled.limitUp : styled.limitDown) : getRiseDropColor(stock.priceInfo.maxPrice, stock.priceInfo.refPrice)}"
									>
										{toCurrency(stock.priceInfo.maxPrice)}
									</td>
									<td
										class="whitespace-nowrap text-sm text-gray-500 {stock.priceInfo.endPrice === stock.priceInfo.minPrice && (stock.priceInfo.isLimitUp || stock.priceInfo.isLimitDown) ? (stock.priceInfo.isLimitUp ? styled.limitUp : styled.limitDown) : getRiseDropColor(stock.priceInfo.minPrice, stock.priceInfo.refPrice)}"
									>
										{toCurrency(stock.priceInfo.minPrice)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.priceInfo.riseDropPrice, 0)}">
										{stock.priceInfo.riseDropPrice}
									</td>
									<td
										class="whitespace-nowrap text-sm text-gray-500 {stock.priceInfo.isLimitUp ? styled.limitUp : stock.priceInfo.isLimitDown ? styled.limitDown : getRiseDropColor(stock.priceInfo.riseDropMargin, 0)}"
									>
										{stock.priceInfo.riseDropMargin}%
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{stock.priceInfo.priceAmplitude}%</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{toCurrency(stock.volInfo.vol)}</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.buySellInfo.bigThree.today, 0)}">
										{toCurrency(stock.buySellInfo.bigThree.today)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{toCurrency(stock.buySellInfo.bigThree.remain)}</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.buySellInfo.foreign.today, 0)}">
										{toCurrency(stock.buySellInfo.foreign.today)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{toCurrency(stock.buySellInfo.foreign.remain)}</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.buySellInfo.foreign.today, 0)}">
										{getBuySellDays(stock.buySellInfo.foreign.days)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.buySellInfo.sites.today, 0)}">
										{toCurrency(stock.buySellInfo.sites.today)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{toCurrency(stock.buySellInfo.sites.remain)}</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.buySellInfo.sites.days, 0)}">
										{getBuySellDays(stock.buySellInfo.sites.days)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.buySellInfo.dealer.today, 0)}">
										{toCurrency(stock.buySellInfo.dealer.today)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{toCurrency(stock.buySellInfo.dealer.remain)}</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.buySellInfo.dealer.today, 0)}">
										{getBuySellDays(stock.buySellInfo.dealer.days)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.buySellInfo.major.today, 0)}">
										{toCurrency(stock.buySellInfo.major.today)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.buySellInfo.major.today, 0)}">
										{getBuySellDays(stock.buySellInfo.major.days)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.bsmInfo.marginPurchase.change, 0)}">
										{toCurrency(stock.bsmInfo.marginPurchase.change)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{toCurrency(stock.bsmInfo.marginPurchase.remain)}</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.bsmInfo.shortSale.change, 0)}">
										{toCurrency(stock.bsmInfo.shortSale.change)}
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{toCurrency(stock.bsmInfo.shortSale.remain)}</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{toCurrency(stock.bsmInfo.marginPurchaseRatio)}</td>
									<td class="whitespace-nowrap text-sm text-gray-500">{toCurrency(stock.bsmInfo.bsmRatio)}</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {styled.moreContent}">
										<p>
											5MA:{toCurrency(stock.priceInfo.priceMA[1])}
											| 10MA:{toCurrency(stock.priceInfo.priceMA[2])}
											| 20MA:{toCurrency(stock.priceInfo.priceMA[3])}
											| 60MA:{toCurrency(stock.priceInfo.priceMA[4])}
											| 120MA:{toCurrency(stock.priceInfo.priceMA[5])}
											| 240MA:{toCurrency(stock.priceInfo.priceMA[6])}
										</p>
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {styled.moreContent}">
										<p>
											上軌:{toCurrency(stock.booleanInfo.top[0])}
											| 下軌:{toCurrency(stock.booleanInfo.bottom[0])}
											| 壓縮率:{toCurrency(stock.booleanInfo.compressionRatio[0])}%
										</p>
									</td>
									<td class="whitespace-nowrap text-sm text-gray-500 {styled.moreContent}">
										<p>
											DIF:{stock.macdInfo.dif}
											| MACD:{stock.macdInfo.macd}
											| OSC:
											{(stock.macdInfo.dif - stock.macdInfo.macd).toFixed(2)}
											{stock.macdInfo.isIncreaseTrend ? ' | 趨勢向上' : ''}
											{stock.macdInfo.isDeceaseTrend ? ' | 趨勢向下' : ''}
											{stock.macdInfo.cross.isRed ? ' | 黃金交叉' : ''}
											{stock.macdInfo.cross.isGreen ? ' | 死亡交叉' : ''}
										</p>
									</td>
									{#if filterProps.isFlagType}
										<td class="whitespace-nowrap text-sm text-gray-500">
											{flagInfoList[stock.flagInfo.flagLevel - 1]}{stock.flagInfo.isFlagType ? '(末端)' : ''}
										</td>
									{/if}
									{#if filterProps.isReverseType}
										<td class="whitespace-nowrap text-sm text-gray-500">{stock.reverseInfo.reverseType}</td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</div>
	</div>
</div>
