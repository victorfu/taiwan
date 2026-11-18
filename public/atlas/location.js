import { parse, places, years } from './data.js';
import { polityLayers } from './polities.js';
import { anpingStory } from './story.js';
import { historicalSheets } from './historical-map.js';

export const initialView = [120.95, 23.68, 6.65];
export const layerKeys = ['terrain','polities','places'];

export function readLocation(params) {
  const state = parse(params);
  const fields = params.get('view')?.split(',') ?? [];
  const view = fields.map(Number);
  const validView = fields.length === 3 && fields.every(s => s.trim()) && view.every(Number.isFinite)
    && Math.abs(view[0]) <= 180 && Math.abs(view[1]) <= 85 && view[2] >= 1 && view[2] <= 19;
  const seat = params.get('seat');
  const validSeat = seat && polityLayers[state.year]?.centers.some(c => c.label === seat);
  const story = params.get('story') === 'anping' && anpingStory.some(stop => stop.year === state.year && stop.id === state.id);
  const invalid = (params.has('story') && !story) || (params.has('seat') && !validSeat) || (params.has('view') && !validView) ||
    (params.has('year') && !years.map(String).includes(params.get('year'))) ||
    (params.has('place') && !places.some(place => place.id === params.get('place'))) ||
    (params.get('historic') === '1' && !historicalSheets[state.year]) ||
    ['events', 'historic', 'modern', ...layerKeys].some(k => params.has(k) && !['0','1'].includes(params.get(k)));
  return { ...state, ...(params.get('historic') === '1' && historicalSheets[state.year] ? {historic:true} : {}),
    ...(params.get('modern') === '1' ? {modern:true} : {}), ...(story ? {story:'anping'} : {}),
    ...(validSeat && !state.id ? {seat} : {}), ...Object.fromEntries(layerKeys.map(key => [key,params.get(key) !== '0'])),
    view: validView ? view : [...initialView], invalid };
}

export function viewUrl(location, state) {
  const url = new URL(location);
  url.searchParams.set('year', String(state.year));
  if (state.story === 'anping') url.searchParams.set('story', 'anping');
  else url.searchParams.delete('story');
  for (const key of ['modern','historic']) {
    if (state[key]) url.searchParams.set(key,'1');
    else url.searchParams.delete(key);
  }
  url.searchParams.set('events', state.events ? '1' : '0');
  for (const key of layerKeys) {
    if (state[key] === false) url.searchParams.set(key, '0');
    else url.searchParams.delete(key);
  }
  if (state.id) url.searchParams.set('place', state.id);
  else url.searchParams.delete('place');
  if (state.seat && !state.id) url.searchParams.set('seat', state.seat);
  else url.searchParams.delete('seat');
  url.searchParams.set('view', state.view.map(n => Number(n.toFixed(5))).join(','));
  return url;
}
