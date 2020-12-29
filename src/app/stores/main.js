import { writable } from 'svelte/store';
import * as R from 'ramda';
// constants
import {
	DAYS,
	PRICE_UP_VOL_UP,
	PRICE_UP_VOL_DOWN,
	PRICE_DOWN_VOL_UP,
	PRICE_DOWN_VOL_DOWN,
	filterRiseDropTabs,
	filterHighLowTabs,
	filterMABackTestTabs,
	filterMATypeTabs,
	filterLongShortTabs,
	filterBooleanTabs,
	filterKDTabs,
	filterBuySellTabs,
	filterContinuousTabs,
	filterTurnPointTabs,
	filterEnterExitTabs,
} from '../constants';

const mainConfig = {
	marketTypeList: [],
	categoryList: [],
	baseStockInfoList: [],
	stockInfoList: [],
	tags: [],
	checkedPriceHighLowDays: [],
	checkedVolHighLowDays: [],
	checkedRiseDropMarginDays: [],
	checkedMABackTestDays: [],
	checkedMAReverseDays: [],
	checkedForeignBuySellDays: [],
	checkedSitesBuySellDays: [],
	checkedDealerBuySellDays: [],
	checkedMajorBuySellDays: [],
	searchText: '',
	refPrice: null,
	startPrice: null,
	maxPrice: null,
	minPrice: null,
	endPrice: null,
	marketType: '',
	category: -1,
	current: 1,
	totalItems: 0,
	perPage: 10,
	selectedVol: 0,
	fromVol: 0,
	toVol: 0,
	riseDropMarginType: '',
	fromRiseDropMargin: 0,
	toRiseDropMargin: 0,
	priceHighLowType: '',
	volHighLowType: '',
	priceVolType: '',
	maLongShortType: '',
	maBackTestType: '',
	maReverseType: '',
	booleanType: '',
	macdType: '',
	kdType: '',
	foreignType: '',
	foreignContinuousType: '',
	foreignTurnPointType: '',
	foreignInOutType: '',
	sitesType: '',
	sitesContinuousType: '',
	sitesTurnPointType: '',
	sitesInOutType: '',
	dealerType: '',
	dealerContinuousType: '',
	dealerTurnPointType: '',
	dealerInOutType: '',
	majorType: '',
	majorContinuousType: '',
	majorTurnPointType: '',

	isHeavyTrading: false,
	isLimitUp: false,
	isLimitDown: false,
	isTangledMA: false,
	isFlagType: false,
	isReverse: false,
	isAllOrder: false,
	isBooleanCompression: false,
	isBooleanExpand: false,
	isOverbuy: false,
	isOverSell: false,
	isHighPassivation: false,
	isLowPassivation: false,
};

const { subscribe, set, update } = writable(mainConfig);
// 將爬完的股票資訊存到 store
const setBaseStockInfoList = (data) =>
	update((props) => {
		const sortData = data.sort((x, y) => {
			if (x.sortPriority === y.sortPriority) {
				return x.code - y.code;
			}
			return x.sortPriority - y.sortPriority;
		});
		const categoryList = R.uniq(sortData.map((stock) => stock.category));
		const marketTypeList = R.uniq(sortData.map((stock) => stock.marketType));
		return {
			...props,
			baseStockInfoList: sortData,
			stockInfoList: sortData,
			totalItems: data.length,
			categoryList,
			marketTypeList,
		};
	});
// 跳頁
const setPage = (current) =>
	update((props) => {
		return { ...props, current };
	});
// 股號 | 股名篩選
const setSearchText = (searchText) =>
	update((props) => {
		const filterStockList = getFilterData({ ...props, searchText });

		return {
			...props,
			...filterStockList,
		};
	});
// 市場篩選
const changeMarketType = (marketType) =>
	update((props) => {
		const filterStockList = getFilterData({ ...props, marketType });
		return {
			...props,
			...filterStockList,
		};
	});
// 產業篩選
const changeCategory = (category) =>
	update((props) => {
		const filterStockList = getFilterData({ ...props, category });
		return {
			...props,
			...filterStockList,
		};
	});

// checkBox 篩選
const filterByParams = (params) =>
	update((props) => {
		const filterStockList = getFilterData({ ...props, ...params });
		const tags = getFilterTag({ ...props, ...params });
		return { ...props, ...filterStockList, tags };
	});
