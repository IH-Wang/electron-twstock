import { writable } from 'svelte/store';
import * as R from 'ramda';
// constants
import {
	filterRiseDropTabs,
	filterMaxMinTabs,
	filterVolTabs,
	filterMATypeTabs,
	filterBuySellTabs,
	DAYS,
} from '../constants';

const mainConfig = {
	marketTypeList: [],
	categoryList: [],
	baseStockInfoList: [],
	stockInfoList: [],
	searchText: '',
	maxPrice: 0,
	minPrice: 0,
	endPrice: 0,
	marketType: '',
	category: -1,
	current: 1,
	totalItems: 0,
	perPage: 10,
	volType: '',
	selectedVolIndex: 0,
	fromVol: 0,
	toVol: 0,
	riseDropType: '',
	selectedRiseDropIndex: 0,
	startRiseDropMargin: 0,
	endRiseDropMargin: 0,
	maxMinType: '',
	selectedMaxMinIndex: 0,
	priceVolType: '',
	maReverseType: '',
	selectedMAReverseIndex: 0,
	macdType: '',
	activeForeignTab: '',
	activeSitesTab: '',
	activeDealerTab: '',
	activeMajorTab: '',

	isLimitUp: false,
	isLimitDown: false,
	isTangledMA: false,
	isFlagType: false,
	isReverse: false,
	isLongOrder: false,
	isShortOrder: false,
	isBreakTangled: false,
	isDropTangled: false,
	isStandOnTop: false,
	isBreakBelowBottom: false,
	isBooleanCompression: false,
	isBooleanExpand: false,
	isForeignEnter: false,
	isForeignExit: false,
	isSitesEnter: false,
	isSitesExit: false,
	isDealerEnter: false,
	isDealerExit: false,
	isMajorContinuousBuy: false,
	isMajorContinuousSell: false,
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
		return { ...props, ...filterStockList };
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
		maxPrice,
		minPrice,
		endPrice,
		isLimitUp,
		isLimitDown,
		riseDropType,
		selectedRiseDropIndex,
		selectedMaxMinIndex,
		startRiseDropMargin,
		endRiseDropMargin,
		maxMinType,
		priceVolType,
		volType,
		selectedVolIndex,
		fromVol,
		toVol,
	} = props;
	let newData = data;
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
	// 量突破或低於成交均量
	if (volType) {
		if (volType === filterVolTabs.increase) {
			newData = newData.filter((stock) => stock.volInfo.vol > stock.volInfo.volDays[selectedVolIndex]);
		} else {
			newData = newData.filter((stock) => stock.volInfo.vol < stock.volInfo.volDays[selectedVolIndex]);
		}
	}
	// 成交量範圍查詢
	if (fromVol || toVol) {
		if (fromVol && toVol) {
			newData = newData.filter((stock) => stock.volInfo.vol >= fromVol && stock.volInfo.vol <= toVol);
		} else if (fromVol && !toVol) {
			newData = newData.filter((stock) => stock.volInfo.vol >= fromVol);
		} else {
			newData = newData.filter((stock) => stock.volInfo.vol <= toVol);
		}
	}
	// 近日漲跌幅
	if (riseDropType && (startRiseDropMargin || endRiseDropMargin)) {
		if (riseDropType === filterRiseDropTabs.rise) {
			newData = newData.filter((stock) => {
				const margin = stock.priceInfo.riseDropDays.margin[selectedRiseDropIndex];
				if (startRiseDropMargin && endRiseDropMargin) {
					return margin >= startRiseDropMargin && margin <= endRiseDropMargin;
				} else if (startRiseDropMargin && !endRiseDropMargin) {
					return margin >= startRiseDropMargin;
				} else {
					return margin <= endRiseDropMargin;
				}
			});
		} else {
			newData = newData.filter((stock) => {
				const margin = stock.priceInfo.riseDropDays.margin[selectedRiseDropIndex];
				if (startRiseDropMargin && endRiseDropMargin) {
					return margin <= startRiseDropMargin * -1 && margin >= endRiseDropMargin * -1;
				} else if (startRiseDropMargin && !endRiseDropMargin) {
					return margin <= startRiseDropMargin * -1;
				} else {
					return margin >= endRiseDropMargin * -1;
				}
			});
		}
	}
	// 近日新高新低
	if (maxMinType) {
		newData = newData.filter((stock) =>
			maxMinType === filterMaxMinTabs.max
				? stock.priceInfo.endPrice === stock.priceInfo.maxMA[selectedMaxMinIndex]
				: stock.priceInfo.endPrice === stock.priceInfo.minMA[selectedMaxMinIndex],
		);
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
			case '價量齊揚':
				newData = newData.filter(
					(stock) =>
						stock.priceInfo.riseDropMargin >= 5 &&
						stock.volInfo.vol > stock.volInfo.volDays[DAYS.indexOf(20)],
				);
				break;
			case '價漲量縮':
				newData = newData.filter(
					(stock) =>
						stock.priceInfo.riseDropDays.margin[DAYS.indexOf(5)] >= 10 &&
						stock.volInfo.vol < stock.volInfo.preVol,
				);
				break;
			case '價跌量增':
				newData = newData.filter(
					(stock) =>
						stock.priceInfo.riseDropDays.margin[DAYS.indexOf(5)] <= -10 &&
						stock.volInfo.vol > stock.volInfo.preVol,
				);
				break;
			case '價跌量縮':
				newData = newData.filter(
					(stock) =>
						stock.priceInfo.riseDropMargin <= -5 &&
						stock.volInfo.vol < stock.volInfo.volDays[DAYS.indexOf(20)],
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
		maReverseType,
		isLongOrder,
		isShortOrder,
		isTangledMA,
		isFlagType,
		isReverse,
		macdType,
		// isBreakTangled,
		// isDropTangled,
		isStandOnTop,
		isBreakBelowBottom,
		isBooleanCompression,
		isBooleanExpand,
		selectedMAReverseIndex,
	} = props;
	let newData = data;
	if (isLongOrder) {
		newData = newData.filter((stock) => !!stock.priceInfo.isLongOrder);
	}
	if (isShortOrder) {
		newData = newData.filter((stock) => !!stock.priceInfo.isShortOrder);
	}
	if (isTangledMA) {
		newData = newData.filter((stock) => !!stock.priceInfo.isTangledMA);
	}
	if (isFlagType) {
		newData = newData.filter((stock) => stock.flagInfo.flagVolRatio !== 0);
	}
	if (isReverse) {
		newData = newData.filter((stock) => stock.reverseInfo.isReverse === isReverse);
	}
	if (maReverseType) {
		if (maReverseType === filterMATypeTabs.up) {
			newData = newData.filter((stock) => !!stock.priceInfo.maReverse.up[selectedMAReverseIndex]);
		} else {
			newData = newData.filter((stock) => !!stock.priceInfo.maReverse.down[selectedMAReverseIndex]);
		}
	}
	if (macdType) {
		switch (macdType) {
			case '趨勢向上':
				newData = newData.filter((stock) => !!stock.macdInfo.isIncreaseTrend);
				break;
			case '趨勢向下':
				newData = newData.filter((stock) => !!stock.macdInfo.isDeceaseTrend);
				break;
			case '黃金交叉':
				newData = newData.filter((stock) => !!stock.macdInfo.cross.isRed);
				break;
			case '死亡交叉':
				newData = newData.filter((stock) => !!stock.macdInfo.cross.isGreen);
				break;
		}
	}
	// if (isBreakTangled) {
	// 	newData = newData.filter((stock) => !!stock.priceInfo.maReverse.up[DAYS.indexOf(60)]);
	// }
	// if (isDropTangled) {
	// 	newData = newData.filter((stock) => !stock.priceInfo.maReverse.up[DAYS.indexOf(60)]);
	// }
	if (isStandOnTop) {
		newData = newData.filter((stock) => stock.booleanInfo.isStandOnTop === isStandOnTop);
	}
	if (isBreakBelowBottom) {
		newData = newData.filter((stock) => stock.booleanInfo.isBreakBelowBottom === isBreakBelowBottom);
	}
	if (isBooleanCompression) {
		newData = newData.filter((stock) => stock.booleanInfo.compressionRatio[0] < 10);
	}
	if (isBooleanExpand) {
		newData = newData.filter(
			(stock) =>
				stock.booleanInfo.compressionRatio[0] > stock.booleanInfo.compressionRatio[1] + 2.5 &&
				stock.booleanInfo.compressionRatio[1] < 10,
		);
	}
	return newData;
};

