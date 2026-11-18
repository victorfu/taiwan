/** @type {import('../../src/atlas-data.ts').PlaceInput[]} */
export const regionalPlaces = [
  {
    id: 'fenggui', modern: '風櫃尾荷蘭城堡遺址', region: '澎湖縣馬公市',
    status: 'approved',
    source: 'https://tcmb.culture.tw/zh-tw/detail?id=20011121000001&indexCode=BOCH_CountryCulture_11',
    locator: '國家文化記憶庫〈馬公風櫃尾荷蘭城堡〉，見城堡簡介、「現狀」與「使用情形」。',
    records: {
      1624: ['風櫃尾', '荷蘭人在蛇頭山築堡兩年後，與明軍議定撤離澎湖。可搬運的建材被拆下，運往大員築城。風櫃尾仍留下土垣與濠溝。'],
      1895: ['風櫃尾', '日軍在這一年攻佔澎湖。古蹟調查推測風櫃尾舊堡仍用作砲陣地，當年實際使用的範圍尚待考證。']
    }
  },
  {
    id: 'wenao', modern: '文澳城隍廟', region: '澎湖縣馬公市',
    status: 'approved',
    source: 'https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=152',
    extra: 'https://penghu.info/OB3A3F364BA357F73353',
    locator: '內政部〈文澳城隍廟〉「發展源流」記暗澳。另見〈青螺與紅羅─巡檢之地乎？〉所引蔣毓英、高拱乾兩部《臺灣府志》。',
    records: {
      1624: ['暗澳', '明軍在暗澳築天啟城，以控制媽宮一帶。地圖借用今日文澳城隍廟的位置標示聚落，當年的城址範圍仍待考證。'],
      1684: ['暗澳', '清廷在澎湖設巡檢司。蔣毓英《臺灣府志》記署址在紅羅罩，稍後高拱乾《臺灣府志》則記在暗澳。圖釘標示今日文澳；設司當年的署址與城隍廟創建年仍有待考證。']
    }
  },
  {
    id: 'jialixing', modern: '佳里興震興宮前紀念碑', region: '臺南市佳里區',
    status: 'approved',
    source: 'https://publications.culture.tainan.gov.tw/index.php?did=650&inter=publication&page=1',
    locator: '臺南市文化局《佳里興震興宮》，見徵引《諸羅縣志》及廟前紀念碑的段落。',
    extra: 'https://www.npm.gov.tw/NewChineseArtDownload.ashx?bid=5213',
    records: {1684: ['佳里興', '清廷設諸羅縣。據《諸羅縣志》，縣署及北路參將營起初設於佳里興，1704 年奉令移往諸羅山，即今日嘉義。地圖以震興宮廟前紀念碑標示聚落概位。'] }
  },
  {
    id: 'keelung', modern: '基隆港', region: '基隆市',
    status: 'approved',
    source: 'https://ship.nmmst.gov.tw/ship/detailprint/136/861',
    extra: 'https://www.klcg.gov.tw/tw/klcg1/3173.html',
    locator: '海科館〈台灣港口歷史〉列通商口岸與 1884 年砲擊。基隆市政府〈歷史沿革〉記 1875 年改名。',
    aliases: {1876: ['雞籠港（舊稱）']},
    records: {
      1876: ['基隆港', '此港與滬尾、安平、打狗同為十九世紀的通商口岸。清廷於前一年將雞籠改稱基隆。'],
      1884: ['基隆港', '清法戰爭期間，法國艦隊進攻基隆，港口遭到砲擊。同年法艦也進攻淡水河口。']
    }
  },
  {
    id: 'tamsui', modern: '淡水河口', region: '新北市淡水區',
    status: 'approved',
    source: 'https://www.tshs.ntpc.gov.tw/xmdoc/cont?sid=0K258535376150560462&xsmsid=0K255571641497878724',
    locator: '淡水古蹟博物館〈從英商陶德之眼看滬尾戰役番外歷史〉，見法艦進攻淡水及商人報導。',
    records: {1884: ['滬尾', '戰事從基隆波及滬尾，法國艦艇進攻淡水河口。當時在臺經商的陶德以報刊通訊員身分，留下海上封鎖影響貿易的記錄。'] }
  },
  {
    id: 'takao', modern: '打狗英國領事館文化園區', region: '高雄市鼓山區',
    status: 'approved',
    source: 'https://britishconsulate.kcg.gov.tw/PhotoData/PIC1021202_2.pdf',
    extra: 'https://tcmb.culture.tw/zh-tw/detail?id=20190223000001&indexCode=BOCH_CountryCulture_11',
    locator: '打狗英國領事館調查報告第三章表 3-3，見 1876 年 11 月租地及 1879 年完工紀錄。另見國家文化記憶庫〈打狗英國領事館及官邸〉。',
    records: {
      1876: ['哨船頭', '英國方面在十一月簽訂兩筆土地的租約，預備在哨船頭山上興建領事官邸。山下的辦公室用地則在翌年取得。'],
      1884: ['打狗英國領事館', '1879 年完工的館舍分布在山上與山下。領事住在山上官邸，辦公室設在靠近海關的哨船頭港邊。']
    }
  },
  {
    id: 'lukang', modern: '鹿港龍山寺', region: '彰化縣鹿港鎮',
    status: 'approved',
    source: 'https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=10',
    locator: '內政部臺灣宗教文化地圖〈鹿港龍山寺〉，見「發展源流」1786、1904 年及「主要特色」1905 年記載。',
    records: {
      1876: ['鹿港龍山寺', '1786 年，泉州移民響應地方倡議，將龍山寺遷建至現址。這次遷建由鹿港日茂行商人林振嵩與地方仕紳許樂三經辦。'],
      1908: ['鹿港龍山寺', '龍山寺於 1904 年成為日本真宗本願寺的分寺，隔年迎來阿彌陀佛像。當地寺院的使用與信仰空間也隨之改變。']
    }
  },
  {
    id: 'bagua', modern: '八卦山', region: '彰化縣彰化市',
    status: 'approved',
    source: 'https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=127',
    locator: '內政部臺灣宗教文化地圖〈彰化八卦山大佛〉，見「發展源流」乙未戰爭段落。',
    records: {1895: ['八卦山', '日軍南下彰化時，吳湯興、吳彭年等率軍在八卦山抵抗，兩人皆在戰役中身亡。今日山上的大佛是戰後才出現的地標。'] }
  },
  {
    id: 'taichungpark', modern: '臺中公園湖心亭', region: '臺中市北區',
    status: 'approved',
    source: 'https://www.tchac.taichung.gov.tw/building?pid=15&uid=33',
    extra: 'https://collections.nmth.gov.tw/CollectionContent.aspx?a=132&rno=2001.008.0876',
    locator: '臺中市文化資產處〈中山公園湖心亭〉古蹟沿革。臺史博藏品 2001.008.0876 的描述第 2 段列日治時期的池亭及其戰後改名。',
    records: {
      1908: ['臺中公園池亭', '臺中公園開園五年後，為縱貫鐵路全線通車典禮，在園內池中興建了休憩用的亭閣。'],
      1914: ['臺中公園池亭', '1908 年通車典禮興建的池亭留存於公園內。戰後池亭改稱湖心亭，成為今日遊客熟悉的名稱。']
    }
  },
  {
    id: 'liwu', modern: '立霧溪谷', region: '花蓮縣秀林鄉',
    status: 'approved',
    source: 'https://ihc.cip.gov.tw/EJournal/EJournalCat/249',
    extra: 'https://www.cip.gov.tw/data/news/202208/T-40369462.pdf?c=3FD58C8AA667F0161C2997999E49C980&fn=14F9D2A98598996F494C73DF3195AA8564F474DD9478577F&s=2AFF5C90ECEA3EC7D0636733C6861689',
    locator: '帖喇‧尤道〈從太魯閣族對日戰役看傳統價值面對殖民統治〉，《原住民族文獻》第 21 期。原民會《太魯閣事件》敘述 1914 年 2 月隘勇線時並列得其黎溪與今名立霧溪。',
    records: {1914: ['得其黎溪流域', '得其黎溪即今日立霧溪。太魯閣族在河谷建立聚落。1914 年殖民政府出兵時，族人在不同部落抵抗。圖釘標示峽谷下游概位，戰事遍及更廣的山區。'] }
  },
  {
    id: 'hehuan', modern: '合歡山', region: '南投縣仁愛鄉（主峰概位）',
    status: 'approved',
    source: 'https://ihc.cip.gov.tw/EJournal/EJournalCat/249',
    locator: '帖喇‧尤道〈從太魯閣族對日戰役看傳統價值面對殖民統治〉，《原住民族文獻》第 21 期，見敘述越過合歡山一支隊伍的段落。',
    records: {1914: ['合歡山區', '攻向太魯閣族部落的日軍，有一支從西側越過合歡山進入立霧溪流域。山區點位僅供定位，當年行經的整段路線未在此圖重建。'] }
  },
  {
    id: 'taipeihall', modern: '臺北市中山堂', region: '臺北市中正區',
    status: 'approved',
    source: 'https://art.archives.gov.tw/tw/art/1788-15244.html',
    locator: '檔案管理局〈台灣光復案專輯〉，檔號 0034/002.6/4010.2/2/045。見 1945 年 10 月 26 日陳儀電文說明。',
    records: {1945: ['臺北市公會堂', '10 月 25 日，臺灣地區受降儀式在臺北市公會堂舉行。陳儀隔日呈報的電文記有出席人員，以及安藤利吉領受命令的經過。'] }
  },
  {
    id: 'kaohsiungport', modern: '高雄港', region: '高雄市',
    status: 'approved',
    source: 'https://art.archives.gov.tw/tw/art/836-15199.html',
    extra: 'https://www.twport.com.tw/business/PortInfo?a=512',
    locator: '檔案管理局〈高雄港現況〉，檔號 B5018230601/0035/140.2/4010，事件年為 1946 年。點位採港務公司公布的第一港口代表座標。',
    records: {1945: ['高雄港', '二戰期間的空襲使港口設備嚴重受損。次年（1946 年）的〈高雄港現況〉記錄港內還有十餘艘沉船，阻礙船舶通行。地圖以第一港口定位。'] }
  },
  {
    id: 'presidentoffice', modern: '總統府', region: '臺北市中正區',
    status: 'approved',
    source: 'https://www.president.gov.tw/NEWS/22082',
    extra: 'https://www.president.gov.tw/Page/294/37460',
    locator: '1996 年見總統府 5 月 20 日〈總統宣誓就職〉首三段。1987 年見 7 月 14 日總統令，載於總統府公報第 4794 號。',
    records: {
      1987: ['總統府', '蔣經國於 7 月 14 日頒布總統令，臺灣、澎湖自 7 月 15 日零時解除戒嚴。點位標出發布命令的機關。'],
      1996: ['總統府', '5 月 20 日上午，經公民直選產生的第九任總統李登輝、副總統連戰在總統府大禮堂宣誓，開始四年任期。']
    }
  },
  {
    id: 'greenisland', modern: '綠島綠洲山莊', region: '臺東縣綠島鄉',
    status: 'approved',
    source: 'https://tcmb.culture.tw/zh-tw/detail?id=112557&indexCode=Culture_Place',
    locator: '國家文化記憶庫〈綠島感訓監獄（綠洲山莊）〉，見說明首段、兩座監獄的沿革及將軍岩地址。',
    records: {1987: ['綠洲山莊', '綠洲山莊是國防部綠島感訓監獄的俗稱。1972 年起，曾在景美與泰源關押的政治犯陸續被移送來此。國防部管理這座監獄至 1987 年。']}
  },
  {
    id: 'taoyuanarena', modern: '桃園市立綜合體育館', region: '桃園市桃園區',
    status: 'approved',
    source: 'https://www.president.gov.tw/NEWS/22071',
    extra: 'https://web.cec.gov.tw/central/article/19170',
    locator: '總統府〈總統就職典禮與慶祝活動之時間、地點〉5 月 20 日上午十時項。投票日期及當選人見中選會〈總統、副總統選舉〉第 9 任。',
    records: {1996: ['桃園巨蛋體育館', '3 月 23 日，選民首次直選總統及副總統，李登輝與連戰當選。5 月 20 日的就職慶祝活動設兩個會場，地圖標示第一會場桃園巨蛋，第二會場設在縣立田徑場。']}
  },
  {
    id: 'confuciustemple', modern: '臺南孔子廟', region: '臺南市中西區',
    status: 'approved',
    source: 'https://taiwangods.moi.gov.tw/html/Cultural/3_0011.aspx?i=107',
    locator: '內政部臺灣宗教文化地圖〈臺南孔子廟〉，見「發展源流」鄭氏建廟與康熙二十三、二十四年段落。',
    records: {
      1684: ['先師聖廟', '鄭氏時期在桂仔埔建立孔廟，設堂講學。1684 年，清朝官員周昌與蔣毓英捐資修建。翌年改為臺灣府學，祭孔與教學繼續在此進行。']
    }
  },
  {
    id: 'yuweng', modern: '漁翁島燈塔', region: '澎湖縣西嶼鄉',
    status: 'approved',
    source: 'https://www.taiwan.net.tw/m1.aspx?id=A12-00186&sNo=0001016',
    locator: '交通部觀光署〈漁翁島燈塔〉，見西嶼塔燈舊址與海關改建的介紹。',
    aliases: {1876: ['西嶼燈塔']},
    records: {
      1876: ['漁翁島燈塔', '西嶼外垵原有一座在塔頂點燈的石塔，船隻夜間行經澎湖時可循光辨位。1875 年，海關在舊址改建圓形鐵塔。']
    }
  },
  {
    id: 'eluanbi', modern: '鵝鑾鼻燈塔', region: '屏東縣恆春鎮',
    status: 'approved',
    source: 'https://www.taiwan.nps.gov.tw/home/zh-tw/quarterly/7935/6949.html',
    locator: '國家公園季刊鵝鑾鼻燈塔專文，見光緒九年啟用及光緒二十一年撤軍兩段。',
    records: {
      1884: ['鵝鑾鼻燈塔', '在恆春半島南端，清廷設置燈塔為過往船隻導航。燈塔周圍築牆、挖壕，並派兵駐守。'],
      1895: ['鵝鑾鼻燈塔', '清軍撤離臺灣時毀去燈塔。1898 年，日本當局才撥款重建。今日所見塔身經過後續改建。']
    }
  },
  {
    id: 'yanliao', modern: '鹽寮海濱公園', region: '新北市貢寮區',
    status: 'approved',
    source: 'https://newtaipei.travel/zh-tw/attractions/detail/110109',
    locator: '新北市觀光旅遊局〈鹽寮抗日紀念碑〉景點介紹，見 1895 年 5 月 29 日澳底登陸段、園址及導覽地圖。',
    records: {
      1895: ['澳底', '馬關條約簽訂後，日軍近衛師團從臺灣東北角登陸，隨後向臺北推進。地圖以鹽寮海濱公園標示這段海岸的概位。']
    }
  },
  {
    id: 'longteng', modern: '龍騰斷橋', region: '苗栗縣三義鄉',
    status: 'approved',
    source: 'https://twh.boch.gov.tw/taiwan/intro.aspx?id=3&lang=zh_tw',
    extra: 'https://www.miaoli.gov.tw/News_Content2.aspx?n=285&s=825993',
    locator: '文化部文化資產局〈臺鐵舊山線〉，見三義至后里的橋隧及魚藤坪橋之描述。苗栗縣政府另載兩代橋的興建年月。',
    records: {
      1908: ['魚藤坪橋', '縱貫鐵路通車時，列車沿山線經過魚藤坪橋。今日稱為龍騰斷橋的磚拱遺構屬第一代橋，與地震後另建的鐵橋位置有別。']
    }
  },
  {
    id: 'qiaotousugar', modern: '橋頭糖廠', region: '高雄市橋頭區',
    status: 'approved',
    source: 'https://www.taisugar.com.tw/KOB/history.aspx?n=11629',
    extra: 'https://tcmb.culture.tw/zh-tw/detail?id=20201124000003&indexCode=BOCH_CountryCulture_11',
    locator: '台糖高雄區處〈歷史沿革〉1902、1907、1908、1909 年條目。名稱及位置見文化資產局〈橋仔頭糖廠〉。',
    records: {
      1908: ['橋仔頭製糖所', '第一工場於 1902 年開始壓榨甘蔗。到 1908 年 1 月，第二工場也開始製糖。'],
      1914: ['橋仔頭製糖所', '到這個年代，製糖所已陸續增添運輸與加工設施。五分車於 1907 年通車，第二工場於 1908 年開工製糖，鑄物工場於 1909 年成立。']
    }
  },
  {
    id: 'hsinchustation', modern: '新竹火車站', region: '新竹市東區',
    status: 'approved',
    source: 'https://www.ey.gov.tw/File/DAE5B7972E56AF7C',
    extra: 'https://tcmb.culture.tw/zh-tw/detail?id=19980623000001&indexCode=BOCH_CountryCulture_11',
    locator: '新竹市政府《新竹大車站計畫可行性研究報告（核定本）》，第 2-33 頁及圖 2.4-2。古蹟位置見〈新竹火車站〉。',
    records: {
      1914: ['新竹驛', '1913 年落成的站房以鐘塔標示入口。站內的一、二等候車室與三等候車空間分開，售票室分別向兩側旅客提供服務。']
    }
  },
  {
    id: 'hualienoldstation', modern: '花蓮舊車站', region: '花蓮縣花蓮市',
    status: 'approved',
    source: 'https://culture-tourism.hualien.gov.tw/review_dt.php?id=19',
    locator: '花蓮市文化觀光資訊網花蓮臨港線口述紀錄，見「舊花蓮車站」與「海岸驛」段落。',
    records: {
      1914: ['花蓮港驛', '花蓮港驛於 1910 年設站，是東部鐵路向縱谷延伸的起點。通往海岸驛的路線連接陸運與航運，圖上位置取自今日市區的舊站一帶。']
    }
  },
  {
    id: 'yushan', modern: '玉山主峰', region: '南投縣、嘉義縣與高雄市交界',
    status: 'approved',
    source: 'https://www.ysnp.gov.tw/FAQ/C007000?ID=99e94f36-d6fd-473a-a441-0ecc4cc0729c&PageIndex=3&PageType=1',
    extra: 'https://etour.cwa.gov.tw/scenery_inpage.php?scn_id=98&stn_id=24',
    locator: '玉山國家公園管理處〈玉山國家公園什麼時候成立？〉，見 1983 與 1985 年紀錄。主峰位置見中央氣象署玉山景點介紹。',
    records: {
      1987: ['玉山國家公園', '玉山國家公園的範圍於 1983 年公告，兩年後核定計畫並成立管理處。地圖以玉山主峰作為園區的地理參照。']
    }
  },
  {
    id: 'nationaltheater', modern: '國家戲劇院', region: '臺北市中正區',
    status: 'approved',
    source: 'https://event.npac-ntch.org/25th/history_1987.htm',
    locator: '國家兩廳院 25 週年大事記，見 1987 年 10 月 6 日啟用與 10 月 31 日開幕兩條。',
    records: {
      1987: ['國家戲劇院', '戲劇院和廣場對面的音樂廳在 10 月 6 日啟用。10 月 31 日舉行開幕典禮，兩座舞臺同時鳴鑼，戲劇院當晚演出京劇《新文姬歸漢》。']
    }
  },
  {
    id: 'zuoyingoldcity', modern: '左營舊城（鳳山縣舊城）', region: '高雄市左營區',
    status: 'approved',
    source: 'https://nchdb.boch.gov.tw/assets/advanceSearch/monument/19850819000083',
    extra: 'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Object&id=510847',
    locator: '文化部文化資產局國家文化資產網〈鳳山縣舊城〉「歷史沿革」1684、1704、1722、1826 年條。縣治初選地點的考證見國家文化記憶庫所收張守真〈考證──康熙領臺時期鳳山縣治設置問題探討〉摘要第二至四部分。',
    records: {
      1684: ['鳳山縣', '清廷設一府三縣，鳳山縣為其一。早期縣治所在有不同記載。文資局引《鳳山縣志》記載，1704 年於興隆莊興建縣署，當時尚無城牆。圖釘標示後來的縣城左營舊城。']
    }
  },
  {
    id: 'grandmazu', modern: '祀典大天后宮', region: '臺南市中西區',
    status: 'approved',
    source: 'https://tmach-culture.tainan.gov.tw/templemuseums/templepage.asp?mainid=F7334481-FDEC-441D-A976-E6E80CC49272',
    extra: 'https://dlbs.liberal.ntu.edu.tw/FULLTEXT/JR-BJ010/bj010588398.pdf',
    locator: '臺南市文化資產管理處「宮廟博物館」〈祀典大天后宮〉「廟宇介紹」首段，原文「康熙23年（1683）」的西元括注應為 1684 年。當時稱天妃宮及捨宅為寺的經過，見闞正宗〈清初臺灣府天后宮與海會寺僧侶〉所引季麒光文。',
    aliases: { 1684: ['寧靖王府邸', '大天后宮'] },
    records: {
      1684: ['天妃宮', '清軍入臺後，施琅將明寧靖王朱術桂的舊府邸改建為祀奉媽祖的天妃宮，即今大天后宮。媽祖由「天妃」改稱「天后」的確切年代，各方記載不一。']
    }
  },
  {
    id: 'northgate', modern: '臺北府城北門（承恩門）', region: '臺北市中正區',
    status: 'approved',
    source: 'https://view.boch.gov.tw/NationalHistorical/itemspage.aspx?id=1',
    extra: 'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Place&id=475676',
    locator: '文化部文化資產局「國定古蹟環景導覽」〈臺北府城—東門、南門、小南門、北門〉，見簡介首段及北門說明。另見國家文化記憶庫〈臺北北門〉說明。',
    aliases: { 1884: ['承恩門'] },
    records: {
      1884: ['臺北府城', '臺北府城自 1882 年動工，1884 年竣工，城呈長方形。北門名承恩門，外有甕城，門額「巖疆鎖鑰」。日治時期拆除城牆，今存四門中僅北門保持清代原貌。']
    }
  },
  {
    id: 'huoshaozhuang', modern: '六堆客家聯軍抗日紀念公園', region: '屏東縣長治鄉',
    status: 'approved',
    source: 'https://www.th.gov.tw/Epaper_Content/238/6568/',
    extra: 'https://www.pthg.gov.tw/towncgt/cp.aspx?n=A8CD1687885EF825',
    locator: '國史館臺灣文獻館〈屏東縣長治鄉「火燒庄」舊名與火燒庄之役〉，見「光緒21年火燒庄之役」及「火燒庄出現的歷史年代」二節。另見長治鄉公所〈長治鄉火燒庄〉。',
    records: {
      1895: ['火燒庄', '邱鳳揚指揮的六堆庄民在火燒庄與南下日軍激戰。日軍以山砲攻擊並放火焚燒村莊。據國史館臺灣文獻館引述的總督府檔案，戰事記於 11 月 26 日，庄內三百餘戶僅餘四、五戶，死者約二百四、五十人。']
    }
  },
  {
    id: 'ntm', modern: '國立臺灣博物館', region: '臺北市中正區',
    status: 'approved',
    source: 'https://www.ntm.gov.tw/cp.aspx?n=5432',
    extra: 'https://www.ntm.gov.tw/cp.aspx?n=5437',
    locator: '國立臺灣博物館〈館史溯源〉，見總督府博物館成立與彩票局館舍段落。另見同館〈本館〉沿革與 1915 年紀念館落成段。',
    aliases: { 1908: ['臺灣總督府博物館'] },
    records: {
      1908: ['臺灣總督府民政部殖產局附屬博物館', '為慶祝縱貫鐵路南北全線通車，總督府成立博物館，借用原為彩票局興建、位於總督府建築基地後方的館舍開館。今日新公園內的館舍於 1915 年落成，圖釘標示今館，並非 1908 年的開館地點。']
    }
  },
  {
    id: 'zhaoping', modern: '阿里山沼平車站', region: '嘉義縣阿里山鄉',
    status: 'approved',
    source: 'https://afrch.forest.gov.tw/railway',
    extra: 'https://tcmb.culture.tw/zh-tw/detail?indexCode=BOCH_CountryCulture_31&id=20110216000001',
    locator: '林業及自然保育署阿里山林業鐵路及文化資產管理處「阿里山大學校」大事紀 1912、1914 年。另見國家文化記憶庫〈阿里山林業暨鐵道文化景觀〉簡介。',
    records: {
      1914: ['阿里山（沼平）', '阿里山鐵路於 1912 年底通車至二萬平，其後繼續向山區延伸。1914 年路線抵達今日的沼平，登山本線完工，當時的阿里山車站成為終點站。']
    }
  },
  {
    id: 'executiveyuan', modern: '行政院', region: '臺北市中正區',
    status: 'approved',
    source: 'https://www.ey.gov.tw/Eyvisit/43BB616A2E73BAA8',
    extra: 'https://onlinearchives.th.gov.tw/docs/zong/003.pdf',
    locator: '行政院〈院區開放參觀網路導覽－中央大樓使用歷程〉，見前言及「臺灣省行政長官公署時期」段。成立日期見國史館臺灣文獻館蕭碧珍〈臺灣省行政長官公署檔案〉「壹、沿革」第二段。',
    records: {
      1945: ['臺灣省行政長官公署', '原臺北市役所大樓於 1940 年竣工。1945 年 10 月 25 日臺灣省行政長官公署在臺正式運作，以這棟大樓為公署辦公廳。1947 年公署裁撤，大樓改為臺灣省政府辦公廳，今為行政院。']
    }
  },
  {
    id: 'houjin', modern: '中油高雄煉油廠舊址西門', region: '高雄市楠梓區',
    status: 'approved',
    source: 'https://www.archives.gov.tw/wSite/public/Attachment/001/f1736323350806.pdf',
    extra: 'https://www.twreporter.org/a/refinery-protesters',
    locator: '檔案管理局《檔案半年刊》第 22 卷第 1 期張庭榕〈檔案裡看不到的抗爭者―以後勁反五輕運動為例（1987-1990）〉，見「貳、後勁反五輕事件」的事件始末。西門位置另見報導者〈後勁血淚抗爭史〉。',
    records: {
      1987: ['中油高雄煉油廠西門', '7 月初，後勁居民反對中油在高雄煉油廠興建第五輕油裂解廠，展開抗議。7 月 24 日經濟部長視察時，居民開始圍堵煉油廠西門，抗爭延續約三年。圖釘為西門一帶的概位。']
    }
  },
  {
    id: 'zoostation', modern: '捷運動物園站', region: '臺北市文山區',
    status: 'approved',
    source: 'https://www.dorts.gov.taipei/cp.aspx?n=DBAC040496EFAB94&s=864CDD262C4C443D',
    extra: 'https://www.metro.taipei/cp.aspx?n=B27E7BC8CBBCDA61',
    locator: '臺北市政府捷運工程局〈文山內湖線路線說明〉，見木柵線段落。另見臺北大眾捷運公司〈大事紀〉085.03.28 及 098.10.08 兩條。',
    records: {
      1996: ['臺北捷運木柵線', '3 月 28 日，木柵線通車營運，自動物園站至中山國中站，是國內第一條捷運線，採全自動無人駕駛的中運量系統。2009 年與內湖線合併為文湖線。']
    }
  },
  {
    id: "mazutemple", modern: "澎湖天后宮", region: "澎湖縣馬公市",
    status: 'approved',
    source: "https://taiwangods.moi.gov.tw/html/Cultural/3_0011.aspx?i=22",
    locator: "內政部臺灣宗教文化地圖〈澎湖天后宮〉「發展源流」1604 年段。",
    records: {
      1604: ["娘媽宮", "天后宮所藏石碑記下沈有容與荷蘭船隊交涉的歷史。碑上所稱的韋麻郎，是率船隊抵澎的荷蘭東印度公司指揮官。"]
    }
  },
  {
    id: "hepingisland", modern: "基隆和平島", region: "基隆市中正區",
    status: 'approved',
    source: "https://klgreat.klcg.gov.tw/News_Photo_Content.aspx?n=8105&s=8711",
    locator: "基隆市文化觀光局〈聖薩爾瓦多城暨修道院考古發掘計畫〉，見 1626 年始建和諸聖教堂相關段落。",
    aliases: { 1626: ["聖薩爾瓦多城","諸聖教堂"] },
    records: {
      1626: ["社寮島", "西班牙人在社寮島建立聖薩爾瓦多城。今日和平島的考古工作也發掘出與西班牙時期相關的諸聖教堂遺構。"]
    }
  },
  {
    id: "sinkang", modern: "新港社舊址一帶", region: "臺南市新市區",
    status: 'approved',
    source: "https://women.nmth.gov.tw/?p=1957",
    locator: "國立臺灣歷史博物館「臺灣女人」〈清代以前的女子教育〉荷蘭時期教育段。",
    records: {
      1636: ["新港社", "國立臺灣歷史博物館整理的教育史資料記載，新港在 1636 年已有教會學校。圖釘標示新港社的聚落概位。"]
    }
  },
  {
    id: "penghubattle", modern: "澎湖媽宮外海", region: "澎湖縣馬公市外海",
    status: 'approved',
    source: "https://www.penghu.gov.tw/ch/home.jsp?id=10174",
    locator: "澎湖縣政府〈歷史沿革〉鄭氏時期，見永曆三十七年（1683）段。",
    records: {
      1683: ["澎湖海域", "澎湖是鄭軍的海防前線。這年施琅率清軍與劉國軒所領鄭軍交戰。圖釘是在媽宮外海標示的區域概位。"]
    }
  },
  {
    id: "neimen", modern: "內門", region: "高雄市內門區",
    status: 'approved',
    source: "https://daap.ly.gov.tw/tw/daap/125-5937.html",
    locator: "立法院民主議政園區〈朱一貴事件 1721年〉，見羅漢門起事及府城失守段。",
    aliases: { 1721: ["鴨母王"] },
    records: {
      1721: ["羅漢門", "羅漢門是起事地之一，約在今天的高雄市內門區。後來事態擴及府城，清軍渡臺平定。"]
    }
  },
  {
    id: "shimenbattlefield", modern: "石門古戰場", region: "屏東縣牡丹鄉與車城鄉交界",
    status: 'approved',
    source: "https://nchdb.boch.gov.tw/assets/overview/historicSite/20230928000001",
    locator: "文化部文化資產局〈石門古戰場〉「相關事件背景」及登錄理由。",
    records: {
      1874: ["石門", "石門位於車城通往牡丹的峽谷，也是石門之役所在地。這處古戰場後來被登錄為史蹟。"]
    }
  },
  {
    id: "wushe", modern: "霧社", region: "南投縣仁愛鄉",
    status: 'approved',
    source: "https://collections.nmth.gov.tw/CollectionContent.aspx?RNO=2017.025.0168&a=132",
    extra: "https://www.th.gov.tw/CP/218/243/",
    locator: "國立臺灣歷史博物館，館藏號 2017.025.0168，見藏品描述的事件日期、六社與軍警鎮壓。國史館臺灣文獻館〈嘉南大圳之父〉，見烏山頭水庫 1930 年完工記錄。",
    aliases: { 1930: ["莫那魯道"] },
    records: {
      1930: ["霧社", "10 月 27 日，莫那魯道等人率領六社行動，攻入正在舉辦運動會的霧社公學校。後續鎮壓造成賽德克族人重大傷亡。圖釘標示霧社市街概位。"]
    }
  },
  {
    id: "wushantou", modern: "烏山頭水庫", region: "臺南市官田區",
    status: 'approved',
    source: "https://www.th.gov.tw/CP/218/243/",
    locator: "國史館臺灣文獻館〈嘉南大圳之父〉，見灌溉範圍及 1930 年完工段。",
    records: {
      1930: ["烏山頭水庫", "烏山頭水庫是嘉南大圳灌溉系統的重要水源。由八田與一參與督建的水庫在這年完成，水利設施服務今日雲林、嘉義、臺南一帶的農業。"]
    }
  },
  {
    id: "tianmacafe", modern: "天馬茶房舊址一帶", region: "臺北市大同區",
    status: 'approved',
    source: "https://the.nmth.gov.tw/nmth/zh-tw/Special/SpecialItemDetail/42f8ed69-c17c-4528-9f0c-e83c84a07c2a?exhibitionId=cb023922-dac6-479e-ba8c-0078b8ae86a4",
    locator: "國立臺灣歷史博物館〈中央通訊社發刊電報稿（1947年2月28日）〉，見 27 日緝菸及 28 日遊行、公署衛兵開槍段。",
    aliases: { 1947: ["二二八事件"] },
    records: {
      1947: ["天馬茶房", "2 月 27 日，專賣局緝私員在天馬茶房附近取締煙販林江邁。查緝及後續開槍造成民眾傷亡。次日的抗議與公署前的槍擊，可從當時的電報稿追查。"]
    }
  },
  {
    id: "formosaoffice", modern: "美麗島雜誌社高雄服務處原址", region: "高雄市新興區",
    status: 'approved',
    source: "https://nchdb.boch.gov.tw/assets/overview/historicalBuilding/20040409000005",
    extra: "https://www.drnh.gov.tw/p/404-1003-15330.php?Lang=zh-tw",
    locator: "文化部文化資產局〈美麗島雜誌社高雄市服務處原址〉，見登錄理由與地址。國史館《美麗島事件史料彙編（四）》出版簡介，見事件日期與後續逮捕。",
    aliases: { 1979: ["高雄事件"] },
    records: {
      1979: ["美麗島雜誌社高雄服務處", "雜誌社的高雄服務處位於中山一路與大同二路一帶。圖釘標示服務處概位，集會與衝突也涉及附近中山路與中正路口。"]
    }
  },
  {
    id: "quake921", modern: "九二一地震教育園區", region: "臺中市霧峰區",
    status: 'approved',
    source: "https://www.wufeng.taichung.gov.tw/980992/981034/981044/3403060",
    extra: "https://www.wra.gov.tw/epaper/Article_Detail.aspx?n=30173&s=2448",
    locator: "臺中市霧峰區公所〈介紹本區921地震教育園區〉，見光復國中與斷層通過校區段。水利署電子報，見集集震央與 9 月 25 日總統發布緊急命令。",
    aliases: { 1999: ["集集地震","車籠埔斷層"] },
    records: {
      1999: ["霧峰光復國中", "園區保留原光復國中災後的地表隆起與校舍遺構。圖釘標示的是斷層經過的保存現場，震央位於南投集集一帶。"]
    }
  },
  {
    id: "presidentplaza", modern: "總統府前廣場", region: "臺北市中正區",
    status: 'approved',
    source: "https://ws.mac.gov.tw/001/Upload/OldFile/public/Attachment/971393304.pdf",
    extra: "https://art.archives.gov.tw/tw/art/1295.html",
    locator: "行政院大陸委員會《政府大陸政策重要文件》，見 2000 年 5 月 20 日就職慶祝大會段。國家檔案大事年表，民國 89 年 3 月 18 日總統選舉條。",
    records: {
      2000: ["總統府前廣場", "就職當天，慶祝大會在總統府前廣場舉行。圖釘標示慶祝大會的位置。"]
    }
  },
  {
    id: "legislativeyuan", modern: "立法院", region: "臺北市中正區",
    status: 'approved',
    source: "https://www.cy.gov.tw/News_Content.aspx?n=124&s=7292",
    extra: "https://www.ey.gov.tw/Goals/60F82C802498E92D",
    locator: "監察院院新聞稿，見立法院服貿審查背景及 3 月 18 日至 4 月 10 日的記載。行政院施政成果，見施行法三讀、公布及施行日期。",
    aliases: { 2014: ["太陽花學運","318學運"], 2019: ["同婚","婚姻平權","釋字748"] },
    records: {
      2014: ["立法院", "行動圍繞服貿協議的審查程序和監督機制。圖釘標示立法院院區，周邊街道也是集會及討論的場所。"],
      2019: ["立法院", "圖釘標示法律在立法院三讀的地點。符合規定的同性伴侶自 5 月 24 日起可在戶政機關辦理結婚登記。"]
    }
  },
  {
    id: 'qingshuitunnel', modern: '清水隧道一帶', region: '花蓮縣秀林鄉',
    status: 'approved',
    source: 'https://www.ttsb.gov.tw/1243/22450/29476/post',
    locator: '國家運輸安全調查委員會〈0402臺鐵第408次車清水隧道重大鐵道事故〉，見事故日期與位置、事故調查報告。',
    aliases: { 2021: ['太魯閣號', '0402鐵道事故'] },
    records: {
      2021: ['臺鐵清水隧道', '4 月 2 日，由樹林開往臺東的太魯閣號第 408 次車，在臺鐵和仁至崇德間、清水隧道北口附近發生重大出軌事故。圖釘標示沿線區域概位。']
    }
  },
  {
    id: 'presidenthall', modern: '總統府大禮堂', region: '臺北市中正區',
    status: 'approved',
    source: 'https://www.president.gov.tw/NEWS/28424',
    extra: 'https://db.cec.gov.tw/Visual',
    locator: '總統府〈第16任總統副總統宣誓就職典禮〉，見 5 月 20 日典禮日期、地點及出席者。選舉結果見中選會選舉資料庫第 16 任總統副總統選舉。',
    records: {
      2024: ['總統府大禮堂', '第 16 任總統、副總統選舉由賴清德與蕭美琴當選。兩人於 5 月 20 日在總統府大禮堂宣誓就職。']
    }
  },
  {
    id: 'jinguangfu', modern: '金廣福公館', region: '新竹縣北埔鄉',
    status: 'in_review',
    source: 'https://nchdb.boch.gov.tw/assets/advanceSearch/monument/19831228000003',
    locator: '文化部文化資產局國家文化資產網〈金廣福公館〉（國定古蹟），見「歷史沿革」與「古蹟特色」。',
    records: {
      1874: ['金廣福公館', '金廣福墾號的辦公室，約建於 1835 年。墾號由官方補助、閩粵兩籍人士合資組成，在北埔一帶設隘防守並招佃開墾，形成「大隘」。墾業後來大半歸姜家所有。']
    }
  },
  {
    id: 'yiminmiao', modern: '新埔褒忠亭義民廟', region: '新竹縣新埔鎮',
    status: 'in_review',
    source: 'https://nchdb.boch.gov.tw/assets/advanceSearch/monument/20060724000005',
    extra: 'https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=253',
    locator: '文化部文化資產局國家文化資產網〈新埔褒忠亭〉（縣定古蹟）「歷史沿革」建築興建史段，原文「明治二十八（1895）年因乙未戰役盡遭回祿」。燒毀者見內政部臺灣宗教文化地圖〈新埔褒忠亭〉「發展源流」；該頁乾隆年號的西元換算有誤，興建年代以文資局為準。',
    aliases: { 1874: ['義民廟'], 1895: ['義民廟'], 1908: ['義民廟'] },
    records: {
      1874: ['褒忠亭', '祭祀林爽文事件中戰死義民的廟宇，1790 年落成。祭典由新埔街、九芎林、大湖口、石岡子四大庄三年一輪輪值管理，1877 年後擴大為十四大庄輪值。'],
      1895: ['褒忠亭', '乙未之役期間，義民廟遭焚毀。內政部資料記為廟身遭日軍燒毀。'],
      1908: ['褒忠亭', '十四大庄信眾捐資重建，1904 年完工。今日所見兩殿兩廊的主建築，就是這次重建的樣貌。']
    }
  },
  {
    id: 'chaotiangong', modern: '北港朝天宮', region: '雲林縣北港鎮',
    status: 'in_review',
    source: 'https://nchdb.boch.gov.tw/assets/advanceSearch/monument/19851127000036',
    extra: 'https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=23',
    locator: '文化部文化資產局國家文化資產網〈北港朝天宮〉（國定古蹟）「歷史沿革」。重建開工年見內政部臺灣宗教文化地圖〈北港朝天宮〉「工程於明治41年(公元1908年)開工」；文資局作「工程在四年後展開」。歷代廟名見朝天宮〈大事年表〉1700、1812 年條。',
    aliases: { 1874: ['笨港天后宮'] },
    records: {
      1721: ['天妃廟', '1694 年樹璧和尚奉湄洲媽祖神像在笨港登陸並留下奉祀。1700 年笨港街民捐款合建天妃廟，由樹璧擔任第一代住持。'],
      1874: ['朝天宮', '1812 年改稱朝天宮，以紀念分靈自湄洲祖廟朝天閣，但當時的人仍習慣稱作天后宮。'],
      1908: ['朝天宮', '1905 年嘉義大地震損毀大殿，北港區長蔡然標倡議重建，聘大木匠陳應彬主修。內政部資料記重建工程在這一年開工，1912 年竣工，捐款者遍及全臺。']
    }
  },
  {
    id: 'dongshanriver', modern: '冬山河親水公園', region: '宜蘭縣五結鄉',
    status: 'in_review',
    source: 'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Place&id=571211',
    extra: 'https://www.lym.gov.tw/ch/collection/epaper/epaper-detail/7cf11288-ab92-11ea-94d3-2760f1289ae7/',
    locator: '國家文化記憶庫〈冬山河親水公園〉，見象設計集團 1987 年簽約與 1996 年開辦國際童玩藝術節兩段。另見蘭陽博物館電子報第 30 期〈歡樂一夏：宜蘭國際童玩藝術節〉首屆名稱、參與人數與停辦年份段。',
    records: {
      1987: ['冬山河風景區', '宜蘭縣政府與日本象設計集團簽訂冬山河親水公園的委託設計監造合約，開始規劃這座親水公園。'],
      1996: ['冬山河親水公園', '宜蘭縣在冬山河親水公園首次舉辦宜蘭國際童玩藝術節，邀請國內外表演團隊參與，第一年就有近 20 萬人次參加。']
    }
  },
  {
    id: 'sixnaphtha', modern: '台塑麥寮六輕工業區', region: '雲林縣麥寮鄉',
    status: 'in_review',
    source: 'https://www.fpcc.com.tw/uploads/images/ir/%E5%8F%B0%E5%A1%91%E7%9F%B3%E5%8C%96112%E5%B9%B4%E8%82%A1%E6%9D%B1%E6%9C%83%E5%B9%B4%E5%A0%B1%E4%B8%8A%E5%82%B3%E7%89%88.pdf',
    locator: '台塑石化股份有限公司 112 年度年報「壹、公司簡介」之「三、公司沿革」，見 83.07、88.02、88.12、89.03、89.10 各條。',
    records: {
      1999: ['六輕工業區', '台塑企業六輕計畫於 1994 年在麥寮動工。2 月，輕油裂解一廠正式運轉，年產乙烯 45 萬噸；12 月，首批 100 萬桶原油運抵麥寮。'],
      2000: ['六輕工業區', '3 月，第一期日煉原油 15 萬桶的煉油廠投產；10 月，輕油裂解二廠正式運轉，年產乙烯 90 萬噸。']
    }
  },
  {
    id: 'guishandao', modern: '龜山島', region: '宜蘭縣頭城鎮',
    status: 'in_review',
    source: 'https://tcmb.culture.tw/zh-tw/detail?indexCode=Culture_Object&id=603164',
    extra: 'https://www.lym.gov.tw/ch/collection/epaper/epaper-detail/d35699e9-dfb3-11eb-92da-2760f1289ae7/',
    locator: '國家文化記憶庫〈龜山島生態導覽叢書〉內容描述，見遷村與 2000 年 8 月 1 日開放觀光段。1999 年納入國家風景區見蘭陽博物館電子報第 88 期〈山河顯影系列：龜山島〉；遷村年份兩處記載為 1975 年與 1975–77 年。',
    records: {
      1999: ['龜山島', '島上居民於 1970 年代中期集體遷往頭城仁澤新村，龜山島隨後列為軍事管制區。12 月 22 日，行政院核定將龜山島納入東北角海岸國家風景區範圍。'],
      2000: ['龜山島', '8 月 1 日，政府宣布龜山島開放觀光，遊客可以登島。同年頭城鎮民代表會決議恢復龜山里。']
    }
  },
  {
    id: 'nanfangaobridge', modern: '南方澳跨港大橋', region: '宜蘭縣蘇澳鎮',
    status: 'in_review',
    source: 'https://www.ttsb.gov.tw/1243/22385/23235/post',
    extra: 'https://www.cy.gov.tw/public/Data/110mo/109%E4%BA%A4%E8%AA%BF0011.pdf',
    locator: '國家運輸安全調查委員會〈南方澳大橋斷裂重大公路事故〉，見「事故簡介」。興建與完工日期見監察院 109 交調 0011 調查報告，調查意見一之（一）3。',
    records: {
      2019: ['南方澳跨港大橋', '這座 1998 年完工、橫跨南方澳漁港航道的拱橋，10 月 1 日上午橋面斷裂崩塌。一輛中油油罐車隨橋面墜落起火，橋下 3 艘漁船被壓毀，共 6 名船員罹難、13 人受傷。']
    }
  },
  {
    id: 'chiayistation', modern: '嘉義車站站前廣場', region: '嘉義市西區',
    status: 'in_review',
    source: 'https://memory.nhrm.gov.tw/TopicExploration/LocationSpace/Detail/104',
    locator: '國家人權博物館國家人權記憶庫〈嘉義車站前〉，見「侵害人權事件概述」、「發生地概述」與「公告日期及文號」。',
    records: {
      1947: ['嘉義車站', '二二八事件期間，嘉義市處委會代表於 3 月 11 日在水上機場遭逮捕，後與其他關押者分三批押至嘉義火車站前公開槍決：3 月 18 日陳復志，23 日盧鎰等 11 人，25 日陳澄波、潘木枝、柯麟、盧鈵欽等 4 人。站前廣場東北側的槍決處，後經促轉會審定為不義遺址。']
    }
  },
  {
    id: 'beimenstation', modern: '北門驛（阿里山林業鐵路北門車站舊站）', region: '嘉義市東區',
    status: 'in_review',
    source: 'https://tcmb.culture.tw/zh-tw/detail?id=251621&indexCode=Culture_Object',
    locator: '國家文化記憶庫〈嘉義北門驛〉內容描述（嘉義市政府文化局建檔），見 1910 年平地段通車與 1973 年北門新站兩段。',
    records: {
      1914: ['北門驛', '阿里山森林鐵路嘉義至竹崎的平地段於 1910 年通車，北門驛同年啟用。北門驛與嘉義站之間形成廣大的木材專業區，鄰近有營林所、宿舍群、貯木池、製材工場與北門修理工廠。'],
      1979: ['北門驛', '1973 年北門新站完工啟用，辦理客運業務，木造舊站改作貨運與維修站使用。']
    }
  },
  {
    id: 'taitungtianhou', modern: '臺東天后宮', region: '臺東縣臺東市',
    status: 'in_review',
    source: 'https://taiwangods.moi.gov.tw/html/cultural/3_0011.aspx?i=278',
    extra: 'https://tcmb.culture.tw/zh-tw/detail?id=274810&indexCode=Culture_Object',
    locator: '內政部臺灣宗教文化地圖〈臺東天后宮〉，見基本資料「創建/起源年代」與「發展源流」。遷建另見國家文化記憶庫〈臺東天后宮日治時期土地資料〉；捐地者兩處分別作吳錦麟、吳錦粦。',
    records: {
      1895: ['天后宮', '1889 年大莊事件平定後，總兵張兆連等人捐養廉銀倡議建廟，三年後完工，分靈自臺南祀典大天后宮。當時廟址在今和平街東禪寺，圖釘標示的是 1933 年後的現址。'],
      1930: ['天后宮', '強烈地震使和平街舊廟龜裂，因而議定遷建。商人吳錦麟捐出今中華路的土地，地方仕紳募款，歷時三年於 1933 年落成。']
    }
  },
  {
    id: 'taimalisunrise', modern: '千禧曙光紀念園區', region: '臺東縣太麻里鄉',
    status: 'in_review',
    source: 'https://www.taimali.gov.tw/home/index.php/sightseeing-guide/2020-04-23-04-32-58/60-tourism/2020-06-16-03-45-56/158-2020-06-16-04-39-11.html',
    locator: '太麻里鄉公所全球資訊網〈千禧曙光紀念園區〉，見景點介紹第二段。',
    records: {
      2000: ['太麻里海灘', '1 月 1 日，太麻里鄉公所在太麻里火車站前的海灘舉辦千禧迎曙光音樂會，經英美電視台與全球 25 個國家連線轉播，吸引數萬人次前來。此後鄉公所每年在這片海灘舉辦跨年晚會與迎曙光活動。']
    }
  },
  {
    id: 'lanyustorage', modern: '台電蘭嶼貯存場', region: '臺東縣蘭嶼鄉',
    status: 'in_review',
    source: 'https://www.nusc.gov.tw/share/file/fcma/7A7z4bkzzFkQnC8e6WzbsA__.pdf',
    extra: 'https://www.president.gov.tw/NEWS/25051',
    locator: '原能會放射性物料管理局《蘭嶼貯存場貯存設施十年再評估報告審查報告》（FCMA-98201）營運概況，見「民國 71 年 5 月」至「民國 85 年 2 月」段。2019 年補償要點見總統府 108 年 11 月 22 日新聞稿。',
    records: {
      1996: ['蘭嶼貯存場', '貯存場自 1982 年 5 月接收第一批低放射性廢棄物桶，2 月接收最後一船次後停止接收外來廢棄物桶，累計貯存 97,672 桶，此後進入靜態貯存。'],
      2019: ['蘭嶼貯存場', '行政院核定《核廢料蘭嶼貯存場使用原住民保留地損失補償要點》，11 月 22 日總統在臺東見證頒布。總統表示，證據顯示核廢料遷來蘭嶼時，在地族人不知情也未表示同意；回溯補償金將由族人和政府代表組成的基金會管理。']
    }
  },
  {
    id: 'taitunglibrary', modern: '臺東縣立圖書館', region: '臺東縣臺東市',
    status: 'in_review',
    source: 'https://www.taitung.gov.tw/News_Content.aspx?n=13370&s=146358',
    locator: '臺東縣政府〈東岸絕美 臺東新地標藝文活動新據點 縣立圖書館4/22盛大開幕〉，民國 115 年 4 月 22 日開幕儀式與規劃沿革段。',
    records: {
      2026: ['臺東縣立圖書館', '新館自 2012 年開始規劃設計，經歷 4 次競圖流標與 19 次工程流標。4 月 22 日舉行開幕儀式，縣長饒慶鈴宣布正式啟用。']
    }
  },
  {
    id: 'kaiyuanport', modern: '蘭嶼開元港', region: '臺東縣蘭嶼鄉',
    status: 'in_review',
    source: 'https://www.taitung.gov.tw/News_Content.aspx?n=13370&s=148441',
    locator: '臺東縣政府〈打造人車分流、安心搭船新動線 蘭嶼開元港2.6億元候船室暨聯外道路工程動土〉，民國 115 年 7 月 30 日動土典禮段。',
    records: {
      2026: ['開元港', '開元港啟用近 60 年，候船空間老舊。7 月 30 日，臺東縣政府舉辦候船室暨聯外道路興建工程動土典禮，工程總經費約 2.6 億元，將新建約 600 坪候船室，預計 2028 年 3 月完工。']
    }
  },
  {
    id: 'chiayifountain', modern: '嘉義市中央噴水圓環', region: '嘉義市西區',
    status: 'in_review',
    source: 'https://www.chiayi.gov.tw/News_Content.aspx?n=455&s=952259',
    locator: '嘉義市政府〈嘉義市中央噴水圓環重新啟用 保存城市記憶延續KANO精神〉，2026 年 9 月 11 日重新啟用、沿革與工期段。',
    records: {
      2026: ['中央噴水圓環', '圓環於 1906 年地震後劃設廣場，1914 年設置噴水池。2026 年完成整體修繕，更新噴泉設備與水池結構，並依原貌翻銅修復 KANO 投手吳明捷雕像，9 月 11 日重新啟用。']
    }
  }
];
