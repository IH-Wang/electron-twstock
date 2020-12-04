import * as ramda from 'ramda';
import { numRound } from '../math';
export const DAYS = [3, 5, 10, 20, 60, 120];
const movingAverage = (data, days) => {
	const movingList = data.slice(days * -1);
	return numRound(ramda.mean(movingList), 2);
};

const getNDayAgoStock = (list, days) => {
	const nDayAgo = days * -1;
	return days === 1 ? list.slice(nDayAgo)[0] : list.slice(nDayAgo, nDayAgo + 1)[0];
};

// 取得連買日數(負數為連賣)
const getStockContinuousBuySell = (list) => {
	let count = 0;
	for (let i = 1; i <= list.length; i++) {
		const calcBuySell = getNDayAgoStock(list, i);
		if (calcBuySell === 0) {
			return count;
		} else {
			if (calcBuySell > 0 && getNDayAgoStock(list, 1) > 0) {
				count += 1;
			} else if (calcBuySell < 0 && getNDayAgoStock(list, 1) < 0) {
				count -= 1;
			} else {
				return count;
			}
		}
	}
};

const getTurningPoint = (list) => {
	const buySell = getNDayAgoStock(list, 1);
	const preBuySell = getNDayAgoStock(list, 2);
	if ((buySell > 0 && preBuySell > 0) || (buySell === 0 && preBuySell === 0) || (buySell < 0 && preBuySell < 0)) {
		return null;
	}
	let count = 0;
	for (let i = 2; i <= list.length; i++) {
		if (preBuySell > 0) {
			if (getNDayAgoStock(list, i) > 0) {
				count += 1;
			} else {
				return { type: 'BUY', count };
			}
		} else if (preBuySell === 0) {
			if (getNDayAgoStock(list, i) === 0) {
				count += 1;
			} else {
				return { type: 'NOTHING', count };
			}
		} else {
			if (getNDayAgoStock(list, i) < 0) {
				count += 1;
			} else {
				return { type: 'SELL', count };
			}
		}
	}
};
class StockUtil {
	// 取得 price 相關資訊
	static getPriceInfo(stockInfo, stockList) {
		const { startPrice, endPrice, maxPrice, minPrice } = stockInfo;
		const { endPrice: refPrice } = getNDayAgoStock(stockList, 2);
		const endPriceList = stockList.map((stock) => stock.endPrice);
		const maxPriceList = stockList.map((stock) => stock.maxPrice);
		const minPriceList = stockList.map((stock) => stock.minPrice);
		const priceAmplitude = numRound(((maxPrice - minPrice) / refPrice) * 100, 2);
		const riskMA = DAYS.map((day) => numRound(((endPrice - movingAverage(endPriceList, day)) / endPrice) * 100, 2));
		const priceMA = DAYS.map((day) => movingAverage(endPriceList, day));
		const maxMA = DAYS.map((day) => Math.max(...maxPriceList.slice(-day)));
		const minMA = DAYS.map((day) => Math.min(...minPriceList.slice(-day)));
		// 判斷均線糾結
		const isTangled5MA = riskMA[DAYS.indexOf(5)] >= -2 && riskMA[DAYS.indexOf(5)] <= 3;
		const isTangled10MA = riskMA[DAYS.indexOf(10)] >= -2 && riskMA[DAYS.indexOf(10)] <= 3;
		const isTangled20MA = riskMA[DAYS.indexOf(20)] >= -2 && riskMA[DAYS.indexOf(20)] <= 3;
		// 判斷多頭排列
		const isLongOrder =
			priceMA[DAYS.indexOf(5)] > priceMA[DAYS.indexOf(10)] &&
			priceMA[DAYS.indexOf(10)] > priceMA[DAYS.indexOf(20)] &&
			priceMA[DAYS.indexOf(20)] > priceMA[DAYS.indexOf(60)];
		// 判斷空頭排列
		const isShortOrder =
			priceMA[DAYS.indexOf(5)] < priceMA[DAYS.indexOf(10)] &&
			priceMA[DAYS.indexOf(10)] < priceMA[DAYS.indexOf(20)] &&
			priceMA[DAYS.indexOf(20)] < priceMA[DAYS.indexOf(60)];
		return {
			refPrice,
			startPrice,
			endPrice,
			maxPrice,
			minPrice,
			riseDropPrice: numRound(endPrice - refPrice, 2),
			riseDropMargin: numRound(((endPrice - refPrice) / refPrice) * 100, 2),
			priceAmplitude,
			riseDropDays: {
				price: DAYS.map((day) => numRound(endPrice - getNDayAgoStock(endPriceList, day), 2)),
				margin: DAYS.map((day) =>
					numRound(
						((endPrice - getNDayAgoStock(endPriceList, day)) / getNDayAgoStock(endPriceList, day)) * 100,
						2,
					),
				),
			},
			riskMA,
			priceMA,
			maxMA,
			minMA,
			isTangledMA: isTangled5MA && isTangled10MA && isTangled20MA,
			isLongOrder,
			isShortOrder,
		};
	}

