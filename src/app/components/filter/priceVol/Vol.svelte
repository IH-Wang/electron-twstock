<script>
	// store
	import MainStore, { changePriceVol, changeTab, changeSelect, changeFilterCheck } from '../../../stores/main';
	// component
	import TabPanel from '../../common/tab/TabPanel.svelte';
	// constants
	import { filterHighLowTabs, DAYS } from '../../../constants';
	const selectedDays = [{ text: '當日', value: 0 }, ...DAYS.map((day) => ({ text: `${day}日均量`, value: day }))];
	// 過濾 checkbox 篩選
	const changeDaysFilterCheck = (day) => () => {
		let checkDays = $MainStore.checkedVolHighLowDays;
		if (checkDays.includes(day)) {
			checkDays = checkDays.filter((item) => item !== day);
		} else {
			checkDays.push(day);
		}
		MainStore.filterByParams({ checkedVolHighLowDays: checkDays });
	};
</script>

<div class="flex flex-col justify-center items-center gap-y-2">
	<div class="flex w-full justify-center gap-x-1 px-1">
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">起</span>
			<input
				name="fromVol"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="成交量"
				value="{$MainStore.fromVol}"
				on:input="{changePriceVol}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center">
			<span class="text-sm rounded-l w-16">迄</span>
			<input
				name="toVol"
				class="focus:ring-indigo-500 rounded-md w-full text-center"
				type="number"
				placeholder="成交量"
				value="{$MainStore.toVol}"
				on:input="{changePriceVol}"
			/>
		</div>
		<div class="flex flex-1 items-center text-center justify-center">
			<select
				value="{$MainStore.selectedVol}"
				class="w-full h-full mx-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				on:blur="{changeSelect('selectedVol')}"
			>
				{#each selectedDays as option}
					<option value="{option.value}">{option.text}</option>
				{/each}
			</select>
		</div>
		<div class="flex flex-1 items-center text-center gap-x-1">
			<input
				name="isHeavyTrading"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				checked="{$MainStore.isHeavyTrading}"
			/>
			<span>爆大量</span>
		</div>
	</div>
	<div class="flex w-full justify-center gap-x-1 px-1">
		<TabPanel
			classProp="flex-1"
			activeTab="{$MainStore.volHighLowType}"
			changeTab="{changeTab('volHighLowType')}"
			tabs="{Object.values(filterHighLowTabs)}"
		/>
		{#each DAYS as day}
			<div class="flex flex-1 items-center justify-center gap-x-1">
				<input
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
					on:change="{changeDaysFilterCheck(day)}"
					checked="{$MainStore.checkedVolHighLowDays.includes(day)}"
					disabled="{!$MainStore.volHighLowType}"
				/><span>{day} 日</span>
			</div>
		{/each}
	</div>
</div>
