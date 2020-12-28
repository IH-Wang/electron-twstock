# 股溝桌面應用程式

有鑒於大多數看盤軟體不支援 mac,而且自己因為懶得架資料庫跟 server,  
只好利用女兒睡著之後的閒暇時間，開發一個桌面應用程式,  
讓自己能方便看的台股盤後快速篩選工具, 順便玩一下 svelte, 使用技術如下:

-   封裝: Electron.js,
-   前端: Svelte.js, Tailwind.css
-   爬蟲: axios + cheerio
-   資料: idb(indexedDB)

## Screenshot

![](https://i.imgur.com/T7BzZgs.gif)

## 目前功能

資料是先抓每股 240 天做短線的均線判斷

1. 價量篩選 - 價格、成交量、漲跌、價量關係篩選
2. 技術篩選 - 均線、布林、MACD、KD 指標篩選
3. 籌碼篩選 - 三大法人買賣超、買賣轉折進出場篩選

## 待完成

1. 打包封裝測試

## Run

(mac)

```mac
yarn start
```

(windows)

```windows
yarn start:windows
```

## Author

Yiheng Wang (ih.wang49@gmail.com)

## License

MIT

## roadmap

-   v0.1 - 初版 windows & mac 桌面程式
-   v0.1.1 - UI 調整及新增技術篩選

歡迎提出 issue

**(最後，感謝找到主力發現獲利的主力大 Nick 的策略教學)**
