<style>
	:global(html) {
		background-color: var(--theme-background);
		color: var(--theme-text);
	}
</style>

<script>
	import ThemeContext from './context/ThemeContext.svelte';
	import Header from './components/header/Header.svelte';
	import './App.module.scss';
</script>

<ThemeContext>
	<Header />
	<main>
		<h1><span>TEST</span>Hello world!</h1>
	</main>
</ThemeContext>
