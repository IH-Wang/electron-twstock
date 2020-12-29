<style>
	input:focus,
	select:focus {
		outline: none;
		box-shadow: 0 0 0 2px var(--theme-inputFocusBorder);
	}

	.reset,
	.tag {
		background-color: var(--theme-progressBar);
	}
	.reset:hover {
		color: #ccc;
	}
</style>

<script>
	import { fly } from 'svelte/transition';
	// store
	import MainStore from '../../stores/main';
	// component
	import Tab from '../common/tab/Tab.svelte';
	import PriceVolFilter from '../filter/PriceVolFilter.svelte';
	import StrategyFilter from './StrategyFilter.svelte';
	import BargainChipFilter from './BargainChipFilter.svelte';
	const filterTabOption = {
		priceVol: '價量篩選',
		strategy: '技術篩選',
		bargainChip: '籌碼篩選',
	};

	let selectMarketType = '';
	let selectCategory = -1;
	let searchText = '';

	let tabs = Object.values(filterTabOption);
	let activeTab;
	let isReset = false;

	// 過濾股號 | 股名
	const changeText = (evt) => {
		if (!evt.data || (evt.data.match(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/) && searchText.length > 1)) {
			MainStore.setSearchText(searchText);
		}
	};
	// 過濾市場
	const changeMarketType = () => {
		MainStore.changeMarketType(selectMarketType);
	};
	//過濾產業
	const changeCategory = () => {
		MainStore.changeCategory(selectCategory);
	};
	const resetFilter = () => {
		selectMarketType = '';
		selectCategory = -1;
		searchText = '';
		MainStore.resetFilter();
		activeTab = tabs[0];
		isReset = true;
	};
	// 切換 tab
	const changeTab = (tab) => {
		activeTab = tab;
	};
</script>

<div class="w-full flex flex-col px-4 my-2">
	<div class="mt-2 inline-flex">
		<div class="mr-2">
			<span>搜尋</span>
			<input
				type="text"
				name="search"
				bind:value="{searchText}"
				placeholder="股號 | 股名"
				class="focus:ring-indigo-500 rounded-md pl-1 w-36"
				on:input="{changeText}"
			/>
		</div>
		<div class="mx-2">
			<span>市場</span>
			<select
				name="marketType"
				bind:value="{selectMarketType}"
				class="inline-flex px-4 bg-white rounded-md h-full"
				on:blur="{changeMarketType}"
			>
				<option value="">全部</option>
				{#each $MainStore.marketTypeList as market}
					<option value="{market}">{market}</option>
				{/each}
			</select>
		</div>
		<div class="mx-2">
			<span>產業</span>
			<select name="category" bind:value="{selectCategory}" class="inline-flex px-4 bg-white rounded-md h-full" on:blur="{changeCategory}">
				<option value="{-1}">全部</option>
				{#each $MainStore.categoryList as category}
					<option value="{category}">{!category ? '無' : category}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-1 justify-end">
			<button
				class="border reset text-white rounded-md px-4 transition duration-500 ease select-none hover:bg-blue-600 focus:outline-none focus:shadow-outline"
				on:click="{resetFilter}"
			>重設</button>
		</div>
	</div>
	<div class="mt-2">
		<Tab tabs="{tabs}" bind:activeTab changeTab="{changeTab}" />
	</div>
	<div class="mt-2 flex flex-col w-full">
		{#if activeTab === filterTabOption.priceVol}
			<PriceVolFilter />
		{:else if activeTab === filterTabOption.strategy}
			<StrategyFilter />
		{:else if activeTab === filterTabOption.bargainChip}
			<BargainChipFilter bind:isReset />
		{/if}
	</div>
	<div class="mt-2 flex flex-wrap">
		{#each $MainStore.tags as tag}
			<div class="border tag text-white mx-1 px-1" transition:fly>{tag}</div>
		{/each}
	</div>
</div>
