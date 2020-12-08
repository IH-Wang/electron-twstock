<style>
	input:focus {
		outline: none;
		box-shadow: 0 0 0 2px var(--theme-inputFocusBorder);
	}
</style>

<script>
	// store
	import MainStore from '../../stores/main';
	// component
	import Tab from '../common/tab/Tab.svelte';
	import TabPanel from '../common/tab/TabPanel.svelte';
	import { DAYS } from '../../util/stock';
	const filterTabOption = {
		priceVol: '價量篩選',
		strategy: '技術篩選',
		big3: '三大法人',
	};
	const filterRiseDropTabs = {
		rise: '漲幅',
		drop: '跌幅',
	};
	const filterMaxMinTabs = {
		max: '新高',
		min: '新低',
	};
	let selectMarketType = '';
	let selectCategory = -1;
	let searchText = '';
	let searchMaxPrice;
	let searchMinPrice;
	let searchEndPrice;
	let isLongOrder, isShortOrder;
	let tabs = Object.values(filterTabOption);
	let activeTab;
	let activeRiseDropTab = '';
	let selectedRiseDropIndex = 0;
	let searchRiseDropMargin;
	let activeMaxMinTab = '';
	let selectedMaxMinIndex = 0;
	// 過濾股號 | 股名
	const changeText = (evt) => {
		if (!evt.data || (evt.data.match(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/) && searchText.length > 1)) {
			MainStore.setSearchText(searchText);
		}
	};
	// 過濾市場
	const changeMarketType = () => {
		MainStore.changeMarketType(selectMarketType);
	};
	//過濾產業
	const changeCategory = () => {
		MainStore.changeCategory(selectCategory);
	};
	// 過濾 checkbox 篩選
	const changeFilterCheck = (evt) => {
		if (evt.target.name === 'isLongOrder' && evt.target.checked) {
			isShortOrder = false;
			MainStore.filterByParams({ [evt.target.name]: evt.target.checked, isShortOrder: false });
		} else if (evt.target.name === 'isShortOrder' && evt.target.checked) {
			isLongOrder = false;
			MainStore.filterByParams({ [evt.target.name]: evt.target.checked, isLongOrder: false });
		} else {
			MainStore.filterByParams({ [evt.target.name]: evt.target.checked });
		}
	};
	const resetFilter = () => {
		MainStore.resetFilter();
		activeTab = tabs[0];
	};
	// 切換 tab
	const changeTab = (type) => (tab) => {
		switch (type) {
			case 'riseDrop':
				activeRiseDropTab = tab;
				break;
			case 'main':
			default:
				activeTab = tab;
				break;
		}
	};

	const changeSelect = (type) => (selected) => {
		switch (type) {
			case 'riseDrop':
				console.log(selected);
				break;
			case 'main':
			default:
				break;
		}
	};
	const changePrice = (evt) => {
		MainStore.filterByParams({ [evt.target.name]: evt.target.value ? Number(evt.target.value) : '' });
	};
</script>

