'use strict';
const { app, BrowserWindow, Menu, screen, ipcMain, nativeImage } = require('electron');
const path = require('path');
const R = require('ramda');
const fs = require('fs');
require('electron-reload')(__dirname);
const db = require('./db/db');
const twStockCrawler = require('./public/util/crawler');
global.db = db;

let mainWindow;
function createWindow() {
	const timer = setInterval(() => {
		if (fs.existsSync('./public/build/bundle.js')) {
			clearInterval(timer);

			// Create the browser window.
			const { width, height } = screen.getPrimaryDisplay().workAreaSize;
			Menu.setApplicationMenu(false);
			mainWindow = new BrowserWindow({
				width: width / 1.1,
				height: height / 1.1,
				title: '股溝',
				icon: `${__dirname}/public/image/icon/stock.${process.platform !== 'darwin' ? 'ico' : 'icns'}`,
				webPreferences: {
					nodeIntegration: true,
					enableRemoteModule: true,
					preload: path.join(__dirname, 'preload.js'),
				},
				frame: false, // 標題列顯示
				transparent: false, // 背景透明
				autoHideMenuBar: true, //  工具列不顯示
			});

			mainWindow.on('minimize', (e) => {
				e.preventDefault();
				mainWindow.minimize();
			});

			mainWindow.on('close', (e) => {
				e.preventDefault();
				mainWindow.hide();
			});

			mainWindow.loadFile('public/index.html');
			if (process.env.NODE_ENV === 'dev') {
				mainWindow.webContents.openDevTools();
			}

			mainWindow.on('closed', () => {
				mainWindow = null;
			});
		}
	}, 500);
}
app.on('ready', async () => {
	app.setName('股溝');
	if (process.platform === 'darwin') {
		app.dock.setIcon(nativeImage.createFromPath(`${app.getAppPath()}/public/image/stock_64.png`));
	}
	process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
	createWindow();
	const stockCodes = await db.stockCodes.getAll();
	if (R.isEmpty(stockCodes)) {
		const stockList = await twStockCrawler.getStockCode();
		await db.stockCodes.create(stockList);
	}
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
	const win = BrowserWindow.getFocusedWindow();
	win.close();
});

ipcMain.handle('initStockInfo', async (event, { code, days }) => {
	const stockInfoList = await twStockCrawler.getStockInfo(code, days);
	return stockInfoList;
});
