<script>
	export let selected;
	export let options;
	export let changeSelect;
	let isShow = false;
	const toggleSelect = () => {
		isShow = !isShow;
	};
	$: {
		if (typeof options[0] !== 'object') {
			options = options.map((option) => ({ text: option, value: option }));
		}
	}
</script>

<button
	class="dropdown:block relative px-3 text-sm leading-relaxed text-gray-800 transition-colors duration-150 bg-white border border-gray-300 rounded-lg focus:outline-none hover:border-gray-600 focus:shadow-outline focus:border-gray-900"
	role="navigation"
	aria-haspopup="true"
	on:click="{toggleSelect}"
>
	<div class="flex items-center ">
		<span class="px-2 text-gray-700">{selected === -1 ? '全部' : selected}</span>
		<svg class="w-4 h-4 text-gray-500 fill-current" viewBox="0 0 20 20" aria-hidden="true">
			<path
				d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
				clip-rule="evenodd"
				fill-rule="evenodd"
			></path>
		</svg>
	</div>
	{#if isShow}
		<ul
			class="absolute left-0 w-auto p-2 mt-3 overflow-y space-y-2 text-sm bg-white border border-gray-100 rounded-lg shadow-lg"
			aria-label="submenu"
		>
			<a
				class="inline-block w-full px-2 py-1 font-medium text-gray-600 transition-colors duration-150 rounded-md hover:text-gray-900 focus:outline-none focus:shadow-outline hover:bg-gray-100"
				href="{null}"
				on:click="{changeSelect('全部')}"
			>全部</a>
			{#each options as option}
				<a
					class="inline-block w-full px-2 text-sm text-gray-600 transition-colors duration-150 rounded-md hover:text-gray-900 focus:outline-none focus:shadow-outline hover:bg-gray-100"
					href="{null}"
					on:click="{changeSelect(option.value)}"
				>
					{option.text}
				</a>
			{/each}
		</ul>
	{/if}
</button>
