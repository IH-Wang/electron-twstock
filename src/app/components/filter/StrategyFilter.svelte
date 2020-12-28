<script>
	import { fly, crossfade, slide } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	// component
	import MAContent from './strategy/MA.svelte';
	import BooleanContent from './strategy/Boolean.svelte';
	import MACDContent from './strategy/MACD.svelte';
	import KDContent from './strategy/KD.svelte';
	// constants
	import { strategyTabs, MOVING_AVERAGE, BOOLEAN, MACD, KD } from '../../constants';
	// style
	import styled from './Filter.module.scss';
	let activeTab = '';

	const [send, receive] = crossfade({
		duration: 300,
		fallback: slide,
	});
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
	{#each strategyTabs as item}
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
		{#if activeTab === MOVING_AVERAGE}
			<MAContent />
		{:else if activeTab === BOOLEAN}
			<BooleanContent />
		{:else if activeTab === MACD}
			<MACDContent />
		{:else if activeTab === KD}
			<KDContent />
		{/if}
	</div>
{/if}