// 過濾篩選
const filterData = (props, data) => {
	const { searchText, marketType, category } = props;
	let newData = data;

	if (searchText.length > 1) {
		newData = newData.filter((stock) => stock.name.indexOf(searchText) > -1 || stock.code.indexOf(searchText) > -1);
	}
	if (marketType) {
		newData = newData.filter((stock) => stock.marketType === marketType);
	}
	if (category !== -1) {
		newData = newData.filter((stock) => stock.category === category);
	}
	newData = filterByPriceVol(props, newData);
	newData = filterByStrategy(props, newData);
	newData = filterByBuySell(props, newData);
	return newData;
};
// 過濾價量篩選
const filterByPriceVol = (props, data) => {
	const {
		refPrice,
		startPrice,
		maxPrice,
		minPrice,
		endPrice,
		isLimitUp,
		isLimitDown,
		riseDropMarginType,
		checkedRiseDropMarginDays,
		fromRiseDropMargin,
		toRiseDropMargin,
		priceHighLowType,
		priceVolType,
		checkedVolHighLowDays,
		selectedVol,
		fromVol,
		toVol,
		volHighLowType,
		checkedPriceHighLowDays,
		isHeavyTrading,
	} = props;
	let newData = data;
	// 參考價
	if (refPrice > 0) {
		newData = newData.filter((stock) => stock.priceInfo.refPrice === refPrice);
	}
	// 開盤價
	if (startPrice > 0) {
		newData = newData.filter((stock) => stock.priceInfo.startPrice === startPrice);
	}
	// 最高價
	if (maxPrice > 0) {
		newData = newData.filter((stock) => stock.priceInfo.maxPrice === maxPrice);
	}
	// 最高價
	if (maxPrice > 0) {
		newData = newData.filter((stock) => stock.priceInfo.maxPrice === maxPrice);
	}
	//最低價
	if (minPrice > 0) {
		newData = newData.filter((stock) => stock.priceInfo.minPrice === minPrice);
	}
	// 收盤價
	if (endPrice > 0) {
		newData = newData.filter((stock) => stock.priceInfo.endPrice === endPrice);
	}

	// 近日收盤價新高新低
	if (priceHighLowType && !R.isEmpty(checkedPriceHighLowDays)) {
		newData = newData.filter((stock) =>
			priceHighLowType === filterHighLowTabs.high
				? checkedPriceHighLowDays.some((day) => stock.priceInfo.endPrice === stock.priceInfo.maxMA[DAYS.indexOf(day)])
				: checkedPriceHighLowDays.some((day) => stock.priceInfo.endPrice === stock.priceInfo.minMA[DAYS.indexOf(day)]),
		);
	}

	// 成交量範圍查詢
	if (fromVol || toVol) {
		newData = newData.filter((stock) => {
			const vol = selectedVol === 0 ? stock.volInfo.vol : stock.volInfo.volDays[DAYS.indexOf(selectedVol)];
			return (!fromVol || vol >= fromVol) && (!toVol || vol <= toVol);
		});
	}
	// 近日成交量新高新低
	if (volHighLowType && !R.isEmpty(checkedVolHighLowDays)) {
		newData = newData.filter((stock) =>
			volHighLowType === filterHighLowTabs.high
				? checkedVolHighLowDays.some((day) => stock.volInfo.vol === stock.volInfo.maxVolDays[DAYS.indexOf(day)])
				: checkedVolHighLowDays.some((day) => stock.volInfo.vol === stock.volInfo.minVolDays[DAYS.indexOf(day)]),
		);
	}
	// 爆大量
	if (isHeavyTrading) {
		newData = newData.filter((stock) => stock.volInfo.vol > stock.volInfo.volDays[DAYS.indexOf(5)] * 3);
	}
	// 近日漲跌幅
	if (riseDropMarginType && (fromRiseDropMargin || toRiseDropMargin)) {
		if (riseDropMarginType === filterRiseDropTabs.rise) {
			newData = newData.filter((stock) => {
				if (R.isEmpty(checkedRiseDropMarginDays)) {
					return (
						(!fromRiseDropMargin || stock.priceInfo.riseDropMargin >= fromRiseDropMargin) &&
						(!toRiseDropMargin || stock.priceInfo.riseDropMargin <= toRiseDropMargin)
					);
				}
				return checkedRiseDropMarginDays.some(
					(day) =>
						(!fromRiseDropMargin || stock.priceInfo.riseDropDays.margin[DAYS.indexOf(day)] >= fromRiseDropMargin) &&
						(!toRiseDropMargin || stock.priceInfo.riseDropDays.margin[DAYS.indexOf(day)] <= toRiseDropMargin),
				);
			});
		} else {
			newData = newData.filter((stock) => {
				if (R.isEmpty(checkedRiseDropMarginDays)) {
					return (
						(!fromRiseDropMargin || stock.priceInfo.riseDropMargin <= fromRiseDropMargin * -1) &&
						(!toRiseDropMargin || stock.priceInfo.riseDropMargin >= toRiseDropMargin * -1)
					);
				}
				return checkedRiseDropMarginDays.some(
					(day) =>
						(!fromRiseDropMargin || stock.priceInfo.riseDropDays.margin[DAYS.indexOf(day)] <= fromRiseDropMargin * -1) &&
						(!toRiseDropMargin || stock.priceInfo.riseDropDays.margin[DAYS.indexOf(day)] >= toRiseDropMargin * -1),
				);
			});
		}
	}

	// 漲停、跌停
	if (isLimitUp && isLimitDown) {
		newData = newData.filter((stock) => !!stock.priceInfo.isLimitUp || !!stock.priceInfo.isLimitDown);
	} else if (isLimitUp) {
		newData = newData.filter((stock) => !!stock.priceInfo.isLimitUp);
	} else if (isLimitDown) {
		newData = newData.filter((stock) => !!stock.priceInfo.isLimitDown);
	}
	// 價量判斷
	if (priceVolType) {
		switch (priceVolType) {
			case PRICE_UP_VOL_UP:
				newData = newData.filter(
					(stock) => stock.priceInfo.riseDropMargin >= 5 && stock.volInfo.vol > stock.volInfo.volDays[DAYS.indexOf(20)],
				);
				break;
			case PRICE_UP_VOL_DOWN:
				newData = newData.filter(
					(stock) => stock.priceInfo.riseDropDays.margin[DAYS.indexOf(5)] >= 10 && stock.volInfo.vol < stock.volInfo.preVol,
				);
				break;
			case PRICE_DOWN_VOL_UP:
				newData = newData.filter(
					(stock) => stock.priceInfo.riseDropDays.margin[DAYS.indexOf(5)] <= -10 && stock.volInfo.vol > stock.volInfo.preVol,
				);
				break;
			case PRICE_DOWN_VOL_DOWN:
				newData = newData.filter(
					(stock) => stock.priceInfo.riseDropMargin <= -5 && stock.volInfo.vol < stock.volInfo.volDays[DAYS.indexOf(20)],
				);
				break;
			default:
				break;
		}
	}
	return newData;
};
// 過濾技術篩選
const filterByStrategy = (props, data) => {
	const {
		maLongShortType,
		isAllOrder,
		isTangledMA,
		isFlagType,
		isReverse,
		maBackTestType,
		checkedMABackTestDays,
		maReverseType,
		checkedMAReverseDays,
		macdType,
		booleanType,
		isBooleanCompression,
		isBooleanExpand,
		kdType,
		isOverbuy,
		isOverSell,
		isHighPassivation,
		isLowPassivation,
	} = props;
	let newData = data;
	// 均線多、空頭排列
	if (maLongShortType) {
		newData = newData.filter((stock) =>
			maLongShortType === filterLongShortTabs.long ? !!stock.priceInfo.isLongOrder : !!stock.priceInfo.isShortOrder,
		);
		if (isAllOrder) {
			newData = newData.filter((stock) =>
				maLongShortType === filterLongShortTabs.long ? !!stock.priceInfo.isAllLongOrder : !!stock.priceInfo.isAllShortOrder,
			);
		}
	}
	// 均線糾結
	if (isTangledMA) {
		newData = newData.filter((stock) => !!stock.priceInfo.isTangledMA);
	}
	if (isFlagType) {
		newData = newData.filter((stock) => stock.flagInfo.flagVolRatio !== 0);
	}
	// 破切
	if (isReverse) {
		newData = newData.filter((stock) => stock.reverseInfo.isReverse === isReverse);
	}
	// 回測、跌破均線
	if (maBackTestType && !R.isEmpty(checkedMABackTestDays)) {
		newData = newData.filter((stock) =>
			maBackTestType === filterMABackTestTabs.backTest
				? checkedMABackTestDays.some((day) => !!stock.priceInfo.maBackTest.backTest[DAYS.indexOf(day)])
				: checkedMABackTestDays.some((day) => !!stock.priceInfo.maBackTest.fallBelow[DAYS.indexOf(day)]),
		);
	}
	// 均線上、下彎
	if (maReverseType && !R.isEmpty(checkedMAReverseDays)) {
		newData = newData.filter((stock) =>
			maReverseType === filterMATypeTabs.up
				? checkedMAReverseDays.some((day) => !!stock.priceInfo.maReverse.up[DAYS.indexOf(day)])
				: checkedMAReverseDays.some((day) => !!stock.priceInfo.maReverse.down[DAYS.indexOf(day)]),
		);
	}
	// macd
	if (macdType) {
		switch (macdType) {
			case '趨勢向上':
				newData = newData.filter(
					(stock) =>
						!!stock.macdInfo.isIncreaseTrend && stock.priceInfo.priceMA[DAYS.indexOf(5)] > stock.priceInfo.priceMA[DAYS.indexOf(20)],
				);
				break;
			case '趨勢向下':
				newData = newData.filter(
					(stock) =>
						!!stock.macdInfo.isDeceaseTrend && stock.priceInfo.priceMA[DAYS.indexOf(5)] < stock.priceInfo.priceMA[DAYS.indexOf(20)],
				);
				break;
			case '黃金交叉':
				newData = newData.filter(
					(stock) => !!stock.macdInfo.cross.isRed && stock.priceInfo.priceMA[DAYS.indexOf(5)] > stock.priceInfo.priceMA[DAYS.indexOf(20)],
				);
				break;
			case '死亡交叉':
				newData = newData.filter(
					(stock) => !!stock.macdInfo.cross.isGreen && stock.priceInfo.priceMA[DAYS.indexOf(5)] < stock.priceInfo.priceMA[DAYS.indexOf(20)],
				);
				break;
		}
	}
	// 布林上、下軌
	if (booleanType) {
		newData = newData.filter((stock) =>
			booleanType === filterBooleanTabs.top ? !!stock.booleanInfo.isStandOnTop : !!stock.booleanInfo.isBreakBelowBottom,
		);
	}
	// 布林壓縮
	if (isBooleanCompression) {
		newData = newData.filter((stock) => stock.booleanInfo.compressionRatio[0] < 10);
	}
	// 打開布林
	if (isBooleanExpand) {
		newData = newData.filter(
			(stock) =>
				stock.booleanInfo.compressionRatio[0] > stock.booleanInfo.compressionRatio[1] + 2.5 && stock.booleanInfo.compressionRatio[1] < 10,
		);
	}
	// Kd 黃金、死亡交叉
	if (kdType) {
		newData = newData.filter((stock) =>
			kdType === filterKDTabs.up
				? !!stock.kdInfo.cross.up && stock.priceInfo.priceMA[DAYS.indexOf(5)] > stock.priceInfo.priceMA[DAYS.indexOf(10)]
				: !!stock.kdInfo.cross.down && stock.priceInfo.priceMA[DAYS.indexOf(5)] < stock.priceInfo.priceMA[DAYS.indexOf(10)],
		);
	}
	// KD 超買、賣
	if (isOverbuy && isOverSell) {
		newData = newData.filter((stock) => !!stock.kdInfo.isOverbuy || !!stock.kdInfo.isOverSell);
	} else if (isOverbuy) {
		newData = newData.filter((stock) => !!stock.kdInfo.isOverbuy);
	} else if (isOverSell) {
		newData = newData.filter((stock) => !!stock.kdInfo.isOverSell);
	}
	// KD 高、低檔鈍化
	if (isHighPassivation && isLowPassivation) {
		newData = newData.filter((stock) => !!stock.kdInfo.isHighPassivation || !!stock.kdInfo.isLowPassivation);
	} else if (isHighPassivation) {
		newData = newData.filter((stock) => !!stock.kdInfo.isHighPassivation);
	} else if (isLowPassivation) {
		newData = newData.filter((stock) => !!stock.kdInfo.isLowPassivation);
	}
	return newData;
};

