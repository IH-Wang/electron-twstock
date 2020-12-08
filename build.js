const path = require('path');
const builder = require('electron-builder');

builder
	.build({
		projectDir: path.resolve(__dirname),

		win: ['nsis', 'portable'], // nsis . portable
		config: {
			appId: 'com.electron.twstock',
			productName: '股溝',
			directories: {
				output: 'build/win',
			},
			win: {
				icon: './public/image/stock_256.png',
			},
			portable: {
				artifactName: 'twstock.exe',
			},
			files: ['public/**/*', 'main.js', 'preload.js'],
			// asar: false,
		},
	})
	.then(
		(data) => console.log(data),
		(err) => console.error(err),
	);
