const { app } = require('electron');
const Datastore = require('nedb-promises');

const dbFactory = (fileName) =>
	Datastore.create({
		filename: `${process.env.NODE_ENV === 'dev' ? '.' : app.getAppPath('userData')}/db/tables/${fileName}`,
		timestampData: true,
		autoload: true,
	});

module.exports = dbFactory;
