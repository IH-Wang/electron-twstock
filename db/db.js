const stockCodeStore = require('./stores/stockCodeStore');

const db = {
	stockCodes: stockCodeStore,
};
module.exports = db;
