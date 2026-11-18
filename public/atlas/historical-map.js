const gis = 'https://gis.sinica.edu.tw';
const taiwanBounds = [117.84953432, 21.65607265, 123.85924109, 25.64233621];
const tainanBounds = [119.77226311, 22.75676309, 120.4124267, 23.214636];

export const historicalSheets = {
  1876: { id: 'Tainan_1875B', service: 'tainan', title: '1875 年臺灣府城並安平海口圖',
    bounds: tainanBounds, focus: [120.174, 22.996, 12] },
  1884: { id: 'Taipei_1888', service: 'taipei', title: '1888 年臺北府之圖',
    bounds: [121.4688935, 25.01283519, 121.55608504, 25.08118095], focus: [121.511, 25.048, 13] },
  1895: { id: 'Tainan_1895c', service: 'tainan', title: '1895 年臺南及安平近傍地圖',
    bounds: tainanBounds, focus: [120.179, 22.997, 12] },
  1908: { id: 'Admin_1901a', service: 'tileserver', title: '1900 年代廳界（1901 圖層）',
    bounds: taiwanBounds, focus: [120.71, 23.90, 7] },
  1914: { id: 'JM50K_1916', service: 'tileserver', title: '1916 年山地地形圖', format: 'jpeg',
    bounds: taiwanBounds, focus: [121.50, 24.18, 11] },
  1945: { id: 'AMCityPlan_1945', service: 'tileserver', title: '1945 年美軍繪製臺灣城市地圖',
    bounds: taiwanBounds, focus: [121.51, 25.04, 12] }
};

function mercatorY(lat) {
  return (1 - Math.asinh(Math.tan(lat * Math.PI / 180)) / Math.PI) / 2;
}

// The display uses a 512px world at zoom 0. WMTS uses 256px Google-compatible tiles.
export function visibleTiles(sheet, { width, height, size, center }) {
  if (!width || !height || !size) return [];
  const z = Math.max(0, Math.min(19, Math.round(Math.log2(size / 256))));
  const count = 2 ** z;
  const side = size / count;
  const left = center[0] - width / 2;
  const top = center[1] - height / 2;
  const [west, south, east, north] = sheet.bounds;
  const minX = Math.floor(Math.max(left / side, (west + 180) / 360 * count));
  const maxX = Math.floor(Math.min((left + width) / side, (east + 180) / 360 * count));
  const minY = Math.floor(Math.max(top / side, mercatorY(north) * count));
  const maxY = Math.floor(Math.min((top + height) / side, mercatorY(south) * count));
  const tiles = [];
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const format = sheet.format === 'jpeg' ? 'jpg' : 'png';
      const tileId = [sheet.id,format,z,x,y].join('-');
      tiles.push({ key: z + '/' + x + '/' + y, left: x * side - left, top: y * side - top, side,
        url: gis + '/' + sheet.service + '/file-exists.php?img=' + tileId });
    }
  }
  return tiles;
}

export function createHistoricalOverlay(surface, controls, navigate, onToggle) {
  const pane = document.createElement('div');
  pane.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;opacity:.83;overflow:hidden';
  pane.setAttribute('aria-hidden', 'true');
  surface.append(pane);

  const panel = document.createElement('div');
  const label = document.createElement('label');
  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  label.append(toggle, ' 對照歷史圖幅');
  const info = document.createElement('div');
  const source = document.createElement('a');
  source.target = '_blank';
  source.rel = 'noreferrer';
  const rights = document.createElement('a');
  rights.href = 'https://iptt.sinica.edu.tw/shares/1121';
  rights.textContent = '中研院 GIS · 非商業使用';
  rights.target = '_blank';
  rights.rel = 'noreferrer';
  const focus = document.createElement('button');
  focus.type = 'button';
  focus.textContent = '前往圖幅';
  focus.hidden = !navigate;
  const status = document.createElement('div');
  status.setAttribute('role', 'status');
  info.append(source, document.createElement('br'), rights, document.createElement('br'), focus, status);
  panel.append(label, info);
  controls.append(panel);
  panel.style.cssText = 'background:#fffdf2ed;max-width:200px;padding:3px 6px;font:12px/1.45 "Microsoft JhengHei",sans-serif';
  focus.style.cssText = 'padding:2px 4px;margin-top:3px;font:inherit';
  let sheet, viewport;
  const images = new Map();

  function clearTiles() {
    pane.replaceChildren();
    images.clear();
  }
  function updateStatus() {
    if (!images.size) status.textContent = '目前視野超出圖幅範圍。';
    else if ([...images.values()].some(img => img.dataset.loaded === 'true')) status.textContent = '';
    else if ([...images.values()].every(img => img.dataset.loaded === 'false')) status.textContent = '此視野未取得圖磚，可開啟原圖查閱。';
    else status.textContent = '讀取圖磚中…';
  }
  function redraw(next) {
    viewport = next;
    if (!sheet || !toggle.checked || !viewport) return;
    const tiles = visibleTiles(sheet, viewport);
    const keys = new Set(tiles.map(tile => tile.key));
    for (const [key, img] of images) {
      if (!keys.has(key)) {
        img.remove();
        images.delete(key);
      }
    }
    for (const tile of tiles) {
      let img = images.get(tile.key);
      if (!img) {
        img = document.createElement('img');
        img.alt = '';
        img.draggable = false;
        img.style.cssText = 'position:absolute;max-width:none;visibility:hidden';
        img.onload = () => { img.dataset.loaded = 'true'; img.style.visibility = 'visible'; updateStatus(); };
        img.onerror = () => { img.dataset.loaded = 'false'; updateStatus(); };
        images.set(tile.key, img);
        pane.append(img);
        img.src = tile.url;
      }
      img.style.width = img.style.height = tile.side + 'px';
      img.style.left = tile.left + 'px';
      img.style.top = tile.top + 'px';
    }
    updateStatus();
  }

  function sync(enabled) {
    toggle.checked = Boolean(sheet && enabled);
    panel.hidden = !sheet;
    info.hidden = !toggle.checked;
    if (toggle.checked) redraw(viewport);
    else clearTiles();
  }
  toggle.onchange = () => onToggle(toggle.checked);
  focus.onclick = () => { if (sheet) navigate?.(sheet.focus); };
  sync(false);
  return {
    setYear(year, enabled) {
      const next = historicalSheets[year];
      if (sheet !== next) clearTiles();
      sheet = next;
      if (sheet) {
        source.href = gis + '/showwmts/index.php?l=' + sheet.id + '&s=' + sheet.service;
        source.textContent = sheet.title + ' ↗';
      }
      sync(enabled);
    },
    redraw,
    destroy() {
      clearTiles();
      pane.remove();
      panel.remove();
    }
  };
}