// 過濾三大法人篩選
const filterByBuySell = (props, data) => {
	const {
		foreignType,
		foreignContinuousType,
		foreignTurnPointType,
		foreignInOutType,
		checkedForeignBuySellDays,
		sitesType,
		sitesContinuousType,
		sitesTurnPointType,
		sitesInOutType,
		checkedSitesBuySellDays,
		dealerType,
		dealerContinuousType,
		dealerTurnPointType,
		dealerInOutType,
		checkedDealerBuySellDays,
		majorType,
		majorContinuousType,
		majorTurnPointType,
		checkedMajorBuySellDays,
	} = props;
	let newData = data;
	// ------------- 外資篩選 ----------
	if (foreignType) {
		if (R.isEmpty(checkedForeignBuySellDays)) {
			newData = newData.filter((stock) =>
				foreignType === filterBuySellTabs.buy ? stock.buySellInfo.foreign.today > 0 : stock.buySellInfo.foreign.today < 0,
			);
		} else {
			newData = newData.filter((stock) =>
				foreignType === filterBuySellTabs.buy
					? checkedForeignBuySellDays.some((day) => stock.buySellInfo.foreign.total[DAYS.indexOf(day)]) > 0
					: checkedForeignBuySellDays.some((day) => stock.buySellInfo.foreign.total[DAYS.indexOf(day)]) < 0,
			);
		}
	}
	if (foreignContinuousType) {
		newData = newData.filter((stock) =>
			foreignContinuousType === filterContinuousTabs.buy ? stock.buySellInfo.foreign.days >= 3 : stock.buySellInfo.foreign.days <= -3,
		);
	}
	if (foreignTurnPointType) {
		newData = newData.filter((stock) => {
			const turnPoint = stock.buySellInfo.foreign.turnPoint;
			if (R.isNil(turnPoint)) {
				return false;
			}
			return foreignTurnPointType === filterTurnPointTabs.buy
				? turnPoint.type === 'BUY' && stock.buySellInfo.foreign.today > 0
				: turnPoint.type === 'SELL' && stock.buySellInfo.foreign.today < 0;
		});
	}
	if (foreignInOutType) {
		newData = newData.filter((stock) =>
			foreignInOutType === filterEnterExitTabs.enter
				? !!stock.buySellInfo.foreign.placementStrategy.enter
				: !!stock.buySellInfo.foreign.placementStrategy.exit,
		);
	}
	// ------------- 外資篩選 ----------
	// ------------- 投信篩選 ----------
	if (sitesType) {
		if (R.isEmpty(checkedSitesBuySellDays)) {
			newData = newData.filter((stock) =>
				sitesType === filterBuySellTabs.buy ? stock.buySellInfo.sites.today > 0 : stock.buySellInfo.sites.today < 0,
			);
		} else {
			newData = newData.filter((stock) =>
				sitesType === filterBuySellTabs.buy
					? checkedSitesBuySellDays.some((day) => stock.buySellInfo.sites.total[DAYS.indexOf(day)]) > 0
					: checkedSitesBuySellDays.some((day) => stock.buySellInfo.sites.total[DAYS.indexOf(day)]) < 0,
			);
		}
	}
	if (sitesContinuousType) {
		newData = newData.filter((stock) =>
			sitesContinuousType === filterContinuousTabs.buy ? stock.buySellInfo.sites.days >= 3 : stock.buySellInfo.sites.days <= -3,
		);
	}
	if (sitesTurnPointType) {
		newData = newData.filter((stock) => {
			const turnPoint = stock.buySellInfo.sites.turnPoint;
			if (R.isNil(turnPoint)) {
				return false;
			}
			return sitesTurnPointType === filterTurnPointTabs.buy
				? turnPoint.type === 'BUY' && stock.buySellInfo.sites.today > 0
				: turnPoint.type === 'SELL' && stock.buySellInfo.sites.today < 0;
		});
	}
	if (sitesInOutType) {
		newData = newData.filter((stock) =>
			sitesInOutType === filterEnterExitTabs.enter
				? !!stock.buySellInfo.sites.placementStrategy.enter
				: !!stock.buySellInfo.sites.placementStrategy.exit,
		);
	}
	// ------------- 投信篩選 ----------
	// ------------- 自營商篩選 ----------
	if (dealerType) {
		if (R.isEmpty(checkedDealerBuySellDays)) {
			newData = newData.filter((stock) =>
				dealerType === filterBuySellTabs.buy ? stock.buySellInfo.dealer.today > 0 : stock.buySellInfo.dealer.today < 0,
			);
		} else {
			newData = newData.filter((stock) =>
				dealerType === filterBuySellTabs.buy
					? checkedDealerBuySellDays.some((day) => stock.buySellInfo.dealer.total[DAYS.indexOf(day)]) > 0
					: checkedDealerBuySellDays.some((day) => stock.buySellInfo.dealer.total[DAYS.indexOf(day)]) < 0,
			);
		}
	}
	if (dealerContinuousType) {
		newData = newData.filter((stock) =>
			dealerContinuousType === filterContinuousTabs.buy ? stock.buySellInfo.dealer.days >= 3 : stock.buySellInfo.dealer.days <= -3,
		);
	}
	if (dealerTurnPointType) {
		newData = newData.filter((stock) => {
			const turnPoint = stock.buySellInfo.dealer.turnPoint;
			if (R.isNil(turnPoint)) {
				return false;
			}
			return dealerTurnPointType === filterTurnPointTabs.buy
				? turnPoint.type === 'BUY' && stock.buySellInfo.dealer.today > 0
				: turnPoint.type === 'SELL' && stock.buySellInfo.dealer.today < 0;
		});
	}
	if (dealerInOutType) {
		newData = newData.filter((stock) =>
			dealerInOutType === filterEnterExitTabs.enter
				? !!stock.buySellInfo.dealer.placementStrategy.enter
				: !!stock.buySellInfo.dealer.placementStrategy.exit,
		);
	}
	// ------------- 自營商篩選 ----------
	// ------------- 大戶篩選 ----------
	if (majorType) {
		if (R.isEmpty(checkedMajorBuySellDays)) {
			newData = newData.filter((stock) =>
				majorType === filterBuySellTabs.buy ? stock.buySellInfo.major.today > 0 : stock.buySellInfo.major.today < 0,
			);
		} else {
			newData = newData.filter((stock) =>
				majorType === filterBuySellTabs.buy
					? checkedMajorBuySellDays.some((day) => stock.buySellInfo.major.total[DAYS.indexOf(day)]) > 0
					: checkedMajorBuySellDays.some((day) => stock.buySellInfo.major.total[DAYS.indexOf(day)]) < 0,
			);
		}
	}
	if (majorContinuousType) {
		newData = newData.filter((stock) =>
			majorContinuousType === filterContinuousTabs.buy ? stock.buySellInfo.major.days >= 3 : stock.buySellInfo.major.days <= -3,
		);
	}
	if (majorTurnPointType) {
		newData = newData.filter((stock) => {
			const turnPoint = stock.buySellInfo.major.turnPoint;
			if (R.isNil(turnPoint)) {
				return false;
			}
			console.log(turnPoint);
			return majorTurnPointType === filterTurnPointTabs.buy
				? turnPoint.type === 'BUY' && stock.buySellInfo.major.today > 0
				: turnPoint.type === 'SELL' && stock.buySellInfo.major.today < 0;
		});
	}
	// ------------- 大戶篩選 ----------
	return newData;
};

