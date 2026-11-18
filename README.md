# 臺灣時序 Taiwan Through Time

[![Atlas checks](https://github.com/victorfu/taiwan/actions/workflows/atlas.yml/badge.svg)](https://github.com/victorfu/taiwan/actions/workflows/atlas.yml)

以互動地圖探索臺灣與澎湖自 1624 至 1996 年的地方沿革。地圖以現代地形、海岸與河川為定位參照，逐年代繪出歷史地名、行政據點與事件，每筆記錄皆附史料出處。

目前為試閱版，收錄 **11 個年代快照、30 處地點、21 則事件**：

> 1624 · 1662 · 1684 · 1876 · 1884 · 1895 · 1908 · 1914 · 1945 · 1987 · 1996

---

## 目錄

- [功能特色](#功能特色)
- [快速開始](#快速開始)
- [操作說明](#操作說明)
- [指令一覽](#指令一覽)
- [專案結構](#專案結構)
- [史料資料與審閱流程](#史料資料與審閱流程)
- [測試](#測試)
- [建置與發布](#建置與發布)
- [參考文獻](#參考文獻)
- [底圖來源與授權](#底圖來源與授權)

---

## 功能特色

- **年代時間軸**：拖曳、點選或以鍵盤切換 11 個年代快照，也可自動播放。
- **離線地形底圖**：內附海岸線、河川水面及依高程格網計算的臺灣本島地形陰影，不需連網即可使用。
- **歷史圖幅對照**：1876、1884、1895、1908、1914、1945 年可疊加中研院歷史地圖圖磚（須連網），選單標示原圖測繪年代與使用條件。
- **現代街道底圖**：開啟時才載入 MapLibre，不影響首次載入速度。
- **史料出處**：每處地點、事件、年代導讀與歷史據點皆附來源連結與引用位置。
- **可分享的網址**：年代、圖層、選取地點與地圖視野皆保存在網址中，可直接分享或加入書籤。
- **安平故事導覽**：依序走訪六站，任一站皆可分享。
- **純文字閱讀版**：地方誌、事件與安平故事另有不需 JavaScript 的 HTML 頁面，並連回對應地圖。
- **史料修正單**：自動帶入當前年代與地點，填寫後下載文字檔交給編輯者。
- **響應式介面**：支援桌面、平板與手機，並提供完整鍵盤操作。

## 快速開始

### 方式一：免安裝試閱（Python）

不需安裝 Node.js，直接以靜態伺服器開啟：

```bash
python -m http.server 8076 --bind 127.0.0.1 --directory public
```

開啟 <http://127.0.0.1:8076/>。

### 方式二：開發環境（Node.js）

需要 **Node.js 24**。

```bash
npm ci
npm run dev
```

開啟 Vite 顯示的網址（預設 <http://127.0.0.1:5173/>）。`npm run dev` 啟動前會自動同步純文字閱讀頁。

使用 VS Code 時，可從「執行與偵錯」面板選擇 **Dev: Vite server + Chrome**，一併啟動開發伺服器並接上瀏覽器偵錯器。`.vscode/launch.json` 另提供單元測試、瀏覽器測試與資料驗證的偵錯設定。

## 操作說明

| 操作 | 方式 |
|---|---|
| 平移地圖 | 拖曳地圖，或使用方向鍵 |
| 縮放 | 滾輪、雙指縮放或 `+` / `−` 按鈕；全圖按鈕回到臺灣全貌 |
| 切換年代 | 拖曳底部時間軸、點選年份，或按 `←` / `→` |
| 播放 / 暫停 | `空白鍵` 或播放按鈕 |
| 搜尋 | 按 `/`，可查古今地名、事件或年代（「台」「臺」通用） |
| 地點詳情 | 點選地標開啟沿革卡片；卡片內的年份可比較同地不同年代的記載 |
| 圖層 | 從「圖層」選單切換地形、歷史據點、地名與年代事件 |
| 分享 | 「分享」按鈕複製目前狀態的網址 |
| 導覽 | 「導覽 → 安平故事導覽」 |

手機上點地圖下方的年代標題可展開當年紀事，閱讀欄可放大閱讀長文。

## 指令一覽

| 指令 | 說明 |
|---|---|
| `npm run dev` | 啟動 Vite 開發伺服器 |
| `npm run validate` | 驗證年代、來源、點位及事件關聯 |
| `npm run validate:release` | 驗證並要求所有資料已審閱通過 |
| `npm run references` | 依資料檔重新產生 [`docs/references.md`](docs/references.md) |
| `npm test` | 單元測試、建置入口測試及 Firefox 端到端測試 |
| `npm run test:unit` | 僅執行單元與建置入口測試（不需瀏覽器） |
| `npm run test:browser` | 以本機 Firefox 驗證介面與地圖 |
| `npm run test:built` | 驗證 `dist-demo/` 建置結果（Firefox 與 Chrome） |
| `npm run build` | 正式建置至 `dist/`，須所有資料已審閱 |
| `npm run build:demo` | 建置 React 試閱版至 `dist-demo/`，允許草稿 |
| `npm run build:local` | 建置免套件靜態試閱版至 `dist-local/` |
| `npm run preview` | 預覽建置結果 |

更新史料後執行 `node scripts/reading-pages.mjs` 同步純文字閱讀頁（各建置指令也會自動執行），並執行 `npm run references` 更新參考文獻；兩者若未同步，單元測試會失敗。

## 專案結構

```text
.
├── index.html              # React 開發與建置入口
├── src/                    # React 外殼與資料型別定義
├── public/
│   ├── index.html          # 免套件入口（Python 靜態伺服器用）
│   └── atlas/
│       ├── app.js          # 介面狀態、時間軸、搜尋與卡片
│       ├── map.js          # 地圖投影、平移縮放與繪製
│       ├── geography.js    # 海岸、河川與地形陰影
│       ├── historical-map.js  # 中研院歷史圖幅圖磚
│       ├── location.js     # 網址狀態的讀取與寫入
│       ├── data.js         # 安平與赤崁地點、事件、搜尋
│       ├── regional-places.js # 其他地區地點與事件
│       ├── periods.js      # 年代快照與導讀
│       ├── polities.js     # 各年代歷史行政據點
│       ├── geometry.js     # 地點現代概位
│       ├── story.js        # 安平故事導覽站點
│       ├── correction.*    # 史料修正單
│       └── *.html          # 由 scripts/reading-pages.mjs 產生的閱讀頁
├── scripts/                # 驗證、閱讀頁與參考文獻產生、manifest 與本機建置
├── tests/                  # 單元測試與瀏覽器端到端測試
├── docs/
│   ├── references.md       # 完整參考文獻（自動產生）
│   └── review/             # 史料審閱與行動裝置驗收紀錄
└── .github/workflows/      # CI（Windows、Node.js 24）
```

## 史料資料與審閱流程

### 資料檔

| 檔案 | 內容 |
|---|---|
| `public/atlas/data.js`、`regional-places.js` | 歷史地名、各年代摘要、別名、事件與出處 |
| `public/atlas/periods.js` | 年代快照與導讀 |
| `public/atlas/polities.js` | 各年代歷史行政據點，附來源與快照時點 |
| `public/atlas/geometry.js` | 地點的現代概位座標 |

地標採用現代地點概位；海岸、河川與高程屬現代地貌，作為各年代共用的定位參照。

### 審閱狀態

每筆地方條目（連同所屬事件）、年代導讀與歷史據點都帶有審閱狀態：

1. 新增或修改的資料預設為草稿（`draft`）。
2. 審閱者核對來源與引用位置，並將審閱紀錄寫入 `docs/review/`。
3. 審閱完成後，在對應物件設定 `status: 'approved'`。
4. `npm run build` 會先執行 `validate:release`，任何草稿都會阻止正式建置。

### 審閱紀錄

2026 年 11 月 18 日，Codex AI 分組獨立核讀 30 處地點的 43 筆年代記錄、21 則事件、11 篇導讀及 60 筆分年據點，記下原始來源、引用位置、勘誤與概位取捨：

- 地方記錄：[安平與赤崁](docs/review/anping.md)、[地方誌上篇](docs/review/regions-early.md)、[地方誌下篇](docs/review/regions-late.md)
- 跨區內容：[年代導讀](docs/review/snapshots.md)、[歷史據點](docs/review/polities.md)
- 行動裝置：[Android 手機驗收](docs/review/mobile-android.md)、[iPhone 尺寸 WebKit 驗收](docs/review/mobile-webkit.md)

實體手機與使用者試用另行記錄。

## 測試

| 層級 | 內容 | 需求 |
|---|---|---|
| 單元測試 | 網址狀態、搜尋、資料驗證規則、歷史據點繪製、圖磚計算、閱讀頁同步 | Node.js |
| 建置入口測試 | 建置腳本的命令列行為 | Node.js |
| 端到端測試 | 介面、地圖像素、鍵盤操作、分享網址、離線與圖磚失敗備援，涵蓋 1280 / 390 / 320 px 寬度 | 本機 Firefox |
| 建置結果測試 | 試閱版互動、MapLibre 實際渲染、HTTP 429 與啟動失敗備援 | 本機 Firefox、Chrome |

Firefox 路徑可透過環境變數 `FIREFOX_BIN` 指定。驗證 `build:local` 的輸出可執行：

```bash
node tests/browser.mjs --built
```

CI 於每次 push 與 pull request 在 Windows 上執行 `npm test`、`npm run build:demo` 與 `npm run test:built`。

## 建置與發布

| 輸出 | 指令 | 用途 |
|---|---|---|
| `dist/` | `npm run build` | 正式版，須全部資料審閱通過 |
| `dist-demo/` | `npm run build:demo` | React 試閱版，允許草稿 |
| `dist-local/` | `npm run build:local` | 免套件靜態試閱版，首頁為 `index.html` |

### 版本與回復

每次建置會產生 `manifest.json`，記錄版本、建置時間、收錄範圍及逐檔 SHA-256。

1. 正式審閱完成後，將完整的 `dist/` 依 manifest 的 `revision` 存放於獨立的版本目錄。
2. 驗收通過後，將主機的網站根目錄切換至該版本。
3. 需要回復時，切回上一個保留的版本目錄，程式與史料將一併還原。

## 參考文獻

全部史料與圖資出處彙整於 **[docs/references.md](docs/references.md)**，由 `npm run references` 從資料檔直接產生，與地圖顯示的內容一致。共 79 個不重複來源網址，分屬 53 個網站。

| 章節 | 內容 |
|---|---|
| 地方記錄 | 30 處地點的各年代記載名稱、相關事件、主要與補充來源，以及書目、頁碼或段落等引用位置 |
| 年代導讀 | 11 個年代快照導讀的引用來源與引用位置 |
| 歷史行政據點 | 各年代每個據點的來源 |
| 歷史圖幅 | 中研院歷史地圖的圖幅名稱、圖層識別碼與使用條件 |
| 底圖 | 地形、海岸、離島與河川資料的來源與授權 |
| 來源索引 | 依網站分組的所有網址，並註明每個網址被哪些條目引用 |

主要來源包括：

- **檔案與典藏**：國家發展委員會檔案管理局、中研院臺灣史研究所檔案館、日本國立國會圖書館數位典藏、國立故宮博物院、國立臺灣博物館、國立臺灣歷史博物館、國立臺灣圖書館
- **文獻與文資**：國史館臺灣文獻館、文化部文化資產局、立法院、行政院公報、原住民族委員會《原住民族文獻》
- **政府機關**：總統府、中央選舉委員會、國防部、內政部，以及國家公園、各縣市政府、文化局與區公所的出版品
- **圖資**：中研院人社中心 GIS 專題中心、政府資料開放平臺、Natural Earth、g0v

審閱過程中的查核與勘誤另見 [`docs/review/`](docs/review/)。

## 底圖來源與授權

| 圖層 | 來源 | 授權 |
|---|---|---|
| 山岳地形 | [內政部 20 公尺網格數值地形模型](https://data.gov.tw/dataset/35430)，經 [OsmHackTW terrain-rgb](https://github.com/OsmHackTW/terrain-rgb) 重採樣 | [政府資料開放授權條款第 1 版](https://data.gov.tw/license) |
| 海岸 | [Natural Earth 1:10m 陸地](https://github.com/nvkelso/natural-earth-vector) | [公有領域](https://www.naturalearthdata.com/about/terms-of-use/) |
| 離島 | [g0v twgeojson](https://github.com/g0v/twgeojson) 2010 年縣市圖資 | CC0 |
| 河川水面 | [mini-taiwan-terrain](https://github.com/ianlkl11234s/mini-taiwan-terrain) | MIT |
| 歷史圖幅 | 中央研究院人社中心 GIS 圖磚 | 依各圖幅標示之使用條件 |

完整說明見應用程式內的「底圖來源」頁（`public/atlas/map-sources.html`）。

本專案程式碼尚未指定授權條款。
