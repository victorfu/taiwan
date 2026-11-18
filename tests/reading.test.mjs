import test from 'node:test';
import assert from 'node:assert/strict';
import { readLocation, viewUrl } from '../public/atlas/location.js';
import { prepareReadingPages,readingPages } from '../scripts/reading-pages.mjs';
import { places,events } from '../public/atlas/data.js';
import { anpingStory } from '../public/atlas/story.js';

test('文字版與地圖使用相同的已收錄史料', async () => {
  await prepareReadingPages({check:true});
});

test('地方誌與故事以文字呈現特殊字元，保留該站的年份、地點與引文', () => {
  const castle=places.find(p=>p.id==='castle');
  const old=castle.records[1624];
  const originalSource=castle.source;
  const originalModern=castle.modern;
  const event=events.find(([year,id])=>year===1624 && id==='castle');
  const originalTitle=event[2];
  try {
    castle.records[1624]=['大員 <港>','筆記 & "引文"'];
    castle.source='https://example.org/archive?vol=1&part=2';
    castle.modern='城堡 <舊址>';
    event[2]='修築 <外城>';
    const pages=readingPages();
    for (const filename of ['places.html','anping.html']) {
      const html=pages[filename];
      assert.ok(html.includes('大員 &lt;港&gt;'));
      assert.ok(html.includes('筆記 &amp; &quot;引文&quot;'));
      assert.match(html,/href="\.\.\/index\.html\?year=1624&amp;place=castle&amp;view=/);
      assert.ok(html.includes(castle.locator));
      assert.ok(html.includes('href="https://example.org/archive?vol=1&amp;part=2"'));
    }
    assert.match(pages['anping.html'],/&amp;story=anping"/);
    assert.ok(pages['places.html'].includes('當年事件　修築 &lt;外城&gt;'));
    assert.ok(pages['places.html'].includes('<a href="#castle">城堡 &lt;舊址&gt;</a>'));
    assert.ok(pages['places.html'].includes('<h2>城堡 &lt;舊址&gt;</h2>'));
  } finally {
    castle.records[1624]=old;
    castle.source=originalSource;
    castle.modern=originalModern;
    event[2]=originalTitle;
  }
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