<div class="w-full flex flex-col px-4 my-2">
	<div class="mt-2 inline-flex">
		<div class="mr-2">
			<span>搜尋</span>
			<input
				type="text"
				name="search"
				bind:value="{searchText}"
				placeholder="股號 | 股名"
				class="focus:ring-indigo-500 rounded-md pl-1 w-36"
				on:input="{changeText}"
			/>
		</div>
		<div class="mx-2">
			<span>市場</span>
			<select
				name="marketType"
				bind:value="{selectMarketType}"
				class="mt-1 inline-flex px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				on:blur="{changeMarketType}"
			>
				<option value="">全部</option>
				{#each $MainStore.marketTypeList as market}
					<option value="{market}">{market}</option>
				{/each}
			</select>
		</div>
		<div class="mx-2">
			<span>產業</span>
			<select
				name="category"
				bind:value="{selectCategory}"
				class="mt-1 inline-flex px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				on:blur="{changeCategory}"
			>
				<option value="{-1}">全部</option>
				{#each $MainStore.categoryList as category}
					<option value="{category}">{!category ? '無' : category}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-1 justify-end">
			<button
				class="border border-blue-500 bg-blue-500 text-white rounded-md px-4 transition duration-500 ease select-none hover:bg-blue-600 focus:outline-none focus:shadow-outline"
				on:click="{resetFilter}"
			>重設</button>
		</div>
	</div>
	<div class="mt-2">
		<Tab tabs="{tabs}" bind:activeTab changeTab="{changeTab('main')}" />
	</div>
	{#if activeTab === filterTabOption.priceVol}
		<div class="mt-2 inline-flex">
			<TabPanel title="價格">
				<div>
					<span>最高</span>
					<input
						type="number"
						name="maxPrice"
						bind:value="{searchMaxPrice}"
						on:input="{changePrice}"
						placeholder="最高價"
						class="focus:ring-indigo-500 rounded-md mx-1 w-20 text-center"
					/>
				</div>
				<div class="mt-1">
					<span>最低</span>
					<input
						type="number"
						name="minPrice"
						bind:value="{searchMinPrice}"
						on:input="{changePrice}"
						placeholder="最低價"
						class="focus:ring-indigo-500 rounded-md mx-1  w-20 text-center"
					/>
				</div>
				<div class="mt-1">
					<span>收盤</span>
					<input
						type="number"
						name="endPrice"
						bind:value="{searchEndPrice}"
						on:input="{changePrice}"
						placeholder="收盤價"
						class="focus:ring-indigo-500 rounded-md mx-1 w-20 text-center"
					/>
				</div>
			</TabPanel>
			<TabPanel
				title="漲跌"
				tabs="{Object.values(filterRiseDropTabs)}"
				changeTab="{changeTab('riseDrop')}"
				activeTab="{activeRiseDropTab}"
				options="{DAYS.map((day) => `${day} 日`)}"
				changeOption="{changeSelect('riseDrop')}"
				selectedOption="{selectedRiseDropIndex}"
			>
				<input
					type="number"
					name="riseDropMargin"
					bind:value="{searchRiseDropMargin}"
					placeholder="漲跌"
					class="focus:ring-indigo-500 rounded-md m-1 w-24 text-center"
					on:change="{changePrice}"
					disabled="{!activeRiseDropTab}"
				/>
				%
			</TabPanel>
			<TabPanel
				title="高低"
				tabs="{Object.values(filterMaxMinTabs)}"
				changeTab="{changeTab('maxMin')}"
				activeTab="{activeMaxMinTab}"
				options="{DAYS.map((day) => `${day} 日`)}"
				changeOption="{changeSelect('maxMin')}"
				selectedOption="{selectedMaxMinIndex}"
			>
				<div class="inline-flex mt-1 justify-around w-full">
					<div>
						<span>漲停</span>
						<input
							name="isLongOrder"
							type="checkbox"
							class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
							on:change="{changeFilterCheck}"
							bind:checked="{isLongOrder}"
						/>
					</div>
					<div>
						<span>跌停</span>
						<input
							name="isLongOrder"
							type="checkbox"
							class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
							on:change="{changeFilterCheck}"
							bind:checked="{isLongOrder}"
						/>
					</div>
				</div>
			</TabPanel>
		</div>
	{:else if activeTab === filterTabOption.strategy}
		<div class="mt-2 inline-flex">
			<div class="inline-flex items-center mx-1">
				<span>多頭排列</span>
				<input
					name="isLongOrder"
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ml-2"
					on:change="{changeFilterCheck}"
					bind:checked="{isLongOrder}"
				/>
			</div>
			<div class="inline-flex items-center mx-1">
				<span>空頭排列</span>
				<input
					name="isShortOrder"
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ml-2"
					on:change="{changeFilterCheck}"
					bind:checked="{isShortOrder}"
				/>
			</div>
			<div class="inline-flex items-center mx-1">
				<span>均線糾結</span>
				<input
					name="isTangledMA"
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ml-2"
					on:change="{changeFilterCheck}"
				/>
			</div>
			<div class="inline-flex items-center mx-1">
				<span>旗型</span>
				<input
					name="isFlagType"
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ml-2"
					on:change="{changeFilterCheck}"
				/>
			</div>
			<div class="inline-flex items-center mx-1">
				<span>破切</span>
				<input
					name="isReverse"
					type="checkbox"
					class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded ml-2"
					on:change="{changeFilterCheck}"
				/>
			</div>
		</div>
	{:else if activeTab === filterTabOption.big3}
		<div class="mt-2 inline-flex"></div>
	{/if}
</div>
