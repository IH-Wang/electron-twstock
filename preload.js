const { ipcRenderer } = require('electron');
window.addEventListener('DOMContentLoaded', async () => {
	if (!window.ipcRenderer) {
		window.ipcRenderer = ipcRenderer;
	}
});
