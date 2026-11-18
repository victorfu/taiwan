import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

// Use a dedicated Android emulator with a Chrome tab already open on the local atlas.
const [serial, port, origin = 'http://127.0.0.1:8076'] = process.argv.slice(2);
if (!/^emulator-\d+$/.test(serial ?? '') || !/^\d+$/.test(port ?? '')) {
  throw new Error('node tests/android.mjs <emulator-serial> <forwarded-Chrome-port> [local-origin]');
}
const adb = (...args) => execFileSync('adb', ['-s',serial,'shell',...args], {encoding:'utf8',windowsHide:true}).trim();
const pages = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
const target = pages.find(page => page.type === 'page' && new URL(page.url).origin === origin);
assert.ok(target, '請先在隔離手機的 Chrome 開啟本機地圖');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject) => { socket.onopen = resolve; socket.onerror = reject; });
const pending = new Map();
let seq = 0;
socket.onmessage = event => {
  const {id,result,error} = JSON.parse(event.data);
  if (!pending.has(id)) return;
  pending.get(id)(result,error);
  pending.delete(id);
};
function call(method, params = {}) {
  return new Promise((resolve,reject) => {
    const id = ++seq;
    const timeout = setTimeout(() => { pending.delete(id); reject(Error(method + ' 逾時')); },12000);
    pending.set(id,(result,error) => { clearTimeout(timeout); error ? reject(Error(error.message)) : resolve(result); });
    socket.send(JSON.stringify({id,method,params}));
  });
}
async function evaluate(expression) {
  const response = await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if (response.exceptionDetails) throw Error(response.exceptionDetails.exception?.description ?? response.exceptionDetails.text);
  return response.result.value;
}
async function until(expression) {
  const end = Date.now() + 12000;
  do {
    if (await evaluate(expression)) return;
    await delay(120);
  } while (Date.now() < end);
  throw Error('手機未達預期狀態 ' + expression);
}
const touch = (type,touchPoints) => call('Input.dispatchTouchEvent',{type,touchPoints});
async function tap(selector) {
  const point = await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) throw Error('找不到控制項');
    element.scrollIntoView({block:'nearest',inline:'nearest'});
    const box = element.getBoundingClientRect();
    const x = box.left + box.width/2, y = box.top + box.height/2;
    if (!element.contains(document.elementFromPoint(x,y))) throw Error('控制項受遮擋 ' + element.outerHTML.slice(0,130));
    return {x,y};
  })()`);
  await touch('touchStart',[point]);
  await touch('touchEnd',[]);
  await delay(140);
}
const view = () => evaluate("new URL(location.href).searchParams.get('view').split(',').map(Number)");
const viewport = () => evaluate("({width:innerWidth,height:innerHeight,visibleHeight:Math.round(visualViewport.height)})");
const landscape = adb('settings','get','system','user_rotation');
const auto = adb('settings','get','system','accelerometer_rotation');
try {
  adb('settings','put','system','accelerometer_rotation','0');
  adb('settings','put','system','user_rotation','0');
  await call('Page.bringToFront');
  await call('Page.navigate',{url:origin + '/index.html?year=1624&view=120.95,23.68,6.7'});
  await until("document.querySelector('#clock-year')?.textContent === '1624'");
  await until('innerWidth < innerHeight');
  assert.ok(await evaluate("navigator.maxTouchPoints > 0 && /Android/.test(navigator.userAgent)"));
  const portrait = await viewport();
  console.log('Android',adb('getprop','ro.build.version.release'),await evaluate('navigator.userAgent'),portrait);
  await tap('#search');
  await until("document.activeElement.id === 'search'");
  await until(`visualViewport.height < ${portrait.visibleHeight - 90}`);
  console.log('系統鍵盤開啟',await viewport());
  await call('Input.insertText',{text:'熱蘭遮'});
  await until("document.querySelector('#results button')?.textContent.includes('安平古堡')");
  await tap('#results button');
  await until("new URL(location.href).searchParams.get('place') === 'castle'");
  await until(`visualViewport.height >= ${portrait.visibleHeight - 30}`);
  await tap('#reading-size');
  await until("document.querySelector('#reading').classList.contains('full-height')");
  await tap('#reading-size');
  await tap('#reading-toggle');
  await tap('[aria-label="全臺全覽"]');
  const before = await view();
  await evaluate(`(() => {
    window.atlasTouchLog=[];
    for (const type of ['pointerdown','pointermove','pointerup','pointercancel','lostpointercapture']) {
      document.addEventListener(type,e => window.atlasTouchLog.push([type,e.clientX,e.clientY,e.target.className]),true);
    }
  })()`);
  const {x,y} = await evaluate(`(() => {
    const surface = document.querySelector('.atlas-map-surface');
    const b = surface.getBoundingClientRect();
    for (let y=b.top+40; y<b.bottom-45; y+=30) {
      for (let x=b.left+55; x<b.right-70; x+=30) {
        const hit = document.elementFromPoint(x,y);
        if (surface.contains(hit) && !hit.closest('button,input,a')) return {x,y};
      }
    }
    throw Error('未找到可拖曳的地圖表面');
  })()`);
  await touch('touchStart',[{x,y,id:1}]);
  for (let step=1; step<=4; step++) {
    await delay(55);
    await touch('touchMove',[{x:x+15*step,y:y+8*step,id:1}]);
  }
  await touch('touchEnd',[]);
  await until(`Number(new URL(location.href).searchParams.get('view').split(',')[0]) !== ${before[0]}`);
  const panned = await view();
  assert.notEqual(panned[0],before[0]);
  await touch('touchStart',[{x:x-20,y,id:1},{x:x+20,y,id:2}]);
  await touch('touchMove',[{x:x-40,y,id:1},{x:x+40,y,id:2}]);
  await touch('touchEnd',[]);
  await until(`Number(new URL(location.href).searchParams.get('view').split(',')[2]) > ${panned[2]+.5}`);
  const zoomed = await view();
  assert.ok(zoomed[2] > panned[2]+.5,'雙指展開應放大地圖');
  console.log('單指平移與雙指縮放',before,panned,zoomed);
  await tap('#guide summary');
  await tap('#start-story');
  for (let i=1; i<6; i++) {
    await until(`document.querySelector('.story-controls')?.textContent.includes('${i} / 6')`);
    await tap('.story-controls button:last-child');
  }
  await until("document.querySelector('.story-controls')?.textContent.includes('6 / 6')");
  await tap('#share');
  await until("document.querySelector('#notice').textContent.includes('已複製')");
  const shared = await evaluate('location.href');
  await call('Page.navigate',{url:shared});
  await until("document.querySelector('.story-controls')?.textContent.includes('6 / 6')");
  assert.equal(await evaluate("document.querySelector('#place-title').textContent"),'德記洋行');
  adb('settings','put','system','user_rotation','1');
  await until('innerWidth > innerHeight');
  const height = await evaluate("document.querySelector('#map').getBoundingClientRect().height");
  assert.ok(height > 80);
  await tap('[aria-label="縮小地圖"]');
  await tap('#next');
  await until("document.querySelector('#clock-year')?.textContent === '1908'");
  console.log('六站、分享重開及橫向地圖',await viewport(),{mapHeight:height});
  adb('settings','put','system','user_rotation','0');
  await until('innerWidth < innerHeight');
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
} catch (error) {
  console.error('觸控記錄',await evaluate('window.atlasTouchLog?.slice(-15)'));
  throw error;
} finally {
  adb('settings','put','system','user_rotation',landscape);
  adb('settings','put','system','accelerometer_rotation',auto);
  socket.close();
}
