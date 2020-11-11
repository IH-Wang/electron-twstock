const dbFactory = require('./dbFactory');

class StockCodeStore {
	constructor() {
		this.db = dbFactory('stockCodes.db');
	}
	async create(data) {
		return await this.db.insert(data);
	}
	async getAll() {
		return await this.db.find();
	}
	async read(_id) {
		return await this.db.findOne({ _id }).exec();
	}
}
module.exports = new StockCodeStore();
