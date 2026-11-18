import {test} from 'node:test';
import assert from 'node:assert/strict';
import {search,parse} from '../public/atlas/data.js';
test('舊名與台臺異體查詢',()=>{
 assert.equal(search('普羅民遮')[0].id,'tower');
 assert.equal(search('安平鎮城')[0].id,'castle');
 assert.deepEqual(search('台南'),search('臺南'));
});
test('網址重開與無效參數',()=>{
 assert.deepEqual(parse(new URLSearchParams('year=1876&place=battery&events=0')),{year:1876,id:'battery',events:false});
 assert.deepEqual(parse(new URLSearchParams('year=x&place=x')),{year:1624,id:null,events:true});
});
import { readLocation, viewUrl } from '../public/atlas/location.js';

test('分享保留年代、選取地點、事件圖層與地圖視野', () => {
  const state = { year: 1895, id: 'merchant', events: false, terrain:false, places:true, polities:true, view: [120.16, 23.01, 14.25] };
  const url = viewUrl('https://example.org/pilot/index.html', state);
  assert.equal(url.pathname, '/pilot/index.html');
  assert.deepEqual(readLocation(url.searchParams), { ...state, invalid: false });
});

test('拒絕不完整或超出範圍的視野，保留有效地點', () => {
  for (const raw of ['120,,12', '190,23,12', '120,90,12', '120,23,20', 'Infinity,0,1']) {
    const state = readLocation(new URLSearchParams({ place: 'merchant', view: raw }));
    assert.equal(state.invalid, true);
    assert.equal(state.id, 'merchant');
    assert.deepEqual(state.view, [120.95, 23.68, 6.65]);
  }
});


test('歷史行政據點可以分享並還原，舊年代的無效據點會被忽略', () => {
  const url = new URL('https://example.org/?year=1914&seat=花蓮港廳');
  const state = readLocation(url.searchParams);
  assert.equal(state.seat, '花蓮港廳');
  assert.equal(readLocation(viewUrl(url, state).searchParams).seat, state.seat);
  url.searchParams.set('year', '1624');
  assert.equal(readLocation(url.searchParams).invalid, true);
});
