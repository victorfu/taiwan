import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { serveAtlas } from './serve-atlas.mjs';

const failOnce = new Set();
const built = process.argv[2] === '--built';
const demo = process.argv[2] === '--demo';
const explicitUrl = built || demo ? null : process.argv[2];
const rootUrl = new URL(built ? '../dist-local/' : demo ? '../dist-demo/' : '../public/', import.meta.url);
const server = explicitUrl ? null : await serveAtlas(rootUrl,failOnce);
const target = new URL(explicitUrl || `http://127.0.0.1:${server.address().port}/index.html`);
const executable = process.env.FIREFOX_BIN || (process.platform === 'win32'
  ? path.join(process.env.ProgramFiles, 'Mozilla Firefox', 'firefox.exe') : 'firefox');
const profile = await mkdtemp(path.join(tmpdir(), 'taiwan-atlas-test-'));
const browser = spawn(executable, ['-headless', '-no-remote', '-profile', profile,
  '--remote-debugging-port', '0', 'about:blank'], { windowsHide: true });
const exited = new Promise(resolve => browser.once('close', resolve));
let socket;

try {
  const endpoint = await new Promise((resolve, reject) => {
    const deadline = setTimeout(() => reject(new Error('Firefox 啟動逾時')), 15000);
    function inspect(chunk) {
      const match = String(chunk).match(/WebDriver BiDi listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(deadline); resolve(match[1]); }
    }
    browser.stdout.on('data', inspect);
    browser.stderr.on('data', inspect);
    browser.once('error', error => { clearTimeout(deadline); reject(error); });
    browser.once('exit', code => { clearTimeout(deadline); reject(new Error('Firefox 已退出 ' + code)); });
  });
  socket = new WebSocket(new URL('/session', endpoint));
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  const errors = [];
  let blockedTilesContext;
  socket.addEventListener('message',event => {
    const message=JSON.parse(event.data);
    if (message.method !== 'log.entryAdded') return;
    const entry=message.params;
    if (entry.type === 'javascript' && blockedTilesContext && entry.source?.context === blockedTilesContext &&
      entry.text?.startsWith('Content-Security-Policy:') && entry.text.includes('https://gis.sinica.edu.tw/') &&
      entry.text.includes('img-src')) return;
    if (entry.type === 'javascript' || (entry.type === 'console' && entry.level === 'error')) {
      errors.push(entry.text ?? JSON.stringify(entry));
    }
  });
  // The checks are sequential, so only one protocol response is pending at a time.
  function send(method, params = {}) {
    const requestId = ++id;
    return new Promise((resolve, reject) => {
      const deadline = setTimeout(() => reject(new Error(method + ' 逾時')), 12000);
      socket.onmessage = event => {
        const message = JSON.parse(event.data);
        if (message.id !== requestId) return;
        clearTimeout(deadline);
        if (message.type === 'error') reject(new Error(method + ' ' + message.message));
        else resolve(message.result);
      };
      socket.send(JSON.stringify({ id: requestId, method, params }));
    });
  }
  await send('session.new', { capabilities: {} });
  await send('session.subscribe',{events:['log.entryAdded']});
  const initial = await send('browsingContext.create', {type:'tab'});
  let context = initial.context;
  const navigate = url => send('browsingContext.navigate', { context, url, wait: 'complete' });
  async function evaluate(expression) {
    const result = await send('script.evaluate', {expression, target: {context}, awaitPromise: true});
    if (result.type === 'exception') throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }
  async function waitUntil(expression) {
    const deadline = Date.now() + 5000;
    do {
      if (await evaluate(expression)) return;
      await delay(50);
    } while (Date.now() < deadline);
    throw new Error('未達到預期狀態 ' + expression);
  }
  async function key(value) {
    await send('input.performActions', {context, actions: [{type: 'key', id: 'keyboard',
      actions: [{type: 'keyDown', value}, {type: 'keyUp', value}]}]});
  }
  async function click(selector) {
    const point = JSON.parse(await evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      const box = el.getBoundingClientRect();
      const x = Math.floor(box.x + box.width / 2);
      const y = Math.floor(box.y + box.height / 2);
      if (!el.contains(document.elementFromPoint(x, y))) throw new Error('控制項遭遮擋 ' + ${JSON.stringify(selector)});
      return JSON.stringify({x,y});
    })()`));
    await send('input.performActions', {context, actions:[{type:'pointer',id:'mouse',parameters:{pointerType:'mouse'},
      actions:[{type:'pointerMove',...point},{type:'pointerDown',button:0},{type:'pointerUp',button:0}]}]});
  }
  async function viewportShot(name) {
    const directory = process.env.ATLAS_SCREENSHOT_DIR;
    if (!directory) return;
    await mkdir(directory, {recursive:true});
    const { data } = await send('browsingContext.captureScreenshot', {context});
    await writeFile(path.join(directory, name + '.png'), Buffer.from(data, 'base64'));
  }
  const atYear = year => `document.querySelector('#clock-year')?.textContent === '${year}'`;
  const yearButton = year => `[...document.querySelectorAll('#years button')].find(b => b.textContent.includes('${year}'))`;
  const paintedFrame = () => evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))");
  const copyUrl = () => evaluate(`(async () => {
    let copied;
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async s=>{copied=s}}});
    await document.querySelector('#share').onclick();
    return copied;
  })()`);
  // Read a small copy of the actual painted basemap. DOM presence alone cannot catch a blank canvas.
  const pixels = (selector = 'canvas.atlas-map-geography') => evaluate(`(() => {
    const source = document.querySelector(${JSON.stringify(selector)});
    const thumbnail = document.createElement('canvas');
    thumbnail.width = 100;
    thumbnail.height = 100;
    const ctx = thumbnail.getContext('2d');
    ctx.drawImage(source, 0, 0, 100, 100);
    const data = ctx.getImageData(0, 0, 100, 100).data;
    return btoa(String.fromCharCode(...data));
  })()`);
  async function checkCoastline(view) {
    const colors = JSON.parse(await evaluate(`(() => {
      const canvas = document.querySelector('canvas.atlas-map-geography');
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const [centerLng, centerLat, zoom] = ${JSON.stringify(view)};
      const scale = 512 * 2 ** zoom;
      const mercatorY = lat => (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2;
      function sample(lng, lat) {
        const x = Math.round((rect.width / 2 + (lng - centerLng) / 360 * scale) * canvas.width / rect.width);
        const y = Math.round((rect.height / 2 + (mercatorY(lat) - mercatorY(centerLat)) * scale) * canvas.height / rect.height);
        if (x < 3 || x >= canvas.width-3 || y < 3 || y >= canvas.height-3) throw new Error('全臺視野未包含取樣位置');
        const pixels = ctx.getImageData(x-2, y-2, 5, 5).data;
        return [0,1,2,3].map(channel => [...pixels].filter((v,i) => i % 4 === channel).sort((a,b) => a-b)[12]);
      }
      return JSON.stringify([sample(120.02,23.65),sample(121.0,23.65),sample(121.91,23.65)]);
    })()`));
    const [strait, land, pacific] = colors;
    const distance = (a, b) => a.reduce((sum, v, i) => sum + Math.abs(v-b[i]), 0);
    assert.ok(distance(land, strait) > 18 && distance(land, pacific) > 18,
      '臺灣海峽、中央山地與太平洋的底圖像素應能區分陸海 ' + JSON.stringify(colors));
  }
  for (const width of [1280, 390, 320]) {
    await send('browsingContext.setViewport', {context, viewport:{width, height:844}});
    await navigate(target.href);
    await waitUntil("document.querySelector('#next')?.onclick != null");
    await waitUntil(atYear(1624));
    await waitUntil("document.querySelector('canvas.atlas-map-geography')?.width > 100");
    await waitUntil("performance.getEntriesByType('resource').some(e => e.name.endsWith('/terrain-height.bin.gz') && e.responseEnd > 0)");
    await paintedFrame();
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, '首屏水平溢出');
    await key('/');
    await waitUntil("document.activeElement.id === 'search' && !document.querySelector('#results').hidden");
    assert.ok(await evaluate(`(() => {
      const input = document.querySelector('#search');
      const holder = input.closest('.searchbox');
      const field = holder.getBoundingClientRect();
      const panel = document.querySelector('#results').getBoundingClientRect();
      return getComputedStyle(input).outlineStyle === 'none' &&
        getComputedStyle(holder).outlineStyle === 'solid' &&
        Math.abs(panel.left - field.left) < 1 && Math.abs(panel.right - field.right) < 1 &&
        panel.left >= 0 && panel.right <= innerWidth;
    })()`), '搜尋欄應有單一外框，結果清單兩側應與外框對齊');
    await key('\uE00C');
    await waitUntil("document.activeElement.id === 'search' && document.querySelector('#results').hidden");
    await key('\uE015');
    await waitUntil("!!document.activeElement.closest('#results')");
    await evaluate("document.querySelector('#share').focus()");
    await waitUntil("document.querySelector('#results').hidden");
    assert.ok(await evaluate(`['#share','#next','#years button:last-child'].every(selector => {
      const box = document.querySelector(selector).getBoundingClientRect();
      return box.left >= 0 && box.right <= innerWidth + 1 && box.bottom <= innerHeight + 1;
    })`), '分享、下一年代及最末年必須在視窗內');
    assert.ok(await evaluate(`(() => {
      const play = document.querySelector('#play');
      const text = document.createRange();
      text.selectNodeContents(play);
      return text.getClientRects().length === 1 && text.getBoundingClientRect().bottom <= play.getBoundingClientRect().bottom + 1;
    })()`), '播放按鈕文字應在單行內完整顯示');
    await viewportShot('atlas-1624-' + width);
    if (width === 1280) {
      if (demo) {
        assert.ok(await evaluate("document.querySelector('.atlas-modern-control') !== null"), 'React 版應提供街道圖層');
        assert.equal(await evaluate("performance.getEntriesByType('resource').some(r => r.name.includes('maplibre-gl'))"),false,'首屏不應預載街道圖層');
      }
      await click('#years button[title^="1908"]');
      await waitUntil(atYear(1908));
      await paintedFrame();
      await viewportShot('atlas-1908');
      const seatsVisible = async () => Buffer.from(await pixels('canvas.atlas-map-polity'), 'base64')
        .some((value, index) => index % 4 === 3 && value > 0);
      assert.ok(await seatsVisible(), '1908 年應繪出廳治');
      await click('#layers summary');
      await click('#polities');
      assert.equal(await seatsVisible(), false, '關閉歷史據點後應清除廳治');
      await click('#polities');
      await click('#layers summary');
      await click('#years button[title^="1624"]');
    }
    const shaded = Buffer.from(await pixels(), 'base64');
    await click('#layers summary');
    await click('#terrain');
    await paintedFrame();
    const plain = Buffer.from(await pixels(), 'base64');
    let changed = 0;
    for (let i = 0; i < plain.length; i += 4) {
      const delta = Math.abs(plain[i] - shaded[i]) + Math.abs(plain[i+1] - shaded[i+1]) + Math.abs(plain[i+2] - shaded[i+2]);
      if (delta > 12) changed++;
    }
    assert.ok(changed > 30, '地形開關未使底圖像素發生可辨識變化');
    const view = new URL(await copyUrl()).searchParams.get('view').split(',').map(Number);
    await checkCoastline(view);
    await click('#terrain');
    await click('#layers summary');

    await evaluate("document.querySelector('#scrubber').focus()");
    await key('\uE014');
    await waitUntil(atYear(1626));
    assert.match(await evaluate("document.querySelector('#scrubber').getAttribute('aria-valuetext')"), /1626/);
    assert.ok(await evaluate('[...document.querySelectorAll("#years button")].length >= 8'));
    await evaluate(yearButton(1876) + '.focus()');
    await key('\uE007');
    await waitUntil(atYear(1876));
    await evaluate("document.querySelector('#search').focus()");
    await key('德');
    await key('記');
    await waitUntil("document.querySelector('#results button')?.textContent.includes('德記')");
    await key('\uE015');
    await key('\uE007');
    await waitUntil("document.activeElement.id === 'place-title'");
    assert.match(await evaluate("document.querySelector('#card a').href"), /^https:\/\//);
    await evaluate(yearButton(1895) + ".click(); document.querySelector('#layers summary').click(); document.querySelector('#events').click(); document.querySelector('#layers summary').click()");
    assert.equal(await evaluate("new URL(location.href).searchParams.get('year')"), '1895');
    assert.equal(await evaluate("new URL(location.href).searchParams.get('events')"), '0');
    const beforeZoom = new URL(await evaluate('location.href'));
    const oldZoom = Number(beforeZoom.searchParams.get('view').split(',')[2]);
    await click('[aria-label=放大地圖]');
    const shared = new URL(await copyUrl());
    assert.equal(shared.searchParams.get('place'), 'merchant');
    assert.ok(Math.abs(Number(shared.searchParams.get('view').split(',')[2]) - oldZoom - 1) < .00002);
    ({context} = await send('browsingContext.create',{type:'tab'}));
    await send('browsingContext.setViewport', {context, viewport:{width,height:844}});
    await navigate(shared.href);
    await waitUntil("document.querySelector('#place-title')?.textContent.includes('德記')");
    assert.equal(await evaluate("document.querySelector('#events').checked"), false);
    assert.equal(await evaluate(atYear(1895)), true);
    assert.equal(await evaluate("document.documentElement.scrollWidth <= innerWidth"), true, '水平溢出');
    await evaluate("document.querySelector('#previous').click(); history.back()");
    await waitUntil(atYear(1895));
    await evaluate("document.querySelector('#card button').click()");
    await waitUntil("!document.querySelector('#place-title')");
    assert.equal(await evaluate(width <= 740 ? "document.activeElement.id === 'reading-toggle'" :
      "document.querySelector('#map').contains(document.activeElement)"), true, '關閉地方卡後，鍵盤焦點應留在可操作的控制項');
    console.log(width + 'px 鍵盤查詢、來源、年代、事件、視野、分享重開與返回通過');
  }
  const malformed = new URL(target);
  malformed.search = '?year=bad&place=invalid&view=0,91,nope';
  await navigate(malformed.href);
  await waitUntil("document.querySelector('#notice')?.textContent.includes('預設')");
  assert.equal(await evaluate(atYear(1624)), true);
  const finalYear = await evaluate("document.querySelector('#years button:last-child').textContent.match(/\\d{4}/)[0]");
  await evaluate("document.querySelector('#years button:nth-last-child(2)').click()");
  await evaluate("document.querySelector('#play').click()");
  await waitUntil(atYear(finalYear));
  assert.equal(await evaluate("document.querySelector('#play').getAttribute('aria-pressed')"), 'false');
  const missing = new URL(target);
  missing.search = '?year=1662&place=merchant';
  await navigate(missing.href);
  await waitUntil("document.querySelector('#card')?.textContent.includes('尚未收錄')");
  if (await evaluate("getComputedStyle(document.querySelector('#reading-body')).display === 'none'")) {
    await evaluate("document.querySelector('#reading-toggle').click()");
  }
  await evaluate("document.querySelector('#sources summary').click()");
  assert.ok(await evaluate("document.querySelector('#sources').open && document.querySelectorAll('#source-list a').length >= 4"));
  const legacy = new URL('./index-local.html', target);
  legacy.search = '?year=1876&place=merchant&events=0&view=120.179,22.997,12.8';
  legacy.hash = 'atlas';
  await navigate(legacy.href);
  await waitUntil("document.querySelector('#place-title')?.textContent.includes('德記')");
  assert.equal(await evaluate(atYear(1876)), true);
  const restored = new URL(await copyUrl());
  assert.equal(restored.hash, '#atlas');
  assert.equal(restored.searchParams.get('events'), '0');
  assert.equal(restored.searchParams.get('view'), '120.179,22.997,12.8');
  console.log('無效網址、舊安平連結、史料缺口、來源清單與自動播放終點通過');
  await click('#guide summary');
  await click('#start-story');
  await waitUntil("document.querySelector('.story-controls')?.textContent.includes('1 / 6')");
  await evaluate("document.querySelector('.story-controls button').click()");
  await waitUntil(atYear(1662));
  const stopUrl = await copyUrl();
  await navigate(stopUrl);
  await waitUntil("document.querySelector('.story-controls')?.textContent.includes('2 / 6')");
  await click('#reading-size');
  assert.equal(await evaluate("document.querySelector('#reading').classList.contains('full-height')"),true);
  await click('#reading-size');
  await click('#guide summary');
  await click('#report-link');
  await waitUntil("document.querySelector('#entry')?.value.includes('castle')");
  assert.equal(await evaluate("new URL(document.querySelector('#return-map').href).searchParams.get('story')"),'anping');
  await evaluate(`(() => {
    const createUrl = URL.createObjectURL.bind(URL);
    URL.createObjectURL = blob => { window.reportText = blob.text(); return createUrl(blob); };
    document.querySelector('#description').value='核對引文頁碼';
    document.querySelector('#download').click();
  })()`);
  await waitUntil("document.querySelector('#status')?.textContent.includes('下載')");
  const report = await evaluate('window.reportText');
  for (const field of ['1662 年','castle','story=anping','核對引文頁碼']) assert.ok(report.includes(field));
  await navigate(new URL('./atlas/anping.html',target).href);
  assert.equal(await evaluate("document.querySelectorAll('article').length"),6);
  const last = await evaluate("document.querySelector('article:last-of-type a').href");
  await navigate(last);
  await waitUntil("document.querySelector('.story-controls')?.textContent.includes('6 / 6')");
  await evaluate("document.querySelector('.story-controls button:last-child').click()");
  assert.equal(await evaluate("new URL(location.href).searchParams.has('story')"),false);
  await navigate(new URL('./atlas/places.html#castle',target).href);
  assert.equal(await evaluate("document.querySelector('article:target h2').textContent"),'安平古堡');
  console.log('安平導覽逐站分享、修正單下載、故事全文與地方誌連結通過');
  if (server) {
    const offline = new URL(target);
    blockedTilesContext=context;
    offline.search = '?year=1876&place=castle&historic=1&view=120.174,22.996,12&offline-test=1';
    await navigate(offline.href);
    await waitUntil("document.querySelector('.atlas-sheet-controls [role=status]')?.textContent.includes('未取得圖磚')");
    assert.equal(await evaluate("document.querySelector('#place-title').textContent"),'熱蘭遮城舊址');
    await evaluate("document.querySelector('.atlas-sheet-controls input').click()");
    assert.equal(await evaluate("new URL(location.href).searchParams.has('historic')"),false);
    await evaluate("history.back()");
    await waitUntil("document.querySelector('.atlas-sheet-controls input').checked");
    console.log('外部圖磚中斷時仍可讀取地方史料，返回可還原圖幅');
  }
  await send('browsingContext.setViewport',{context,viewport:{width:1280,height:844}});
  await navigate(target.href);
  blockedTilesContext=undefined;
  await waitUntil(atYear(1624));
  await evaluate("document.querySelector('#years button').focus()");
  await key('\uE014');
  await waitUntil(atYear(1626));
  await key(' ');
  assert.equal(await evaluate("document.querySelector('#play').getAttribute('aria-pressed')"),'true');
  await key(' ');
  await evaluate("document.querySelector('#region-note').open=true; document.querySelector('#region-detail button').focus()");
  await key('\uE007');
  await waitUntil("!!new URL(location.href).searchParams.get('seat')");
  const oldLength=await evaluate('history.length');
  await evaluate(`(() => {
    const s=document.querySelector('#scrubber');
    const years=[...document.querySelectorAll('#years button')].map(b=>Number(b.textContent));
    for(const year of [1876,1895,1908,1914]) {
      s.value=years.indexOf(year);
      s.dispatchEvent(new Event('input'));
    }
    s.dispatchEvent(new Event('change'));
  })()`);
  await waitUntil(atYear(1914));
  assert.equal(await evaluate('history.length'),oldLength+1);
  await evaluate('history.back()');
  await waitUntil(atYear(1626));
  const fallback=await evaluate(`(async()=>{
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('clipboard unavailable')}}});
    let copied; window.prompt=(_,url)=>{copied=url};
    await document.querySelector('#share').onclick();
    return copied;
  })()`);
  assert.equal(new URL(fallback).searchParams.get('year'),'1626');
  if (server) {
    for (const [asset,label] of [['river-surfaces.json','河川'],['coastlines.json','海岸線']]) {
      failOnce.add('/atlas/'+asset);
      await navigate(target.href+'?missing='+asset);
      await waitUntil(`document.querySelector('.atlas-data-warning')?.textContent.includes('${label}暫未載入')`);
      assert.equal(await evaluate(atYear(1624)),true);
      if (asset==='coastlines.json') {
        await waitUntil("performance.getEntriesByType('resource').some(r=>r.name.endsWith('terrain-height.bin.gz') && r.responseEnd>0)");
        await paintedFrame();
        const state=new URL(await copyUrl()).searchParams.get('view').split(',').map(Number);
        await checkCoastline(state);
      }
      await click('.atlas-data-warning button');
      await waitUntil(`performance.getEntriesByType('resource').filter(r=>r.name.endsWith('/${asset}') && r.responseEnd>0).length>=2`);
      await waitUntil("document.querySelector('.atlas-data-warning').hidden");
    }
  }
  // Exercise the same injected Map API as the React entry without depending on a GPU or external tiles.
  const streetResult=await evaluate(`(async()=>{
    const {createAtlasMap}=await import('./atlas/map.js');
    const handlers={};
    class StreetMap {
      on(type,fn){ handlers[type]=fn; }
      once(type,fn){ this.on(type,fn); }
      resize(){} remove(){} jumpTo(){}
    }
    const host=document.createElement('div'); document.body.append(host);
    let failures=0;
    const adapter=createAtlasMap(host,async()=>({Map:StreetMap}),{
      onModernFailure(){failures++;adapter.setLayers({modern:false})}
    });
    try {
      adapter.setLayers({modern:true}); await Promise.resolve();
      handlers.load();
      handlers.error({tile:{},error:Error('tile 429')}); await Promise.resolve();
      const partial=host.querySelector('.atlas-modern-control').getAttribute('aria-pressed')==='true' &&
        host.querySelector('.atlas-map-key').textContent.includes('圖磚暫缺') && failures===0;
      handlers.error({sourceId:'osm',error:Error('source unavailable')}); await Promise.resolve();
      return partial && failures===1 && host.querySelector('.atlas-modern-control').getAttribute('aria-pressed')==='false';
    } finally {adapter.destroy();host.remove()}
  })()`);
  assert.equal(streetResult,true,'單張圖磚失敗應保留街圖，致命錯誤應回復本機圖層');
  await navigate(target.href+'?year=1945');
  await waitUntil(atYear(1945));
  const historyDelta=await evaluate(`(() => {
    const start=history.length;
    const original=window.setInterval;
    let advance;
    window.setInterval=fn=>{advance=fn;return -1};
    try { document.querySelector('#play').click(); advance(); advance(); }
    finally {window.setInterval=original}
    return history.length-start;
  })()`);
  assert.equal(historyDelta,1,'播放兩次換頁僅建立一筆瀏覽紀錄');
  await waitUntil(atYear(1979));
  await evaluate('history.back()');
  await waitUntil(atYear(1945));
  const zoomBefore=Number(new URL(await copyUrl()).searchParams.get('view').split(',')[2]);
  await evaluate(`(() => {
    const surface=document.querySelector('.atlas-map-surface');
    window.replaceCalls=0;
    const replace=history.replaceState.bind(history);
    history.replaceState=(...args)=>{window.replaceCalls++;return replace(...args)};
    for(let i=0;i<40;i++)surface.dispatchEvent(new WheelEvent('wheel',{deltaY:-1,cancelable:true}));
  })()`);
  await waitUntil('window.replaceCalls>=1');
  assert.equal(await evaluate('window.replaceCalls'),1);
  const zoomAfter=Number(new URL(await evaluate('location.href')).searchParams.get('view').split(',')[2]);
  assert.ok(Math.abs(zoomAfter-zoomBefore-.1)<.00002,'40 個 1px 捲動應放大 0.1 級');
  await navigate(target.href+'?year=2019&place=legislativeyuan');
  await waitUntil(atYear(2019));
  assert.match(await evaluate("document.querySelector('#card').textContent"),/5 月 24 日/);
  await click('#guide summary');
  await click('#guide a[href$="prehistory.html"]');
  await waitUntil("document.querySelector('h1')?.textContent === '史前臺灣'");
  assert.equal(await evaluate("document.querySelectorAll('main article .source a').length"),4);
  assert.deepEqual(errors,[],'瀏覽器出現未捕捉例外或 console.error');
  console.log('時間軸歷史紀錄、鍵盤據點、剪貼簿備援、圖資重試與街圖錯誤處理通過');
  await send('browser.close');
} finally {
  server?.close();
  socket?.close();
  if (browser.exitCode === null && browser.signalCode === null) browser.kill();
  await exited;
  await rm(profile, { recursive:true, force:true, maxRetries:4, retryDelay:150 });
}
