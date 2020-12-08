<style>
	.red {
		color: red;
	}
	.green {
		color: green;
	}
</style>

<script>
	import * as R from 'ramda';
	import { slide } from 'svelte/transition';
	// util
	import { toCurrency } from '../../util/common/index';
	// css
	import styled from './Table.module.scss';

	export let stockInfoList = [];
	export let filterProps = { marketType: '', category: -1, isFlagType: false, isReverseType: false };
	const flagInfoList = ['弱勢', '中等', '強勢'];
	const getRiseDropColor = (base, compare) => {
		if (base === compare) {
			return '';
		} else if (base > compare) {
			return 'red';
		} else {
			return 'green';
		}
	};
</script>

<div class="{styled.tableWrapper} w-full">
	<div class="flex flex-col">
		<div class="my-2">
			<div class="align-middle inline-block min-w-full px-4">
				{#if !R.isEmpty(stockInfoList)}
					<p>日期: {stockInfoList[0].date}</p>
				{/if}
				<div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
					<table class="min-w-full divide-y divide-gray-200 overflow-auto">
						<thead>
							<tr class="{styled.tableHeader}">
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									股號
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									名稱
								</th>
								{#if !R.isEmpty(filterProps.marketType)}
									<th
										scope="col"
										class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
									>
										市場
									</th>
								{/if}
								{#if filterProps.category !== -1}
									<th
										scope="col"
										class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
									>
										產業
									</th>
								{/if}
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									參考價
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									開盤價
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									收盤價
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									最高
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									最低
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									漲跌
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									漲跌幅
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									振幅
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									成交量
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									三大法人
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									外資
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									投信
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									自營商
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									主力
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									融資
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									融券
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									融資使用率
								</th>
								<th
									scope="col"
									class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
								>
									券資比
								</th>
								{#if filterProps.isFlagType}
									<th
										scope="col"
										class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
									>
										旗型
									</th>
								{/if}
								{#if filterProps.isReverseType}
									<th
										scope="col"
										class="px-1 py-2 text-center font-bold font-bold uppercase tracking-wider"
									>
										破切
									</th>
								{/if}
							</tr>
						</thead>

						{#if R.isEmpty(stockInfoList)}
							<span>查無資料</span>
						{:else}
							<tbody class="bg-white divide-y divide-gray-200 text-center" transition:slide>
								{#each stockInfoList as stock (stock.code)}
									<tr>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{stock.code}</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">{stock.name}</td>
										{#if !R.isEmpty(filterProps.marketType)}
											<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
												{stock.marketType}
											</td>
										{/if}
										{#if filterProps.category !== -1}
											<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
												{stock.category}
											</td>
										{/if}
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{toCurrency(stock.priceInfo.refPrice)}
										</td>
										<td
											class="px-2 py-4 whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.priceInfo.startPrice, stock.priceInfo.refPrice)}"
										>
											{toCurrency(stock.priceInfo.startPrice)}
										</td>
										<td
											class="px-2 py-4 whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.priceInfo.endPrice, stock.priceInfo.refPrice)}"
										>
											{toCurrency(stock.priceInfo.endPrice)}
										</td>
										<td
											class="px-2 py-4 whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.priceInfo.maxPrice, stock.priceInfo.refPrice)}"
										>
											{toCurrency(stock.priceInfo.maxPrice)}
										</td>
										<td
											class="px-2 py-4 whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.priceInfo.minPrice, stock.priceInfo.refPrice)}"
										>
											{toCurrency(stock.priceInfo.minPrice)}
										</td>
										<td
											class="px-2 py-4 whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.priceInfo.riseDropPrice, 0)}"
										>
											{stock.priceInfo.riseDropPrice}
										</td>
										<td
											class="px-2 py-4 whitespace-nowrap text-sm text-gray-500 {getRiseDropColor(stock.priceInfo.riseDropMargin, 0)}"
										>
											{stock.priceInfo.riseDropMargin}%
										</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{stock.priceInfo.priceAmplitude}%
										</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{toCurrency(stock.volInfo.vol)}
										</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{toCurrency(stock.buySellInfo.bigThree.today)}
										</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{toCurrency(stock.buySellInfo.foreign.today)}
										</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{toCurrency(stock.buySellInfo.sites.today)}
										</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{toCurrency(stock.buySellInfo.dealer.today)}
										</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{toCurrency(stock.buySellInfo.major.today)}
										</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{toCurrency(stock.bsmInfo.marginPurchase.change)}
										</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{toCurrency(stock.bsmInfo.shortSale.change)}
										</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{toCurrency(stock.bsmInfo.marginPurchaseRatio)}
										</td>
										<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
											{toCurrency(stock.bsmInfo.bsmRatio)}
										</td>
										{#if filterProps.isFlagType}
											<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
												{flagInfoList[stock.flagInfo.flagLevel - 1]}{stock.flagInfo.isFlagType ? '(末端)' : ''}
											</td>
										{/if}
										{#if filterProps.isReverseType}
											<td class="px-2 py-4 whitespace-nowrap text-sm text-gray-500">
												{stock.reverseInfo.reverseType}
											</td>
										{/if}
									</tr>
								{/each}
							</tbody>
						{/if}
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
