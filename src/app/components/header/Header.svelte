<script>
	import { getContext } from 'svelte';
	import Switch from '@smui/switch';
	import FormField from '@smui/form-field';
	import styled from './Header.module.scss';

	const { toggle } = getContext('theme');
	let toggleSelect = false;

	let minimize = () => {
		window.ipcRenderer.send('minimize');
		// const result = await window.ipcRenderer.invoke('getStockCode');
	};
	let maximize = () => {
		window.ipcRenderer.send('maximize');
		// const result = await window.ipcRenderer.invoke('getStockCode');
	};
	let close = () => {
		window.ipcRenderer.send('close');
		// const result = await window.ipcRenderer.invoke('getStockCode');
	};
</script>

<div class="{styled.titleBar}">
	<header class="flex mx-auto px-3 justify-between items-center">
		<div class="{styled.titleLogo}"><img src="image/stock.png" alt="logo" /><span>股溝</span></div>

		<nav class="{styled.titleControl}">
			<ul>
				<li class="{styled.darkMode}">
					<FormField>
						<Switch bind:checked="{toggleSelect}" on:click="{toggle}" />
						<i class="material-icons {styled.darkModeIcon}">{!toggleSelect ? 'nights_stay' : 'wb_sunny'}</i>
					</FormField>
				</li>
				<li class="ml-4">
					<button class="{styled.titleButton} focus:outline-none" on:click="{minimize}">
						<i class="material-icons">minimize</i>
					</button>
				</li>
				<li class="ml-4">
					<button class="{styled.titleButton} focus:outline-none" on:click="{maximize}">
						<i class="material-icons">open_in_full</i>
					</button>
				</li>
				<li class="ml-4">
					<button class="{styled.titleButton} focus:outline-none" on:click="{close}">
						<i class="material-icons">close</i>
					</button>
				</li>
			</ul>
		</nav>
	</header>
</div>