	// 取得量能相關資訊
	static getVolInfo(stockInfo, stockList) {
		const { vol } = stockInfo;
		const { vol: preVol } = getNDayAgoStock(stockList, 2);
		const volList = stockList.map((stock) => stock.vol);
		return {
			vol,
			preVol,
			volRatio: numRound(vol / preVol, 2),
			volDays: DAYS.map((day) => numRound(movingAverage(volList, day), 0)),
			volDaysRatio: DAYS.map((day) => numRound(vol / movingAverage(volList, day), 2)),
		};
	}

	/*
    #抓取旗型型態(以抓取前三日~前十日內有一表態紅K漲幅大於5%且當日交易量大於5日均量為對象)
    #強勢=>近日收盤未跌破表態紅K收盤價
    #中等=>近日收盤未跌破表態紅K收盤價與開盤價二分之一
    #弱勢=>近日收盤未跌破表態紅K開盤價
  */
	static getStockFlagType(stockInfo, stockList) {
		const { endPrice: price, vol } = stockInfo;
		const endPriceList = stockList.map((stock) => stock.endPrice);
		const startPriceList = stockList.map((stock) => stock.startPrice);
		const volList = stockList.map((stock) => stock.vol);
		let isDrop5MA = false;
		let isFlagEnd = false;
		let flagLevel = 99;
		let flagVolRatio = 0;
		// 隔日開平盤的5MA(假定)
		const priceNext5MA = numRound(
			(movingAverage(endPriceList, 5) * 5 - getNDayAgoStock(endPriceList, 5) + price) / 5,
			2,
		);
		for (let i = 3; i <= 10; i++) {
			// 前N日之收盤價
			const calcPrice = getNDayAgoStock(endPriceList, i);
			// 前N日之前日收盤價
			const calcPrePrice = getNDayAgoStock(endPriceList, i + 1);
			// 前N日之漲跌幅
			const calcRiseDropMargin = numRound((calcPrice - calcPrePrice) / calcPrePrice, 4);
			// 前N日之成交量
			const calcVol = getNDayAgoStock(volList, i);
			// 5日均量
			const calcVol5MA = numRound(movingAverage(volList.slice(-i), 5), 2);
			// 5MA
			const calcPrice5MA = numRound(movingAverage(endPriceList.slice(-i), 5), 2);
			// 跌破過五日線
			isDrop5MA = calcPrice < calcPrice5MA;
			/*
        表態紅K條件:
        #1.漲跌幅大於5%
        #2.成交量大於五日均量
        #3.收盤價大於5MA 4%以上
       */
			if (calcRiseDropMargin > 0.05 && calcVol > calcVol5MA && calcPrice >= calcPrice5MA * 1.04) {
				// 前N日之開盤價
				const calcStartPrice = getNDayAgoStock(startPriceList, i);
				const calcHalfPrice = (calcPrice + calcStartPrice) / 2;
				let compareFlagLevel = 0;
				for (let j = i - 1; j >= 1; j--) {
					// 表態紅K後收盤價
					const calcTempPrice = getNDayAgoStock(endPriceList, j);
					// 表態紅K後漲超過3%排除旗型
					if (calcTempPrice >= calcPrice * 1.05) {
						compareFlagLevel = 0;
					} else if (calcTempPrice >= calcPrice) {
						// 強勢
						compareFlagLevel = 3;
					} else if (calcTempPrice >= calcHalfPrice) {
						// 中等
						compareFlagLevel = 2;
					} else if (calcTempPrice >= calcStartPrice) {
						// 弱勢
						compareFlagLevel = 1;
					} else {
						compareFlagLevel = 0;
					}
					if (compareFlagLevel < flagLevel) {
						flagLevel = compareFlagLevel;
					}
				}
			}
			// 判斷是否為旗型末端
			if (flagLevel > 0 && flagLevel < 99 && !isDrop5MA) {
				// 當日收盤仍需在五日線上
				if (priceNext5MA * 1.015 > price && price >= numRound(movingAverage(endPriceList, 5), 2)) {
					isFlagEnd = true;
				}
				flagVolRatio = vol / calcVol;
			}
		}
		return {
			isFlagEnd,
			flagLevel,
			flagVolRatio,
		};
	}