const getFilterData = (props) => {
	const { baseStockInfoList } = props;
	const data = [];
	// 把全部股票拆成每一百筆去做過濾
	for (let i = 0; i <= Math.round(baseStockInfoList.length / 100); i++) {
		data.push(...filterData(props, baseStockInfoList.slice(i * 100, (i + 1) * 100)));
	}

	return {
		...props,
		stockInfoList: data,
		totalItems: data.length,
		current: 1,
	};
};

const getFilterTag = (props) => {
	const {
		refPrice,
		startPrice,
		maxPrice,
		minPrice,
		endPrice,
		isLimitUp,
		isLimitDown,
		riseDropMarginType,
		checkedPriceHighLowDays,
		checkedVolHighLowDays,
		checkedRiseDropMarginDays,
		fromRiseDropMargin,
		toRiseDropMargin,
		priceHighLowType,
		priceVolType,
		volHighLowType,
		selectedVol,
		fromVol,
		toVol,
		isHeavyTrading,
		maLongShortType,
		isAllOrder,
		isTangledMA,
		isFlagType,
		isReverse,
		maBackTestType,
		checkedMABackTestDays,
		maReverseType,
		checkedMAReverseDays,
		macdType,
		booleanType,
		isBooleanCompression,
		isBooleanExpand,
		kdType,
		isOverbuy,
		isOverSell,
		isHighPassivation,
		isLowPassivation,
		foreignType,
		foreignContinuousType,
		foreignTurnPointType,
		foreignInOutType,
		checkedForeignBuySellDays,
		sitesType,
		sitesContinuousType,
		sitesTurnPointType,
		sitesInOutType,
		checkedSitesBuySellDays,
		dealerType,
		dealerContinuousType,
		dealerTurnPointType,
		dealerInOutType,
		checkedDealerBuySellDays,
		majorType,
		majorContinuousType,
		majorTurnPointType,
		checkedMajorBuySellDays,
	} = props;
	const tags = [];
	if (refPrice > 0) {
		tags.push(`昨日價=${refPrice}`);
	}
	if (startPrice > 0) {
		tags.push(`開盤價=${startPrice}`);
	}
	if (maxPrice > 0) {
		tags.push(`最高價=${maxPrice}`);
	}
	if (minPrice > 0) {
		tags.push(`最低價=${minPrice}`);
	}
	if (endPrice > 0) {
		tags.push(`收盤價=${endPrice}`);
	}
	if (priceHighLowType && !R.isEmpty(checkedPriceHighLowDays)) {
		tags.push(`收盤價近 ${checkedPriceHighLowDays.map((day, index) => (index === 0 ? day : `${day}`)).join(' | ')} 日${priceHighLowType}`);
	}
	if (fromVol || toVol) {
		tags.push(
			`${selectedVol === 0 ? '成交量' : `${selectedVol}日均量`} ${!toVol ? '>' : ''} ${fromVol > 0 ? fromVol : 0}${
				toVol > 0 ? `~${toVol}` : ''
			}`,
		);
	}
	if (volHighLowType && !R.isEmpty(checkedVolHighLowDays)) {
		tags.push(`成交量近 ${checkedVolHighLowDays.map((day, index) => (index === 0 ? day : `${day}`)).join(' | ')} 日${volHighLowType}`);
	}
	if (isHeavyTrading) {
		tags.push(`爆大量：成交量 > 5 日均量三倍`);
	}
	if (riseDropMarginType && (fromRiseDropMargin || toRiseDropMargin)) {
		const riseDropMarginText = `${!toRiseDropMargin ? '>' : ''} ${fromRiseDropMargin > 0 ? fromRiseDropMargin : 0}${
			toRiseDropMargin > 0 ? `~${toRiseDropMargin}` : ''
		}%`;
		if (R.isEmpty(checkedRiseDropMarginDays)) {
			tags.push(`當日${riseDropMarginType} ${riseDropMarginText}`);
		} else {
			tags.push(
				`近 ${checkedRiseDropMarginDays
					.map((day, index) => (index === 0 ? day : `${day}`))
					.join(' | ')} 日${riseDropMarginType} ${riseDropMarginText}`,
			);
		}
	}
	if (isLimitUp) {
		tags.push('漲停');
	}
	if (isLimitDown) {
		tags.push('跌停');
	}
	if (priceVolType) {
		switch (priceVolType) {
			case PRICE_UP_VOL_UP:
				tags.push(`${PRICE_UP_VOL_UP}：今日漲幅 > 5% 且成交量大於 20 日均量`);
				break;
			case PRICE_UP_VOL_DOWN:
				tags.push(`${PRICE_UP_VOL_DOWN}：5 日漲幅 > 10% 且成交量小於昨日成交量`);
				break;
			case PRICE_DOWN_VOL_UP:
				tags.push(`${PRICE_DOWN_VOL_UP}：5 日跌幅 > 10% 且成交量大於昨日成交量`);
				break;
			case PRICE_DOWN_VOL_DOWN:
				tags.push(`${PRICE_DOWN_VOL_DOWN}：今日跌幅 < 5% 且成交量小於 20 日均量`);
				break;
		}
	}
	if (maLongShortType) {
		tags.push(maLongShortType);
		if (isAllOrder) {
			tags.push(`六線全${maLongShortType === filterLongShortTabs.long ? '上' : '下'}`);
		}
	}
	if (isTangledMA) {
		tags.push('均線糾結：收盤價與 5|10|20 日均線上下震幅在 -2% ~ 3%');
	}
	if (isFlagType) {
		tags.push('旗型');
	}
	if (isReverse) {
		tags.push('破切');
	}
	if (maBackTestType && !R.isEmpty(checkedMABackTestDays)) {
		tags.push(`${maBackTestType} ${checkedMABackTestDays.map((day, index) => (index === 0 ? day : `${day}`)).join(' | ')} 日均線`);
	}
	if (maReverseType && !R.isEmpty(checkedMAReverseDays)) {
		tags.push(`${checkedMAReverseDays.map((day, index) => (index === 0 ? day : `${day}`)).join(' | ')} 日均線剛${maReverseType}`);
	}

	if (macdType) {
		switch (macdType) {
			case '趨勢向上':
				tags.push(`MACD 快線從底部連三天向上即將翻正且 5MA > 20MA`);
				break;
			case '趨勢向下':
				tags.push(`MACD 快線從頂部連三天向下即將變負且 5MA < 20MA`);
				break;
			case '黃金交叉':
				tags.push(`MACD 快慢線黃金交叉且 5MA > 20MA`);
				break;
			case '死亡交叉':
				tags.push(`MACD 快慢線死亡交叉且 5MA < 20MA`);
				break;
		}
	}
	if (booleanType) {
		tags.push(booleanType);
	}
	if (isBooleanCompression) {
		tags.push('布林壓縮率 < 10%');
	}
	if (isBooleanExpand) {
		tags.push('今日布林壓縮率 > 昨日布林壓縮率 2.5% 且布林壓縮率 > 10%');
	}
	if (kdType) {
		tags.push(`KD ${kdType}且 ${kdType === filterKDTabs.up ? '5MA > 10MA' : '5MA < 10MA'}`);
	}
	if (isOverbuy) {
		tags.push(`KD 超買`);
	}
	if (isOverSell) {
		tags.push(`KD 超賣`);
	}
	if (isHighPassivation) {
		tags.push(`KD 高檔鈍化`);
	}
	if (isLowPassivation) {
		tags.push(`KD 低檔鈍化`);
	}
	if (foreignType) {
		tags.push(
			`${
				R.isEmpty(checkedForeignBuySellDays)
					? ''
					: `近 ${checkedForeignBuySellDays.map((day, index) => (index === 0 ? day : `${day}`)).join(' | ')} 日`
			}外資${foreignType}`,
		);
	}
	if (sitesType) {
		tags.push(
			`${
				R.isEmpty(checkedSitesBuySellDays)
					? ''
					: `近 ${checkedSitesBuySellDays.map((day, index) => (index === 0 ? day : `${day}`)).join(' | ')} 日`
			}投信${sitesType}`,
		);
	}
	if (dealerType) {
		tags.push(
			`${
				R.isEmpty(checkedDealerBuySellDays)
					? ''
					: `近 ${checkedDealerBuySellDays.map((day, index) => (index === 0 ? day : `${day}`)).join(' | ')} 日`
			}自營商${dealerType}`,
		);
	}
	if (majorType) {
		tags.push(
			`${
				R.isEmpty(checkedMajorBuySellDays)
					? ''
					: `近 ${checkedMajorBuySellDays.map((day, index) => (index === 0 ? day : `${day}`)).join(' | ')} 日`
			}大戶${majorType}`,
		);
	}
	if (foreignContinuousType) {
		tags.push(`外資${foreignContinuousType}`);
	}
	if (foreignTurnPointType) {
		tags.push(`外資${foreignTurnPointType}`);
	}
	if (foreignInOutType) {
		tags.push(`外資${foreignInOutType}`);
	}
	if (sitesContinuousType) {
		tags.push(`投信${sitesContinuousType}`);
	}
	if (sitesTurnPointType) {
		tags.push(`投信${sitesTurnPointType}`);
	}
	if (sitesInOutType) {
		tags.push(`投信${sitesInOutType}`);
	}
	if (dealerContinuousType) {
		tags.push(`自營商${dealerContinuousType}`);
	}
	if (dealerTurnPointType) {
		tags.push(`自營商${dealerTurnPointType}`);
	}
	if (dealerInOutType) {
		tags.push(`自營商${dealerInOutType}`);
	}
	if (majorContinuousType) {
		tags.push(`大戶${majorContinuousType}`);
	}
	if (majorTurnPointType) {
		tags.push(`大戶${majorTurnPointType}`);
	}

	return tags;
};

