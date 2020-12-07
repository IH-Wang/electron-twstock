const stockCrawler = require('./crawler');

// 上市
const TWSE_URL = 'https://isin.twse.com.tw/isin/C_public.jsp?strMode=2';
// 上櫃
const OTC_URL = 'https://isin.twse.com.tw/isin/C_public.jsp?strMode=4';
// 興櫃
// const EMERGING_URL = 'https://isin.twse.com.tw/isin/C_public.jsp?strMode=5';

const evaluate = ($) => {
	// console.log($.text());
	const stockCodeList = [];
	// eslint-disable-next-line no-undef
	const list = $('tbody tr');
	const trimDom = (dom, index) => dom.eq(index).text().trim();
	list.map((index) => {
		const childList = list.eq(index).find('td');
		const isStockCodeRow = childList.length === 7;
		if (isStockCodeRow) {
			// 從第一個td去將股票代碼跟股票名稱分開
			const stockInfo = trimDom(childList, 0)
				.split(/(\d+)/)
				.filter((key) => key);
			if (stockInfo[0].length === 4) {
				stockCodeList.push({
					code: stockInfo[0],
					name: stockInfo[1].trim(),
					marketType: trimDom(childList, 3),
					category: trimDom(childList, 4),
				});
			}
		}
	});

	return stockCodeList;
};

const getStockCodes = async () => {
	const [twseRes, otcRes] = await Promise.all([
		await stockCrawler(TWSE_URL, evaluate),
		await stockCrawler(OTC_URL, evaluate),
		// await stockCrawler(EMERGING_URL, evaluate),
	]);
	const stockList = [...twseRes, ...otcRes];
	return stockList.filter((stock) => stock.name.indexOf('　') === -1);
};
module.exports = getStockCodes;
