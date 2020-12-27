<script>
	// store
	import MainStore, { changeTab } from '../../../stores/main';
	// component
	import TabPanel from '../../common/tab/TabPanel.svelte';
	const priceVolOptions = ['價量齊揚', '價漲量縮', '價跌量增', '價跌量縮'];
</script>

<div class="flex flex-col justify-center items-center gap-y-2 w-full">
	<div class="flex w-full justify-center gap-x-1 px-1">
		<TabPanel classProp="flex-1" activeTab="{$MainStore.priceVolType}" changeTab="{changeTab('priceVolType')}" tabs="{priceVolOptions}" />
	</div>
</div>
