<script>
	import { onMount, setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { themes as _themes } from '../theme/themes.js';

	export let themes = [..._themes];
	let current = themes[0].name;
	const getCurrentTheme = (name) => themes.find((theme) => theme.name === name);
	const themeStore = writable(getCurrentTheme(current));
	setContext('theme', {
		// provide Theme store through context
		theme: themeStore,
		toggle: () => {
			// update internal state
			let currentIndex = themes.findIndex((theme) => theme.name === current);
			current = themes[currentIndex === themes.length - 1 ? 0 : (currentIndex += 1)].name;
			// update Theme store
			themeStore.update((theme) => ({ ...theme, ...getCurrentTheme(current) }));
			setRootColors(getCurrentTheme(current));
		},
	});

	onMount(() => {
		// set CSS vars on mount
		setRootColors(getCurrentTheme(current));
	});

	const setRootColors = (theme) => {
		Object.entries(theme.colors).forEach(([prop, color]) => {
			let varString = `--theme-${prop}`;
			document.documentElement.style.setProperty(varString, color);
		});
		document.documentElement.style.setProperty('--theme-name', theme.name);
	};
</script>

<slot />
