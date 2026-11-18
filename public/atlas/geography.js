const radians = Math.PI / 180;
const terrain = { x:109238, y:56010, width:718, height:1352, size:131072 };
const media = name => new URL(name, import.meta.url);
const physicalNames = [
  ['臺 灣 海 峽',119.63,24.25,-55,'sea'], ['太 平 洋',122.32,23.38,-65,'sea'],
  ['巴 士 海 峽',120.67,21.38,0,'sea'], ['東 海',122.12,25.57,-8,'sea'],
  ['中 央 山 脈',121.13,23.52,-66,'ridge'], ['雪 山 山 脈',121.25,24.44,-48,'ridge'],
  ['海 岸 山 脈',121.36,23.23,-68,'ridge'], ['澎 湖 群 島',119.48,23.79,0,'island'],
  ['金 門',118.37,24.53,0,'island'], ['馬 祖 列 島',119.97,26.26,0,'island'],
  ['蘭 嶼',121.59,22.00,0,'island'], ['綠 島',121.50,22.68,0,'island'],
  ['福 建',118.98,25.65,0,'island']
];

function world([lng, lat]) {
  return [(lng+180)/360*512,(1-Math.asinh(Math.tan(lat*radians))/Math.PI)*256];
}

function pathFrom(rings) {
  const path = new Path2D();
  for (const ring of rings) {
    ring.forEach((p,i) => {
      const [x,y] = world(p);
      if (i === 0) path.moveTo(x,y);
      else path.lineTo(x,y);
    });
    path.closePath();
  }
  return path;
}

// The input is MOI elevation in integer meters, resampled by OsmHackTW at XYZ z9.
// The ink color is computed from measured elevation and local slope.
// No historical shoreline or surveyed relief is inferred from the selected year.
async function loadRelief() {
  const response = await fetch(media('./terrain-height.bin.gz'));
  if (!response.ok) throw Error('高程資料讀取失敗');
  let buffer = await response.arrayBuffer();
  const signature = new Uint8Array(buffer,0,2);
  if (signature[0]===31 && signature[1]===139) {
    const decoded=new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'));
    buffer=await new Response(decoded).arrayBuffer();
  }
  const heights = new Uint16Array(buffer);
  const {width,height} = terrain;
  if (heights.length !== width*height) throw Error('高程格網尺寸不符');
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const image = ctx.createImageData(width,height);
  const ramp = [
    [0,222,214,169], [100,202,203,152], [350,169,183,135], [850,143,160,122],
    [1450,128,146,111], [2050,150,153,120], [2850,182,172,140], [3900,221,203,169]
  ];
  for (let y=1;y<height-1;y++) {
    for (let x=1;x<width-1;x++) {
      const i=y*width+x, h=heights[i];
      if (!h) continue;
      const stop = ramp.findIndex(r => h <= r[0]);
      const a = ramp[Math.max(0,stop-1)], b = ramp[stop < 0 ? ramp.length-1 : stop];
      const mix = Math.min(1,(h-a[0])/(b[0]-a[0] || 1));
      const dx = (heights[i+1]-heights[i-1])/300;
      const dy = (heights[i+width]-heights[i-width])/300;
      const light = (dx*.59+dy*.46+.64)/Math.hypot(dx,dy,1);
      const shade = (light-.64)*85;
      const contour = (h>250 && h%250 < 14) ? 4 : 0;
      for (let j=0;j<3;j++) image.data[i*4+j]=a[j+1]+mix*(b[j+1]-a[j+1])+shade-contour;
      image.data[i*4+3]=Math.min(255,h*35+20);
    }
  }
  ctx.putImageData(image,0,0);
  return canvas;
}

function loadJSON(name) {
  return fetch(media(name)).then(response => {
    if (!response.ok) throw Error('地理資料讀取失敗');
    return response.json();
  });
}

let assets;
function start() {
  if (!assets) {
    assets = {
      coast:loadJSON('./coastlines.json').then(g => ({land:pathFrom(g.land),islands:pathFrom(g.islands)})),
      rivers:loadJSON('./river-surfaces.json').then(pathFrom),
      relief:loadRelief()
    };
  }
  return assets;
}

