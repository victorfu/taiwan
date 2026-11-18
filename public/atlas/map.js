import { createGeography } from './geography.js';
import { drawPolities, polityLayers } from './polities.js';
import { createHistoricalOverlay } from './historical-map.js';

const DEFAULT_VIEW = [120.95, 23.68, 6.65];
export function nationalView(width, height) {
  if (!width || !height) return DEFAULT_VIEW.slice();
  const fit=Math.min((height-64)/537, (width-46)/449);
  return [DEFAULT_VIEW[0],DEFAULT_VIEW[1], DEFAULT_VIEW[2]+Math.log2(Math.max(.35,Math.min(1.75,fit)))];
}
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const radians = Math.PI / 180;

function project([lng, lat], size) {
  return [(lng + 180) / 360 * size,
    (1 - Math.asinh(Math.tan(lat * radians)) / Math.PI) / 2 * size];
}

function unproject([x, y], size) {
  return [((x / size * 360) % 360 + 360) % 360 - 180,
    clamp(Math.atan(Math.sinh(Math.PI * (1 - 2 * y / size))) / radians, -85, 85)];
}

function niceInterval(value) {
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return [1, 2, 5, 10].find(n => n * magnitude >= value) * magnitude;
}

function node(tag, cls, parent, text) {
  const element = document.createElement(tag);
  element.className = cls;
  if (text !== undefined) element.textContent = text;
  parent.append(element);
  return element;
}

