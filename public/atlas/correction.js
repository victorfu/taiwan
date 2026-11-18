import { places } from './data.js';
import { readLocation, viewUrl } from './location.js';

const form = document.querySelector('#correction');
const entry = document.querySelector('#entry');
const description = document.querySelector('#description');
const citation = document.querySelector('#citation');
const status = document.querySelector('#status');
const home = new URL('../index.html', location.href);
const rawMap = new URLSearchParams(location.search).get('map');
let mapUrl;
if (rawMap && URL.canParse(rawMap)) {
  const incoming = new URL(rawMap);
  const state = readLocation(incoming.searchParams);
  if (incoming.origin === home.origin && !state.invalid) {
    mapUrl = viewUrl(home, state);
    const place = places.find(item => item.id === state.id);
    entry.value = [state.year + ' 年', place ? place.modern + '（' + place.id + '）' : state.seat].filter(Boolean).join(' · ');
    document.querySelector('#return-map').href = mapUrl.href;
  }
}

document.querySelector('#download').disabled = false;
form.addEventListener('input', () => { status.textContent = ''; });
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!entry.value.trim() || !description.value.trim()) {
    status.textContent = '請填寫條目與更正內容。';
    (!entry.value.trim() ? entry : description).focus();
    return;
  }
  const text = ['臺灣時序 · 史料修正單', entry.value.trim(), mapUrl?.href ?? '',
    '', '需要更正的內容', description.value.trim(), '', '查考依據', citation.value.trim() || '未填寫'].join('\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', text], {type:'text/plain;charset=utf-8'}));
  const a = document.createElement('a');
  a.href = url;
  a.download = '臺灣時序-史料修正單.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = '修正單已備妥下載，可將檔案交給編輯者。';
});
