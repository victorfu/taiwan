import { years, periodNotes, places, points, events, search, matchingRecords, normalize } from './data.js';
import { readLocation, viewUrl, layerKeys } from './location.js';
import { createAtlasMap, nationalView } from './map.js';
import { polityLayers } from './polities.js';
import { anpingStory } from './story.js';
import { historicalSheets } from './historical-map.js';

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
}
function button(text, action) {
  const element = node('button', text);
  element.type = 'button';
  element.onclick = action;
  return element;
}
function link(text, url) {
  const element = node('a', text);
  element.href = url;
  element.target = '_blank';
  element.rel = 'noreferrer';
  return element;
}

export async function mount(root, loadStreetMap) {
  const response = await fetch(new URL('./layout.html', import.meta.url));
  if (!response.ok) throw new Error('無法載入地圖介面。');
  root.innerHTML = await response.text();
  root.classList.add('atlas-shell');
  const el = id => root.querySelector('#' + id);
  const read = () => {
    const params = new URLSearchParams(location.search);
    const restored = readLocation(params);
    if (restored.modern && !loadStreetMap) { delete restored.modern; restored.invalid = true; }
    if (!params.has('view')) restored.view = nationalView(el('map').clientWidth, el('map').clientHeight);
    return restored;
  };
  let state = read();
  let timer, noticeTimer, urlTimer, pendingUrl;
  let playingEntry = false;
  let scrubbing = false;
  function notice(message) {
    clearTimeout(noticeTimer);
    el('notice').textContent = message;
    noticeTimer = setTimeout(() => { el('notice').textContent = ''; }, 4200);
  }
  function stop() {
    clearInterval(timer);
    timer = undefined;
    playingEntry = false;
    el('play').textContent = '▶ 播放';
    el('play').setAttribute('aria-pressed', 'false');
  }
  function updateReportLink() {
    const report = new URL('./atlas/correction.html',location.href);
    report.searchParams.set('map',viewUrl(location.href,state).href);
    el('report-link').href = report.href;
  }
  function updateUrl(method, url = viewUrl(location.href,state)) {
    clearTimeout(urlTimer);
    pendingUrl = undefined;
    if (url.href !== location.href) {
      try { history[method](null, '', url); }
      catch (error) {
        if (error.name !== 'SecurityError') throw error;
        notice('瀏覽器暫緩更新網址，可用「分享」複製目前視圖。');
      }
    }
    updateReportLink();
  }
  function scheduleUrl() {
    clearTimeout(urlTimer);
    pendingUrl = viewUrl(location.href,state);
    urlTimer = setTimeout(() => updateUrl('replaceState',pendingUrl),400);
  }
  function change(patch, automatic = false, method = 'pushState') {
    if (pendingUrl && method === 'pushState') updateUrl('replaceState',pendingUrl);
    if (!automatic) stop();
    if (('year' in patch || 'id' in patch) && !('story' in patch)) delete state.story;
    state = { ...state, ...patch };
    if (!historicalSheets[state.year]) delete state.historic;
    if (state.seat && !polityLayers[state.year]?.centers.some(c => c.label === state.seat)) delete state.seat;
    if (method === 'defer') scheduleUrl();
    else updateUrl(method);
    render();
  }
  function reading(open) {
    el('reading').classList.toggle('is-open',open);
    el('reading-toggle').setAttribute('aria-expanded',String(open));
  }
  function select(id, year = state.year, story) {
    el('results').hidden = true;
    change({ id, year, seat:null, story });
    reading(true);
    el('place-title')?.focus({preventScroll:true});
    el('reading').scrollTop = el('reading-body').scrollTop = 0;
  }
  function findPlace(id, year = state.year, story) {
    if (points[id]) {
      state.view = [...points[id], story ? 13 : Math.max(8.7, state.view[2])];
      map.setView(state.view);
    }
    select(id, year, story);
  }
  function openStop(index) {
    const { id, year } = anpingStory[index];
    el('guide').open = false;
    findPlace(id, year, 'anping');
  }
  el('start-story').onclick = () => openStop(0);
  function selectCenter(label, year = state.year, recenter = false) {
    const site = polityLayers[year]?.centers.find(c => c.label === label);
    if (!site) return;
    if (recenter) {
      state.view = [...site.point, Math.max(8.2,state.view[2])];
      map.setView(state.view);
    }
    el('results').hidden = true;
    change({id:null,seat:label,year});
    reading(true); el('place-title')?.focus({preventScroll:true});
    el('reading').scrollTop = el('reading-body').scrollTop = 0;
  }
  const map = createAtlasMap(el('map'), loadStreetMap, {
    onSelect: select,
    onCenter: selectCenter,
    onLayerChange: patch => change(patch),
    onModernFailure() {
      state.modern = false;
      updateUrl('replaceState'); render();
      notice('街道底圖未能載入，已回到現代地形參照。');
    },
    onViewChange(view, continuous) {
      state.view = view;
      if (continuous) scheduleUrl();
      else updateUrl('replaceState');
    }
  });
  map.setView(state.view);
  const yearButtons = years.map(year => {
    const b = button(String(year), () => change({year}));
    b.title = year + ' 年 · ' + periodNotes[year].title;
    return b;
  });
  el('years').append(...yearButtons);
  const eraStops = [
    [1624,'荷蘭時期'],[1662,'鄭氏時期'],[1684,'清領時期'],
    [1895,'日治時期'],[1945,'戰後臺灣']
  ];
  const eraButtons = eraStops.map(([start,label],index) => {
    const b = button(label, () => change({year:start}));
    const end = eraStops[index + 1]?.[0] ?? Infinity;
    b.style.flexGrow = String(years.filter(y => y >= start && y < end).length);
    return b;
  });
  el('eras').append(...eraButtons);
  el('scrubber').max = String(years.length - 1);
  el('scrubber').oninput = e => {
    const year = years[Number(e.target.value)];
    if (year === state.year) return;
    change({year},false,scrubbing ? 'defer' : 'pushState');
    scrubbing = true;
  };
  function finishScrub() {
    if (scrubbing) updateUrl('replaceState');
    scrubbing = false;
  }
  el('scrubber').onchange = finishScrub;
  el('scrubber').onblur = finishScrub;
  function step(direction, automatic = false) {
    const year = years[years.indexOf(state.year) + direction];
    if (year !== undefined) {
      change({year},automatic,automatic && playingEntry ? 'replaceState' : 'pushState');
      playingEntry = automatic;
    }
    if (automatic && state.year === years[years.length - 1]) stop();
  }
  function play() {
    if (timer) return stop();
    if (state.year === years[years.length - 1]) {
      change({ year:years[0] });
      playingEntry = true;
    }
    el('play').textContent = 'Ⅱ 暫停';
    el('play').setAttribute('aria-pressed','true');
    timer = setInterval(() => step(1,true),3000);
  }
  el('previous').onclick = () => step(-1);
  el('next').onclick = () => step(1);
  el('play').onclick = play;
  el('reading-toggle').onclick = () => reading(!el('reading').classList.contains('is-open'));
  el('reading-size').onclick = () => {
    const expanded = el('reading').classList.toggle('full-height');
    el('reading-size').textContent = expanded ? '縮小閱讀欄' : '放大閱讀欄';
    el('reading-size').setAttribute('aria-pressed',String(expanded));
  };

  function results() {
    const term = el('search').value.trim();
    const matches = search(term).filter(p => term || p.records[state.year]);
    const rows = matches.flatMap(p => {
      const row = button(p.modern, () => findPlace(p.id));
      const records = term ? matchingRecords(p,term) : [];
      const names = records.map(({year,name}) => year + ' ' + name);
      row.append(node('small',p.region + ' · ' + (names.join('、') || Object.keys(p.records).join('、'))));
      const choices = [row];
      if (records.length && !records.some(record => record.year === state.year)) {
        const matchedYears = new Set(records.map(record => record.year));
        for (const year of matchedYears) {
          choices.push(button('切至 ' + year + ' 年 · ' + p.records[year][0], () => findPlace(p.id,year)));
        }
      }
      return choices;
    });
    if (term) {
      const query = normalize(term);
      for (const year of years.filter(y => normalize(y + periodNotes[y].title + periodNotes[y].era).includes(query))) {
        rows.push(button(year + ' 年　' + periodNotes[year].title, () => {
          change({year,id:null,seat:null}); el('results').hidden = true; reading(true);
          const heading = el('map-title');
          heading.tabIndex = -1; heading.focus({preventScroll:true});
        }));
      }
      for (const [year,id,text] of events.filter(e => normalize(e[2]).includes(query))) {
        rows.push(button(year + ' · ' + text, () => findPlace(id,year)));
      }
      for (const year of years) {
        for (const site of polityLayers[year]?.centers ?? []) {
          if (normalize(site.label).includes(query)) rows.push(button(
            year + ' · ' + site.label, () => selectCenter(site.label,year,true)));
        }
      }
    }
    el('results').replaceChildren(...rows);
    if (!rows.length) el('results').append(node('p','尚未收錄符合的條目。可試試舊名、年代或事件。'));
    el('results').hidden = false;
  }
  function closeCard() {
    change({id:null,seat:null});
    if (el('reading-toggle').getClientRects().length) { reading(false); el('reading-toggle').focus(); }
    else { el('map').querySelector('[tabindex]')?.focus({preventScroll:true}); }
  }
  function card() {
    const panel = el('card');
    panel.replaceChildren();
    const p = places.find(item => item.id === state.id);
    if (state.seat) {
      const layer = polityLayers[state.year];
      const site = layer.centers.find(c => c.label === state.seat);
      if (site) {
        const top = node('div',undefined,'cardtop');
        top.append(node('small',state.year + ' 年 · 歷史據點'),button('關閉',closeCard));
        const title = node('h2',site.label);
        title.id = 'place-title'; title.tabIndex = -1;
        panel.append(top,title,node('p',layer.note),link('查閱來源 ↗',site.source));
      }
      return;
    }
    if (!p) return;
    const record = p.records[state.year];
    const top = node('div',undefined,'cardtop');
    top.append(node('small','地方沿革 · ' + p.region),button('關閉',closeCard));
    const title = node('h2',record?.[0] ?? p.modern);
    title.id = 'place-title'; title.tabIndex = -1;
    panel.append(top,title,node('small','今址　' + p.modern),node('p',record?.[1] ?? '此年代尚未收錄此地的史料，可選下方年份閱讀。'));
    const dates = node('div',undefined,'dates');
    for (const y of Object.keys(p.records)) {
      const b = button(y + ' 年', () => select(p.id,Number(y)));
      b.setAttribute('aria-pressed',String(Number(y) === state.year)); dates.append(b);
    }
    const citation = node('p');
    citation.append(link('查閱來源 ↗',p.source),node('br'),node('small',p.locator));
    panel.append(dates,citation);
    if (p.extra) panel.append(link('延伸資料 ↗',p.extra));
    const localEvents = events.filter(([year,id]) => id === p.id && year === state.year);
    if (localEvents.length) {
      const list = node('ul');
      list.append(...localEvents.map(([, , title]) => node('li',title)));
      panel.append(node('h3','此地當年事件'),list);
    }
    panel.append(node('small','位置為現代地點概位。'),node('br'));
    const entry = node('a','閱讀完整地方誌');
    entry.href = './atlas/places.html#' + p.id;
    panel.append(entry);
    const stopIndex = anpingStory.findIndex(stop => stop.year === state.year && stop.id === p.id);
    if (state.story && stopIndex >= 0) {
      const nav = node('nav',undefined,'story-controls');
      nav.setAttribute('aria-label','安平故事導覽');
      nav.append(node('strong','安平故事　' + (stopIndex + 1) + ' / ' + anpingStory.length));
      if (stopIndex > 0) nav.append(button('上一站',() => openStop(stopIndex - 1)));
      if (stopIndex + 1 < anpingStory.length) nav.append(button('下一站',() => openStop(stopIndex + 1)));
      else nav.append(button('結束導覽',() => { change({story:undefined}); el('place-title').focus(); }));
      panel.prepend(nav);
    }
  }
  function render() {
    updateReportLink();
    const index = years.indexOf(state.year);
    const period = periodNotes[state.year];
    const current = places.filter(p => p.records[state.year]);
    const yearEvents = events.filter(([year]) => year === state.year);
    yearButtons.forEach((b,i) => b.setAttribute('aria-pressed',String(i === index)));
    eraButtons.forEach((b,i) => b.setAttribute('aria-current',String(
      state.year >= eraStops[i][0] && state.year < (eraStops[i+1]?.[0] ?? Infinity))));
    el('previous').disabled = index === 0;
    el('next').disabled = index === years.length - 1;
    el('scrubber').value = String(index);
    el('scrubber').setAttribute('aria-valuetext',state.year + ' 年 ' + period.title);
    for (const key of ['events',...layerKeys]) el(key).checked = state[key];
    el('clock-year').textContent = state.year;
    el('clock-era').textContent = period.era;
    el('map-title').textContent = period.title;
    el('period-year').textContent = '公元 ' + state.year + ' 年';
    el('era-tag').textContent = period.era;
    el('caption-era').textContent = state.year + ' 年';
    el('mobile-era').textContent = state.year + '　' + period.title;
    el('period-summary').textContent = period.summary;
    el('period-citations').replaceChildren(...(period.citations ?? []).map(({url,locator}) => {
      const item = node('li'); item.append(link(locator,url)); return item;
    }));
    el('coverage').textContent = '本年收錄 ' + current.length + ' 處地點、' + yearEvents.length + ' 則事件';
    el('event-list').replaceChildren(...yearEvents.map(([,id,text]) => button(text + '　›',() => findPlace(id))));
    el('place-list').replaceChildren(...current.map(p => button(p.records[state.year][0], () => findPlace(p.id))));
    const layer = polityLayers[state.year];
    el('region-detail').replaceChildren();
    if (layer) {
      el('region-detail').append(node('p',layer.title),node('p',layer.note));
      const list = node('ul');
      for (const c of layer.centers) {
        const li = node('li');
        li.append(button(c.label,() => selectCenter(c.label,state.year,true)),document.createTextNode('　'),link('出處 ↗',c.source));
        list.append(li);
      }
      el('region-detail').append(list);
    }
    map.setLayers({terrain:state.terrain,polities:state.polities,places:state.places,events:state.events,
      historic:state.historic,modern:state.modern,year:state.year});
    map.setPlaces(current.map(p => ({id:p.id,label:p.records[state.year][0],point:points[p.id],
      selected:p.id === state.id,hasEvent:state.events && yearEvents.some(([,id]) => id === p.id)})));
    card();
    if (!el('results').hidden) results();
  }
  el('map-source').append(link('海岸線、地形與水系圖資出處 ↗',new URL('./map-sources.html',import.meta.url)));
  el('source-list').append(...places.map(p => {
    const item = node('li'); item.append(link(p.modern,p.source),document.createTextNode('　' + p.locator)); return item;
  }));
  el('search').onfocus = () => {stop(); results();};
  el('search').oninput = results;
  el('search').onclick = () => {
    if (el('results').hidden) results();
  };
  const searchBox = el('search').closest('.searchbox');
  const closeSearchOnBlur = event => {
    if (!event.currentTarget.contains(event.relatedTarget)) el('results').hidden = true;
  };
  searchBox.addEventListener('focusout',closeSearchOnBlur);
  el('guide').ontoggle = () => {
    if (el('guide').open) { stop(); updateReportLink(); el('layers').open = false; }
  };
  el('layers').ontoggle = () => { if (el('layers').open) el('guide').open = false; };
  el('search').onkeydown = event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (el('results').hidden) results();
      el('results').querySelector('button')?.focus();
    }
    if (event.key === 'Enter' && !el('results').hidden) el('results').querySelector('button')?.click();
  };
  for (const key of ['events', ...layerKeys]) el(key).onchange = () => change({[key]:el(key).checked});
  const dismiss = e => {
    if (!e.target.closest('.searchbox')) el('results').hidden = true;
    if (!e.target.closest('#layers')) el('layers').open = false;
    if (!e.target.closest('#guide')) el('guide').open = false;
  };
  const keyboard = e => {
    if (e.key === 'Escape') {
      if (!el('results').hidden) {
        el('search').focus(); el('results').hidden = true; return;
      }
      for (const id of ['guide','layers']) {
        if (el(id).open) { el(id).open = false; el(id).querySelector('summary').focus(); return; }
      }
      if (state.id || state.seat) closeCard(); else reading(false);
      if (document.activeElement === el('search')) el('search').blur();
      return;
    }
    if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) && document.activeElement !== el('search')) {
      e.preventDefault();el('search').focus();return;
    }
    if (e.altKey || e.metaKey || e.ctrlKey || e.defaultPrevented) return;
    if (!e.target.closest('.timeline button') && e.target.closest('input,button,summary,a,.atlas-map-surface')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.code === 'Space') { e.preventDefault(); play(); }
  };
  const pop = () => {
    clearTimeout(urlTimer); pendingUrl = undefined; scrubbing = false;
    stop(); state = read(); map.setView(state.view); render(); reading(Boolean(state.id || state.seat));
    if (state.invalid) notice('部分網址參數無法還原，已使用預設值。');
  };
  document.addEventListener('pointerdown',dismiss);
  document.addEventListener('keydown',keyboard);
  window.addEventListener('popstate',pop);
  el('share').onclick = async () => {
    const url = viewUrl(location.href,state).href;
    try { await navigator.clipboard.writeText(url); notice('已複製目前地圖與年代。'); }
    catch { window.prompt('複製目前視圖網址',url); }
  };
  stop();render();reading(Boolean(state.id || state.seat));
  if (state.invalid) notice('部分網址參數無法還原，已使用預設值。');
  return () => {
    stop();clearTimeout(noticeTimer);clearTimeout(urlTimer);window.removeEventListener('popstate',pop);
    searchBox.removeEventListener('focusout',closeSearchOnBlur);
    document.removeEventListener('pointerdown',dismiss);document.removeEventListener('keydown',keyboard);map.destroy();
    root.classList.remove('atlas-shell');
  };
}

