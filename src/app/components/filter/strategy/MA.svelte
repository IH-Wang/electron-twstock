<script>
	// store
	import MainStore, { changeTab, changeFilterCheck } from '../../../stores/main';
	// component
	import TabPanel from '../../common/tab/TabPanel.svelte';
	// constants
	import { filterLongShortTabs, filterMABackTestTabs, filterMATypeTabs, DAYS } from '../../../constants';
	// 過濾 checkbox 篩選
	const changeDaysFilterCheck = (day, key) => () => {
		let checkDays = $MainStore[key];
		if (checkDays.includes(day)) {
			checkDays = checkDays.filter((item) => item !== day);
		} else {
			checkDays.push(day);
		}
		MainStore.filterByParams({ [key]: checkDays });
	};
</script>

<div class="flex flex-col justify-center items-center gap-y-2 w-full">
	<div class="flex w-full justify-center gap-x-1 px-1">
		<div class="flex flex-1 items-center text-center">
			<TabPanel
				classProp="flex-1 w-full"
				activeTab="{$MainStore.maLongShortType}"
				changeTab="{changeTab('maLongShortType')}"
				tabs="{Object.values(filterLongShortTabs)}"
			/>
		</div>
		<div class="flex flex-1 items-center justify-center gap-x-1">
			<input
				name="isAllOrder"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isAllOrder}"
				disabled="{!$MainStore.maLongShortType}"
			/>
			<span>六線全(上|下)</span>
		</div>
		<div class="flex flex-1 items-center justify-center gap-x-1">
			<input
				name="isTangledMA"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isTangledMA}"
			/>
			<span>均線糾結</span>
		</div>
		<div class="flex flex-1 items-center justify-center gap-x-1">
			<input
				name="isReverse"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isReverse}"
			/>
			<span>破切</span>
		</div>
	</div>
	<div class="flex w-full justify-center gap-x-1 px-1">
		<TabPanel
			classProp="flex-1"
			activeTab="{$MainStore.maBackTestType}"
			changeTab="{changeTab('maBackTestType')}"
			tabs="{Object.values(filterMABackTestTabs)}"
		/>
		{#each DAYS as day}
			<div class="flex flex-1 items-center justify-center gap-x-1">
				<input
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeDaysFilterCheck(day, 'checkedMABackTestDays')}"
					checked="{$MainStore.checkedMABackTestDays.includes(day)}"
					disabled="{!$MainStore.maBackTestType}"
				/><span>{day} 日</span>
			</div>
		{/each}
	</div>
	<div class="flex w-full justify-center gap-x-1 px-1">
		<TabPanel
			classProp="flex-1"
			activeTab="{$MainStore.maReverseType}"
			changeTab="{changeTab('maReverseType')}"
			tabs="{Object.values(filterMATypeTabs)}"
		/>
		{#each DAYS as day}
			<div class="flex flex-1 items-center justify-center gap-x-1">
				<input
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeDaysFilterCheck(day, 'checkedMAReverseDays')}"
					checked="{$MainStore.checkedMAReverseDays.includes(day)}"
					disabled="{!$MainStore.maReverseType}"
				/><span>{day} 日</span>
			</div>
		{/each}
	</div>
</div>
