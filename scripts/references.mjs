// Generates docs/references.md: every source cited by the atlas data.
// Run `node scripts/references.mjs` after editing data; `--check` fails when the file is stale.
import { readFile, writeFile } from 'node:fs/promises';
import { places, events, periodNotes, years } from '../public/atlas/data.js';
import { polityLayers } from '../public/atlas/polities.js';
import { historicalSheets } from '../public/atlas/historical-map.js';
import { isMain } from './is-main.mjs';

const output = new URL('../docs/references.md', import.meta.url);

const basemaps = [
  ['山岳地形', '內政部地政司 20 公尺網格數值地形模型（資料集 35430）', 'https://data.gov.tw/dataset/35430', '政府資料開放授權條款第 1 版'],
  ['山岳地形', 'OsmHackTW terrain-rgb 第 9 級高程圖磚（重採樣來源）', 'https://github.com/OsmHackTW/terrain-rgb', '政府資料開放授權條款第 1 版'],
  ['海岸', 'Natural Earth 1:10m 陸地幾何', 'https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_land.geojson', '公有領域'],
  ['離島', 'g0v twgeojson 2010 年縣市圖資', 'https://github.com/g0v/twgeojson', 'CC0'],
  ['河川水面', 'mini-taiwan-terrain 河川水面多邊形', 'https://github.com/ianlkl11234s/mini-taiwan-terrain/blob/main/public/layers/river_surfaces.json', 'MIT']
];

const sheetServices = {
  tainan: 'https://gis.sinica.edu.tw/tainan/',
  taipei: 'https://gis.sinica.edu.tw/taipei/',
  tileserver: 'https://gis.sinica.edu.tw/tileserver/'
};

/** @param {string} text */
const cell = text => String(text).replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
/** @param {string} url */
const link = url => `<${url}>`;

