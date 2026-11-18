# 臺灣時序

從全臺與澎湖的地形、海岸及歷史據點探索 1624 至 1996 年。試閱版收錄 11 個年代快照、30 處地點與 21 則事件。

## 開啟地圖

在專案根目錄執行以下指令，再開啟 [臺灣時序](http://127.0.0.1:8076/)。

```powershell
python -m http.server 8076 --bind 127.0.0.1 --directory public
```

全臺地圖內附海岸線、河川及依高程格網繪製的臺灣本島地形陰影。1876、1884、1895、1908、1914、1945 年另可開啟中研院歷史圖幅對照，該圖層須連網，選單標示原圖年代及使用條件。可執行 `npm run build:local` 輸出完整靜態網站到 `dist-local/`，其首頁為 `index.html`。

## 探索

- 拖曳地圖平移，滾輪或加減按鈕縮放，點全圖控制回到臺灣全貌。
- 拖曳底部時間軸、點年份，或按左右鍵切換年代。空白鍵播放與暫停。
- 按 `/` 搜尋古今地名、事件或年代。點地標可讀地方沿革及出處；卡片內的年份可比較同地其他記載。
- 從「圖層」切換地形、歷史據點、地名及年代事件。各年代的據點說明列在閱讀欄。
- 點「分享」複製含年代、圖層、地點與地圖視野的網址。手機點地圖下方的年代標題可展開紀事。
- 從「導覽 → 安平故事導覽」依序走訪六站，可以把任一站的地圖分享給他人。手機可放大閱讀欄閱讀長文。
- 「地方誌與事件」及「閱讀安平故事全文」提供純 HTML 文字版，每條記錄都有史料出處與對應地圖連結。
- 開啟「填寫史料修正單」會帶入當前年代與地點。填妥後可下載文字檔，內含地圖網址與查考依據，供交給編輯者。

## 資料與驗證

`public/atlas/data.js` 與 `regional-places.js` 保存歷史地名、摘要及事件，`periods.js` 提供年代導讀，`geometry.js` 保存地點概位。`polities.js` 的歷史據點各附來源與快照時點。現代地貌作為各年代共用參照。

2026 年 11 月 18 日，Codex AI 分組獨立核讀 30 處地點的 43 筆年代記錄、21 則事件、11 篇導讀及 60 筆分年據點。各組記下原始來源、引用位置、勘誤與概位取捨。地方記錄見[安平與赤崁](docs/review/anping.md)、[地方誌上篇](docs/review/regions-early.md)與[地方誌下篇](docs/review/regions-late.md)。跨區內容見[年代導讀](docs/review/snapshots.md)與[歷史據點](docs/review/polities.md)。

- `npm test` 執行單元、建置入口及 Firefox 端到端測試。只執行前兩項可用 `npm run test:unit`。Firefox 可透過 `FIREFOX_BIN` 指定。
- `npm run validate` 檢查年代、來源、點位及事件關聯。
- `npm run test:browser` 使用本機 Firefox 驗證介面與地圖。
- `npm run build:local` 建置免套件試閱版。建置後可執行 `node tests/browser.mjs --built` 驗證輸出網站。
- React 入口可用 Node.js 24 與 `npm ci` 安裝相依套件，再用 `npm run dev` 啟動。現代街道底圖在開啟時才載入 MapLibre。
- `npm run build:demo` 建置 React 試閱版到 `dist-demo/`，再執行 `npm run test:built`。Firefox 驗證互動與離線流程，Chrome 使用實際 MapLibre 渲染器驗證單張圖磚 HTTP 429 及啟動失敗備援。測試使用本機安裝的瀏覽器。更新史料後，執行 `node scripts/reading-pages.mjs` 同步文字版，建置時也會自動同步。
- `npm run build` 在正式建置前檢查審核狀態。地方條目連同所屬事件一起審閱，年代導讀與歷史據點按快照年審閱。審閱完成後在相應物件記錄 `status: 'approved'`。草稿會阻止產生正式版。
- 行動環境的版本、操作與實測界線分別記於 [Android 手機驗收](docs/review/mobile-android.md)與 [iPhone 尺寸 WebKit 驗收](docs/review/mobile-webkit.md)。實體手機與五位使用者試用另行記錄。

## 版本與回復

每次建置產生 `manifest.json`，包含版本、建置時間、收錄範圍與逐檔 SHA-256。正式審閱完成後，將完整的 `dist/` 依 manifest 的 revision 留存於各自的版本目錄，驗收後再切換主機的網站根目錄。需要回復時切回上一個保留的目錄，同時還原程式與史料。


