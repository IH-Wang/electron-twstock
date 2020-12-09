<script>
	import ChevronLeftIcon from './ChevronLeft.svelte';
	import ChevronRightIcon from './ChevronRight.svelte';
	import { createEventDispatcher } from 'svelte/internal';
	const dispatch = createEventDispatcher();
	export let current = 1;
	export let totalItems;
	export let perPage = 10;
	export let rounded = false;
	export let small = false;
	export let color = 'indigo';
	let prevTotalItems;
	$: s = small ? 8 : 12;
	$: num_pages = Math.ceil(totalItems / perPage);
	let arr_pages = [];
	function buildArr(c, n) {
		if (n <= 7) {
			return [...Array(n)].map((_, i) => i + 1);
		} else {
			if (c < 3 || c > n - 2) {
				return [1, 2, 3, '...', n - 2, n - 1, n];
			} else {
				return [1, '...', c - 1, c, c + 1, '...', n];
			}
		}
	}
	function setArrPages() {
		arr_pages = buildArr(current, num_pages);
	}
	$: if (current) {
		setArrPages();
	}
	$: if (perPage) {
		setArrPages();
		current = 1;
	}
	$: if (totalItems) {
		num_pages = Math.ceil(totalItems / perPage);
		current = current || 1;
	}
	$: if (totalItems !== prevTotalItems) {
		prevTotalItems = totalItems;
		setArrPages();
	}
	function setCurrent(i) {
		if (isNaN(i)) return;
		current = i;
		dispatch('navigate', current);
	}
</script>

<div class="flex text-gray-700 mt-2 text-{small ? 'base' : 'lg'}">
	<div
		class="h-{s} w-{s} mr-1 flex justify-center items-center {rounded ? 'rounded-full bg-gray-200' : ''}
	  {current > 1 ? 'cursor-pointer' : 'text-gray-400'}"
		on:click="{() => current > 1 && setCurrent(current - 1)}"
	>
		<ChevronLeftIcon class="w-{s / 2} h-{s / 2}" />
	</div>
	<div class="flex h-{s} font-medium {rounded ? 'rounded-full bg-gray-200' : ''}">
		{#each arr_pages as i}
			<div
				class="w-{s} sm:flex justify-center items-center hidden select-none
		  cursor-pointer leading-5 transition duration-150 ease-in {i == current ? (rounded ? `rounded-full bg-${color}-600 text-white` : `border-t-2 border-${color}-600 `) : rounded ? 'rounded-full ' : 'border-t-2 border-white'}
		  "
				on:click="{() => setCurrent(i)}"
			>
				{i}
			</div>
		{/each}
		<div
			class="w-{s} h-{s} sm:hidden flex justify-center select-none items-center
		cursor-pointer leading-5 transition duration-150 ease-in {rounded ? `rounded-full bg-${color}-600 text-white` : `border-t-2 border-${color}-600`}"
		>
			{current}
		</div>
	</div>
	<div
		class="h-{s} w-{s} ml-1 flex justify-center items-center {rounded ? 'rounded-full bg-gray-200' : ''}
	  {current < num_pages ? 'cursor-pointer' : 'text-gray-400'}"
		on:click="{() => current < num_pages && setCurrent(current + 1)}"
	>
		<ChevronRightIcon class="w-{s / 2} h-{s / 2}" />
	</div>
</div>
