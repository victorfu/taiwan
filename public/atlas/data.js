import { years } from './periods.js';
import { regionalPlaces } from './regional-places.js';
export { periodNotes, periods, years } from './periods.js';
export { points } from './geometry.js';

/** @type {import('../../src/atlas-data.ts').PlaceInput[]} */
const placeRows = [
  {
    id: 'castle',
    status: 'approved',
    modern: '安平古堡',
    region: '臺南市安平區',
    source: 'https://publications.culture.tainan.gov.tw/index.php?did=1022&inter=publication&page=2',
    locator: '臺南市文化局《我們的安平古堡》書介年表 1623–1627、1662、1874 年。交城條件見臺博館《安平城開城條約文》荷文本翻攝件，內容摘要第 2 條。',
    extra: 'https://collections.culture.tw/ntm_collectionsweb/Collection?GID=MCM6MIM7M2',
    aliases: { 1662: ['安平鎮城'] },
    records: {
      1624: ['大員', '荷蘭東印度公司撤出澎湖後，在大員的一鯤鯓擴建既有據點。新城後來定名為熱蘭遮城。'],
      1662: ['熱蘭遮城', '荷蘭守軍與鄭成功議和，交出熱蘭遮城。鄭氏接收後，城址又稱安平鎮城。'],
      1876: ['熱蘭遮城舊址', '自 1874 年籌建二鯤鯓砲臺時，安平舊城的部分外城牆磚被運往工地。新砲臺於 1876 年落成。']
    }
  },
  {
    id: 'tower',
    status: 'approved',
    modern: '赤崁樓',
    region: '臺南市中西區',
    source: 'https://daap.ly.gov.tw/tw/daap/125-4003.html',
    extra: 'https://ws.moi.gov.tw/Download.ashx?icon=..pdf&n=MjAxMzExMjYxNTU2NTIxMDUyMDIucGRm&u=LzAwMS9VcGxvYWQvT2xkRmlsZV9USk5QL0ZpbGVVcGxvYWRMaXN0LzIwMTMxMTI2MTU1NjUyMTA1MjAyLnBkZg%3D%3D',
    locator: '立法院〈赤崁樓 1936–1961年〉1653、1661 年沿革。台江國家公園調查報告第 3-7 頁圖 3-1-3，可比較兩城位置與交城時間。',
    records: {
      1662: ['普羅民遮堡', '普羅民遮堡位於台江對岸的赤崁，與大員的熱蘭遮城隔水相望。鄭軍於前一年圍堡，荷蘭守軍在 1661 年 5 月交城。']
    }
  },
  {
    id: 'merchant',
    status: 'approved',
    modern: '原英商德記洋行',
    region: '臺南市安平區',
    source: 'https://web.tainan.gov.tw/tnanping/cp.aspx?n=20609&s=7242',
    locator: '安平區公所〈安平樹屋暨原德記洋行〉，見沿革表 1867、1895 年兩條。',
    records: {
      1876: ['德記洋行', '英商德記於 1867 年在安平海頭社設行。砂糖、樟腦與鴉片是它在安平經手的大宗貨物。'],
      1895: ['德記洋行', '日本統治初期，安平仍有德記洋行營業。往後港道淤塞，貨物交易也受專賣制度影響，安平的外商洋行陸續歇業。']
    }
  },
  {
    id: 'battery',
    status: 'approved',
    modern: '億載金城',
    region: '臺南市安平區',
    source: 'https://collections.nmth.gov.tw/CollectionContent.aspx?a=132&rno=2002.007.0267',
    extra: 'https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg031174/ch05/type3/gov46/num11/Eg.pdf',
    locator: '臺史博藏品 2002.007.0267「文物描述」第 3 段載完工年份及題額。1895 年駐守見文化部古蹟公告「指定理由」第一款。',
    records: {
      1876: ['二鯤鯓砲臺', '清廷為守護安平與臺灣府城，在二鯤鯓修築海防砲臺。1876 年工程完成，城門上的「億載金城」四字，成為今天人們熟悉的地標名稱。'],
      1895: ['二鯤鯓砲臺', '乙未戰爭期間，劉永福曾駐守二鯤鯓砲臺。這座安平海防設施當時已建成十九年。']
    }
  },
  ...regionalPlaces
];
/** @type {import('../../src/atlas-data.ts').AtlasData['places']} */
export const places = placeRows.map(place => ({...place,status:place.status ?? 'draft'}));

