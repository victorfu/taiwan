import test from 'node:test';
import assert from 'node:assert/strict';
import { drawPolities, polityLayers } from '../public/atlas/polities.js';
import { years } from '../public/atlas/periods.js';
import { validatePolities } from '../scripts/validate.mjs';

test('政權據點逐年有引用，十二廳涵蓋東部與澎湖', () => {
  validatePolities(years, polityLayers);
  assert.throws(() => validatePolities(years, {}), /涵蓋所有快照年/);
  const labels = polityLayers[1914].centers.map(center => center.label);
  const earlierLabels = new Set(polityLayers[1908].centers.map(center => center.label));
  assert.equal(earlierLabels.size, 20);
  assert.equal(earlierLabels.has('花蓮港廳'), false);
  assert.equal(new Set(labels).size, 12);
  for (const label of ['花蓮港廳', '臺東廳', '澎湖廳']) assert.ok(labels.includes(label));
});

test('地圖僅繪出快照當年的可見據點', () => {
  const labels = [];
  let marks = 0;
  const ctx = {
    save() {}, restore() {}, strokeRect() {}, strokeText() {},
    fillRect() { marks++; },
    fillText(label) { labels.push(label); },
    measureText(label) { return { width: label.length * 12 }; }
  };
  const project = ([lon, lat]) => [(lon - 119) * 200, (26 - lat) * 120];
  drawPolities(ctx, 1895, project, 800, 500);
  assert.equal(marks, 2);
  assert.ok(labels.some(label => label.includes('臺灣民主國')));
  drawPolities(ctx, 1914, () => [-10, 50], 800, 500);
  drawPolities(ctx, 1800, project, 800, 500);
  assert.equal(marks, 2);
  const obstacle = { left: 0, right: 800, middle: 250, height: 500 };
  drawPolities(ctx, 1895, project, 800, 500, [obstacle]);
  assert.equal(marks, 4);
  assert.equal(labels.length, 2);
});
