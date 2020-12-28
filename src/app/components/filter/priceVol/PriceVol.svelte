<script>
	// store
	import MainStore, { changeTab } from '../../../stores/main';
	// component
	import TabPanel from '../../common/tab/TabPanel.svelte';
	// constants
	import { PRICE_UP_VOL_UP, PRICE_UP_VOL_DOWN, PRICE_DOWN_VOL_UP, PRICE_DOWN_VOL_DOWN } from '../../../constants';
	const priceVolOptions = [PRICE_UP_VOL_UP, PRICE_UP_VOL_DOWN, PRICE_DOWN_VOL_UP, PRICE_DOWN_VOL_DOWN];
</script>

<div class="flex flex-col justify-center items-center gap-y-2 w-full">
	<div class="flex w-full justify-center gap-x-1 px-1">
		<TabPanel classProp="flex-1" activeTab="{$MainStore.priceVolType}" changeTab="{changeTab('priceVolType')}" tabs="{priceVolOptions}" />
	</div>
</div>