export function createAtlasMap(container, loadStreetMap, { onSelect, onViewChange, onCenter, onLayerChange, onModernFailure }) {
  container.classList.add('atlas-map');
  const surface = node('div', 'atlas-map-surface', container);
  surface.tabIndex = 0;
  surface.setAttribute('role', 'region');
  surface.setAttribute('aria-label', '臺灣歷史地圖。方向鍵平移，加減鍵縮放，Home 鍵回到全臺。');
  const base = node('div', 'atlas-map-base', surface);
  base.hidden = true;
  const geographyCanvas = node('canvas', 'atlas-map-geography', surface);
  const polityCanvas = node('canvas', 'atlas-map-polity', surface);
  const pins = node('div', 'atlas-map-pins', surface);
  const controls = node('div', 'atlas-map-controls', container);
  const sheetControls = node('div', 'atlas-sheet-controls', container);
  const compass = node('div', 'atlas-map-north', container);
  compass.setAttribute('aria-label', '正北方向');
  node('span','',compass,'N');
  node('i','',compass);
  const footer = node('div', 'atlas-map-foot', container);
  const legend = node('div', 'atlas-map-key', footer);
  const mode = node('span', '', legend,'現代地形參照');
  const credit = node('a','',legend,'© OpenStreetMap');
  credit.href='https://www.openstreetmap.org/copyright';
  credit.target='_blank';credit.rel='noreferrer';credit.hidden=true;
  const scale = node('div', 'atlas-map-scale', footer);
  const geography = createGeography(redraw, key => {
    mode.textContent=key==='relief'?'現代海岸參照 · 地形暫缺':'地理資料未完整載入';
  });
  const historical = createHistoricalOverlay(surface,sheetControls,update,enabled => onLayerChange({historic:enabled}));
  const layers = {terrain:true,polities:true,places:true,events:true,year:1624};
  let view = nationalView(surface.clientWidth,surface.clientHeight);
  let map;
  let destroyed = false;
  let items = [];
  let size = 0;
  let center = [0, 0];
  let width = 0;
  let height = 0;

  function position(point) {
    const [x,y] = project(point,size);
    let dx=x-center[0];
    dx-=Math.round(dx/size)*size;
    return [width/2 + dx,height/2 + y-center[1]];
  }

  function prepareCanvas(canvas) {
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const w=Math.round(width*dpr), h=Math.round(height*dpr);
    if (canvas.width!==w || canvas.height!==h) {canvas.width=w;canvas.height=h;}
    const ctx=canvas.getContext('2d');
    if(!ctx) return null;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,width,height);
    return ctx;
  }
  function redraw() {
    width=surface.clientWidth; height=surface.clientHeight;
    if (!width || !height || destroyed) return;
    size=512*2**view[2];
    center=project(view,size);
    const viewport={width,height,size,center,view,zoom:view[2],project:position};
    if (!map) {
      const ctx=prepareCanvas(geographyCanvas);
      if (ctx) geography.draw(ctx,viewport,layers.terrain);
    }
    historical.redraw(viewport);
    const occupied=[];
    const visible=[];
    for(const entry of items) {
      const {place,pin}=entry;
      const [x,y]=position(place.point);
      const event=layers.events && place.hasEvent;
      pin.hidden=(!layers.places && !event) || x<0 || x>width || y<0 || y>height;
      pin.classList.toggle('atlas-pin-event',Boolean(event));
      pin.style.left=x+'px';pin.style.top=y+'px';
      if (!pin.hidden) visible.push({...entry,x,y,event});
    }
    visible.sort((a,b)=>Number(b.place.selected)-Number(a.place.selected) || Number(b.event)-Number(a.event));
    for(const {place,pin,label,x,y} of visible) {
      label.hidden=false;
      const w=label.offsetWidth, h=label.offsetHeight||21;
      const positions=[[12,0],[-w-12,0],[10,-h-1],[-w-10,-h-1],[10,h+1],[-w-10,h+1]];
      const selected=positions.find(([dx,dy])=> {
        const left=x+dx,right=left+w,middle=y+dy;
        return left>=2 && right<=width-2 && middle>h/2 && middle<height-h/2 &&
          !occupied.some(b=>right>b.left-3 && left<b.right+3 && Math.abs(middle-b.middle)<(h+b.height)/2+2) &&
          !visible.some(other=>other.pin!==pin && other.x>left-5 && other.x<right+5 && Math.abs(other.y-middle)<h/2+4);
      });
      if (!selected && !place.selected) {label.hidden=true;continue;}
      const [dx,dy]=selected||positions[0];
      label.style.left='calc(50% + '+dx+'px)';
      label.style.top='calc(50% + '+dy+'px)';
      occupied.push({left:x+dx,right:x+dx+w,middle:y+dy,height:h});
    }
    const polityCtx=prepareCanvas(polityCanvas);
    if(polityCtx && layers.polities) drawPolities(polityCtx,layers.year,position,width,height,occupied);
    const metersPerPixel=40075016.686*Math.cos(view[1]*radians)/size;
    const meters=niceInterval(metersPerPixel*32);
    scale.style.width=meters/metersPerPixel+'px';
    scale.textContent=meters>=1000?meters/1000+' km':meters+' m';
  }

  function setView(next) {
    if (!Array.isArray(next) || next.length !== 3 || !next.every(Number.isFinite)) return;
    view = [clamp(next[0], -180, 180), clamp(next[1], -85, 85), clamp(next[2], 1, 19)];
    map?.jumpTo({center: view.slice(0, 2), zoom: view[2]});
    redraw();
  }

  function update(next) {
    setView(next);
    onViewChange(view.slice());
  }

  function zoom(delta, dx = 0, dy = 0) {
    const nextZoom = clamp(view[2] + delta, 1, 19);
    const ratio = 2 ** (nextZoom - view[2]);
    const origin = [center[0] + dx * (1 - 1 / ratio), center[1] + dy * (1 - 1 / ratio)];
    update([...unproject(origin, size), nextZoom]);
  }

  function pan(dx, dy) {
    update([...unproject([center[0] + dx, center[1] + dy], size), view[2]]);
  }

  function showAll() {
    update(nationalView(width,height));
  }

  function control(label, glyph, action) {
    const button = node('button', '', controls, glyph);
    button.type = 'button';
    button.title = label;
    button.setAttribute('aria-label', label);
    button.onclick = action;
  }
  control('放大地圖', '＋', () => zoom(1));
  control('縮小地圖', '−', () => zoom(-1));
  control('全臺全覽', '全臺', showAll);

  const pointers=new Map();
  let gestureMoved=false;
  function gesture() {
    const [a,b]=pointers.values();
    if (!b) return {x:a.x,y:a.y,distance:0};
    return {x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.hypot(a.x-b.x,a.y-b.y)};
  }
  surface.onpointerdown = event => {
    if (pointers.size>=2 || event.button!==0 || event.target.closest('button')) return;
    gestureMoved=pointers.size>0;
    surface.focus({preventScroll:true});
    surface.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
  };
  surface.onpointermove = event => {
    if (!pointers.has(event.pointerId)) return;
    const before=gesture();
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    const after=gesture();
    if (before.x===after.x && before.y===after.y && before.distance===after.distance) return;
    gestureMoved=true;
    const rect=surface.getBoundingClientRect();
    const oldZoom=view[2];
    const nextZoom=before.distance&&after.distance
      ? clamp(oldZoom+Math.log2(after.distance/before.distance),1,19) : oldZoom;
    const ratio=2**(nextZoom-oldZoom);
    const virtualX=rect.left+width/2,virtualY=rect.top+height/2;
    const originX=center[0]+(before.x-virtualX)-(after.x-virtualX)/ratio;
    const originY=center[1]+(before.y-virtualY)-(after.y-virtualY)/ratio;
    setView([...unproject([originX,originY],size),nextZoom]);
  };
  surface.onpointerup = event => {
    if (!pointers.has(event.pointerId) || gestureMoved || !layers.polities || !onCenter) return;
    const rect=surface.getBoundingClientRect();
    const px=event.clientX-rect.left,py=event.clientY-rect.top;
    const nearby=(polityLayers[layers.year]?.centers??[]).map(c=>{
      const [x,y]=position(c.point);
      return [c.label,Math.hypot(x-px,y-py)];
    }).filter(([,d])=>d<=12).sort((a,b)=>a[1]-b[1]);
    if(nearby.length) onCenter(nearby[0][0]);
  };
  surface.onlostpointercapture = event => {
    if (!pointers.delete(event.pointerId)) return;
    if (gestureMoved && !pointers.size) onViewChange(view.slice());
  };
  surface.onkeydown = event => {
    if (event.target !== surface) return;
    const actions = {ArrowUp:() => pan(0,-64), ArrowDown:() => pan(0,64),
      ArrowLeft:() => pan(-64,0), ArrowRight:() => pan(64,0),
      '+':() => zoom(1), '=':() => zoom(1), '-':() => zoom(-1), Home:showAll};
    if (Object.hasOwn(actions,event.key)) {
      event.preventDefault();
      actions[event.key]();
    }
  };
  function wheel(event) {
    if (!size || event.deltaY === 0) return;
    event.preventDefault();
    const box = surface.getBoundingClientRect();
    zoom(-Math.sign(event.deltaY) * .25, event.clientX - box.left - width / 2,
      event.clientY - box.top - height / 2);
  }
  surface.addEventListener('wheel', wheel, {passive:false});

  // Street tiles are fetched only after a reader explicitly enables the modern basemap.
  let modern;
  let streetRequest = 0;
  async function switchModern(enabled) {
    const request = ++streetRequest;
    const previous=map;
    map=undefined;
    previous?.remove();
    base.replaceChildren();
    base.hidden=true;
    geographyCanvas.hidden=false;
    credit.hidden=true;
    if(modern) modern.setAttribute('aria-pressed',String(enabled));
    mode.textContent=enabled?'讀取街道底圖中…':'現代地形參照';
    if(enabled) {
      try {
        const maplibre = await loadStreetMap();
        if (destroyed || request !== streetRequest) return;
        base.hidden=false;
        map=new maplibre.Map({container:base,center:view.slice(0,2),zoom:view[2],
          interactive:false,attributionControl:false,minZoom:1,maxZoom:19,
          style:{version:8,sources:{osm:{type:'raster',tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],tileSize:256}},
            layers:[{id:'streets',type:'raster',source:'osm',paint:{'raster-saturation':-.72}}]}});
        const current=map;
        map.once('load',() => {
          if (map !== current || destroyed) return;
          geographyCanvas.hidden=true;
          credit.hidden=false;
          mode.textContent='現代街道底圖';
        });
        map.on('error',()=>queueMicrotask(()=>{
          if (map===current&&!destroyed) {
            onModernFailure();
          }
        }));
      } catch { if (!destroyed && request === streetRequest) onModernFailure(); }
    }
    redraw();
  }
  if(loadStreetMap) {
    modern=node('button','atlas-modern-control',controls,'街道');
    modern.type='button';modern.setAttribute('aria-label','切換現代街道底圖');
    modern.setAttribute('aria-pressed','false');modern.onclick=()=>onLayerChange({modern:!layers.modern});
  }
  const observer = new ResizeObserver(() => {map?.resize();redraw();});
  observer.observe(surface);
  redraw();
  return {
    setView,
    setLayers(next) {
      const switchBase = Boolean(next.modern) !== Boolean(layers.modern);
      Object.assign(layers,next);
      if (switchBase && loadStreetMap) switchModern(Boolean(layers.modern));
      historical.setYear(layers.year,layers.historic);
      redraw();
    },
    setPlaces(places) {
      const focusedId = document.activeElement?.dataset.place;
      pins.replaceChildren();
      items = places.map(place => {
        const pin = node('button', 'atlas-pin', pins);
        pin.type = 'button';
        pin.dataset.place = place.id;
        pin.classList.toggle('atlas-pin-event', place.hasEvent);
        pin.setAttribute('aria-pressed', String(place.selected));
        pin.setAttribute('aria-label', place.label + (place.hasEvent ? '，當年事件' : ''));
        node('span','atlas-pin-dot',pin);
        const label=node('span','atlas-pin-label',pin,place.label);
        pin.title=place.label;
        pin.onclick = () => onSelect(place.id);
        return {place,pin,label};
      });
      redraw();
      if (focusedId) items.find(({place}) => place.id === focusedId)?.pin.focus({preventScroll:true});
    },
    destroy() {
      destroyed = true;
      observer.disconnect();
      geography.destroy();
      historical.destroy();
      map?.remove();
      surface.removeEventListener('wheel', wheel);
      container.replaceChildren();
      container.classList.remove('atlas-map');
    }
  };
}
