<style>
	:global(html) {
		background-color: var(--theme-background);
		color: var(--theme-text);
	}
</style>

<script>
	import Router from 'svelte-spa-router';
	// context
	import ThemeContext from './context/ThemeContext.svelte';
	import DatabaseContext from './context/DatabaseContext.svelte';
	// titleBar
	import Header from './components/header/Header.svelte';
	// routes
	import routes from './routes';
	// css
	import './App.module.scss';
</script>

<ThemeContext>
	<Header />
	<main>
		<DatabaseContext>
			<Router routes="{routes}" />
		</DatabaseContext>
	</main>
</ThemeContext>
