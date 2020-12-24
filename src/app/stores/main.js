import { writable } from 'svelte/store';
import * as R from 'ramda';
// constants
import { filterRiseDropTabs, filterHighLowTabs, filterMATypeTabs, filterBuySellTabs, DAYS } from '../constants';

const mainConfig = {
	marketTypeList: [],
	categoryList: [],
	baseStockInfoList: [],
	stockInfoList: [],
	tags: [],
	checkedPriceHighLowDays: [],
	checkedVolHighLowDays: [],
	checkedRiseDropMarginDays: [],
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
	maReverseType: '',
	selectedMAReverseIndex: 0,
	macdType: '',
	activeForeignTab: '',
	activeSitesTab: '',
	activeDealerTab: '',
	activeMajorTab: '',

	isHeavyTrading: false,
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
			case '價量齊揚':
				newData = newData.filter((stock) => stock.priceInfo.riseDropMargin >= 5 && stock.volInfo.vol > stock.volInfo.volDays[DAYS.indexOf(20)]);
				break;
			case '價漲量縮':
				newData = newData.filter((stock) => stock.priceInfo.riseDropDays.margin[DAYS.indexOf(5)] >= 10 && stock.volInfo.vol < stock.volInfo.preVol);
				break;
			case '價跌量增':
				newData = newData.filter((stock) => stock.priceInfo.riseDropDays.margin[DAYS.indexOf(5)] <= -10 && stock.volInfo.vol > stock.volInfo.preVol);
				break;
			case '價跌量縮':
				newData = newData.filter((stock) => stock.priceInfo.riseDropMargin <= -5 && stock.volInfo.vol < stock.volInfo.volDays[DAYS.indexOf(20)]);
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
				newData = newData.filter(
					(stock) => !!stock.macdInfo.isIncreaseTrend && stock.priceInfo.priceMA[DAYS.indexOf(5)] > stock.priceInfo.priceMA[DAYS.indexOf(20)],
				);
				break;
			case '趨勢向下':
				newData = newData.filter(
					(stock) => !!stock.macdInfo.isDeceaseTrend && stock.priceInfo.priceMA[DAYS.indexOf(5)] < stock.priceInfo.priceMA[DAYS.indexOf(20)],
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
			(stock) => stock.booleanInfo.compressionRatio[0] > stock.booleanInfo.compressionRatio[1] + 2.5 && stock.booleanInfo.compressionRatio[1] < 10,
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

const getFilterTag = (props) => {
	const {
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
		maReverseType,
		isLongOrder,
		isShortOrder,
		isTangledMA,
		isFlagType,
		isReverse,
		macdType,
		isStandOnTop,
		isBreakBelowBottom,
		isBooleanCompression,
		isBooleanExpand,
		selectedMAReverseIndex,
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
	const tags = [];
	if (isLimitUp) {
		tags.push('漲停');
	}
	if (isLimitDown) {
		tags.push('跌停');
	}
	if (riseDropMarginType && (fromRiseDropMargin || toRiseDropMargin)) {
		if (R.isEmpty(checkedRiseDropMarginDays)) {
			tags.push(`當日${riseDropMarginType}`);
		} else {
			tags.push(`近 ${checkedRiseDropMarginDays.map((day, index) => (index === 0 ? day : `${day}`)).join(' | ')} 日${riseDropMarginType}`);
		}
	}
	if (priceHighLowType && !R.isEmpty(checkedPriceHighLowDays)) {
		tags.push(`收盤價近 ${checkedPriceHighLowDays.map((day, index) => (index === 0 ? day : `${day}`)).join(' | ')} 日${priceHighLowType}`);
	}
	if (fromVol || toVol) {
		tags.push(`${selectedVol === 0 ? '成交量' : `${selectedVol}日均量`} ${!toVol ? '>' : ''} ${fromVol > 0 ? fromVol : 0}${toVol > 0 ? `~${toVol}` : ''}`);
	}
	if (volHighLowType && !R.isEmpty(checkedVolHighLowDays)) {
		tags.push(`成交量近 ${checkedVolHighLowDays.map((day, index) => (index === 0 ? day : `${day}`)).join(' | ')} 日${volHighLowType}`);
	}
	if (isHeavyTrading) {
		tags.push(`爆大量`);
	}
	if (priceVolType) {
		tags.push(priceVolType);
	}
	if (maReverseType) {
		tags.push(`${DAYS[selectedMAReverseIndex]}日均線${maReverseType}`);
	}
	if (isLongOrder) {
		tags.push('多頭排列');
	}
	if (isShortOrder) {
		tags.push('空頭排列');
	}
	if (isTangledMA) {
		tags.push('均線糾結');
	}
	if (isFlagType) {
		tags.push('旗型');
	}
	if (isReverse) {
		tags.push('破切');
	}
	if (macdType) {
		tags.push(macdType);
	}
	if (isStandOnTop) {
		tags.push('站上布林上軌');
	}
	if (isBreakBelowBottom) {
		tags.push('跌破布林下軌');
	}
	if (isBooleanCompression) {
		tags.push('布林壓縮');
	}
	if (isBooleanExpand) {
		tags.push('打開布林');
	}
	if (activeForeignTab) {
		tags.push(`外資${activeForeignTab}`);
	}
	if (activeSitesTab) {
		tags.push(`投信${activeSitesTab}`);
	}
	if (activeDealerTab) {
		tags.push(`自營商${activeDealerTab}`);
	}
	if (activeMajorTab) {
		tags.push(`大戶${activeMajorTab}`);
	}
	if (isForeignEnter) {
		tags.push('外資進場');
	}
	if (isForeignExit) {
		tags.push('外資出場');
	}
	if (isSitesEnter) {
		tags.push('投信進場');
	}
	if (isSitesExit) {
		tags.push('投信出場');
	}
	if (isDealerEnter) {
		tags.push('自營商進場');
	}
	if (isDealerExit) {
		tags.push('自營商出場');
	}
	if (isMajorContinuousBuy) {
		tags.push('大戶連買');
	}
	if (isMajorContinuousSell) {
		tags.push('大戶連賣');
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
			maReverseType: '',
			selectedMAReverseIndex: 0,
			macdType: '',
			activeForeignTab: '',
			activeSitesTab: '',
			activeDealerTab: '',
			activeMajorTab: '',
			tags: [],
			checkedPriceHighLowDays: [],
			checkedVolHighLowDays: [],
			checkedRiseDropMarginDays: [],
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
			isHeavyTrading: false,
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