const resetFilter = () =>
	update((props) => {
		return {
			...props,
			stockInfoList: props.baseStockInfoList,
			searchText: '',
			refPrice: null,
			startPrice: null,
			maxPrice: null,
			minPrice: null,
			endPrice: null,
			marketType: '',
			category: -1,
			current: 1,
			totalItems: props.baseStockInfoList.length,
			volType: '',
			selectedVol: 0,
			fromVol: 0,
			toVol: 0,
			riseDropMarginType: '',
			fromRiseDropMargin: 0,
			toRiseDropMargin: 0,
			priceHighLowType: '',
			volHighLowType: '',
			priceVolType: '',
			maLongShortType: '',
			maBackTestType: '',
			maReverseType: '',
			booleanType: '',
			macdType: '',
			kdType: '',
			foreignType: '',
			foreignContinuousType: '',
			foreignTurnPointType: '',
			foreignInOutType: '',
			sitesType: '',
			sitesContinuousType: '',
			sitesTurnPointType: '',
			sitesInOutType: '',
			dealerType: '',
			dealerContinuousType: '',
			dealerTurnPointType: '',
			dealerInOutType: '',
			majorType: '',
			majorContinuousType: '',
			majorTurnPointType: '',
			tags: [],
			checkedPriceHighLowDays: [],
			checkedVolHighLowDays: [],
			checkedRiseDropMarginDays: [],
			checkedMABackTestDays: [],
			checkedMAReverseDays: [],
			checkedForeignBuySellDays: [],
			checkedSitesBuySellDays: [],
			checkedDealerBuySellDays: [],
			checkedMajorBuySellDays: [],
			isLimitUp: false,
			isLimitDown: false,
			isTangledMA: false,
			isFlagType: false,
			isReverse: false,
			isBooleanCompression: false,
			isBooleanExpand: false,
			isOverbuy: false,
			isOverSell: false,
			isHighPassivation: false,
			isLowPassivation: false,
			isHeavyTrading: false,
			isAllOrder: false,
		};
	});

const reset = () => {
	set(mainConfig);
};

export const changePriceVol = (evt) => {
	filterByParams({ [evt.target.name]: evt.target.value ? Number(evt.target.value) : '' });
};

// 過濾 checkbox 篩選
export const changeFilterCheck = (evt) => {
	filterByParams({ [evt.target.name]: evt.target.checked });
};
export const changeTab = (key) => (tab) => {
	filterByParams({ [key]: tab });
};

export const changeSelect = (key) => (evt) => {
	filterByParams({ [key]: Number(evt.target.value) });
};

export default {
	subscribe,
	setBaseStockInfoList,
	setPage,
	setSearchText,
	changeMarketType,
	changeCategory,
	filterByParams,
	resetFilter,
	reset,
};
