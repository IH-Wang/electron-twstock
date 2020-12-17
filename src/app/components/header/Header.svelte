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
	console.log(process);
</script>

<div class="{styled.titleBar}">
	<header class="flex mx-auto px-3 justify-between items-center">
		{#if process.platform === 'darwin'}
			<nav class="{styled.titleControl}">
				<ul>
					<li>
						<button class="{styled.titleButton} {styled.macClose} focus:outline-none" on:click="{close}">
							<i class="material-icons">close</i>
						</button>
					</li>

					<li class="ml-4">
						<button class="{styled.titleButton} {styled.macMini} focus:outline-none" on:click="{minimize}">
							<i class="material-icons">minimize</i>
						</button>
					</li>
					<li class="ml-4">
						<button class="{styled.titleButton} {styled.macMax} focus:outline-none" on:click="{maximize}">
							<i class="material-icons">open_in_full</i>
						</button>
					</li>
				</ul>
			</nav>
		{/if}
		<div class="{styled.titleLogo}">
			<img src="image/stock.png" alt="logo" class="pl-2" />
			<span class="pl-4">股溝</span>
			<span class="text-xs text-gray-500 pl-4">~ 在茫茫股海深溝裡，挖好股也<span
					class="line-through pl-0"
				>踢屁股</span>
				~</span>
		</div>
		<div class="inline-flex items-center {styled.toggle}">
			<Toggle isToggle="{toggleSelect}" toggle="{handleToggle}" />
			<i class="material-icons pl-2 {styled.toggleIcon}">{!toggleSelect ? 'nights_stay' : 'wb_sunny'}</i>
		</div>
		{#if process.platform !== 'darwin'}
			<nav class="{styled.titleControl}">
				<ul>
					<li class="{styled.darkMode}">
						<div class="inline-flex items-center">
							<Toggle isToggle="{toggleSelect}" toggle="{handleToggle}" />
							<!-- <Switch bind:checked="{toggleSelect}" on:click="{toggle}" /> -->
							<i
								class="material-icons {styled.darkModeIcon}"
							>{!toggleSelect ? 'nights_stay' : 'wb_sunny'}</i>
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
		{/if}
	</header>
</div>
