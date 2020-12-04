'use strict';
const { app, BrowserWindow, Menu, screen, ipcMain, nativeImage } = require('electron');
const path = require('path');
const R = require('ramda');
const fs = require('fs');
const { format, differenceInDays } = require('date-fns');

require('electron-reload')(`${app.getAppPath()}/public/build/`);
const db = require('../db/db');
const twStockCrawler = require('../public/util/crawler');
global.db = db;

let mainWindow;
function createWindow() {
	const timer = setInterval(() => {
		if (fs.existsSync(`${app.getAppPath()}/public/build/bundle.js`)) {
			clearInterval(timer);

			// Create the browser window.
			const { width, height } = screen.getPrimaryDisplay().workAreaSize;
			Menu.setApplicationMenu(false);
			mainWindow = new BrowserWindow({
				width: width / 1.05,
				height: height / 1.05,
				title: '股溝',
				icon: `${app.getAppPath()}/public/image/icon/stock.${process.platform !== 'darwin' ? 'ico' : 'icns'}`,
				webPreferences: {
					nodeIntegration: true,
					enableRemoteModule: true,
					preload: path.join(app.getAppPath(), 'src/preload.js'),
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

			mainWindow.loadFile(`${app.getAppPath()}/public/index.html`);
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
	await initialStockCode();
	await checkStockInfoList();
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
	const win = BrowserWindow.getFocusedWindow();
	win.close();
});

ipcMain.handle('initStockInfo', async (event, { code, days }) => {
	const stockInfoList = await twStockCrawler.getStockInfo(code, days).catch((error) => {
		throw error;
	});
	return stockInfoList;
});

async function initialStockCode() {
	const stockCodes = await db.stockCodes.getAll();
	if (R.isEmpty(stockCodes)) {
		const stockList = await twStockCrawler.getStockCode();
		await db.stockCodes.create(stockList);
	}
}

async function checkStockInfoList() {
	const stockInfoList = await db.stockInfos.getAll();
	const checkDate = stockInfoList.length > 0 && stockInfoList[0].date;
	const checkTime = format(new Date(), 'yyyy/MM/dd');
	// const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;
	const checkDiffDays = differenceInDays(new Date(checkTime), new Date(checkDate));
	// 開啟時間超過當天晚上六點半且 db table 資料日期不是當天的, 就抓取當天的
	if (
		checkDiffDays > 1 ||
		(new Date().valueOf() > new Date(`${checkTime} 18:30:00`).valueOf() && checkDiffDays === 1)
	) {
		const newStockInfoList = await twStockCrawler.getStockInfo(2330, 1);
		if (newStockInfoList[0].date !== checkDate) {
			fs.writeFileSync(`${app.getAppPath()}/db/tables/stockInfos.db`, '');
		}
	}
}
