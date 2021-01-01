<script>
	// store
	import MainStore, { changePriceVol, changeFilterCheck, changeTab } from '../../../stores/main';
	// component
	import TabPanel from '../../common/tab/TabPanel.svelte';
	// constants
	import { filterRiseDropTabs, DAYS } from '../../../constants';
	// 過濾 checkbox 篩選
	const changeDaysFilterCheck = (day) => () => {
		let checkDays = $MainStore.checkedRiseDropMarginDays;
		if (checkDays.includes(day)) {
			checkDays = checkDays.filter((item) => item !== day);
		} else {
			checkDays.push(day);
		}
		MainStore.filterByParams({ checkedRiseDropMarginDays: checkDays });
	};
</script>

<div class="flex flex-col justify-center items-center gap-y-2">
	<div class="flex w-full justify-center gap-x-1 px-1">
		<TabPanel
			classProp="flex-1"
			activeTab="{$MainStore.riseDropMarginType}"
			changeTab="{changeTab('riseDropMarginType')}"
			tabs="{Object.values(filterRiseDropTabs)}"
		/>
		{#each DAYS as day}
			<div class="flex flex-1 items-center justify-center gap-x-1">
				<input
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeDaysFilterCheck(day)}"
					checked="{$MainStore.checkedRiseDropMarginDays.includes(day)}"
					disabled="{!$MainStore.riseDropMarginType}"
				/><span>{day} 日</span>
			</div>
		{/each}
	</div>
	<div class="flex w-full justify-center gap-x-1 px-1">
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">起</span>
			<input
				name="fromRiseDropMargin"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="漲跌幅"
				value="{$MainStore.fromRiseDropMargin}"
				on:input="{changePriceVol}"
				disabled="{!$MainStore.riseDropMarginType}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">迄</span>
			<input
				name="toRiseDropMargin"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="漲跌幅"
				value="{$MainStore.toRiseDropMargin}"
				on:input="{changePriceVol}"
				disabled="{!$MainStore.riseDropMarginType}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center gap-x-1">
			<input
				name="isLimitUp"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isLimitUp}"
			/>
			<span>漲停</span>
			<input
				name="isLimitDown"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isLimitDown}"
			/>
			<span>跌停</span>
		</div>
	</div>
</div>
