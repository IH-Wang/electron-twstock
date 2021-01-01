<script>
	// store
	import MainStore, { changeTab } from '../../../stores/main';
	// component
	import TabPanel from '../../common/tab/TabPanel.svelte';
	// constants
	import { filterBuySellTabs, filterContinuousTabs, filterTurnPointTabs, filterEnterExitTabs, DAYS } from '../../../constants';

	// 過濾 checkbox 篩選
	const changeDaysFilterCheck = (day) => () => {
		let checkDays = $MainStore.checkedSitesBuySellDays;
		if (checkDays.includes(day)) {
			checkDays = checkDays.filter((item) => item !== day);
		} else {
			checkDays.push(day);
		}
		MainStore.filterByParams({ checkedSitesBuySellDays: checkDays });
	};
</script>

<div class="flex flex-col justify-center items-center gap-y-2 w-full">
	<div class="flex w-full justify-center gap-x-1 px-1">
		<TabPanel
			classProp="flex-1"
			activeTab="{$MainStore.sitesType}"
			changeTab="{changeTab('sitesType')}"
			tabs="{Object.values(filterBuySellTabs)}"
		/>
		{#each DAYS as day}
			<div class="flex flex-1 items-center justify-center gap-x-1">
				<input
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeDaysFilterCheck(day)}"
					checked="{$MainStore.checkedSitesBuySellDays.includes(day)}"
				/><span>{day} 日</span>
			</div>
		{/each}
	</div>
	<div class="flex w-full justify-center gap-x-1 px-1">
		<div class="flex flex-1 items-center justify-center">
			<TabPanel
				classProp="flex-1"
				activeTab="{$MainStore.sitesContinuousType}"
				changeTab="{changeTab('sitesContinuousType')}"
				tabs="{Object.values(filterContinuousTabs)}"
			/>
		</div>
		<div class="flex flex-1 items-center justify-center">
			<TabPanel
				classProp="flex-1"
				activeTab="{$MainStore.sitesTurnPointType}"
				changeTab="{changeTab('sitesTurnPointType')}"
				tabs="{Object.values(filterTurnPointTabs)}"
			/>
		</div>
		<div class="flex flex-1 items-center justify-center">
			<TabPanel
				classProp="flex-1"
				activeTab="{$MainStore.sitesInOutType}"
				changeTab="{changeTab('sitesInOutType')}"
				tabs="{Object.values(filterEnterExitTabs)}"
			/>
		</div>
	</div>
</div>
