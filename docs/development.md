# 開發與維護指南

[返回臺灣時序首頁](../README.md) · [參考文獻](references.md) · [審閱紀錄](review/)

## 本機啟動

主要開發環境使用 **Node.js 24**。

```bash
npm ci
npm run dev
```

開啟 Vite 顯示的網址，預設為 <http://127.0.0.1:5173/>。Vite 啟動前會同步純文字閱讀頁。

VS Code 的「執行與偵錯」面板提供 **Dev: Vite server + Chrome**，也可以直接啟動測試與資料驗證。設定見 [launch.json](../.vscode/launch.json)。

如果只想在本機試閱，可以直接用 Python 提供 `public/` 下的靜態版，網址為 <http://127.0.0.1:8076/>。

```bash
python -m http.server 8076 --bind 127.0.0.1 --directory public
```

## 專案結構

React 入口負責掛載地圖介面及按需載入 MapLibre。靜態版與 React 版共用 `public/atlas/` 的介面、資料和地圖繪製程式。

| 位置 | 內容 |
| --- | --- |
| [`index.html`](../index.html)、[`src/`](../src/) | React 入口、外殼與 TypeScript 資料型別 |
| [`public/index.html`](../public/index.html) | 免套件靜態入口 |
| [`app.js`](../public/atlas/app.js)、[`location.js`](../public/atlas/location.js) | 介面狀態、時間軸、卡片、搜尋與網址還原 |
| [`map.js`](../public/atlas/map.js)、[`geography.js`](../public/atlas/geography.js)、[`historical-map.js`](../public/atlas/historical-map.js) | 投影、平移縮放、地形繪製與歷史圖磚 |
| [`data.js`](../public/atlas/data.js)、[`regional-places.js`](../public/atlas/regional-places.js) | 地方條目、別名、年代記錄與事件 |
| [`periods.js`](../public/atlas/periods.js)、[`polities.js`](../public/atlas/polities.js) | 年代導讀和分年歷史據點 |
| [`geometry.js`](../public/atlas/geometry.js)、[`story.js`](../public/atlas/story.js) | 地點概位與安平故事站點 |
| [`scripts/`](../scripts/)、[`tests/`](../tests/) | 資料驗證、生成文件、建置與測試 |
| [`.github/workflows/`](../.github/workflows/) | Windows CI 與 GitHub Pages 發布 |

## 更新史料

1. 在對應資料檔更新年代、別名、摘要、引用位置與概位，將待核對的資料標記為 `draft`。
2. 核對出處、所指時點與位置精度，把異說、勘誤及審閱依據記錄在 [`docs/review/`](review/)。
3. 核對完成後，將對應資料標記為 `approved`。地方條目與所屬事件一起審閱。年代導讀與行政據點依快照年審閱。
4. 同步閱讀頁與參考文獻，再執行驗證與單元測試。測試會檢查生成內容是否與資料檔一致。

```bash
node scripts/reading-pages.mjs
npm run references
npm run validate
npm run test:unit
```

`npm run validate` 檢查年代、來源、點位及事件關聯。`npm run validate:release` 另外要求資料已審閱。正式建置會執行發布驗證，遇到草稿會中止。

## 測試

| 指令 | 驗證內容 | 需求 |
| --- | --- | --- |
| `npm run test:unit` | 搜尋、網址狀態、史料驗證、圖磚計算、閱讀頁與文獻同步、建置入口 | Node.js |
| `npm run test:browser` | 地圖像素、時間軸、鍵盤操作、分享還原及圖資備援，涵蓋 1280、390 和 320 像素寬度 | Firefox |
| `npm test` | 單元、建置入口及 Firefox 端到端測試 | Node.js、Firefox |
| `npm run build:demo` 後執行 `npm run test:built` | 建置後的互動、MapLibre 渲染、單張圖磚 HTTP 429、啟動失敗備援 | Firefox、Chrome |
| `npm run build:local` 後執行 `node tests/browser.mjs --built` | 免套件建置的瀏覽器驗收 | Firefox |

可用 `FIREFOX_BIN` 指定 Firefox 執行檔。Windows CI 在 push 與 pull request 執行測試、試閱版建置與建置結果驗收。[CI 工作流程](../.github/workflows/atlas.yml)

行動裝置的環境、已知限制與重測方式，分別記錄在 [Android 驗收](review/mobile-android.md)與 [iPhone 尺寸 WebKit 驗收](review/mobile-webkit.md)。

## 建置與發布

| 指令 | 輸出 | 用途 |
| --- | --- | --- |
| `npm run build` | `dist/` | 通過審閱驗證的正式版 |
| `npm run build:demo` | `dist-demo/` | 允許草稿的 React 試閱版 |
| `npm run build:local` | `dist-local/` | 免套件靜態試閱版 |
| `npm run preview` | 本機網址 | 預覽 `dist/` 的正式建置 |

GitHub Pages 使用 **GitHub Actions** 作為發布來源。推送至 `master` 後，發布工作流程在 Ubuntu 與 Node.js 24 上建置正式版，將 `dist/` 部署到 [臺灣時序](https://victorfu.github.io/taiwan/)。也可在 Actions 手動對 `master` 執行。 [Pages 工作流程](../.github/workflows/pages.yml)

各建置都產生 `manifest.json`，記錄版本、建置時間、收錄統計和逐檔 SHA-256。自管靜態伺服器時，可依 manifest 的 `revision` 留存各版完整產物，以便整批切回上一版。GitHub Pages 上需要回復變更時，可用 revert 提交觸發重新部署。
