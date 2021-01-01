const path = require('path');
const builder = require('electron-builder');

builder
	.build({
		projectDir: path.resolve(__dirname),

		win: ['nsis', 'portable'], // nsis . portable
		config: {
			appId: 'com.electron.twstock',
			productName: '股溝',
			copyright: `Copyright © 2020 YHW`,
			directories: {
				output: 'release/win',
			},
			win: {
				icon: './public/image/stock_256.png',
			},
			portable: {
				artifactName: '股溝_alpha_0.1.1.exe',
			},
			files: ['public/**/*', 'main.js', 'preload.js'],
			// asar: true,
		},
	})
	.then(
		(data) => console.log(data),
		(err) => console.error(err),
	);
