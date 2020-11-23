const stockCrawler = require("./crawler");

const evaluate = ($) => {
  const contentData = $.text()
    .replace(";", "")
    .split(" ")
    .map((item) => item.split(","));
  if (contentData.length === 1) {
    return [];
  }
  const EStockType = {
    DATE: 0,
    START_PRICE: 1,
    MAX_PRICE: 2,
    MIN_PRICE: 3,
    END_PRICE: 4,
    VOL: 5,
    MARGIN_PURCHASE: 6,
    SHORT_SALE: 7,
    FOREIGN_HOLDING: 8,
    SITES_HOLDING: 9,
    DEALER_HOLDING: 10,
    BIG_THREE_HOLDING: 14,
    MAJOR_NET_BUY_SELL: 15,
    DAY_TRADING: 16,
    MARGIN_PURCHASE_RATIO: 17,
    BALANCE_SALE_MARGIN_RATIO: 18,
    FOREIGN_NET_BUY_SELL: 19,
    SITES_NET_BUY_SELL: 20,
    DEALER_NET_BUY_SELL: 21,
    BIG_THREE_NET_BUY_SELL: 22,
  };
  return contentData[EStockType.DATE].map((date, index) => ({
    // 日期
    date,
    // 開盤價
    startPrice: parseFloat(contentData[EStockType.START_PRICE][index]),
    // 最高價
    maxPrice: parseFloat(contentData[EStockType.MAX_PRICE][index]),
    // 最低價
    minPrice: parseFloat(contentData[EStockType.MIN_PRICE][index]),
    // 收盤價
    endPrice: parseFloat(contentData[EStockType.END_PRICE][index]),
    // 成交量
    vol: parseInt(contentData[EStockType.VOL][index], 10) || 0,
    // 融資餘額
    marginPurchase: contentData[EStockType.MARGIN_PURCHASE]
      ? parseInt(contentData[EStockType.MARGIN_PURCHASE][index], 10) || 0
      : 0,
    // 融券餘額
    shortSale: contentData[EStockType.SHORT_SALE]
      ? parseInt(contentData[EStockType.SHORT_SALE][index], 10) || 0
      : 0,
    // 外資持股
    foreignHolding: contentData[EStockType.FOREIGN_HOLDING]
      ? parseInt(contentData[EStockType.FOREIGN_HOLDING][index]) || 0
      : 0,
    // 投信持股
    sitesHolding: contentData[EStockType.SITES_HOLDING]
      ? parseInt(contentData[EStockType.SITES_HOLDING][index], 10) || 0
      : 0,
    // 自營商持股
    dealerHolding: contentData[EStockType.DEALER_HOLDING]
      ? parseInt(contentData[EStockType.DEALER_HOLDING][index], 10) || 0
      : 0,
    // 三大法人持股
    bigThreeHolding: contentData[EStockType.BIG_THREE_HOLDING]
      ? parseInt(contentData[EStockType.BIG_THREE_HOLDING][index], 10) || 0
      : 0,
    // 主力買賣超
    majorNetBuySell: contentData[EStockType.MAJOR_NET_BUY_SELL]
      ? parseInt(contentData[EStockType.MAJOR_NET_BUY_SELL][index], 10) || 0
      : 0,
    // 當沖
    dayTrading: contentData[EStockType.DAY_TRADING]
      ? parseInt(contentData[EStockType.DAY_TRADING][index], 10) || 0
      : 0,
    // 融資使用率
    marginPurchaseRatio: contentData[EStockType.MARGIN_PURCHASE_RATIO]
      ? parseFloat(contentData[EStockType.MARGIN_PURCHASE_RATIO][index]) || 0
      : 0,
    // 券資比
    bsmRatio: contentData[EStockType.BALANCE_SALE_MARGIN_RATIO]
      ? parseFloat(contentData[EStockType.BALANCE_SALE_MARGIN_RATIO][index]) ||
        0
      : 0,
    // 外資買賣超
    foreignNetBuySell: contentData[EStockType.FOREIGN_NET_BUY_SELL]
      ? parseInt(contentData[EStockType.FOREIGN_NET_BUY_SELL][index], 10) || 0
      : 0,
    // 投信買賣超
    sitesNetBuySell: contentData[EStockType.SITES_NET_BUY_SELL]
      ? parseInt(contentData[EStockType.SITES_NET_BUY_SELL][index], 10) || 0
      : 0,
    // 自營商買賣超
    dealerNetBuySell: contentData[EStockType.DEALER_NET_BUY_SELL]
      ? parseInt(contentData[EStockType.DEALER_NET_BUY_SELL][index], 10) || 0
      : 0,
    // 三大法人買賣超
    bigThreeNetBuySell: contentData[EStockType.BIG_THREE_NET_BUY_SELL]
      ? parseInt(contentData[EStockType.BIG_THREE_NET_BUY_SELL][index], 10) || 0
      : 0,
  }));
};
const getStockInfo = async (code, days) => {
  const url = `https://fubon-ebrokerdj.fbs.com.tw/Z/ZC/ZCW/CZKC1.djbcd?a=${code}&b=D&c=${days}`;
  const stockRes = await stockCrawler(url, evaluate);
  return stockRes;
};

module.exports = getStockInfo;
