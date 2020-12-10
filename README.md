# 股溝桌面應用程式

有鑒於大多數看盤軟體不支援 mac,而且自己因為懶得架資料庫跟 server,  
只好開發一個桌面應用程式, 讓自己能方便看的台股盤後快速篩選工具,  
順便玩一下 svelte, 使用技術如下:

-   封裝: Electron.js,
-   前端: Svelte.js, Tailwind.css
-   爬蟲: axios + cheerio
-   資料: idb(indexedDB)

## Screenshot

![](https://i.imgur.com/T7BzZgs.gif)

## 目前功能

資料是先抓每股 120 天做短線的均線判斷

1. 高低價及收盤價篩選
2. 多空排列、均線糾結、旗型、破切、布林篩選
3. 三大法人連續買賣超、買賣轉折篩選

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

-   v0.1 - 打包成 windows & mac 桌面程式
-   v0.1.5 - 下載 excel 報表功能
-   v0.2 - TBD

歡迎提出 issue

**(最後，感謝找到主力發現獲利的主力大 Nick 的策略教學)**
