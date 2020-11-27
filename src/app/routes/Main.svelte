<script>
	import { fly } from 'svelte/transition';
	// import { quintOut } from 'svelte/easing';
	// component
	import Table from '../components/stockTable/Table.svelte';
</script>

<div class="pegeWrapper" transition:fly>
	<Table />
</div>
