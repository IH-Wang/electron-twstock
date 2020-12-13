<style>
</style>

<script>
	// store
	import MainStore from '../../stores/main';
	// component
	import TabPanel from '../common/tab/TabPanel.svelte';
	// util
	import { DAYS } from '../../util/stock';
	// constants
	import {
		RISE_DROP,
		MAX_MIN,
		INCREASE_DECREASE,
		filterRiseDropTabs,
		filterMaxMinTabs,
		filterVolTabs,
	} from '../../constants';
	// style
	import styled from './Filter.module.scss';
	export let isReset = false;

	const priceVolOptions = ['價量齊揚', '價漲量縮', '價跌量增', '價跌量縮'];
	const selectDays = DAYS.map((day) => `${day} 日`);
	let searchMaxPrice = $MainStore.maxPrice,
		searchMinPrice = $MainStore.minPrice,
		searchEndPrice = $MainStore.endPrice,
		activeRiseDropTab = $MainStore.riseDropType,
		selectedRiseDropIndex = $MainStore.selectedRiseDropIndex,
		searchStartRiseDropMargin = $MainStore.startRiseDropMargin,
		searchEndRiseDropMargin = $MainStore.endRiseDropMargin,
		activeMaxMinTab = $MainStore.maxMinType,
		selectedMaxMinIndex = $MainStore.selectedMaxMinIndex,
		isLimitUp = $MainStore.isLimitUp,
		isLimitDown = $MainStore.isLimitDown,
		selectPriceVol = $MainStore.priceVolType,
		activeVolTab = $MainStore.volType,
		selectedVolIndex = $MainStore.selectedVolIndex,
		searchFromVol = $MainStore.fromVol,
		searchToVol = $MainStore.toVol;

	const changePrice = (evt) => {
		MainStore.filterByParams({ [evt.target.name]: evt.target.value ? Number(evt.target.value) : '' });
	};

	// 切換 tab
	const changeTab = (type) => (tab) => {
		switch (type) {
			case RISE_DROP:
				activeRiseDropTab = tab;
				MainStore.filterByParams({ riseDropType: tab });
				break;
			case MAX_MIN:
				activeMaxMinTab = tab;
				MainStore.filterByParams({ maxMinType: tab });
				break;
			case INCREASE_DECREASE:
				activeVolTab = tab;
				MainStore.filterByParams({ volType: tab });
				break;
			default:
				break;
		}
	};
	const changeSelect = (type) => (evt) => {
		switch (type) {
			case RISE_DROP:
				selectedRiseDropIndex = Number(evt.target.value);
				MainStore.filterByParams({ selectedRiseDropIndex });
				break;
			case MAX_MIN:
				selectedMaxMinIndex = Number(evt.target.value);
				MainStore.filterByParams({ selectedMaxMinIndex });
				break;
			case INCREASE_DECREASE:
				selectedVolIndex = Number(evt.target.value);
				MainStore.filterByParams({ selectedVolIndex });
				break;
			default:
				break;
		}
	};
	// 過濾 checkbox 篩選
	const changeFilterCheck = (evt) => {
		MainStore.filterByParams({ [evt.target.name]: evt.target.checked });
	};
	const changePriceVol = (key) => () => {
		selectPriceVol = selectPriceVol === key ? '' : key;
		MainStore.filterByParams({ priceVolType: selectPriceVol });
	};
	$: {
		if (isReset) {
			searchMaxPrice = undefined;
			searchMinPrice = undefined;
			searchEndPrice = undefined;
			activeRiseDropTab = '';
			selectedRiseDropIndex = 0;
			searchStartRiseDropMargin = undefined;
			searchEndRiseDropMargin = undefined;
			activeMaxMinTab = '';
			selectedMaxMinIndex = 0;
			isLimitUp = false;
			isLimitDown = false;
			selectPriceVol = '';
			activeVolTab = '';
			selectedVolIndex = 0;
			searchFromVol = undefined;
			searchToVol = undefined;
			isReset = false;
		}
	}
</script>

