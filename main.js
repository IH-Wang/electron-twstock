'use strict';
const { app, BrowserWindow, Menu, screen, ipcMain } = require('electron');
const HCCrawler = require('headless-chrome-crawler');
const path = require('path');
require('electron-reload')(__dirname);
const db = require('./db/db');
global.db = db;
// 上市
const TWSE_URL = 'https://isin.twse.com.tw/isin/C_public.jsp?strMode=2';
// 上櫃
const OTC_URL = 'https://isin.twse.com.tw/isin/C_public.jsp?strMode=4';
// 興櫃
const EMERGING_URL = 'https://isin.twse.com.tw/isin/C_public.jsp?strMode=5';

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
	if (R.isEmpty(stockCodes)) {
		const [twseRes, otcRes, emergingRes] = await Promise.all([
			await crawlStockCodeList(TWSE_URL),
			await crawlStockCodeList(OTC_URL),
			await crawlStockCodeList(EMERGING_URL),
		]);
		const stockList = [...twseRes, ...otcRes, ...emergingRes];
		await db.stockCodes.create(stockList.filter((stock) => stock.name.indexOf('　') === -1));
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

const crawlStockCodeList = async (url) => {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {
		const crawler = await HCCrawler.launch({
			evaluatePage: () => {
				const stockCodeList = [];
				// eslint-disable-next-line no-undef
				const list = $('tbody tr');
				const trimDom = (dom, index) => dom.eq(index).text().trim();
				list.map((index) => {
					const childList = list.eq(index).find('td');
					const isStockCodeRow = childList.length === 7;
					if (isStockCodeRow) {
						// 從第一個td去將股票代碼跟股票名稱分開
						const stockInfo = trimDom(childList, 0)
							.split(/(\d+)/)
							.filter((key) => key);
						if (stockInfo[0].length === 4) {
							stockCodeList.push({
								code: stockInfo[0],
								name: stockInfo[1].trim(),
								marketType: trimDom(childList, 3),
								category: trimDom(childList, 4),
							});
						}
					}
				});

				return stockCodeList;
			},
			onSuccess: (response) => {
				resolve(response.result);
			},
			onError: (error) => {
				console.log(error);
				reject([]);
			},
		});
		await crawler.queue(url);
		await crawler.onIdle();
		await crawler.close();
	});
};