	// 破切型態=>準備反轉(逆轉紅K隔日底部三分之一進場)
	static getStockReverseType(stockInfo, stockList) {
		const reverseInfo = {
			isReverse: false,
			reverseType: '',
		};
		const { maxPrice, startPrice, endPrice, vol } = stockInfo;
		const { maxPrice: preMaxPrice, endPrice: preEndPrice } = getNDayAgoStock(stockList, 2);
		const volList = stockList.map((stock) => stock.vol);
		const priceList = stockList.map((stock) => stock.endPrice);
		const maxPriceList = stockList.map((stock) => stock.maxPrice);
		const vol10MA = numRound(movingAverage(volList, 10), 2);
		const price5MA = numRound(movingAverage(priceList, 5), 2);
		const price10MA = numRound(movingAverage(priceList, 10), 2);
		const price20MA = numRound(movingAverage(priceList, 20), 2);
		// 最高價至前一日跌幅需超過5%才算
		if ((maxPrice - preMaxPrice) / maxPrice < 0.05) {
			return reverseInfo;
		}
		//當日漲幅需超過2.5%才算
		if (getNDayAgoStock(priceList, 2) * 1.025 > endPrice) {
			return reverseInfo;
		}
		// 至少要是紅K且高於前一日收盤才算
		if (endPrice < startPrice || endPrice < preEndPrice) {
			return reverseInfo;
		}
		// 成交量需大於十日均量才算
		if (vol < vol10MA) {
			return reverseInfo;
		}
		// 需站上5/10/20日均線才算
		if (endPrice < price5MA || (endPrice < price10MA) | (endPrice < price20MA)) {
			return reverseInfo;
		}
		// 抓取下降趨勢最高點
		let maxPriceBase = 0;
		let calcMaxPrice = 0;
		for (let i = 2; i <= maxPriceList.length; i++) {
			const compareMaxPrice = getNDayAgoStock(maxPriceList, i);
			// 先預設前一日為最高
			if (i === 2) {
				calcMaxPrice = compareMaxPrice;
				maxPriceBase = i;
			} else if (compareMaxPrice > calcMaxPrice) {
				// 遇到新的最高價時，需高於原有最高價的3%以上(五日內不限制此規則)，避免盤整線形
				if (maxPriceBase + i <= 5 || compareMaxPrice > maxPrice * 1.03) {
					calcMaxPrice = compareMaxPrice;
					maxPriceBase = i;
				}
			}
		}
		// 下降趨勢起始點須為20日前
		if (maxPriceBase < 20) {
			return reverseInfo;
		}
		// 抓取下降趨勢基準點，斜率越小代表線越平
		let dropTrendMaxBase = 0;
		let dropTrendMaxSlope = 0;
		for (let i = maxPriceBase - 1; i > 1; i--) {
			// 計算斜率:(y2-y1)/(x2-x1)
			const dropTrendSlope = (getNDayAgoStock(maxPriceList, i) - calcMaxPrice) / (maxPriceBase - i);
			if (i === maxPriceBase - 1) {
				dropTrendMaxSlope = dropTrendSlope;
				dropTrendMaxBase = i;
			} else if (dropTrendSlope > dropTrendMaxSlope) {
				dropTrendMaxSlope = dropTrendSlope;
				dropTrendMaxBase = i;
			}
		}
		// 斜率大於0表示不為下降趨勢
		if (dropTrendMaxSlope > 0) {
			return reverseInfo;
		}
		// 下降趨勢線畫出來後，不能有任一天的最高價超過下降趨勢線
		reverseInfo.isReverse = true;
		let dropTrendPrice = 0;
		for (let i = dropTrendMaxBase - 1; i > 0; i--) {
			dropTrendPrice = (maxPriceBase - i) * dropTrendMaxSlope + calcMaxPrice;
			// 當天要突破下降趨勢線
			if (i === 1) {
				reverseInfo.isReverse = endPrice > dropTrendPrice;
			} else if (getNDayAgoStock(maxPriceList, i) > dropTrendPrice) {
				reverseInfo.isReverse = false;
			}
		}
		if (reverseInfo.isReverse) {
			reverseInfo.reverseType =
				startPrice > preMaxPrice ? '跳空站上' : startPrice > dropTrendPrice ? '底部站上' : '';
		}
		return reverseInfo;
	}

