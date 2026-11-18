import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateAtlas, validatePeriodNotes, validatePolities } from '../scripts/validate.mjs';

function sample() {
  return {
    years: [1876],
    periods: ['開港與海防'],
    places: [{
      id: 'merchant', modern: '原英商德記洋行', region: '安平區',
      source: 'https://example.org/merchant', locator: '沿革，第 2 段',
      status: 'approved', records: { 1876: ['德記洋行', '測試摘要'] }
    }],
    points: { merchant: [120.1595, 23.0043] },
    events: [[1876, 'merchant', '測試事件']]
  };
}

test('年代導讀與歷史據點也須逐年通過發布審核', () => {
  const note = { title:'導讀', era:'時期', summary:'摘要', citations:[{url:'https://example.org/record',locator:'館藏說明第 1 段'}] };
  const layer = { title:'據點', note:'概位', centers:[{label:'地方',point:[120,23],source:'https://example.org/place'}] };
  for (const [validate, record] of [[validatePeriodNotes,note],[validatePolities,layer]]) {
    assert.throws(() => validate([1876],{1876:record},{release:true}),/尚待審閱：1876/);
    validate([1876],{1876:{...record,status:'approved'}},{release:true});
  }
  assert.throws(() => validatePeriodNotes([1876],{1876:{...note,status:'approved',citations:[]}},
    {release:true}),/1876：年代導讀缺少引用/);
});

test('審核通過的完整資料可以發布，草稿僅通過開發驗證', () => {
  const data = sample();
  validateAtlas(data, { release: true });
  data.places[0].status = 'draft';
  validateAtlas(data);
  assert.throws(() => validateAtlas(data, { release: true }), /尚待審閱：merchant/);
});

test('地點與快照驗證會指明缺失的條目', () => {
  const invalidCases = [
    [data => { data.places.push(structuredClone(data.places[0])); }, /重複的地點 ID/],
    [data => { data.places[0].id=' '; }, /地點 ID/],
    [data => { data.places[0].modern=''; }, /缺少現名或區域/],
    [data => { data.places[0].region=''; }, /缺少現名或區域/],
    [data => { data.places[0].source='http://example.org/archive'; }, /HTTPS/],
    [data => { data.places[0].extra='http://example.org/extra'; }, /HTTPS/],
    [data => { data.places[0].status='apprvoed'; }, /無效的審核狀態/],
    [data => { data.places[0].records={}; }, /缺少年代記錄/],
    [data => { data.places[0].aliases={1876:[' ']}; }, /別名/],
    [data => { data.places[0].aliases={1895:['異名']}; }, /別名/],
    [data => { data.points.extra=[120,23]; }, /座標未對應/],
    [data => { data.events[0].push('extra'); }, /事件缺少/],
    [data => { data.events[0][2]=' '; }, /須對應有效地點/],
    [data => { data.years.push(1895); data.periods.push('另一年'); data.events[0][0]=1895; }, /merchant 1895/],
    [data => { data.years.push(1876); }, /快照年須/],
    [data => { data.points.merchant = []; }, /merchant：座標/],
    [data => { data.points.merchant.reverse(); }, /merchant：座標/],
    [data => { data.places[0].locator = ' '; }, /merchant：缺少來源引用位置/],
    [data => { data.places[0].source = ''; }, /merchant：來源/],
    [data => { data.places[0].records[1876][1] = ''; }, /merchant 1876/],
    [data => { data.places[0].records[1895] = ['示例', '摘要']; }, /merchant：未知快照年/],
    [data => { data.events[0][1] = 'unknown'; }, /測試事件.*unknown/],
    [data => { data.events[0][0] = 1895; }, /測試事件.*1895/]
  ];
  for (const [mutate, message] of invalidCases) {
    const data = sample();
    mutate(data);
    assert.throws(() => validateAtlas(data, { release: true }), message);
  }
});