/** @type {import('../../src/atlas-data.ts').AtlasData['events']} */
export const events = [
  [1624, 'fenggui', '荷蘭人撤離風櫃尾'],
  [1624, 'castle', '荷蘭東印度公司在大員擴建城堡'],
  [1662, 'castle', '鄭氏接收熱蘭遮城'],
  [1684, 'jialixing', '諸羅縣初設'],
  [1684, 'wenao', '澎湖設巡檢司'],
  [1684, 'confuciustemple', '周昌與蔣毓英捐資修建孔廟'],
  [1684, 'zuoyingoldcity', '鳳山縣初設'],
  [1684, 'grandmazu', '施琅改寧靖王府邸為天妃宮'],
  [1876, 'battery', '二鯤鯓砲臺完工'],
  [1876, 'takao', '英國簽租哨船頭山上官邸用地'],
  [1884, 'keelung', '法國艦隊進攻基隆'],
  [1884, 'tamsui', '清法滬尾戰役'],
  [1884, 'northgate', '臺北府城竣工'],
  [1895, 'bagua', '八卦山戰役'],
  [1895, 'battery', '乙未戰爭期間劉永福駐守砲臺'],
  [1895, 'yanliao', '近衛師團由澳底海岸登陸'],
  [1895, 'eluanbi', '清軍撤離時毀去鵝鑾鼻燈塔'],
  [1895, 'huoshaozhuang', '火燒庄之役'],
  [1908, 'taichungpark', '縱貫鐵路通車紀念典禮'],
  [1908, 'ntm', '臺灣總督府博物館成立'],
  [1914, 'liwu', '太魯閣戰役'],
  [1914, 'zhaoping', '阿里山鐵路延伸至沼平'],
  [1945, 'taipeihall', '臺北公會堂受降儀式'],
  [1945, 'executiveyuan', '臺灣省行政長官公署成立'],
  [1987, 'presidentoffice', '臺灣、澎湖解除戒嚴'],
  [1987, 'nationaltheater', '國家戲劇院與音樂廳開幕'],
  [1987, 'houjin', '後勁反五輕運動'],
  [1996, 'presidentoffice', '首任直選正副總統宣誓就職'],
  [1996, 'taoyuanarena', '桃園舉行就職慶祝大會'],
  [1996, 'zoostation', '臺北捷運木柵線通車']
];

/** @param {string} text */
export function normalize(text) {
  return text.replace(/臺/g, '台').trim().toLowerCase();
}

/** @param {import('../../src/atlas-data.ts').AtlasPlace} place @param {string} term */
export function matchingRecords(place, term) {
  const query = normalize(term);
  return Object.entries(place.records).flatMap(([year, record]) =>
    [record[0], ...(place.aliases?.[Number(year)] ?? [])]
      .filter(name => normalize(name).includes(query))
      .map(name => ({year:Number(year), name})));
}

/** @param {string} term */
export function search(term) {
  const query = normalize(term);
  return places.filter(place =>
    [place.modern, place.region].some(name => normalize(name).includes(query)) ||
    matchingRecords(place, query).length > 0);
}
/** @param {URLSearchParams} params */
export function parse(params){
  const year = years.find(value => String(value) === params.get('year')) ?? years[0];
  const id = params.get('place');
  return { year, id: places.some(p => p.id === id) ? id : null, events: params.get('events') !== '0' };
}
