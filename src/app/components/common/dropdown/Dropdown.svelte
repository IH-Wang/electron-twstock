<script>
	export let selected;
	export let options;
	export let changeSelect;
	let isShow = false;
	const toggleSelect = () => {
		isShow = !isShow;
	};
</script>

<div class="inline-flex">
	<button
		type="button"
		class="border justify-centerrounded-md  border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
		id="options-menu"
		aria-haspopup="true"
		aria-expanded="true"
		on:click="{toggleSelect}"
	>
		{selected}
		<!-- Heroicon name: chevron-down -->
		<svg
			class="-mr-1 ml-2 h-5 w-5"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
		>
			<path
				fill-rule="evenodd"
				d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
				clip-rule="evenodd"
			></path>
		</svg>
	</button>
</div>
<div
	class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 {!isShow && 'hidden'}"
	role="menu"
	aria-orientation="vertical"
	aria-labelledby="options-menu"
>
	<div class="py-1">
		{#each options as option}
			<a
				href="{null}"
				class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
				role="menuitem"
				on:click="{changeSelect(option.value)}"
			>{option.text}</a>
		{/each}
	</div>
</div>
