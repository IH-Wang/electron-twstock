<script>
	import * as R from 'ramda';

	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import { onMount, getContext } from 'svelte';

	// css
	import styled from './Table.module.scss';
	let db = getContext('db');
	let stockInfoList = [];
	onMount(async () => {
		db = await db.store;
		const [codeList, infoList] = await Promise.all([db.stockCodes.getAll(), db.stockInfos.getAll()]);
		stockInfoList = infoList.slice(0, 5).map((stock) => {
			const info = codeList.find((codeInfo) => codeInfo.code == stock.code);
			return { ...stock, name: info.name, category: info.category, marketType: info.marketType };
		});
	});
</script>

<div class="{styled.tableWrapper}">
	{#if !R.isEmpty(stockInfoList)}
		<p>日期: {stockInfoList[0].date}</p>
	{/if}
	<DataTable>
		<Head class="{styled.tableHeader}">
			<Row>
				<Cell>股號</Cell>
				<Cell>名稱</Cell>
				<Cell>市場</Cell>
				<Cell>類別</Cell>
				<Cell>開盤價</Cell>
				<Cell>收盤價</Cell>
				<Cell>最高</Cell>
				<Cell>最低</Cell>
				<Cell>漲跌</Cell>
				<Cell>漲跌幅</Cell>
				<Cell>振幅</Cell>
			</Row>
		</Head>
		<Body>
			{#each stockInfoList as stock (stock.code)}
				<Row>
					<Cell>{stock.code}</Cell>
					<Cell>{stock.name}</Cell>
					<Cell>{stock.marketType}</Cell>
					<Cell>{stock.category}</Cell>
					<Cell numeric>{stock.priceInfo.startPrice}</Cell>
					<Cell numeric>{stock.priceInfo.endPrice}</Cell>
					<Cell numeric>{stock.priceInfo.maxPrice}</Cell>
					<Cell numeric>{stock.priceInfo.minPrice}</Cell>
					<Cell numeric>{stock.priceInfo.riseDropPrice}</Cell>
					<Cell numeric>{stock.priceInfo.riseDropMargin}%</Cell>
					<Cell numeric>{stock.priceInfo.priceAmplitude}%</Cell>
				</Row>
			{/each}
		</Body>
	</DataTable>
</div>
