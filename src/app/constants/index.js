export const DB = 'db';
export const DB_STOCK_CODE = 'code';
export const DB_STOCK_INFO = 'info';
export const IPC_INIT_STOCK_CODE = 'initStockCode';
export const IPC_INIT_STOCK_INFO = 'initStockInfo';
export const RISE_DROP = 'RISE_DROP';
export const MAX_MIN = 'MAX_MIN';
export const LONG_SHORT = 'LONG_SHORT';
export const BREAK_DROP = 'BREAK_DROP';
export const TOP_BOTTOM = 'TOP_BOTTOM';
export const UP_DOWN = 'UP_DOWN';
export const INCREASE_DECREASE = 'INCREASE_DECREASE';
export const FOREIGN = 'FOREIGN';
export const SITES = 'SITES';
export const DEALER = 'DEALER';
export const MAJOR = 'MAJOR';
export const DAYS = [3, 5, 10, 20, 60, 120, 240];
export const priceVolTabs = [
	{ text: '價格', value: 'price' },
	{ text: '成交量', value: 'vol' },
	{ text: '漲跌', value: 'riseDrop' },
	{ text: '價量關係', value: 'priceVol' },
];
export const strategyTabs = [
	{ text: '均線', value: 'ma' },
	{ text: '布林', value: 'boolean' },
	{ text: 'MACD', value: 'macd' },
	{ text: 'KD', value: 'kd' },
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
export const filterBuySellTabs = {
	buy: '轉買',
	sell: '轉賣',
};
