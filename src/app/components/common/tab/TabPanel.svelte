<script>
	import * as R from 'ramda';
	// component
	import styled from './Tab.module.scss';
	export let title = '';
	export let classProp = '';
	export let tabs = [];
	export let options = [];
	export let activeTab;
	export let changeTab;
	export let changeOption;
	export let selectedOption;
	const setTab = (tab) => {
		if (activeTab === tab) {
			changeTab('');
		} else {
			changeTab(tab);
		}
	};
</script>

<div class="{styled.tabPanelWrapper} flex-1 border shadow py-1 mr-1 text-center">
	<span>{title}</span>
	{#if !R.isEmpty(tabs)}
		<ul class="{styled.tabPanel} {classProp} list-reset flex">
			{#each tabs as tab}
				<li class="p-0 flex-1">
					<a
						class="{tab === activeTab ? styled.active : ''} inline-block w-full px-0 text-sm text-center hover:text-gray-500"
						href="{null}"
						on:click="{() => setTab(tab)}"
					>{tab}</a>
				</li>
			{/each}
		</ul>
	{/if}
	{#if !R.isEmpty(options)}
		<div>
			<select
				bind:value="{selectedOption}"
				class="mt-1 w-full px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				on:blur="{changeOption}"
				disabled="{!activeTab && !R.isEmpty(tabs)}"
			>
				{#each options as option, index}
					<option value="{index}">{option}</option>
				{/each}
			</select>
		</div>
	{/if}
	<slot />
</div>
