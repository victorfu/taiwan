// Each coordinate locates the named settlement or town at atlas scale.
// It does not locate a government office to survey precision.
const tainanArchive = 'https://archives.ith.sinica.edu.tw/collections_con.php?no=150';
const earlyPrefectures = 'https://dl.ndl.go.jp/pid/805840/1/28';
const prefectures = 'https://dl.ndl.go.jp/pid/974279/1/37';
const late1945 = 'https://art.archives.gov.tw/tw/art/1759.html';
const islandsUnderMilitaryAdministration = 'https://art.archives.gov.tw/tw/art/1506-13185.html';
const qing = '#76551e';
const japan = '#91465a';

function site(label, point, source, color) {
  return { label, point, source, color };
}

const towns = {
  taipei: [121.51, 25.04], keelung: [121.74, 25.13], yilan: [121.75, 24.76],
  taoyuan: [121.31, 24.99], hsinchu: [120.97, 24.80], taichung: [120.68, 24.14],
  nantou: [120.68, 23.91], chiayi: [120.45, 23.48], changhua: [120.54, 24.08],
  tainan: [120.20, 22.99], kaohsiung: [120.29, 22.62], pingtung: [120.49, 22.67],
  penghu: [119.57, 23.56], hualien: [121.61, 23.98], taitung: [121.15, 22.75],
  hengchun: [120.74, 22.00], anping: [120.16, 23.00], shenkeng: [121.61, 25.00],
  miaoli: [120.82, 24.56], douliu: [120.54, 23.71], yanshui: [120.27, 23.32],
  qishan: [120.48, 22.89], fengshan: [120.36, 22.63]
};

const qingCapital = site('臺灣府治', towns.tainan, tainanArchive);
const hengchun = site('恆春縣城', towns.hengchun, 'https://tcmb.culture.tw/zh-tw/detail?id=19850819000085&indexCode=BOCH_CountryCulture_11');