	// 取得外資/投信/自營/主力 買賣資訊
	static getNetBuySellInfo(stockInfo, stockList) {
		const {
			majorNetBuySell,
			foreignNetBuySell,
			foreignHolding,
			sitesNetBuySell,
			sitesHolding,
			dealerNetBuySell,
			dealerHolding,
			bigThreeNetBuySell,
			bigThreeHolding,
			vol,
		} = stockInfo;
		const majorList = stockList.map((stock) => stock.majorNetBuySell);
		const foreignList = stockList.map((stock) => stock.foreignNetBuySell);
		const sitesList = stockList.map((stock) => stock.sitesNetBuySell);
		const dealerList = stockList.map((stock) => stock.dealerNetBuySell);
		const bigThreeList = stockList.map((stock) => stock.bigThreeNetBuySell);
		return {
			major: {
				today: majorNetBuySell,
				remain: null,
				volRatio: numRound((majorNetBuySell / vol) * 100, 2),
				days: getStockContinuousBuySell(majorList),
				total: DAYS.map((day) => ramda.sum(majorList.slice(-day))),
				daysChange: [],
				turnPoint: getTurningPoint(majorList),
			},
			foreign: {
				today: foreignNetBuySell,
				remain: foreignHolding,
				volRatio: numRound((foreignNetBuySell / vol) * 100, 2),
				days: getStockContinuousBuySell(foreignList),
				total: DAYS.map((day) => ramda.sum(foreignList.slice(-day))),
				daysChange: DAYS.map((day) => foreignHolding - getNDayAgoStock(foreignList, day)),
				turnPoint: getTurningPoint(foreignList),
			},
			sites: {
				today: sitesNetBuySell,
				remain: sitesHolding,
				volRatio: numRound((sitesNetBuySell / vol) * 100, 2),
				days: getStockContinuousBuySell(sitesList),
				total: DAYS.map((day) => ramda.sum(sitesList.slice(-day))),
				daysChange: DAYS.map((day) => sitesHolding - getNDayAgoStock(sitesList, day)),
				turnPoint: getTurningPoint(sitesList),
			},
			dealer: {
				today: dealerNetBuySell,
				remain: dealerHolding,
				volRatio: numRound((dealerNetBuySell / vol) * 100, 2),
				days: getStockContinuousBuySell(dealerList),
				total: DAYS.map((day) => ramda.sum(dealerList.slice(-day))),
				daysChange: DAYS.map((day) => dealerHolding - getNDayAgoStock(dealerList, day)),
				turnPoint: getTurningPoint(dealerList),
			},
			bigThree: {
				today: bigThreeNetBuySell,
				remain: bigThreeHolding,
				volRatio: numRound((bigThreeNetBuySell / vol) * 100, 2),
				days: getStockContinuousBuySell(bigThreeList),
				total: DAYS.map((day) => ramda.sum(bigThreeList.slice(-day))),
				daysChange: DAYS.map((day) => bigThreeHolding - getNDayAgoStock(bigThreeList, day)),
				turnPoint: getTurningPoint(bigThreeList),
			},
		};
	}

