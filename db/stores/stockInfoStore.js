const dbFactory = require('./dbFactory');

class StockInfoStore {
	constructor() {
		this.db = dbFactory('stockInfos.db');
	}
	async create(data) {
		return await this.db.insert(data);
	}
	async get(code) {
		return await this.db.findOne({ code }).exec();
	}
	async getAll() {
		return await this.db.find();
	}
	async update(code, data) {
		return await this.db.update({ code }, { $pop: { list: -1 }, $push: { list: data } }, {});
	}
	async remove(code) {
		return await this.db.remove({ code }, {});
	}
	async removeAll() {
		this.db.remove({}, { multi: true });
	}
}
module.exports = new StockInfoStore();
