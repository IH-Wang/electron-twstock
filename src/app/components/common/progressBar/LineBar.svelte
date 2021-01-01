<style>
	progress {
		display: block;
		width: 100%;
		margin-bottom: 0.1em;
	}
	progress[value]::-webkit-progress-bar {
		background-color: var(--theme-progressBG);
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
		border-radius: 0.25em;
	}
	progress::-webkit-progress-value {
		background: var(--theme-progressBar);
		border-radius: 0.25em;
	}
</style>

<script>
	import { fade } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	export let progressValue;
	const progress = tweened(0, {
		duration: 200,
		easing: cubicOut,
	});
	$: {
		progress.set(progressValue);
	}
</script>

<progress value="{$progress}" transition:fade="{{ duration: 500 }}"></progress>
