<script>
	import { fly } from 'svelte/transition';
	// import * as R from 'ramda';
	import { onMount, onDestroy, getContext } from 'svelte';
	// component
	import Filter from '../components/stockTable/Filter.svelte';
	import Table from '../components/stockTable/Table.svelte';
	import Pagination from '../components/common/pagination/Pagination.svelte';
	// store
	import MainStore from '../stores/main.js';

	let db = getContext('db');
	onMount(async () => {
		db = await db;
		// const infoList = await db.stockInfos.getAll();
		// MainStore.setBaseStockInfoList(infoList);
	});
	onDestroy(() => {
		MainStore.reset();
	});

	const changePage = (evt) => {
		MainStore.setPage(evt.detail);
	};
</script>

<div class="pageWrapper justify-start" transition:fly>
	<Filter />

	<Table
		filterProps="{{ marketType: $MainStore.marketType, category: $MainStore.category, isFlagType: $MainStore.isFlagType, isReverseType: $MainStore.isReverse }}"
		stockInfoList="{$MainStore.stockInfoList.slice(($MainStore.current - 1) * 10, $MainStore.current * 10)}"
	/>
	{#if $MainStore.totalItems > $MainStore.perPage}
		<Pagination
			rounded
			current="{$MainStore.current}"
			totalItems="{$MainStore.totalItems}"
			perPage="{$MainStore.perPage}"
			on:navigate="{changePage}"
		/>
	{/if}
</div>
