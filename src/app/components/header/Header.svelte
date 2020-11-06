<script>
	import styled from './Header.module.scss';
	let min = () => {
		window.ipcRenderer.send('minimize');
	};
</script>

<header class="{styled.titleBar}">
	<div class="{styled.titleLogo}"><img src="image/stock.png" alt="logo" /><span>股溝</span></div>

	<div class="{styled.titleControl}">
		<button class="{styled.titleButton}" on:click="{min}"><i class="material-icons">minimize</i></button>
	</div>
</header>
