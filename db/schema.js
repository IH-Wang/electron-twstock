const stockCodeSchema = {
	title: 'stockcode',
	description: 'describes a stockCode',
	version: 0,
	type: 'object',
	properties: {
		code: {
			type: 'string',
			primary: true,
		},
		name: {
			type: 'string',
		},
		marketType: { type: 'string' },
		category: { type: 'string' },
	},
	required: ['name'],
};

module.exports = {
	stockCodeSchema,
};
