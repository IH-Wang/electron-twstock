<style>
	.square {
		background-color: #fff;
		border: 1px solid var(--theme-progressCircleBar);
		border-radius: 6px;
		cursor: pointer;
		color: #333;
	}
	.square:hover {
		color: gray;
	}
	.active {
		background-color: var(--theme-progressCircleBar);
		border: 1px solid #fff;
		color: #fff;
	}
	.activeContent {
		background-color: var(--theme-titleBarBG);
		border-radius: 6px;
	}
</style>

<script>
	import { fly, crossfade, slide } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	// store
	import MainStore from '../../stores/main';
	// component
	// import TabPanel from '../common/tab/TabPanel.svelte';
	import PriceContent from '../filter/Price.svelte';

	// constants
	import { RISE_DROP, MAX_MIN, INCREASE_DECREASE, filterRiseDropTabs, filterMaxMinTabs, filterVolTabs, DAYS } from '../../constants';
	// style
	import styled from './Filter.module.scss';
	export let isReset = false;
	const [send, receive] = crossfade({
		duration: 300,
		fallback: slide,
	});
	const priceVolList = [
		{ text: '價格', value: 'price' },
		{ text: '成交量', value: 'vol' },
		{ text: '漲跌', value: 'riseDrop' },
		{ text: '價量關係', value: 'priceVol' },
	];
	let activeTab = '';

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

	// 切換 tab
	const changeActiveTab = (tab) => {
		activeTab = activeTab === tab ? '' : tab;
	};

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

<div class="flex flex-wrap" in:fly="{{ x: -1920, duration: 400, easing: quintInOut, opacity: 1 }}" out:fly="{{ x: 1920, duration: 200, easing: quintInOut }}">
	{#each priceVolList as item}
		<div class="flex-1 m-1 square text-center {activeTab === item.value ? 'active' : ''}" on:click="{() => changeActiveTab(item.value)}">{item.text}</div>
	{/each}
</div>
{#if activeTab}
	<div class="flex m-1 py-4 justify-center activeContent" in:receive="{{ key: activeTab }}" out:send="{{ key: activeTab }}">
		{#if activeTab === 'price'}
			<PriceContent />
		{/if}
	</div>
{/if}

<!-- <TabPanel
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
</TabPanel> -->