<TabPanel title="價格">
	<div class="flex">
		<span class="text-sm rounded-l w-16 px-2">最高</span>
		<input
			name="maxPrice"
			class="focus:ring-indigo-500 rounded-md mx-1 w-full text-center"
			type="number"
			placeholder="最高價"
			bind:value="{searchMaxPrice}"
			on:input="{changePrice}"
		/>
	</div>
	<div class="flex mt-1">
		<span class="text-sm rounded-l px-2 w-16">最低</span>
		<input
			type="number"
			name="minPrice"
			bind:value="{searchMinPrice}"
			on:input="{changePrice}"
			placeholder="最低價"
			class="focus:ring-indigo-500 rounded-md mx-1  w-full text-center"
		/>
	</div>
	<div class="flex mt-1">
		<span class="text-sm rounded-l px-2 w-16">收盤</span>
		<input
			type="number"
			name="endPrice"
			bind:value="{searchEndPrice}"
			on:input="{changePrice}"
			placeholder="收盤價"
			class="focus:ring-indigo-500 rounded-md mx-1 w-full text-center"
		/>
	</div>
</TabPanel>
<TabPanel
	title="成交量"
	tabs="{Object.values(filterVolTabs)}"
	changeTab="{changeTab(INCREASE_DECREASE)}"
	activeTab="{activeVolTab}"
	options="{DAYS.map((day) => `${day} 日均量`)}"
	changeOption="{changeSelect(INCREASE_DECREASE)}"
	selectedOption="{selectedVolIndex}"
>
	<div class="flex mt-2 mx-1">
		<span class="text-sm rounded-l w-12">起</span>
		<input
			type="number"
			name="fromVol"
			bind:value="{searchFromVol}"
			placeholder="量增減"
			class="focus:ring-indigo-500 rounded-md mx-1  w-full text-center"
			on:change="{changePrice}"
		/>
	</div>
	<div class="flex mt-1 mx-1">
		<span class="text-sm rounded-l w-12">訖</span>
		<input
			type="number"
			name="toVol"
			bind:value="{searchToVol}"
			placeholder="量增減"
			class="focus:ring-indigo-500 rounded-md mx-1  w-full text-center"
			on:change="{changePrice}"
		/>
	</div>
</TabPanel>
<TabPanel
	title="漲跌"
	tabs="{Object.values(filterRiseDropTabs)}"
	changeTab="{changeTab(RISE_DROP)}"
	activeTab="{activeRiseDropTab}"
	options="{selectDays}"
	changeOption="{changeSelect(RISE_DROP)}"
	selectedOption="{selectedRiseDropIndex}"
>
	<div class="flex mt-2 mx-1">
		<span class="text-sm rounded-l w-12">起</span>
		<input
			type="number"
			name="startRiseDropMargin"
			bind:value="{searchStartRiseDropMargin}"
			placeholder="漲跌"
			class="focus:ring-indigo-500 rounded-md mx-1  w-full text-center"
			on:change="{changePrice}"
			disabled="{!activeRiseDropTab}"
		/>%
	</div>
	<div class="flex mt-1 mx-1">
		<span class="text-sm rounded-l w-12">訖</span>
		<input
			type="number"
			name="endRiseDropMargin"
			bind:value="{searchEndRiseDropMargin}"
			placeholder="漲跌"
			class="focus:ring-indigo-500 rounded-md mx-1  w-full text-center"
			on:change="{changePrice}"
			disabled="{!activeRiseDropTab}"
		/>
		%
	</div>
</TabPanel>
<TabPanel
	title="收盤價"
	tabs="{Object.values(filterMaxMinTabs)}"
	changeTab="{changeTab(MAX_MIN)}"
	activeTab="{activeMaxMinTab}"
	options="{selectDays}"
	changeOption="{changeSelect(MAX_MIN)}"
	selectedOption="{selectedMaxMinIndex}"
>
	<div class="inline-flex mt-1 justify-around w-full">
		<div>
			<span>漲停</span>
			<input
				name="isLimitUp"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				bind:checked="{isLimitUp}"
			/>
		</div>
		<div>
			<span>跌停</span>
			<input
				name="isLimitDown"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				bind:checked="{isLimitDown}"
			/>
		</div>
	</div>
</TabPanel>
<TabPanel title="價量關係">
	<div class="flex flex-wrap {styled.filterBtn}">
		{#each priceVolOptions as option}
			<div
				class="{selectPriceVol === option ? styled.active : ''} text-sm w-1/2 border py-2 cursor-pointer hover:border-blue-500 hover:text-gray-500"
				on:click="{changePriceVol(option)}"
			>
				{option}
			</div>
		{/each}
	</div>
</TabPanel>
