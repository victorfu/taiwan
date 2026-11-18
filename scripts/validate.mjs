import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import * as atlas from '../public/atlas/data.js';
import { polityLayers } from '../public/atlas/polities.js';

const statuses = new Set(['draft', 'in_review', 'approved', 'published', 'needs_revision', 'withdrawn']);
const publicStatuses = new Set(['approved', 'published']);

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateSource(url, id) {
  assert.ok(hasText(url) && URL.canParse(url) && new URL(url).protocol === 'https:',
    `${id}：來源須為完整 HTTPS 網址`);
}

/** @param {import('../src/atlas-data.ts').AtlasData} data */
export function validateAtlas(data, { release = false } = {}) {
  const { years, periods, places, points, events } = data;
  assert.ok(years.length > 0 && years.every((year, i) =>
    Number.isSafeInteger(year) && (i === 0 || years[i - 1] < year)), '快照年須為依序排列且不重複的整數');
  assert.ok(periods.length === years.length && periods.every(hasText), '每個快照年須有對應的年代標題');
  assert.ok(places.length > 0, '資料集缺少地點');
  const byId = new Map();
  for (const place of places) {
    const { id, modern, region, records, status } = place;
    assert.ok(hasText(id) && !byId.has(id), `無效或重複的地點 ID：${id}`);
    byId.set(id, place);
    assert.ok(hasText(modern) && hasText(region), `${id}：缺少現名或區域`);
    validateSource(place.source, id);
    if (place.extra !== undefined) validateSource(place.extra, id);
    assert.ok(hasText(place.locator), `${id}：缺少來源引用位置`);
    assert.ok(statuses.has(status), `${id}：無效的審核狀態`);
    assert.ok(!release || publicStatuses.has(status), `尚待審閱：${id}（${status}）`);

    const point = points[id];
    assert.ok(Array.isArray(point) && point.length === 2 && point.every(Number.isFinite)
      && Math.abs(point[0]) <= 180 && Math.abs(point[1]) <= 90, `${id}：座標須為有效的 WGS 84 經度、緯度`);
    assert.ok(records && typeof records === 'object' && !Array.isArray(records)
      && Object.keys(records).length > 0, `${id}：缺少年代記錄`);
    for (const [year, record] of Object.entries(records)) {
      assert.ok(years.some(value => String(value) === year), `${id}：未知快照年 ${year}`);
      assert.ok(Array.isArray(record) && record.length === 2 && hasText(record[0]) && hasText(record[1]),
        `${id} ${year}：年代記錄須包含名稱與摘要`);
    }
    for (const [year, names] of Object.entries(place.aliases ?? {})) {
      assert.ok(records[year] && Array.isArray(names) && names.length && names.every(hasText),
        `${id} ${year}：別名須對應有效的年代記錄`);
    }
  }
  for (const id of Object.keys(points)) {
    assert.ok(byId.has(id), `${id}：座標未對應任何地點`);
  }
  for (const [index, event] of events.entries()) {
    assert.ok(Array.isArray(event) && event.length === 3, `第 ${index + 1} 則事件缺少年代、地點或標題`);
    const [year, id, title] = event;
    assert.ok(hasText(title) && years.includes(year) && byId.get(id)?.records[year],
      `事件「${title}」須對應有效地點與年代記錄（${id} ${year}）`);
  }
}

export function validatePeriodNotes(years, notes, { release = false } = {}) {
  assert.deepEqual(Object.keys(notes).map(Number), years, '年代導讀須涵蓋所有快照年');
  for (const year of years) {
    const note = notes[year];
    assert.ok([note.era, note.title, note.summary].every(hasText), `${year}：年代導讀缺少時期、標題或摘要`);
    validateSnapshotReview(note, `${year} 年代導讀`, release);
  }
}

function validateSnapshotReview(record, id, release) {
  const status = record.status ?? 'draft';
  assert.ok(statuses.has(status), `${id}：無效的審核狀態`);
  assert.ok(!release || publicStatuses.has(status), `尚待審閱：${id}（${status}）`);
}

export function validatePolities(years, layers, { release = false } = {}) {
  assert.deepEqual(Object.keys(layers).map(Number), years, '政權據點圖層須涵蓋所有快照年');
  for (const year of years) {
    const { title, note, centers } = layers[year];
    validateSnapshotReview(layers[year], `${year} 歷史據點`, release);
    assert.ok(hasText(title) && hasText(note) && Array.isArray(centers) && centers.length,
      `${year}：政權據點圖層缺少標題、說明或據點`);
    assert.equal(new Set(centers.map(center => center.label)).size, centers.length, `${year}：據點名稱重複`);
    for (const { label, point, source } of centers) {
      const id = `${year} ${label}`;
      assert.ok(hasText(label) && Array.isArray(point) && point.length === 2 &&
        point.every(Number.isFinite) && Math.abs(point[0]) <= 180 && Math.abs(point[1]) <= 90,
        `${id}：政權據點名稱或座標無效`);
      validateSource(source, id);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const options = { release: process.argv.includes('--release') };
    validateAtlas(atlas, options);
    validatePeriodNotes(atlas.years, atlas.periodNotes, options);
    validatePolities(atlas.years, polityLayers, options);
    console.log(`通過 ${atlas.years.length} 個快照、${atlas.places.length} 處地點與 ${atlas.events.length} 則事件的驗證。`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
