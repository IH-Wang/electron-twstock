export const DB = 'db';
export const DB_STOCK_CODE = 'code';
export const DB_STOCK_INFO = 'info';
export const IPC_INIT_STOCK_CODE = 'initStockCode';
export const IPC_INIT_STOCK_INFO = 'initStockInfo';
export const PRICE = 'PRICE';
export const VOL = 'VOL';
export const RISE_DROP = 'RISE_DROP';
export const PRICE_VOL = 'PRICE_VOL';
export const PRICE_UP_VOL_UP = '價量齊揚';
export const PRICE_UP_VOL_DOWN = '價漲量縮';
export const PRICE_DOWN_VOL_UP = '價跌量增';
export const PRICE_DOWN_VOL_DOWN = '價跌量縮';
export const MOVING_AVERAGE = 'MOVING_AVERAGE';
export const BOOLEAN = 'BOOLEAN';
export const MACD = 'MACD';
export const KD = 'KD';
export const FOREIGN = 'FOREIGN';
export const SITES = 'SITES';
export const DEALER = 'DEALER';
export const MAJOR = 'MAJOR';
export const DAYS = [3, 5, 10, 20, 60, 120, 240];
export const priceVolTabs = [
	{ text: '價格', value: PRICE },
	{ text: '成交量', value: VOL },
	{ text: '漲跌', value: RISE_DROP },
	{ text: '價量關係', value: PRICE_VOL },
];
export const strategyTabs = [
	{ text: '均線', value: MOVING_AVERAGE },
	{ text: '布林', value: BOOLEAN },
	{ text: 'MACD', value: MACD },
	{ text: 'KD', value: KD },
];
export const bargainChipTabs = [
	{ text: '外資', value: FOREIGN },
	{ text: '投信', value: SITES },
	{ text: '自營商', value: DEALER },
	{ text: '大戶', value: MAJOR },
];
export const filterRiseDropTabs = {
	rise: '漲幅',
	drop: '跌幅',
};
export const filterHighLowTabs = {
	high: '新高',
	low: '新低',
};
export const filterLongShortTabs = {
	long: '多頭排列',
	short: '空頭排列',
};
export const filterMABackTestTabs = {
	backTest: '回測',
	fallBelow: '跌破',
};
export const filterMATypeTabs = {
	up: '上彎',
	down: '下彎',
};
export const filterBooleanTabs = {
	top: '站上上軌',
	bottom: '跌破下軌',
};
export const filterKDTabs = {
	up: '黃金交叉',
	down: '死亡交叉',
};
export const filterBuySellTabs = {
	buy: '買超',
	sell: '賣超',
};
export const filterContinuousTabs = {
	buy: '連續買超',
	sell: '連續賣超',
};
export const filterTurnPointTabs = {
	buy: '轉買',
	sell: '轉賣',
};
export const filterEnterExitTabs = {
	enter: '進場',
	exit: '出場',
};
