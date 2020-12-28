<script>
	// store
	import MainStore, { changeTab, changeFilterCheck } from '../../../stores/main';
	// component
	import TabPanel from '../../common/tab/TabPanel.svelte';
	// constants
	import { filterKDTabs } from '../../../constants';
</script>

<div class="flex flex-col justify-center items-center gap-y-2 w-full">
	<div class="flex w-full justify-center gap-x-1 px-1">
		<div class="flex flex-1 items-center text-center">
			<TabPanel
				classProp="flex-1 w-full"
				activeTab="{$MainStore.kdType}"
				changeTab="{changeTab('kdType')}"
				tabs="{Object.values(filterKDTabs)}"
			/>
		</div>
		<div class="flex flex-1 items-center justify-center gap-x-1">
			<input
				name="isOverbuy"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isOverbuy}"
			/>
			<span>超買</span>
		</div>
		<div class="flex flex-1 items-center justify-center gap-x-1">
			<input
				name="isOverSell"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isOverSell}"
			/>
			<span>超賣</span>
		</div>
		<div class="flex flex-1 items-center justify-center gap-x-1">
			<input
				name="isHighPassivation"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isHighPassivation}"
			/>
			<span>高檔鈍化</span>
		</div>
		<div class="flex flex-1 items-center justify-center gap-x-1">
			<input
				name="isLowPassivation"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isLowPassivation}"
			/>
			<span>低檔鈍化</span>
		</div>
	</div>
</div>
