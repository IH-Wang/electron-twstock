<script>
	import { fly, crossfade, slide } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	// component
	import ForeignContent from './bargainChip/Foreign.svelte';
	import SitesContent from './bargainChip/Sites.svelte';
	import DealerContent from './bargainChip/Dealer.svelte';
	import MajorContent from './bargainChip/Major.svelte';
	// constants
	import { bargainChipTabs, FOREIGN, SITES, DEALER, MAJOR } from '../../constants';
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
	{#each bargainChipTabs as item}
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
		{#if activeTab === FOREIGN}
			<ForeignContent />
		{:else if activeTab === SITES}
			<SitesContent />
		{:else if activeTab === DEALER}
			<DealerContent />
		{:else if activeTab === MAJOR}
			<MajorContent />
		{/if}
	</div>
{/if}
