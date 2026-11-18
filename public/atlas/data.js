import { years } from './periods.js';
import { regionalPlaces } from './regional-places.js';
export { periodNotes, periods, years } from './periods.js';
export { points } from './geometry.js';

export const places = [
  {
    id: 'castle',
    modern: '安平古堡',
    region: '臺南市安平區',
    source: 'https://publications.culture.tainan.gov.tw/index.php?did=1022&inter=publication&page=2',
    locator: '臺南市文化局《我們的安平古堡》，見書籍介紹所列築城、1662 年及 1874 年大事。',
    extra: 'https://collections.nmth.gov.tw/CollectionContent.aspx?a=132&rno=2003.015.0124',
    aliases: { 1662: ['安平鎮城'] },
    records: {
      1624: ['大員', '荷蘭東印度公司從澎湖移往大員，在今安平一帶建立據點，開始築城。後來的熱蘭遮城就在此地逐步形成。'],
      1662: ['熱蘭遮城', '1662 年，鄭成功接收荷蘭人的熱蘭遮城，改稱安平鎮城。今日「安平古堡」這個名稱，仍保留了當年改名的痕跡。'],
      1876: ['熱蘭遮城舊址', '安平南方興建二鯤鯓砲臺時，清軍從舊城拆取磚材。從地圖上的舊城往南找到砲臺，可以看到這批建材如何連結兩處遺址。']
    }
  },
  {
    id: 'tower',
    modern: '赤崁樓',
    region: '臺南市中西區',
    source: 'https://www.twtainan.net/zh-tw/attractions/detail/802/',
    locator: '臺南市觀光旅遊局〈赤崁文化園區〉，見介紹首兩段及園區現存建築說明。',
    records: {
      1662: ['普羅民遮堡', '從安平隔著台江望向赤崁，對岸的普羅民遮堡曾是荷蘭人的行政與商業據點。今日赤崁樓周邊已是市街，十七世紀的海岸約在新美街一帶。']
    }
  },
  {
    id: 'merchant',
    modern: '原英商德記洋行',
    region: '臺南市安平區',
    source: 'https://web.tainan.gov.tw/tnanping/cp.aspx?n=20609&s=7242',
    locator: '安平區公所〈安平樹屋暨原德記洋行〉，見沿革表 1867、1895 年兩條。',
    records: {
      1876: ['德記洋行', '英商德記於 1867 年在安平海頭社設行。到了這個快照年代，洋行已經營將近十年，砂糖、樟腦和鴉片都是它買賣的貨物。'],
      1895: ['德記洋行', '日本接收臺灣以後，安平港逐漸淤淺，船隻裝卸貨物愈來愈困難。在其他洋行陸續歇業的過程中，德記仍持續營業。目前資料未列出它在 1895 年的交易量。']
    }
  },
  {
    id: 'battery',
    modern: '億載金城',
    region: '臺南市安平區',
    source: 'https://collections.nmth.gov.tw/CollectionContent.aspx?a=132&rno=2002.007.0267',
    locator: '國立臺灣歷史博物館，館藏號 2002.007.0267，見「文物描述」第 3 段。',
    records: {
      1876: ['二鯤鯓砲臺', '清廷為守護安平與臺灣府城，在二鯤鯓修築海防砲臺。1876 年工程完成，城門上的「億載金城」四字，成為今天人們熟悉的地標名稱。'],
      1895: ['二鯤鯓砲臺', '這處清代海防設施於十九年前建成。臺史博的館藏說明記載，劉永福所部曾在此與日軍接觸。資料僅記年份，確切日期仍待查考。']
    }
  },
  ...regionalPlaces
].map(place => ({ status: 'draft', ...place }));

export const events = [
  [1624, 'fenggui', '荷蘭人撤離風櫃尾'],
  [1624, 'castle', '荷蘭東印度公司在大員築城'],
  [1662, 'castle', '鄭氏接收城堡'],
  [1684, 'jialixing', '諸羅縣初設'],
  [1684, 'wenao', '澎湖設巡檢司'],
  [1684, 'confuciustemple', '周昌與蔣毓英捐資修建孔廟'],
  [1876, 'battery', '二鯤鯓砲臺完工'],
  [1876, 'takao', '哨船頭籌建英國領事館'],
  [1884, 'keelung', '法國艦隊進攻基隆'],
  [1884, 'tamsui', '清法滬尾戰役'],
  [1895, 'bagua', '八卦山戰役'],
  [1895, 'merchant', '政權更替後德記繼續營業'],
  [1895, 'yanliao', '近衛師團由澳底海岸登陸'],
  [1895, 'eluanbi', '清軍撤離時毀去鵝鑾鼻燈塔'],
  [1908, 'taichungpark', '縱貫鐵路通車紀念典禮'],
  [1914, 'liwu', '太魯閣戰役'],
  [1945, 'taipeihall', '臺北公會堂受降儀式'],
  [1987, 'presidentoffice', '臺灣、澎湖解除戒嚴'],
  [1987, 'nationaltheater', '國家戲劇院與音樂廳開幕'],
  [1996, 'presidentoffice', '首任直選正副總統宣誓就職'],
  [1996, 'taoyuanarena', '桃園舉行就職慶祝大會']
];

function normalize(text) {
  return text.replaceAll('臺', '台').trim().toLowerCase();
}

export function matchingRecords(place, term) {
  const query = normalize(term);
  return Object.entries(place.records).flatMap(([year, record]) =>
    [record[0], ...(place.aliases?.[year] ?? [])]
      .filter(name => normalize(name).includes(query))
      .map(name => ({year:Number(year), name})));
}

export function matchingNames(place, term) {
  return matchingRecords(place, term).map(({year, name}) => year + ' ' + name);
}

export function search(term) {
  const query = normalize(term);
  return places.filter(place =>
    [place.modern, place.region].some(name => normalize(name).includes(query)) ||
    matchingRecords(place, query).length > 0);
}
export function parse(params){
  const year = years.find(value => String(value) === params.get('year')) ?? years[0];
  const id = params.get('place');
  return { year, id: places.some(p => p.id === id) ? id : null, events: params.get('events') !== '0' };
}
