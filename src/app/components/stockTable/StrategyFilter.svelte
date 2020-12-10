<script>
	// store
	import MainStore from '../../stores/main';
	// component
	import TabPanel from '../common/tab/TabPanel.svelte';
	// constants
	import {
		LONG_SHORT,
		BREAK_DROP,
		TOP_BOTTOM,
		filterLongShortTabs,
		filterTangledTabs,
		filterBooleanTabs,
	} from '../../constants';
	// style
	// import styled from './Filter.module.scss';
	export let isReset = false;
	let activeLongShortTab = $MainStore.isLongOrder
		? filterLongShortTabs.long
		: $MainStore.isShortOrder
		? filterLongShortTabs.short
		: '';
	let activeBreakDropTab = $MainStore.isBreakTangled
		? filterTangledTabs.break
		: $MainStore.isDropTangled
		? filterTangledTabs.drop
		: '';
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

	// 切換 tab
	const changeTab = (type) => (tab) => {
		switch (type) {
			case LONG_SHORT:
				activeLongShortTab = activeLongShortTab === tab ? '' : tab;
				if (tab === filterLongShortTabs.long) {
					MainStore.filterByParams({ isLongOrder: !!activeLongShortTab, isShortOrder: false });
				} else {
					MainStore.filterByParams({ isShortOrder: !!activeLongShortTab, isLongOrder: false });
				}
				break;
			case BREAK_DROP:
				activeBreakDropTab = activeBreakDropTab === tab ? '' : tab;
				if (tab === filterTangledTabs.break) {
					MainStore.filterByParams({ isBreakTangled: !!activeBreakDropTab, isDropTangled: false });
				} else {
					MainStore.filterByParams({ isDropTangled: !!activeBreakDropTab, isBreakTangled: false });
				}
				break;
			case TOP_BOTTOM:
				activeBooleanTab = activeBooleanTab === tab ? '' : tab;
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
	$: {
		if (isReset) {
			activeLongShortTab = '';
			activeBreakDropTab = '';
			activeBooleanTab = '';
			isFlagType = false;
			isReverse = false;
			isReset = false;
			isTangledMA = false;
			isBooleanCompression = false;
			isBooleanExpand = false;
		}
	}
</script>

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
	tabs="{Object.values(filterTangledTabs)}"
	changeTab="{changeTab(BREAK_DROP)}"
	activeTab="{activeBreakDropTab}"
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
