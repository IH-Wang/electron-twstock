<style>
</style>

<script>
	import { fly, crossfade, slide } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	// component
	import PriceContent from './priceVol/Price.svelte';
	import VolContent from './priceVol/Vol.svelte';
	import RiseDropContent from './priceVol/RiseDrop.svelte';
	import PriceVolContent from './priceVol/PriceVol.svelte';
	// constants
	import { priceVolTabs, PRICE, VOL, RISE_DROP, PRICE_VOL } from '../../constants';
	// style
	import styled from './Filter.module.scss';

	const [send, receive] = crossfade({
		duration: 200,
		fallback: slide,
	});

	let activeTab = '';

	// 切換 tab
	const changeActiveTab = (tab) => {
		activeTab = activeTab === tab ? '' : tab;
	};
</script>

<div
	class="flex flex-wrap"
	in:fly="{{ x: -1920, duration: 400, easing: quintInOut, opacity: 1 }}"
	out:fly="{{ x: 1920, duration: 200, easing: quintInOut }}"
>
	{#each priceVolTabs as item}
		<div
			class="flex-1 m-1 {styled.square} text-center {activeTab === item.value ? styled.active : ''}"
			on:click="{() => changeActiveTab(item.value)}"
		>
			{item.text}
		</div>
	{/each}
</div>
{#if activeTab}
	<div class="flex m-1 py-4 justify-center {styled.activeContent}" in:receive="{{ key: activeTab }}" out:send="{{ key: activeTab }}">
		{#if activeTab === PRICE}
			<PriceContent />
		{:else if activeTab === VOL}
			<VolContent />
		{:else if activeTab === RISE_DROP}
			<RiseDropContent />
		{:else if activeTab === PRICE_VOL}
			<PriceVolContent />
		{/if}
	</div>
{/if}
