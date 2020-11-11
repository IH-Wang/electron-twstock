const { ipcRenderer, remote } = require('electron');

window.addEventListener('DOMContentLoaded', async () => {
	// const database = require('./db/database');
	// const db = await database.getDatabase();
	if (!window.db) {
		window.db = remote.getGlobal('db');
	}
	if (!window.ipcRenderer) {
		window.ipcRenderer = ipcRenderer;
	}

	// const stockCode = await db.stockcode.dump();
	// if (R.isEmpty(stockCode.docs)) {
	// 	const stockList = await ipcRenderer.invoke('crawl-stock-code');
	// 	await db.stockcode.bulkInsert(stockList);
	// }
});
