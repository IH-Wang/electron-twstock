import { writable } from 'svelte/store';
import * as R from 'ramda';

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
	isTangledMA: false,
	isFlagType: false,
	isReverse: false,
	isLongOrder: false,
	isShortOrder: false,
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
	const {
		searchText,
		maxPrice,
		minPrice,
		endPrice,
		marketType,
		category,
		isLongOrder,
		isShortOrder,
		isTangledMA,
		isFlagType,
		isReverse,
	} = props;
	let newData = data;

	if (searchText.length > 1) {
		newData = newData.filter((stock) => stock.name.indexOf(searchText) > -1 || stock.code.indexOf(searchText) > -1);
	}
	if (maxPrice > 0) {
		newData = newData.filter((stock) => stock.priceInfo.maxPrice === maxPrice);
	}
	if (minPrice > 0) {
		newData = newData.filter((stock) => stock.priceInfo.minPrice === minPrice);
	}
	if (endPrice > 0) {
		newData = newData.filter((stock) => stock.priceInfo.endPrice === endPrice);
	}
	if (marketType) {
		newData = newData.filter((stock) => stock.marketType === marketType);
	}
	if (category !== -1) {
		newData = newData.filter((stock) => stock.category === category);
	}
	if (isLongOrder) {
		newData = newData.filter((stock) => stock.priceInfo.isLongOrder === isLongOrder);
	}
	if (isShortOrder) {
		newData = newData.filter((stock) => stock.priceInfo.isShortOrder === isShortOrder);
	}
	if (isTangledMA) {
		newData = newData.filter((stock) => stock.priceInfo.isTangledMA === isTangledMA);
	}
	if (isFlagType) {
		newData = newData.filter((stock) => stock.flagInfo.flagVolRatio !== 0);
	}
	if (isReverse) {
		newData = newData.filter((stock) => stock.reverseInfo.isReverse === isReverse);
	}
	return newData;
};

const getFilterData = (props) => {
	const {
		searchText,
		baseStockInfoList,
		marketType,
		category,
		isLongOrder,
		isShortOrder,
		isTangledMA,
		isFlagType,
		isReverse,
	} = props;
	const data = [];
	// 把全部股票拆成每一百筆去做過濾
	for (let i = 0; i <= Math.round(baseStockInfoList.length / 100); i++) {
		data.push(...filterData(props, baseStockInfoList.slice(i * 100, (i + 1) * 100)));
	}

	return {
		searchText,
		marketType,
		category,
		isLongOrder,
		isShortOrder,
		isTangledMA,
		isFlagType,
		isReverse,
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
			isTangledMA: false,
			isFlagType: false,
			isReverse: false,
			isLongOrder: false,
			isShortOrder: false,
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
