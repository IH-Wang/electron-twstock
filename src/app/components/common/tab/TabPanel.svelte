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

<div class="border py-1">
	<span>{title}</span>
	<ul class="{styled.tabPanel} {classProp} list-reset flex">
		{#each tabs as tab}
			<li class="p-0 flex-1">
				<a
					class="{tab === activeTab ? styled.active : ''} inline-block px-4 text-center"
					href="{null}"
					on:click="{() => setTab(tab)}"
				>{tab}</a>
			</li>
		{/each}
	</ul>
	{#if !R.isEmpty(options)}
		<div>
			<select
				bind:value="{selectedOption}"
				class="mt-1 w-full px-4 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				on:blur="{changeOption}"
				disabled="{!activeTab}"
			>
				{#each options as option, index}
					<option value="{index}">{option}</option>
				{/each}
			</select>
		</div>
	{/if}
	<slot />
</div>
