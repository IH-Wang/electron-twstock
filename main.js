'use strict';
const { app, BrowserWindow, Menu, screen, ipcMain } = require('electron');
const path = require('path');
require('electron-reload')(__dirname);
const db = require('./db/db');
const twStockCrawler = require('./public/static/js/twStockCrawler.min');
global.db = db;

let mainWindow;
function createWindow() {
	// Create the browser window.
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	Menu.setApplicationMenu(false);
	mainWindow = new BrowserWindow({
		width: width / 1.1,
		height: height / 1.1,
		icon: `${__dirname}/public/image/icon/stock.${process.platform !== 'darwin' ? 'ico' : 'ico'}`,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			preload: path.join(__dirname, 'preload.js'),
		},
		frame: false, // 標題列顯示
		transparent: false, // 背景透明
		autoHideMenuBar: true, //  工具列不顯示
	});

	mainWindow.title = '股溝';
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

app.on('ready', async () => {
	app.setName('股溝');
	process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
	const R = require('ramda');

	createWindow();
	const stockCodes = await db.stockCodes.getAll();
	const stockInfos = await db.stockInfos.getAll();
	console.log(stockInfos);
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

ipcMain.handle('getStockCode', async () => {
	return await db.stockCodes.getAll();
});

ipcMain.handle('initStockInfo', async (event, { code, days }) => {
	const stockInfoList = await twStockCrawler.getStockInfo(code, days);
	return stockInfoList;
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
