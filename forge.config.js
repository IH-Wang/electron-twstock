module.exports = {
	make_targets: {
		win32: ['squirrel'], // An array of win32 make targets
		darwin: ['zip', 'dmg'], // An array of darwin make targets
		linux: ['deb', 'rpm', 'flatpak', 'snap'], // An array of linux make targets
	},
	packagerConfig: {
		icon: 'public/image/icon/stock.icns',
	},
	electronRebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				name: 'twstock',
			},
		},
		{
			name: '@electron-forge/maker-zip',
			platforms: ['darwin'],
		},
	],
	publishers: [],
	plugins: [],
	hooks: {},
	buildIdentifier: 'electron-twstock',
};
