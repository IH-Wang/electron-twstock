<script>
	// store
	import MainStore, { changeTab, changeFilterCheck } from '../../../stores/main';
	// component
	import TabPanel from '../../common/tab/TabPanel.svelte';
	// constants
	import { filterBooleanTabs } from '../../../constants';
</script>

<div class="flex flex-col justify-center items-center gap-y-2 w-full">
	<div class="flex w-full justify-center gap-x-1 px-1">
		<div class="flex flex-1 items-center text-center">
			<TabPanel
				classProp="flex-1 w-full"
				activeTab="{$MainStore.booleanType}"
				changeTab="{changeTab('booleanType')}"
				tabs="{Object.values(filterBooleanTabs)}"
			/>
		</div>
		<div class="flex flex-1 items-center justify-center gap-x-1">
			<input
				name="isBooleanCompression"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isBooleanCompression}"
			/>
			<span>布林壓縮</span>
		</div>
		<div class="flex flex-1 items-center justify-center gap-x-1">
			<input
				name="isBooleanExpand"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isBooleanExpand}"
			/>
			<span>打開布林</span>
		</div>
	</div>
</div>