export function createGeography(onLoad, onError) {
  const data={};
  let active=true;
  for (const [key,loading] of Object.entries(start())) {
    loading.then(value => {
      if (active) {data[key]=value;onLoad();}
    }).catch(() => {if(active) onError(key);});
  }

  function draw(ctx, viewport, showTerrain) {
    const {width,height,size,center,project,zoom}=viewport;
    const factor=size/512;
    const ox=width/2-center[0],oy=height/2-center[1];
    const sea=ctx.createLinearGradient(0,0,width,height);
    sea.addColorStop(0,'#c9d9d3');
    sea.addColorStop(.52,'#dce6dc');
    sea.addColorStop(1,'#c6d9d5');
    ctx.fillStyle=sea;
    ctx.fillRect(0,0,width,height);
    ctx.save();
    ctx.translate(ox,oy);
    ctx.scale(factor,factor);
    if (data.coast) {
      ctx.lineJoin='round';
      const paths=[data.coast.land,data.coast.islands];
      for (const [stroke,color] of [[10,'#cadbd4'],[6,'#bad0c9'],[3,'#e7e9d8']]) {
        ctx.lineWidth=stroke/factor;
        ctx.strokeStyle=color;
        for(const p of paths) ctx.stroke(p);
      }
      ctx.fillStyle='#d4d4b9';
      ctx.fill(data.coast.land);
      ctx.fillStyle='#dfd8b3';
      ctx.fill(data.coast.islands);
      if (showTerrain && data.relief) {
        ctx.save();
        ctx.clip(data.coast.islands);
        const scale=size/terrain.size;
        const left=terrain.x*scale+ox,top=terrain.y*scale+oy;
        // Crop the source before scaling so close-up views remain inexpensive.
        const sx=Math.max(0,-left/scale),sy=Math.max(0,-top/scale);
        const sw=Math.min(terrain.width,(width-left)/scale)-sx;
        const sh=Math.min(terrain.height,(height-top)/scale)-sy;
        if (sw>0 && sh>0) {
          ctx.imageSmoothingEnabled=true;
          ctx.drawImage(data.relief,sx,sy,sw,sh,(terrain.x+sx)/256,(terrain.y+sy)/256,sw/256,sh/256);
        }
        ctx.restore();
      }
      if (data.rivers) {
        ctx.save();
        ctx.clip(data.coast.islands);
        ctx.fillStyle='#9ebdb6';
        ctx.fill(data.rivers);
        if (zoom>8) {
          ctx.strokeStyle='#a4c1bb';
          ctx.lineWidth=.45/factor;
          ctx.stroke(data.rivers);
        }
        ctx.restore();
      }
      ctx.lineWidth=.9/factor;
      ctx.strokeStyle='#7d9487';
      for (const p of paths) ctx.stroke(p);
    }
    ctx.restore();
    drawGraticule(ctx,viewport);
    ctx.save();
    ctx.textAlign='center';ctx.textBaseline='middle';
    for (const [name,lng,lat,angle,kind] of physicalNames) {
      if (kind==='ridge' && (!showTerrain || zoom<6.2)) continue;
      if (kind==='island' && zoom<6.0) continue;
      if (zoom<5.4 && kind==='sea' && name!=='臺 灣 海 峽') continue;
      const [x,y]=project([lng,lat]);
      if(x < -80 || x>width+80 || y<12 || y>height-15) continue;
      ctx.save();ctx.translate(x,y);ctx.rotate(angle*radians);
      const sea=kind==='sea';
      ctx.font=(sea?'italic 20px':kind==='ridge'?'600 13px':'13px')+' "Noto Serif TC","PMingLiU",serif';
      ctx.lineWidth=sea?3:2;
      ctx.strokeStyle=sea?'#dce6de':'#d9dbba';
      ctx.strokeText(name,0,0);
      ctx.fillStyle=sea?'#648983':kind==='ridge'?'#52664c':'#586f60';
      ctx.fillText(name,0,0);
      ctx.restore();
    }
    ctx.restore();
  }
  return {draw,destroy(){active=false;}};
}

function drawGraticule(ctx,{width,height,center,size,project,view}) {
  const longitudeStep = 90*360/size;
  const decade=10**Math.floor(Math.log10(longitudeStep));
  const step=[1,2,5,10].find(n=>n*decade>=longitudeStep)*decade;
  const west=view[0]-width/2*360/size, east=view[0]+width/2*360/size;
  const latAt = y => Math.atan(Math.sinh(Math.PI*(1-2*y/size)))/radians;
  const south=latAt(center[1]+height/2), north=latAt(center[1]-height/2);
  const digits=Math.max(0,-Math.floor(Math.log10(step)));
  ctx.save();ctx.beginPath();ctx.lineWidth=.65;ctx.strokeStyle='#637c734a';ctx.setLineDash([1.2,4.4]);
  ctx.font='9px "Courier New",monospace';ctx.fillStyle='#607b72';
  for (let i=Math.ceil(west/step);i<=Math.floor(east/step);i++) {
    const lng=i*step;
    const x=project([lng,view[1]])[0];
    ctx.moveTo(x,0);ctx.lineTo(x,height);
    ctx.fillText(Math.abs(lng).toFixed(digits)+'°'+(lng<0?'W':'E'),x+4,11);
  }
  for (let i=Math.ceil(south/step);i<=Math.floor(north/step);i++) {
    const lat=i*step;
    const y=project([view[0],lat])[1];
    ctx.moveTo(0,y);ctx.lineTo(width,y);
    ctx.fillText(Math.abs(lat).toFixed(digits)+'°'+(lat<0?'S':'N'),4,y-4);
  }
  ctx.stroke();ctx.restore();
}
