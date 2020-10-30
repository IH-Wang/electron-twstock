'use strict';
const { app, BrowserWindow, Menu, screen } = require('electron');
// const { join } = require('path');
require('electron-reload')(__dirname);

function createWindow() {
	// Create the browser window.
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	console.log(width, height);
	Menu.setApplicationMenu(false);
	const mainWindow = new BrowserWindow({
		width: width / 1.1,
		height: height / 1.1,
		webPreferences: {
			nodeIntegration: true,
		},
		frame: true, // 標題列不顯示
		transparent: false, // 背景透明
		autoHideMenuBar: true, //  工具列不顯示
	});
	mainWindow.on('minimize', (e) => {
		e.preventDefault();
		mainWindow.hide();
	});

	mainWindow.on('close', (e) => {
		e.preventDefault();
		mainWindow.hide();
	});

	mainWindow.loadFile('public/index.html');
	mainWindow.webContents.openDevTools();
}

app.on('ready', () => {
	createWindow();
});

app.on('window-all-closed', () => {
	app.quit();
});
