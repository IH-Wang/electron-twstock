<script>
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	// store
	import MainStore from '../../stores/main';
	// component
	import TabPanel from '../common/tab/TabPanel.svelte';
	// constants
	import {
		LONG_SHORT,
		TOP_BOTTOM,
		UP_DOWN,
		filterLongShortTabs,
		filterMATypeTabs,
		filterBooleanTabs,
		DAYS,
	} from '../../constants';
	// style
	import styled from './Filter.module.scss';
	export let isReset = false;
	const selectDays = DAYS.map((day) => `${day} 日線`);
	const macdOptions = ['趨勢向上', '趨勢向下', '黃金交叉', '死亡交叉'];
	let activeLongShortTab = $MainStore.isLongOrder
		? filterLongShortTabs.long
		: $MainStore.isShortOrder
		? filterLongShortTabs.short
		: '';
	let activeMAReverseTab = $MainStore.maReverseType;
	let selectedMAReverseIndex = $MainStore.selectedMAReverseIndex;
	let activeBooleanTab = $MainStore.isStandOnTop
		? filterBooleanTabs.top
		: $MainStore.isBreakBelowBottom
		? filterBooleanTabs.bottom
		: '';
	let isFlagType = $MainStore.isFlagType,
		isReverse = $MainStore.isReverse,
		isTangledMA = $MainStore.isTangledMA,
		isBooleanCompression = $MainStore.isBooleanCompression,
		isBooleanExpand = $MainStore.isBooleanExpand;
	let selectMACDType = $MainStore.macdType;

	// 切換 tab
	const changeTab = (type) => (tab) => {
		switch (type) {
			case LONG_SHORT:
				activeLongShortTab = tab;
				if (tab === filterLongShortTabs.long) {
					MainStore.filterByParams({ isLongOrder: !!activeLongShortTab, isShortOrder: false });
				} else {
					MainStore.filterByParams({ isShortOrder: !!activeLongShortTab, isLongOrder: false });
				}
				break;
			case UP_DOWN:
				activeMAReverseTab = tab;
				MainStore.filterByParams({ maReverseType: activeMAReverseTab });
				break;
			case TOP_BOTTOM:
				activeBooleanTab = tab;
				if (tab === filterBooleanTabs.top) {
					MainStore.filterByParams({ isStandOnTop: !!activeBooleanTab, isBreakBelowBottom: false });
				} else {
					MainStore.filterByParams({ isBreakBelowBottom: !!activeBooleanTab, isStandOnTop: false });
				}
				break;
			default:
				break;
		}
	};
	// 過濾 checkbox 篩選
	const changeFilterCheck = (evt) => {
		MainStore.filterByParams({ [evt.target.name]: evt.target.checked });
	};
	const changeSelect = (type) => (evt) => {
		switch (type) {
			case UP_DOWN:
				selectedMAReverseIndex = Number(evt.target.value);
				MainStore.filterByParams({ selectedMAReverseIndex });
				break;
			default:
				break;
		}
	};
	const changeMACDType = (key) => () => {
		selectMACDType = selectMACDType === key ? '' : key;
		MainStore.filterByParams({ macdType: selectMACDType });
	};
	$: {
		if (isReset) {
			activeLongShortTab = '';
			activeMAReverseTab = '';
			activeBooleanTab = '';
			selectMACDType = '';
			selectedMAReverseIndex = 0;
			isFlagType = false;
			isReverse = false;
			isReset = false;
			isTangledMA = false;
			isBooleanCompression = false;
			isBooleanExpand = false;
		}
	}
</script>

<div
	class="flex flex-wrap"
	in:fly="{{ x: -1920, duration: 400, easing: quintInOut, opacity: 1 }}"
	out:fly="{{ x: 1920, duration: 200, easing: quintInOut }}"
>
	<TabPanel
		title="排列"
		tabs="{Object.values(filterLongShortTabs)}"
		changeTab="{changeTab(LONG_SHORT)}"
		activeTab="{activeLongShortTab}"
	>
		<div class="inline-flex mt-1 justify-around w-full">
			<div>
				<span>旗型</span>
				<input
					name="isFlagType"
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeFilterCheck}"
					bind:checked="{isFlagType}"
					disabled
				/>
			</div>
			<div>
				<span>破切</span>
				<input
					name="isReverse"
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeFilterCheck}"
					bind:checked="{isReverse}"
				/>
			</div>
		</div>
	</TabPanel>
	<TabPanel
		title="均線"
		tabs="{Object.values(filterMATypeTabs)}"
		changeTab="{changeTab(UP_DOWN)}"
		activeTab="{activeMAReverseTab}"
		options="{selectDays}"
		changeOption="{changeSelect(UP_DOWN)}"
		selectedOption="{selectedMAReverseIndex}"
	>
		<div class="inline-flex mt-1 justify-around w-full">
			<div>
				<span>均線糾結</span>
				<input
					name="isTangledMA"
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeFilterCheck}"
					bind:checked="{isTangledMA}"
				/>
			</div>
		</div>
	</TabPanel>
	<TabPanel
		title="布林"
		tabs="{Object.values(filterBooleanTabs)}"
		changeTab="{changeTab(TOP_BOTTOM)}"
		activeTab="{activeBooleanTab}"
	>
		<div class="inline-flex mt-1 justify-around w-full">
			<div>
				<span>布林壓縮</span>
				<input
					name="isBooleanCompression"
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeFilterCheck}"
					bind:checked="{isBooleanCompression}"
				/>
			</div>
			<div>
				<span>打開布林</span>
				<input
					name="isBooleanExpand"
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeFilterCheck}"
					bind:checked="{isBooleanExpand}"
				/>
			</div>
		</div>
	</TabPanel>
	<TabPanel title="MACD">
		<div class="flex flex-wrap {styled.filterBtn}">
			{#each macdOptions as option}
				<div
					class="{selectMACDType === option ? styled.active : ''} text-sm w-1/2 border py-2 cursor-pointer hover:border-blue-500 hover:text-gray-500"
					on:click="{changeMACDType(option)}"
				>
					{option}
				</div>
			{/each}
		</div>
	</TabPanel>
</div>
