<script>
	// store
	import MainStore from '../../stores/main';
	// component
	import TabPanel from '../common/tab/TabPanel.svelte';
	// constants
	import { filterBuySellTabs, FOREIGN, SITES, DEALER } from '../../constants';
	// style
	import styled from './Filter.module.scss';
	export let isReset = false;
	const majorOptions = ['轉買', '轉賣', '連買', '連賣'];
	let activeForeignTab = $MainStore.activeForeignTab,
		activeSitesTab = $MainStore.activeSitesTab,
		activeDealerTab = $MainStore.activeDealerTab,
		selectMajorTab =
			$MainStore.activeMajorTab || $MainStore.isMajorContinuousBuy
				? '連買'
				: '' || $MainStore.isMajorContinuousSell
				? '連賣'
				: '',
		isForeignEnter = $MainStore.isForeignEnter,
		isForeignExit = $MainStore.isForeignExit,
		isSitesEnter = $MainStore.isSitesEnter,
		isSitesExit = $MainStore.isSitesExit,
		isDealerEnter = $MainStore.isDealerEnter,
		isDealerExit = $MainStore.isDealerExit;
	// 切換 tab
	const changeTab = (type) => (tab) => {
		switch (type) {
			case FOREIGN:
				activeForeignTab = tab;
				MainStore.filterByParams({ activeForeignTab });
				break;
			case SITES:
				activeSitesTab = tab;
				MainStore.filterByParams({ activeSitesTab });
				break;
			case DEALER:
				activeDealerTab = tab;
				MainStore.filterByParams({ activeDealerTab });
				break;
			default:
				break;
		}
	};
	// 過濾 checkbox 篩選
	const changeFilterCheck = (evt) => {
		MainStore.filterByParams({ [evt.target.name]: evt.target.checked });
	};
	const changeMajorType = (key) => () => {
		selectMajorTab = selectMajorTab === key ? '' : key;
		switch (key) {
			case '轉買':
			case '轉賣':
				MainStore.filterByParams({
					activeMajorTab: selectMajorTab,
					isMajorContinuousBuy: false,
					isMajorContinuousSell: false,
				});
				break;
			case '連買':
				MainStore.filterByParams({
					isMajorContinuousBuy: selectMajorTab,
					isMajorContinuousSell: false,
					activeMajorTab: '',
				});
				break;
			case '連賣':
				MainStore.filterByParams({
					isMajorContinuousSell: selectMajorTab,
					isMajorContinuousBuy: false,
					activeMajorTab: '',
				});
				break;
		}
	};
	$: {
		if (isReset) {
			isReset = false;
		}
	}
</script>

<TabPanel
	title="外資"
	tabs="{Object.values(filterBuySellTabs)}"
	changeTab="{changeTab(FOREIGN)}"
	activeTab="{activeForeignTab}"
>
	<div class="inline-flex mt-1 justify-around w-full">
		<div>
			<span>進場</span>
			<input
				name="isForeignEnter"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				bind:checked="{isForeignEnter}"
			/>
		</div>
		<div>
			<span>出場</span>
			<input
				name="isForeignExit"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				bind:checked="{isForeignExit}"
			/>
		</div>
	</div>
</TabPanel>
<TabPanel
	title="投信"
	tabs="{Object.values(filterBuySellTabs)}"
	changeTab="{changeTab(SITES)}"
	activeTab="{activeSitesTab}"
>
	<div class="inline-flex mt-1 justify-around w-full">
		<div>
			<span>進場</span>
			<input
				name="isSitesEnter"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				bind:checked="{isSitesEnter}"
			/>
		</div>
		<div>
			<span>出場</span>
			<input
				name="isSitesExit"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				bind:checked="{isSitesExit}"
			/>
		</div>
	</div>
</TabPanel>
<TabPanel
	title="自營商"
	tabs="{Object.values(filterBuySellTabs)}"
	changeTab="{changeTab(DEALER)}"
	activeTab="{activeDealerTab}"
>
	<div class="inline-flex mt-1 justify-around w-full">
		<div>
			<span>進場</span>
			<input
				name="isDealerEnter"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				bind:checked="{isDealerEnter}"
			/>
		</div>
		<div>
			<span>出場</span>
			<input
				name="isDealerExit"
				type="checkbox"
				class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
				on:change="{changeFilterCheck}"
				bind:checked="{isDealerExit}"
			/>
		</div>
	</div>
</TabPanel>
<TabPanel title="大戶">
	<div class="flex flex-wrap {styled.filterBtn}">
		{#each majorOptions as option}
			<div
				class="{selectMajorTab === option ? styled.active : ''} text-sm w-1/2 border py-2 cursor-pointer hover:border-blue-500 hover:text-gray-500"
				on:click="{changeMajorType(option)}"
			>
				{option}
			</div>
		{/each}
	</div>
</TabPanel>
