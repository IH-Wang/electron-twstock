<script>
	import { getContext } from 'svelte';
	import styled from './Header.module.scss';

	import Toggle from '../common/button/Toggle.svelte';

	const { toggle } = getContext('theme');
	let toggleSelect = false;

	let minimize = () => {
		window.ipcRenderer.send('minimize');
	};
	let maximize = () => {
		window.ipcRenderer.send('maximize');
	};
	let close = () => {
		window.ipcRenderer.send('close');
	};
	const handleToggle = () => {
		toggle();
		toggleSelect = !toggleSelect;
	};
</script>

<div class="{styled.titleBar}">
	<header class="flex mx-auto px-3 justify-between items-center">
		<div class="{styled.titleLogo}">
			<img src="image/stock.png" alt="logo" />
			<span>股溝</span>
			<span class="text-xs text-gray-500">~ 在茫茫股海深溝裡，挖出好股</span>
		</div>

		<nav class="{styled.titleControl}">
			<ul>
				<li class="{styled.darkMode}">
					<div class="inline-flex items-center">
						<Toggle isToggle="{toggleSelect}" toggle="{handleToggle}" />
						<!-- <Switch bind:checked="{toggleSelect}" on:click="{toggle}" /> -->
						<i class="material-icons {styled.darkModeIcon}">{!toggleSelect ? 'nights_stay' : 'wb_sunny'}</i>
					</div>
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
