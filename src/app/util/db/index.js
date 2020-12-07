import { openDB } from 'idb';

class DbUtil {
	static async initDB() {
		const dbPromise = await openDB('stock', 1, {
			upgrade(db) {
				db.createObjectStore('code', { keyPath: 'code' });
				db.createObjectStore('info', { keyPath: 'code' });
			},
		});
		return dbPromise;
	}
	static async getItem(db, { store, code }) {
		return await db.get(store, code);
	}
	static async setItem(db, { store, code, data }) {
		return await db.put(store, data, code);
	}
	static async deleteItem(db, { store, code }) {
		return await db.delete(store, code);
	}
	static async getAllKeys(db, store) {
		return await db.getAllKeys(store);
	}
	static async getAllItems(db, store) {
		return await db.getAll(store);
	}
	static async getTotalCounts(db, store) {
		return await db.count(store);
	}
	static async clearStore(db, store) {
		return await db.clear(store);
	}
	static async storeBatchData(db, { store, data }) {
		const tx = db.transaction(store, 'readwrite');
		const asyncList = data.map((item) => {
			return tx.store.add(item);
		});
		tx.onabort = (event) => {
			const error = event.target.error; // DOMException
			if (error.name == 'QuotaExceededError') {
				// Fallback code goes here
				db.clear(store);
				throw error;
			}
		};
		return await Promise.all([...asyncList, tx.done]);
	}
	static async clearBatchData(db, { store, data }) {
		const tx = db.transaction(store, 'readwrite');
		const asyncList = data.map((item) => {
			return tx.store.delete(item);
		});
		tx.onabort = (event) => {
			const error = event.target.error; // DOMException
			if (error.name == 'QuotaExceededError') {
				// Fallback code goes here
				db.clear(store);
				throw error;
			}
		};
		return await Promise.all([...asyncList, tx.done]);
	}
}

export default DbUtil;