/** @returns {string} */
export function referencesMarkdown() {
  /** @type {Map<string, Set<string>>} */
  const uses = new Map();
  /** @param {string} url @param {string} where */
  const use = (url, where) => {
    if (!uses.has(url)) uses.set(url, new Set());
    uses.get(url).add(where);
  };

  const lines = [
    '# 史料與資料參考文獻',
    '',
    '> 本檔由 `node scripts/references.mjs` 依 `public/atlas/` 的資料檔產生，請勿手動編輯。',
    '',
    `收錄 ${years.length} 個年代快照、${places.length} 處地點、${events.length} 則事件，以及各年代導讀、歷史據點、歷史圖幅與底圖的全部出處。審閱過程與勘誤見 [docs/review/](review/)。`,
    '',
    '## 目錄',
    '',
    '1. [地方記錄](#1-地方記錄)',
    '2. [年代導讀](#2-年代導讀)',
    '3. [歷史行政據點](#3-歷史行政據點)',
    '4. [歷史圖幅](#4-歷史圖幅)',
    '5. [底圖](#5-底圖)',
    '6. [來源索引](#6-來源索引)',
    '',
    '## 1. 地方記錄',
    '',
    '依最早收錄年代排序。每處地點列出各年代記載名稱、相關事件、主要來源、補充來源與引用位置。',
    ''
  ];

  const firstYear = place => Math.min(...Object.keys(place.records).map(Number));
  for (const place of [...places].sort((a, b) => firstYear(a) - firstYear(b) || a.id.localeCompare(b.id))) {
    const where = `地點 ${place.modern}`;
    lines.push(`### ${place.modern}`, '');
    lines.push(`- **地區**：${place.region}`);
    lines.push(`- **識別碼**：\`${place.id}\`　**審閱狀態**：${place.status}`);
    const recordNames = Object.entries(place.records)
      .map(([year, [name]]) => {
        const aliases = place.aliases?.[Number(year)];
        return `${year} ${name}${aliases?.length ? `（又稱 ${aliases.join('、')}）` : ''}`;
      });
    lines.push(`- **年代記載**：${recordNames.join('；')}`);
    const placeEvents = events.filter(([, id]) => id === place.id);
    if (placeEvents.length) lines.push(`- **相關事件**：${placeEvents.map(([year, , title]) => `${year} ${title}`).join('；')}`);
    lines.push(`- **主要來源**：${link(place.source)}`);
    use(place.source, where);
    if (place.extra) {
      lines.push(`- **補充來源**：${link(place.extra)}`);
      use(place.extra, where);
    }
    lines.push(`- **引用位置**：${place.locator}`, '');
  }

  lines.push('## 2. 年代導讀', '');
  for (const year of years) {
    const note = periodNotes[year];
    lines.push(`### ${year}　${note.title}`, '');
    lines.push(`- **時期**：${note.era}　**審閱狀態**：${note.status ?? 'draft'}`);
    for (const citation of note.citations ?? []) {
      lines.push(`- ${link(citation.url)}  `, `  ${citation.locator}`);
      use(citation.url, `${year} 年代導讀`);
    }
    lines.push('');
  }

  lines.push('## 3. 歷史行政據點', '', '據點座標為聚落或市街概位，非官署精確位置。', '');
  for (const year of years) {
    const layer = polityLayers[year];
    if (!layer) continue;
    lines.push(`### ${year}　${layer.title}`, '');
    if (layer.note) lines.push(layer.note, '');
    lines.push(`審閱狀態：${layer.status ?? 'draft'}`, '', '| 據點 | 來源 |', '|---|---|');
    for (const center of layer.centers) {
      lines.push(`| ${cell(center.label)} | ${link(center.source)} |`);
      use(center.source, `${year} 歷史據點`);
    }
    lines.push('');
  }

  lines.push(
    '## 4. 歷史圖幅',
    '',
    '圖磚由中央研究院人文社會科學研究中心地理資訊科學研究專題中心提供，須連網載入。使用條件：<https://iptt.sinica.edu.tw/shares/1121>',
    '',
    '| 對照年代 | 圖幅 | 圖層識別碼 | 圖磚服務 |',
    '|---|---|---|---|'
  );
  for (const [year, sheet] of Object.entries(historicalSheets)) {
    const service = sheetServices[sheet.service] ?? sheet.service;
    lines.push(`| ${year} | ${cell(sheet.title)} | \`${sheet.id}\` | ${link(service)} |`);
    use(service, `${year} 歷史圖幅`);
  }
  use('https://iptt.sinica.edu.tw/shares/1121', '歷史圖幅使用條件');

  lines.push('', '## 5. 底圖', '', '現代地貌作為各年代共用的定位參照。', '', '| 圖層 | 資料 | 來源 | 授權 |', '|---|---|---|---|');
  for (const [layer, title, url, license] of basemaps) {
    lines.push(`| ${layer} | ${cell(title)} | ${link(url)} | ${license} |`);
    use(url, `底圖・${layer}`);
  }

  const hosts = new Map();
  for (const url of uses.keys()) {
    const host = new URL(url).hostname;
    if (!hosts.has(host)) hosts.set(host, []);
    hosts.get(host).push(url);
  }
  lines.push(
    '',
    '## 6. 來源索引',
    '',
    `共 ${uses.size} 個不重複網址，來自 ${hosts.size} 個網站，依網站分組。`,
    ''
  );
  for (const host of [...hosts.keys()].sort()) {
    lines.push(`### ${host}`, '');
    for (const url of hosts.get(host).sort()) {
      lines.push(`- ${link(url)}  `, `  引用於：${[...uses.get(url)].join('、')}`);
    }
    lines.push('');
  }

  return lines.join('\n').replace(/\n+$/, '\n');
}

if (isMain(import.meta)) {
  const markdown = referencesMarkdown();
  if (process.argv.includes('--check')) {
    const current = await readFile(output, 'utf8').catch(() => '');
    if (current.replace(/\r\n/g, '\n') !== markdown) {
      console.error('docs/references.md 需要更新，請執行 node scripts/references.mjs');
      process.exitCode = 1;
    }
  } else {
    await writeFile(output, markdown);
    console.log('已產生 docs/references.md');
  }
}
