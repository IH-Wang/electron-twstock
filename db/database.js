const { createRxDatabase, addRxPlugin } = require('rxdb');
addRxPlugin(require('pouchdb-adapter-indexeddb'));

const { stockCodeSchema } = require('./schema');

let _getDatabase; // cached
const getDatabase = async () => {
	if (!_getDatabase) _getDatabase = await createDatabase();
	return _getDatabase;
};

const createDatabase = async () => {
	const db = await createRxDatabase({
		name: `stock`,
		adapter: 'indexeddb',
	});

	console.log('creating stock-collection..');
	await createCollection(db, stockCodeSchema.title, stockCodeSchema);

	return db;
};

const createCollection = async (db, name, schema) => {
	await db.collection({
		name,
		schema,
	});
};

module.exports = {
	getDatabase,
};
