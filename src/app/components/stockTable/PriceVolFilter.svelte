<style>
	.square {
		background-color: #fff;
		border: 1px solid var(--theme-progressCircleBar);
		border-radius: 6px;
		cursor: pointer;
		color: #333;
	}
	.square:hover {
		color: gray;
	}
	.active {
		background-color: var(--theme-progressCircleBar);
		border: 1px solid #fff;
		color: #fff;
	}
	.activeContent {
		background-color: var(--theme-titleBarBG);
		border-radius: 6px;
	}
</style>

<script>
	import { fly, crossfade, slide } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	// component
	import PriceContent from '../filter/Price.svelte';
	import VolContent from '../filter/Vol.svelte';
	import RiseDropContent from '../filter/RiseDrop.svelte';
	import PriceVolContent from '../filter/PriceVol.svelte';

	const [send, receive] = crossfade({
		duration: 300,
		fallback: slide,
	});
	const priceVolList = [
		{ text: '價格', value: 'price' },
		{ text: '成交量', value: 'vol' },
		{ text: '漲跌', value: 'riseDrop' },
		{ text: '價量關係', value: 'priceVol' },
	];
	let activeTab = '';

	// 切換 tab
	const changeActiveTab = (tab) => {
		activeTab = activeTab === tab ? '' : tab;
	};
</script>

<div class="flex flex-wrap" in:fly="{{ x: -1920, duration: 400, easing: quintInOut, opacity: 1 }}" out:fly="{{ x: 1920, duration: 200, easing: quintInOut }}">
	{#each priceVolList as item}
		<div class="flex-1 m-1 square text-center {activeTab === item.value ? 'active' : ''}" on:click="{() => changeActiveTab(item.value)}">{item.text}</div>
	{/each}
</div>
{#if activeTab}
	<div class="flex m-1 py-4 justify-center activeContent" in:receive="{{ key: activeTab }}" out:send="{{ key: activeTab }}">
		{#if activeTab === 'price'}
			<PriceContent />
		{:else if activeTab === 'vol'}
			<VolContent />
		{:else if activeTab === 'riseDrop'}
			<RiseDropContent />
		{:else if activeTab === 'priceVol'}
			<PriceVolContent />
		{/if}
	</div>
{/if}
