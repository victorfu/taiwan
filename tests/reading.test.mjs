import test from 'node:test';
import assert from 'node:assert/strict';
import { readLocation, viewUrl } from '../public/atlas/location.js';
import { prepareReadingPages } from '../scripts/reading-pages.mjs';
import { anpingStory } from '../public/atlas/story.js';

test('文字版與地圖使用相同的已收錄史料', async () => {
  await prepareReadingPages({check:true});
});

test('安平各站與圖層可透過分享網址還原', () => {
  for (const {year,id} of anpingStory) {
    const url = new URL('https://example.org/map/');
    const state = readLocation(new URLSearchParams({year,place:id,story:'anping',modern:'1'}));
    assert.equal(state.invalid,false);
    assert.equal(state.story,'anping');
    assert.equal(state.modern,true);
    assert.deepEqual(readLocation(viewUrl(url,state).searchParams),state);
  }
  const historic = readLocation(new URLSearchParams('year=1876&historic=1'));
  assert.equal(historic.historic,true);
  assert.equal(viewUrl('https://example.org/',historic).searchParams.get('historic'),'1');
  for (const query of ['year=1624&historic=1','year=1987&place=castle&story=anping','modern=x']) {
    assert.equal(readLocation(new URLSearchParams(query)).invalid,true);
  }
});
