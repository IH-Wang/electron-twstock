<style>
</style>

<script>
	import styled from './Tab.module.scss';
	export let tabs = [];
	export let activeTab = tabs[0];
	export let changeTab;
</script>

<ul class=" {styled.tab} list-reset flex">
	{#each tabs as tab}
		<li class="p-0 flex-1">
			<a
				class="{tab === activeTab ? styled.active : ''} inline-block py-2 px-4 w-full text-center"
				href="{null}"
				on:click="{() => changeTab(tab)}"
			>{tab}</a>
		</li>
	{/each}
</ul>
