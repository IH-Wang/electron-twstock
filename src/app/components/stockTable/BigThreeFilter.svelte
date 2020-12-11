<script>
	// store
	// import MainStore from '../../stores/main';
	// component
	import TabPanel from '../common/tab/TabPanel.svelte';
	export let isReset = false;
	$: {
		if (isReset) {
			isReset = false;
		}
	}
</script>

<TabPanel title="外資">
	<div></div>
</TabPanel>
<TabPanel title="投信">
	<div></div>
</TabPanel>
<TabPanel title="自營商">
	<div></div>
</TabPanel>
<TabPanel title="大戶">
	<div></div>
</TabPanel>
