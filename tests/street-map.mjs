import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import { serveAtlas } from './serve-atlas.mjs';

const root=new URL('../dist-demo/',import.meta.url);
const tile=await readFile(new URL('atlas/favicon.png',root));
const server=await serveAtlas(root);
let browser;
try {
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage();
  const errors=[];
  const consoleErrors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',msg=>{
    if (msg.type()==='error') consoleErrors.push({text:msg.text(),url:msg.location().url});
  });
  let successful=0;
  let rejectedUrl;
  await page.route('https://tile.openstreetmap.org/**',async route=>{
    if (!rejectedUrl) {
      rejectedUrl=route.request().url();
      await route.fulfill({status:429,body:'fixture rate limit',headers:{'Access-Control-Allow-Origin':'*'}});
    } else {
      await route.fulfill({status:200,contentType:'image/png',body:tile,headers:{'Access-Control-Allow-Origin':'*'}});
      successful++;
    }
  });
  const url='http://127.0.0.1:'+server.address().port+'/index.html';
  await page.goto(url);
  const control=page.getByRole('button',{name:'切換現代街道底圖'});
  await control.click();
  await page.waitForFunction(()=>document.querySelector('.atlas-map-key').textContent.includes('部分圖磚暫缺') &&
    !document.querySelector('.atlas-map-key a').hidden);
  assert.ok(rejectedUrl && successful>0);
  assert.equal(await control.getAttribute('aria-pressed'),'true');
  assert.equal(new URL(page.url()).searchParams.get('modern'),'1');
  assert.ok(await page.locator('.maplibregl-canvas').isVisible());
  await control.click();
  assert.equal(await page.locator('.maplibregl-canvas').count(),0);
  assert.deepEqual(consoleErrors.filter(e=>e.url!==rejectedUrl || !e.text.includes('429')),[]);
  assert.deepEqual(errors,[]);

  // Fail the shared app entry for each frontend and follow the independent HTML reader.
  for (const entry of ['index.html','index-local.html']) {
    const fallback=await browser.newPage();
    const diagnostics=[];
    fallback.on('console',msg=>{if(msg.type()==='error')diagnostics.push(msg.text())});
    await fallback.route('**/atlas/layout.html',route=>route.fulfill({status:503,body:'fixture unavailable'}));
    await fallback.goto(new URL(entry,url).href);
    await fallback.getByRole('alert').getByRole('link',{name:'閱讀地方誌與事件'}).click();
    await fallback.getByRole('heading',{name:'地方誌與事件',exact:true}).waitFor();
    assert.ok(diagnostics.some(message=>message.includes('地圖啟動失敗') && message.includes('無法載入地圖介面')));
    await fallback.close();
  }
  console.log('Chrome 實際 MapLibre 單張 HTTP 429、其餘圖磚載入、兩個入口的啟動診斷與文字備援通過');
} finally {
  await browser?.close();
  server.close();
}