	// 融資融券資訊
	static getBSMInfo(stockInfo, stockList) {
		const { marginPurchase, shortSale, marginPurchaseRatio, bsmRatio } = stockInfo;
		const { marginPurchase: preMarginPurchase, shortSale: preShortSale } = getNDayAgoStock(stockList, 2);
		const marginPurchaseList = stockList.map((stock) => stock.marginPurchase);
		const shortSaleList = stockList.map((stock) => stock.shortSale);
		return {
			marginPurchase: {
				remain: marginPurchase,
				change: marginPurchase - preMarginPurchase,
				daysChange: DAYS.map((day) => marginPurchase - getNDayAgoStock(marginPurchaseList, day)),
			},
			shortSale: {
				remain: shortSale,
				change: shortSale - preShortSale,
				daysChange: DAYS.map((day) => shortSale - getNDayAgoStock(shortSaleList, day)),
			},
			marginPurchaseRatio,
			bsmRatio,
		};
	}

	// 取得布林通道資訊
	static getBooleanInfo(stockList) {
		const endPriceList = stockList.map((stock) => stock.endPrice);
		const price20MAList = stockList
			.slice(-20)
			.map((price, index) =>
				numRound(movingAverage(endPriceList.slice(0, index === 19 ? undefined : -19 + index), 20), 2),
			);

		let total = 0;
		let preTotal = 0;
		let sigma = 0;
		let preSigma = 0;
		const price20MA = getNDayAgoStock(price20MAList, 1);
		const prePrice20MA = getNDayAgoStock(price20MAList, 2);
		for (let i = 1; i < 21; i++) {
			total += Math.pow(price20MA - getNDayAgoStock(endPriceList, i), 2);
		}
		for (let i = 2; i < 22; i++) {
			preTotal += Math.pow(prePrice20MA - getNDayAgoStock(endPriceList, i), 2);
		}

		sigma = Math.sqrt(total / 20);
		preSigma = Math.sqrt(preTotal / 20);
		const booleanTop = numRound(price20MA + sigma * 2, 2);
		const preBooleanTop = numRound(prePrice20MA + preSigma * 2, 2);
		const booleanBottom = numRound(price20MA - sigma * 2, 2);
		const preBooleanBottom = numRound(prePrice20MA - preSigma * 2, 2);
		const price = getNDayAgoStock(endPriceList, 1);
		const prePrice = getNDayAgoStock(endPriceList, 2);
		// 回傳資料為 [今天,前一天]
		return {
			top: [booleanTop, preBooleanTop],
			bottom: [booleanBottom, preBooleanBottom],
			compressionRatio: numRound(((booleanTop - booleanBottom) / price20MA) * 100, 2),
			isStandOnTop: prePrice < preBooleanTop && price >= booleanTop,
			isBreakBelowBottom: prePrice > preBooleanBottom && price <= booleanBottom,
		};
	}
}

export default StockUtil;