export const polityLayers = {
  1624: {
    status: 'approved',
    title: '大員商館與西拉雅村社', color: '#87512e',
    note: '荷蘭東印度公司進駐大員時，臺南平原已有西拉雅村社。溫振華依地名與考古材料將新港社定位於今新市區社內一帶，圖中標示聚落概位。',
    centers: [
      site('東印度公司・大員', towns.anping, tainanArchive),
      site('西拉雅・新港社', [120.28, 23.08], 'https://www.ntl.edu.tw/public/Attachment/451716533944.pdf', '#3c7059')
    ]
  },
  1662: {
    status: 'approved',
    title: '鄭氏府治與中部村社', color: '#814539',
    note: '1662 年鄭氏接收熱蘭遮城，承天府府治設在赤崁的普羅民遮城。中部以今臺中大肚市街標示大肚社的活動地區。',
    centers: [
      site('鄭氏・承天府', [120.2024, 22.9975], 'https://www.tainan.gov.tw/cp.aspx?n=13291'),
      site('大肚社', [120.54, 24.15], 'https://www.taichung.gov.tw/media/270401/551110255171.pdf', '#3c7059')
    ]
  },
  1684: {
    status: 'approved',
    title: '臺灣府與澎湖巡檢司', color: qing,
    note: '清廷在今臺南設臺灣府，並在澎湖設隸屬臺灣縣的巡檢司。署址有紅羅罩與暗澳（文澳）等說法，澎湖點位只標示澎湖本島。',
    centers: [qingCapital, site('澎湖巡檢司', [119.60, 23.57], 'https://penghu.info/OB3A3F364BA357F73353')]
  },
  1876: {
    status: 'approved',
    title: '府治與興建中的恆春縣城', color: qing,
    note: '南部仍以府城為行政中心。恆春在 1875 年設縣，這個快照年的縣城仍在興築，至 1879 年完工。',
    centers: [qingCapital, { ...hengchun, label: '恆春縣城・興建中' }]
  },
  1884: {
    status: 'approved',
    title: '臺北府城與基隆港', color: qing,
    note: '取當年十月以後的情勢。臺北府城於這年落成，法軍在基隆港一帶登陸占領，淡水仍由清軍防守。',
    centers: [
      site('臺北府城', towns.taipei, 'https://www.gov.taipei/cp.aspx?n=14D2637CBC4AAEC2'),
      site('法軍・基隆港', towns.keelung, 'https://collections.nmth.gov.tw/CollectionContent.aspx?a=132&rno=2008.004.0121', '#405987'),
      qingCapital, hengchun
    ]
  },
  1895: {
    status: 'approved',
    title: '臺北與臺南的政權更迭', color: japan,
    note: '取當年夏季。日本總督府在臺北開始施政，同時劉永福等人在臺南維持臺灣民主國，至十月瓦解。',
    centers: [
      site('日本總督府・臺北', [121.5102, 25.0430], 'https://guantian.tainan.gov.tw/cp.aspx?n=8990'),
      site('臺灣民主國・臺南', towns.tainan, 'https://collections.nmth.gov.tw/CollectionContent.aspx?RNO=2003.010.0096&a=132', '#32616b')
    ]
  },
  1908: {
    status: 'approved',
    title: '二十廳的地方行政中心', color: japan,
    note: '1908 年仍沿用二十廳制，基隆、深坑、鹽水港、恆春等地各有廳治。翌年廳制重整，並從臺東廳分設花蓮港廳。',
    centers: [
      ['臺北廳', 'taipei'], ['基隆廳', 'keelung'], ['深坑廳', 'shenkeng'], ['宜蘭廳', 'yilan'],
      ['桃園廳', 'taoyuan'], ['新竹廳', 'hsinchu'], ['苗栗廳', 'miaoli'], ['臺中廳', 'taichung'],
      ['彰化廳', 'changhua'], ['南投廳', 'nantou'], ['斗六廳', 'douliu'], ['嘉義廳', 'chiayi'],
      ['鹽水港廳', 'yanshui'], ['臺南廳', 'tainan'], ['蕃薯寮廳', 'qishan'], ['鳳山廳', 'fengshan'],
      ['阿緱廳', 'pingtung'], ['恆春廳', 'hengchun'], ['臺東廳', 'taitung'], ['澎湖廳', 'penghu']
    ].map(([label, town]) => site(label, towns[town], earlyPrefectures))
  },
  1914: {
    status: 'approved',
    title: '十二廳的地方行政中心', color: japan,
    note: '1909 年改制後的十二廳，包括東部的花蓮港廳、臺東廳與離島的澎湖廳。圖上各點按今市街概位排列。',
    centers: [
      ['臺北廳', 'taipei'], ['宜蘭廳', 'yilan'], ['桃園廳', 'taoyuan'], ['新竹廳', 'hsinchu'],
      ['臺中廳', 'taichung'], ['南投廳', 'nantou'], ['嘉義廳', 'chiayi'], ['臺南廳', 'tainan'],
      ['阿緱廳', 'pingtung'], ['臺東廳', 'taitung'], ['花蓮港廳', 'hualien'], ['澎湖廳', 'penghu']
    ].map(([label, town]) => site(label, towns[town], prefectures))
  },
  1945: {
    status: 'approved',
    title: '行政長官公署與九個省轄市', color: '#365e78',
    note: '1945 年 10 月，臺灣省行政長官公署在臺北開始辦公，主要辦公地點為原臺北市役所。圖中九市依 12 月公布的省轄市組織規程標示。',
    centers: [
      site('臺北市・行政長官公署', [121.521, 25.046], 'https://building.cy.gov.tw/cp.aspx?Create=1&n=283'),
      ...[
        ['基隆市', 'keelung'], ['新竹市', 'hsinchu'], ['臺中市', 'taichung'], ['彰化市', 'changhua'],
        ['嘉義市', 'chiayi'], ['臺南市', 'tainan'], ['高雄市', 'kaohsiung'], ['屏東市', 'pingtung']
      ].map(([label, town]) => site(label, towns[town], late1945))
    ]
  },
  1987: {
    status: 'approved',
    title: '解嚴與金馬戰地政務', color: '#365e78',
    note: '總統於 7 月 14 日頒布解嚴令，臺灣地區從翌日零時起解嚴。金門、馬祖的戰地政務延續至 1992 年 11 月 7 日。兩處點位分別以金城、南竿作區域參照。',
    centers: [
      site('臺北・總統頒布解嚴令', [121.512, 25.040], 'https://www.president.gov.tw/Page/294/37460'),
      site('金門・戰地政務', [118.32, 24.43], islandsUnderMilitaryAdministration, '#865035'),
      site('馬祖・戰地政務', [119.95, 26.16], islandsUnderMilitaryAdministration, '#865035')
    ]
  },
  1996: {
    status: 'approved',
    title: '首次總統直選與就職', color: '#365e78',
    note: '3 月 23 日，選民首次直接選出總統、副總統。5 月 20 日，李登輝與連戰在臺北總統府宣誓就職，桃園巨蛋為當日慶祝典禮的主會場。',
    centers: [
      site('臺北・總統府宣誓就職', [121.512, 25.040], 'https://www.president.gov.tw/NEWS/22082'),
      site('桃園・就職慶祝會場', [121.3243, 24.9953], 'https://www.th.gov.tw/Epaper_Content/238/9126/')
    ]
  }
};

// The caller owns canvas sizing, clearing, and device pixel ratio. project()
// maps [longitude, latitude] to [x,y] CSS pixels in the current viewport.
// obstacles are visible label boxes in the same coordinates. For a single
// text line, {left,right,middle} is sufficient; taller labels may pass height.
export function drawPolities(ctx, year, project, width, height, obstacles = []) {
  const layer = polityLayers[year];
  if (!layer) return;
  const occupied = [...obstacles];
  ctx.save();
  ctx.font = '600 12px "Microsoft JhengHei", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.lineJoin = 'round';

  for (const center of layer.centers) {
    const [x, y] = project(center.point);
    if (x < 0 || x > width || y < 0 || y > height) continue;
    const color = center.color ?? layer.color;
    ctx.fillStyle = color;
    ctx.strokeStyle = '#fffaf0';
    ctx.lineWidth = 2;
    ctx.fillRect(x - 4, y - 4, 8, 8);
    ctx.strokeRect(x - 5, y - 5, 10, 10);

    const length = ctx.measureText(center.label).width;
    const candidates = [[x + 9, y - 12], [x - length - 9, y - 12], [x + 9, y + 14], [x - length - 9, y + 14]];
    for (const [left, middle] of candidates) {
      const right = left + length;
      if (left < 2 || right > width - 2 || middle < 9 || middle > height - 9) continue;
      if (occupied.some(box => left < box.right && right > box.left
        && Math.abs(middle - box.middle) < 8 + (box.height ?? 16) / 2)) continue;
      ctx.lineWidth = 4;
      ctx.strokeText(center.label, left, middle);
      ctx.fillText(center.label, left, middle);
      occupied.push({ left: left - 3, right: right + 3, middle });
      break;
    }
  }
  ctx.restore();
}
