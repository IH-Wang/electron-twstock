<style>
	.toggle-dot {
		top: -0.25rem;
		left: -0.25rem;
		transition: all 0.3s ease-in-out;
	}

	input:checked ~ .toggle-dot {
		transform: translateX(100%);
		background-color: tomato;
	}
</style>

<script>
	export let toggle;
	export let isToggle = false;
</script>

<div class="relative" on:click="{toggle}">
	<input id="toogleA" type="checkbox" class="hidden" checked="{isToggle}" />
	<div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
	<div class="toggle-dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
</div>
