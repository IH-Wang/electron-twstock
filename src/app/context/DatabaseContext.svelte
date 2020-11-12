<script>
	import { setContext } from 'svelte';
	const db = new Promise((resolve) => {
		const timer = setInterval(() => {
			if (window.db) {
				clearInterval(timer);
				resolve(window.db);
			}
		}, 1);
	});
	setContext('db', {
		store: db,
	});
</script>

<slot />
