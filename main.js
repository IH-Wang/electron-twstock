'use strict';
const { app, BrowserWindow, Menu, screen, ipcMain, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
if (process.env.NODE_ENV === 'dev') {
	require('electron-reload')(`${app.getAppPath()}/public/build/`, {
		electron: `${app.getAppPath()}/node_modules', '.bin', 'electron')`,
		awaitWriteFinish: true,
	});
}

const twStockCrawler = require(`${app.getAppPath()}/public/util/crawler`);

let mainWindow;
app.setName('股溝');
function createWindow() {
	const timer = setInterval(() => {
		if (fs.existsSync(`${app.getAppPath()}/public/build/bundle.js`)) {
			clearInterval(timer);

			// Create the browser window.
			const { width, height } = screen.getPrimaryDisplay().workAreaSize;
			if (process.platform === 'darwin') {
				const template = [];
				template.unshift({
					label: '股溝',
					submenu: [
						{
							label: '結束',
							accelerator: 'CmdOrCtrl+Q',
							click() {
								app.quit();
							},
						},
					],
				});
				Menu.setApplicationMenu(Menu.buildFromTemplate(template));
				// app.dock.setMenu(
				// 	Menu.buildFromTemplate([
				// 		{
				// 			label: 'Quit',
				// 			click() {
				// 				app.quit();
				// 			},
				// 		},
				// 	]),
				// );
			} else {
				Menu.setApplicationMenu(false);
			}

			mainWindow = new BrowserWindow({
				width: width / 1.01,
				height: height / 1.01,
				title: '股溝',
				icon: `${app.getAppPath()}/public/image/icon/stock.${process.platform !== 'darwin' ? 'ico' : 'icns'}`,
				webPreferences: {
					nodeIntegration: true,
					preload: path.join(app.getAppPath(), '/preload.js'),
				},
				frame: false, // 標題列顯示
				transparent: false, // 背景透明
				autoHideMenuBar: true, //  工具列不顯示
			});

			// mainWindow.on('minimize', (e) => {
			// 	e.preventDefault();
			// 	mainWindow.minimize();
			// });

			// mainWindow.on('close', (e) => {
			// 	e.preventDefault();
			// 	mainWindow.hide();
			// });

			mainWindow.loadFile(`${app.getAppPath()}/public/index.html`);
			if (process.env.NODE_ENV === 'dev') {
				mainWindow.webContents.openDevTools();
			}

			// mainWindow.on('closed', () => {
			// 	mainWindow = null;
			// });
		}
	}, 500);
}

app.on('ready', async () => {
	if (process.platform === 'darwin') {
		app.dock.setIcon(nativeImage.createFromPath(`${app.getAppPath()}/public/image/stock_64.png`));
	}
	process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
	createWindow();
});

app.on('window-all-closed', () => {
	app.quit();
});
app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (!mainWindow) createWindow();
});

ipcMain.on('minimize', () => {
	const win = BrowserWindow.getFocusedWindow();
	win.minimize();
});
ipcMain.on('maximize', () => {
	const win = BrowserWindow.getFocusedWindow();
	win.setFullScreen(!win.isFullScreen());
});
ipcMain.on('close', () => {
	mainWindow.removeAllListeners('close');
	mainWindow.close();
});

ipcMain.handle('initStockCode', async () => {
	const stockCodeList = await twStockCrawler.getStockCode().catch((error) => {
		throw error;
	});
	return stockCodeList;
});

ipcMain.handle('initStockInfo', async (event, { code, days }) => {
	const stockInfoList = await twStockCrawler.getStockInfo(code, days).catch((error) => {
		throw error;
	});
	return stockInfoList;
});
