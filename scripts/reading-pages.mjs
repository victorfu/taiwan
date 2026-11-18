import { readFile, writeFile } from 'node:fs/promises';
import { isMain } from './is-main.mjs';
import { places, points, events, years } from '../public/atlas/data.js';
import { anpingStory } from '../public/atlas/story.js';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const anchor = (url, label) => `<a href="${escape(url)}">${escape(label)}</a>`;

function mapLink(place, year, story = false) {
  const params = new URLSearchParams({ year, place: place.id, view: [...points[place.id], 13].join(',') });
  if (story) params.set('story', 'anping');
  return anchor('../index.html?' + params, story ? '從這一站探索地圖' : '在地圖查看');
}

function page(title, description, body) {
  return `<!doctype html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} · 臺灣時序</title><meta name="description" content="${escape(description)}"><link rel="icon" href="../favicon.ico"><link rel="apple-touch-icon" href="favicon.png"><link rel="stylesheet" href="reader.css"></head>
<body><header><a href="../index.html">臺灣時序</a><nav aria-label="閱讀導覽"><a href="anping.html">安平故事</a><a href="places.html">地方誌</a><a href="prehistory.html">史前遺址</a><a href="method.html">編輯方法</a></nav></header>
<main><h1>${escape(title)}</h1><p class="intro">${escape(description)}</p>${body}</main>
<footer><a href="../index.html">返回互動地圖</a> · <a href="correction.html">填寫史料修正單</a></footer></body></html>\n`;
}

function citation(place) {
  return `<p class="source">${anchor(place.source, '史料出處')}　${escape(place.locator)}${place.extra ? '　' + anchor(place.extra, '延伸資料') : ''}</p>`;
}

function placeEntry(place) {
  const records = Object.entries(place.records).map(([year, [name, summary]]) => {
    const related = events.filter(([y, id]) => y === Number(year) && id === place.id);
    const aliases = place.aliases?.[year];
    return `<section><h3>${year} 年 · ${escape(name)}</h3>${aliases ? '<p>別名　' + escape(aliases.join('、')) + '</p>' : ''}
<p>${escape(summary)}</p>${related.map(event => '<p class="event">當年事件　' + escape(event[2]) + '</p>').join('')}
${mapLink(place, year)}</section>`;
  });
  return `<article id="${escape(place.id)}"><p class="region">${escape(place.region)}</p><h2>${escape(place.modern)}</h2>
${records.join('\n')}${citation(place)}<a href="#contents">回到地點索引 ↑</a></article>`;
}

export function readingPages() {
  const toc = places.map(p => '<li>' + anchor('#' + p.id, p.modern) + '</li>').join('');
  const directory = `<nav id="contents" aria-label="地點索引"><h2>地點索引</h2><ul class="contents">${toc}</ul></nav>${places.map(placeEntry).join('\n')}`;
  const stops = anpingStory.map(({ year, id }, i) => {
    const place = places.find(item => item.id === id);
    if (!place?.records[year]) throw new Error(`安平故事第 ${i + 1} 站缺少 ${id} 的 ${year} 年記錄`);
    const [name, summary] = place.records[year];
    return `<article><p class="region">第 ${i + 1} 站　${year} 年</p><h2>${escape(name)}</h2><p>${escape(summary)}</p>
${mapLink(place, year, true)}${citation(place)}</article>`;
  });
  return {
    'places.html': page('地方誌與事件', `從現代地名查閱 ${places.length} 處地方的沿革與 ${events.length} 則事件。各地僅列有收錄的年份。`, directory),
    'anping.html': page('安平港的四個年代', '從大員築城到通商口岸，沿著安平古堡、赤崁樓、德記洋行與億載金城的記錄，閱讀同一帶海岸的變化。', stops.join('\n')),
    'method.html': page('編輯方法與圖資', '閱讀年份、位置與出處時，可以用下列方式判斷資料的涵蓋範圍。', `
<h2>年代快照</h2><p>全圖收錄 ${years.join('、')} 年。每筆名稱與摘要屬於指定快照，兩個快照之間的沿革仍可能有缺口。</p>
<h2>位置與圖層</h2><p>地標使用現代地點概位。歷史據點以點位呈現，海岸、河流與高程提供現代定位參照。開啟歷史圖幅時，請以圖幅標題標示的測繪年代判讀。</p>
<p>${anchor('map-sources.html','底圖出處與使用條件')}</p>
<h2>查證與修正</h2><p>2026 年 11 月 18 日，Codex AI 分組核讀地方誌、事件、年代導讀與歷史據點，對照檔案、館藏、地方志及研究文獻。地點卡列出引用位置，各年代可展開「年代導讀出處」。例如 1684 年澎湖設巡檢司，署址的不同記載保留在文澳條目。若發現疑義，可在導覽選單開啟修正單，附上條目及查考依據。</p>
<p>${anchor('places.html','閱讀各地記錄與出處')}</p>`)
  };
}

export async function prepareReadingPages({ check = false } = {}) {
  for (const [name, html] of Object.entries(readingPages())) {
    const file = new URL('../public/atlas/' + name, import.meta.url);
    if (check) {
      const existing = (await readFile(file,'utf8')).replace(/\r\n/g,'\n');
      if (existing !== html) throw new Error(name + ' 需要更新，請執行 node scripts/reading-pages.mjs');
    } else await writeFile(file, html);
  }
}

if (isMain(import.meta)) {
  await prepareReadingPages({ check: process.argv.includes('--check') });
}
