# Android 手機瀏覽器驗收

2026-11-18 在 Windows 的本機 Android Emulator 37.4.1 執行 Google APIs Android 15（API 35、x86_64）映像，使用映像內的 Chrome 124.0.6367.219 及 Gboard。裝置畫面為 1080 × 2160、420 dpi。驗收時 ADB 裝置清單只有模擬器。最終網站建置版本為 `0d605ce8a1bbd61aa1537fa3efc5f49064d9ff7cba008182dad3d5365695c008`。

| 流程 | 實際觀察 |
| --- | --- |
| 搜尋與系統鍵盤 | 直向視窗為 412 × 719 CSS px。觸控搜尋框後，系統鍵盤將可視高度縮到 435 px。在鍵盤展開時輸入「熱蘭遮」、點選結果，開啟安平古堡地點卡並收起鍵盤。 |
| 閱讀 | 可放大、縮小及收合地點卡，再回到全臺視野。 |
| 單指與雙指 | Chrome 冷啟動後完整流程通過。單指拖曳使地圖中心從 120.95、23.68 移到 120.40511、23.94587；雙指展開使縮放層級從 6.27471 升至 7.27471。 |
| 導覽與分享 | 點按導覽走完六站。在第六站點分享得到複製成功提示，重開該視圖網址後恢復 1895 年德記洋行及第六站。 |
| 橫向 | 旋轉至 823 × 308 CSS px，地圖高約 128 px。修正前，縮小按鈕位於頁首下方而無法點選。修正後，低地圖視窗使用橫排工具列，可點選縮小、切至 1908 年並回到直向。 |

**仍可重現的限制**　Chrome 124 在同一模擬器程序反覆執行時，曾出現收合鍵盤及閱讀欄後，按鈕可以點選、地圖拖曳卻未收到指標事件的情況。以 Android 系統滑動與瀏覽器觸控注入都能觀察到。重啟瀏覽器後，全套流程再次通過。保留此項為間歇性問題；持續使用、跨旋轉的手勢穩定性仍待更多裝置驗證。

## 重跑

在專用 Android 模擬器開啟 USB 偵錯與 Chrome，以 ADB reverse 將測試手機的 8076 埠連到本機網站，並將瀏覽器的 DevTools socket 轉送到本機。以下以本次模擬器名稱與埠為例。

```powershell
adb -s emulator-5584 reverse tcp:8076 tcp:8076
adb -s emulator-5584 forward tcp:19584 localabstract:chrome_devtools_remote
adb -s emulator-5584 shell am start -a android.intent.action.VIEW -d http://127.0.0.1:8076/ -p com.android.chrome
node tests/android.mjs emulator-5584 19584
```

測試程式會從已開啟的本機分頁進入地圖，於結束時還原模擬器原先的旋轉設定。iPhone 尺寸的測試另見 [WebKit 驗收](mobile-webkit.md)。
