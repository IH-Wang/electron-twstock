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
	async remove(code, option) {
		return await this.db.remove({ code }, option);
	}
}
module.exports = new StockCodeStore();
