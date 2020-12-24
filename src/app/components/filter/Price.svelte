<script>
	// store
	import MainStore, { changePriceVol, changeTab } from '../../stores/main';
	// component
	import TabPanel from '../common/tab/TabPanel.svelte';
	// constants
	import { filterHighLowTabs, DAYS } from '../../constants';

	// 過濾 checkbox 篩選
	const changeDaysFilterCheck = (day) => () => {
		let checkDays = $MainStore.checkedPriceHighLowDays;
		if (checkDays.includes(day)) {
			checkDays = checkDays.filter((item) => item !== day);
		} else {
			checkDays.push(day);
		}
		MainStore.filterByParams({ checkedPriceHighLowDays: checkDays });
	};
</script>

<div class="flex flex-col justify-center items-center gap-y-2">
	<div class="flex w-full justify-center gap-x-1 px-1">
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">昨日</span>
			<input
				name="refPrice"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="昨日價"
				value="{$MainStore.refPrice}"
				on:input="{changePriceVol}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">開盤</span>
			<input
				name="startPrice"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="開盤價"
				value="{$MainStore.startPrice}"
				on:input="{changePriceVol}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">最高</span>
			<input
				name="maxPrice"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="最高價"
				value="{$MainStore.maxPrice}"
				on:input="{changePriceVol}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">最低</span>
			<input
				name="minPrice"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="最低價"
				value="{$MainStore.minPrice}"
				on:input="{changePriceVol}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">收盤</span>
			<input
				name="endPrice"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="收盤價"
				value="{$MainStore.endPrice}"
				on:input="{changePriceVol}"
			/>
		</div>
	</div>
	<div class="flex w-full justify-center gap-x-1 px-1">
		<TabPanel
			classProp="flex-1"
			activeTab="{$MainStore.priceHighLowType}"
			changeTab="{changeTab('priceHighLowType')}"
			tabs="{Object.values(filterHighLowTabs)}"
		/>
		{#each DAYS as day}
			<div class="flex flex-1 items-center justify-center gap-x-1">
				<input
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeDaysFilterCheck(day)}"
					checked="{$MainStore.checkedPriceHighLowDays.includes(day)}"
				/><span>{day} 日</span>
			</div>
		{/each}
	</div>
</div>
