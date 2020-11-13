const stockCodeStore = require('./stores/stockCodeStore');
const stockInfoStore = require('./stores/stockInfoStore');

const db = {
	stockCodes: stockCodeStore,
	stockInfos: stockInfoStore,
};
module.exports = db;
