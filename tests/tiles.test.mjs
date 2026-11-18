import assert from 'node:assert/strict';
import test from 'node:test';
import { visibleTiles,historicalSheets } from '../public/atlas/historical-map.js';

test('256px XYZ 格線的東南邊緣不多取一列，像素偏移隨視野而移動', () => {
  const sheet={id:'sheet',service:'atlas',bounds:[-180,-85,180,85]};
  const aligned={width:256,height:256,size:1024,center:[640,384]};
  assert.deepEqual(visibleTiles(sheet,aligned),[{
    key:'2/2/1',left:0,top:0,side:256,url:'https://gis.sinica.edu.tw/atlas/file-exists.php?img=sheet-png-2-2-1'
  }]);
  const tiles=visibleTiles(sheet,{...aligned,center:[660,394]});
  assert.deepEqual(tiles.map(t=>[t.key,t.left,t.top]),[
    ['2/2/1',-20,-10],['2/3/1',236,-10],['2/2/2',-20,246],['2/3/2',236,246]
  ]);
  assert.equal(visibleTiles(sheet,{...aligned,size:1200})[0].side,300);
  assert.deepEqual(visibleTiles({...sheet,bounds:[1,1,2,2]}, {...aligned,width:2,height:2,center:[535,502]}),[]);
});

test('臺南與立霧溪圖幅中心對應供應者圖層、XYZ 座標及影像格式', () => {
  for (const [year,url] of [
    [1876,'tainan/file-exists.php?img=Tainan_1875B-png-13-6830-3558'],
    [1914,'tileserver/file-exists.php?img=JM50K_1916-jpg-12-3430-1764']
  ]) {
    const sheet=historicalSheets[year];
    const [lng,lat,zoom]=sheet.focus;
    const size=512*2**zoom;
    const center=[(180+lng)*size/360,(1-Math.log(Math.tan((90+lat)*Math.PI/360))/Math.PI)*size/2];
    assert.equal(visibleTiles(sheet,{center,width:1,height:1,size})[0].url,'https://gis.sinica.edu.tw/'+url);
  }
});
