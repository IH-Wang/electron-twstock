<script>
	// store
	import MainStore from '../../stores/main';
	// component
	import TabPanel from '../common/tab/TabPanel.svelte';
	// constants
	import { filterMaxMinTabs, DAYS } from '../../constants';

	const changePrice = (evt) => {
		MainStore.filterByParams({ [evt.target.name]: evt.target.value ? Number(evt.target.value) : '' });
	};
	// 切換 tab
	const changeTab = (tab) => {
		MainStore.filterByParams({ maxMinType: tab });
	};
	// 過濾 checkbox 篩選
	const changeDaysFilterCheck = (day) => () => {
		let checkDays = $MainStore.checkedMaxMinDays;
		if (checkDays.includes(day)) {
			checkDays = checkDays.filter((item) => item !== day);
		} else {
			checkDays.push(day);
		}
		MainStore.filterByParams({ checkedMaxMinDays: checkDays });
	};
	// // 過濾 checkbox 篩選
	// const changeFilterCheck = (evt) => {
	// 	MainStore.filterByParams({ [evt.target.name]: evt.target.checked });
	// };
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
				bind:value="{$MainStore.refPrice}"
				on:input="{changePrice}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">開盤</span>
			<input
				name="startPrice"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="開盤價"
				bind:value="{$MainStore.startPrice}"
				on:input="{changePrice}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">最高</span>
			<input
				name="maxPrice"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="最高價"
				bind:value="{$MainStore.maxPrice}"
				on:input="{changePrice}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">最低</span>
			<input
				name="minPrice"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="最低價"
				bind:value="{$MainStore.minPrice}"
				on:input="{changePrice}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">收盤</span>
			<input
				name="endPrice"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="收盤價"
				bind:value="{$MainStore.endPrice}"
				on:input="{changePrice}"
			/>
		</div>
	</div>
	<div class="flex w-full justify-center gap-x-1 px-1">
		<TabPanel classProp="flex-1" activeTab="{$MainStore.maxMinType}" changeTab="{changeTab}" tabs="{Object.values(filterMaxMinTabs)}" />
		{#each DAYS as day}
			<div class="flex flex-1 items-center justify-center gap-x-1">
				<input
					name="isLimitUp"
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeDaysFilterCheck(day)}"
					checked="{$MainStore.checkedMaxMinDays.includes(day)}"
				/><span>{day} 日</span>
			</div>
		{/each}
	</div>
	<!-- <div class="flex w-full justify-center gap-x-1 px-1">
		<div>
			<span>漲停</span>
			<input
				name="isLimitUp"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isLimitUp}"
			/>
		</div>
		<div>
			<span>跌停</span>
			<input
				name="isLimitDown"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isLimitDown}"
			/>
		</div>
	</div> -->
</div>