// 過濾三大法人篩選
const filterByBuySell = (props, data) => {
	const {
		activeForeignTab,
		activeSitesTab,
		activeDealerTab,
		activeMajorTab,
		isForeignEnter,
		isForeignExit,
		isSitesEnter,
		isSitesExit,
		isDealerEnter,
		isDealerExit,
		isMajorContinuousBuy,
		isMajorContinuousSell,
	} = props;
	let newData = data;
	if (activeForeignTab) {
		newData = newData.filter((stock) => {
			const turPoint = stock.buySellInfo.foreign.turnPoint;
			if (turPoint) {
				return activeForeignTab === filterBuySellTabs.buy
					? turPoint.type === 'BUY' && stock.buySellInfo.foreign.today > 0
					: turPoint.type === 'SELL' && stock.buySellInfo.foreign.today < 0;
			}
			return false;
		});
	}
	if (activeSitesTab) {
		newData = newData.filter((stock) => {
			const turPoint = stock.buySellInfo.sites.turnPoint;
			if (turPoint) {
				return activeSitesTab === filterBuySellTabs.buy
					? turPoint.type === 'BUY' && stock.buySellInfo.sites.today > 0
					: turPoint.type === 'SELL' && stock.buySellInfo.sites.today < 0;
			}
			return false;
		});
	}
	if (activeDealerTab) {
		newData = newData.filter((stock) => {
			const turPoint = stock.buySellInfo.dealer.turnPoint;
			if (turPoint) {
				return activeDealerTab === filterBuySellTabs.buy
					? turPoint.type === 'BUY' && stock.buySellInfo.dealer.today > 0
					: turPoint.type === 'SELL' && stock.buySellInfo.dealer.today < 0;
			}
			return false;
		});
	}
	if (activeMajorTab) {
		newData = newData.filter((stock) => {
			const turPoint = stock.buySellInfo.major.turnPoint;
			if (turPoint) {
				return activeMajorTab === filterBuySellTabs.buy
					? turPoint.type === 'BUY' && stock.buySellInfo.major.today > 0
					: turPoint.type === 'SELL' && stock.buySellInfo.major.today < 0;
			}
			return false;
		});
	}
	if (isForeignEnter) {
		newData = newData.filter((stock) => !!stock.buySellInfo.foreign.placementStrategy.enter);
	}
	if (isForeignExit) {
		newData = newData.filter((stock) => !!stock.buySellInfo.foreign.placementStrategy.exit);
	}
	if (isSitesEnter) {
		newData = newData.filter((stock) => !!stock.buySellInfo.sites.placementStrategy.enter);
	}
	if (isSitesExit) {
		newData = newData.filter((stock) => !!stock.buySellInfo.sites.placementStrategy.exit);
	}
	if (isDealerEnter) {
		newData = newData.filter((stock) => !!stock.buySellInfo.dealer.placementStrategy.enter);
	}
	if (isDealerExit) {
		newData = newData.filter((stock) => !!stock.buySellInfo.dealer.placementStrategy.exit);
	}
	if (isMajorContinuousBuy) {
		newData = newData.filter((stock) => stock.buySellInfo.major.days >= 3);
	}
	if (isMajorContinuousSell) {
		newData = newData.filter((stock) => stock.buySellInfo.major.days <= -3);
	}
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

const resetFilter = () =>
	update((props) => {
		return {
			...props,
			stockInfoList: props.baseStockInfoList,
			searchText: '',
			maxPrice: 0,
			minPrice: 0,
			endPrice: 0,
			marketType: '',
			category: -1,
			current: 1,
			totalItems: props.baseStockInfoList.length,
			volType: '',
			selectedVolIndex: 0,
			fromVol: 0,
			toVol: 0,
			riseDropType: '',
			selectedRiseDropIndex: 0,
			startRiseDropMargin: 0,
			endRiseDropMargin: 0,
			maxMinType: '',
			selectedMaxMinIndex: 0,
			priceVolType: '',
			maReverseType: '',
			selectedMAReverseIndex: 0,
			macdType: '',
			activeForeignTab: '',
			activeSitesTab: '',
			activeDealerTab: '',
			activeMajorTab: '',
			isLimitUp: false,
			isLimitDown: false,
			isTangledMA: false,
			isFlagType: false,
			isReverse: false,
			isLongOrder: false,
			isShortOrder: false,
			isBreakTangled: false,
			isDropTangled: false,
			isStandOnTop: false,
			isBreakBelowBottom: false,
			isBooleanCompression: false,
			isBooleanExpand: false,
			isForeignEnter: false,
			isForeignExit: false,
			isSitesEnter: false,
			isSitesExit: false,
			isDealerEnter: false,
			isDealerExit: false,
			isMajorContinuousBuy: false,
			isMajorContinuousSell: false,
		};
	});

const reset = () => {
	set(mainConfig);
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
