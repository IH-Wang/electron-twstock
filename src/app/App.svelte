<style global>
	:global(html) {
		background-color: var(--theme-background);
		color: var(--theme-text);
	}

	/* purgecss start ignore */
	@tailwind base;
	@tailwind components;
	/* purgecss end ignore */
	@tailwind utilities;
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
	import './App.scss';

	function conditionsFailed(event) {
		console.error('conditionsFailed event', event.detail);
	}

	// Handles the "routeLoaded" event dispatched by the router when a component was loaded
	function routeLoaded(event) {
		console.log('routeLoaded event', event.detail);
	}
</script>

<ThemeContext>
	<Header />
	<main>
		<DatabaseContext>
			<Router routes="{routes}" on:conditionsFailed="{conditionsFailed}" on:routeLoaded="{routeLoaded}" />
		</DatabaseContext>
	</main>
</ThemeContext>
