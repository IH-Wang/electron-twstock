<script>
	// store
	import MainStore, { changeTab } from '../../../stores/main';
	// component
	import TabPanel from '../../common/tab/TabPanel.svelte';
	const macdOptions = ['趨勢向上', '趨勢向下', '黃金交叉', '死亡交叉'];
</script>

<div class="flex flex-col justify-center items-center gap-y-2 w-full">
	<div class="flex w-full justify-center gap-x-1 px-1">
		<TabPanel classProp="flex-1" activeTab="{$MainStore.macdType}" changeTab="{changeTab('macdType')}" tabs="{macdOptions}" />
	</div>
</div>
