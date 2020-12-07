<script>
	import { setContext } from 'svelte';
	import dbUtil from '../util/db';
	// let database;
	// onMount(async () => {
	// 	database = await dbUtil.initDB();
	// });
	// const db = new Promise((resolve) => {
	// 	const timer = setInterval(() => {
	// 		if (window.db) {
	// 			clearInterval(timer);
	// 			resolve(window.db);
	// 		}
	// 	}, 1);
	// });
	setContext('db', (async () => await dbUtil.initDB())());
</script>

<slot />
