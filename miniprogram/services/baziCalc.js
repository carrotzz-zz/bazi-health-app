// ========== 八字排盘 ==========

const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const WUXING_GAN = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };
const WUXING_ZHI = { '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水' };
const YIN_YANG_GAN = { '甲':'阳','乙':'阴','丙':'阳','丁':'阴','戊':'阳','己':'阴','庚':'阳','辛':'阴','壬':'阳','癸':'阴' };

const ZANG_GAN = {
  '子': ['癸'], '丑': ['己','癸','辛'], '寅': ['甲','丙','戊'], '卯': ['乙'],
  '辰': ['戊','乙','癸'], '巳': ['丙','戊','庚'], '午': ['丁','己'], '未': ['己','丁','乙'],
  '申': ['庚','壬','戊'], '酉': ['辛'], '戌': ['戊','辛','丁'], '亥': ['壬','甲'],
};

const JIEQI = {
  1990: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,8, 11,8, 12,7, 1,6],
  1991: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,9, 11,8, 12,7, 1,6],
  1992: [2,4, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,6],
  1993: [2,4, 3,5, 4,5, 5,5, 6,6, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  1994: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,8, 11,7, 12,7, 1,6],
  1995: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,9, 11,8, 12,7, 1,6],
  1996: [2,4, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  1997: [2,4, 3,5, 4,5, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  1998: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,8, 11,7, 12,7, 1,6],
  1999: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,9, 11,8, 12,7, 1,6],
  2000: [2,4, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,6],
  2001: [2,4, 3,5, 4,5, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  2002: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,8, 11,7, 12,7, 1,6],
  2003: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,9, 11,8, 12,7, 1,6],
  2004: [2,4, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,6],
  2005: [2,4, 3,5, 4,5, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  2006: [2,4, 3,6, 4,5, 5,5, 6,6, 7,7, 8,7, 9,8, 10,8, 11,7, 12,7, 1,6],
  2007: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,9, 11,8, 12,7, 1,6],
  2008: [2,4, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,6],
  2009: [2,4, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  2010: [2,4, 3,5, 4,5, 5,5, 6,6, 7,7, 8,7, 9,8, 10,8, 11,7, 12,7, 1,6],
  2011: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,8, 11,8, 12,7, 1,6],
  2012: [2,4, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  2013: [2,4, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  2014: [2,4, 3,6, 4,5, 5,5, 6,6, 7,7, 8,7, 9,8, 10,8, 11,7, 12,7, 1,6],
  2015: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,8, 11,8, 12,7, 1,6],
  2016: [2,4, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,6],
  2017: [2,3, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  2018: [2,4, 3,5, 4,5, 5,5, 6,6, 7,7, 8,7, 9,8, 10,8, 11,7, 12,7, 1,5],
  2019: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,8, 11,8, 12,7, 1,6],
  2020: [2,4, 3,5, 4,4, 5,5, 6,5, 7,6, 8,7, 9,7, 10,8, 11,7, 12,7, 1,6],
  2021: [2,3, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  2022: [2,4, 3,5, 4,5, 5,5, 6,6, 7,7, 8,7, 9,8, 10,8, 11,7, 12,7, 1,5],
  2023: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,8, 11,8, 12,7, 1,6],
  2024: [2,4, 3,5, 4,4, 5,5, 6,5, 7,6, 8,7, 9,7, 10,8, 11,7, 12,6, 1,6],
  2025: [2,3, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  2026: [2,4, 3,5, 4,5, 5,5, 6,6, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  2027: [2,4, 3,6, 4,5, 5,6, 6,6, 7,7, 8,8, 9,8, 10,8, 11,8, 12,7, 1,6],
  2028: [2,4, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,6],
  2029: [2,3, 3,5, 4,4, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,5],
  2030: [2,4, 3,5, 4,5, 5,5, 6,5, 7,7, 8,7, 9,7, 10,8, 11,7, 12,7, 1,6],
};

const JIE_TO_YUE_ZHI = [2,3,4,5,6,7,8,9,10,11,0,1];

function getJieqi(year, jieIndex) {
  const effectiveYear = jieIndex === 11 ? year + 1 : year;
  if (JIEQI[year]) {
    const m = JIEQI[year][jieIndex * 2];
    const d = JIEQI[year][jieIndex * 2 + 1];
    return [effectiveYear, m, d];
  }
  let nearest = year;
  for (let y = year - 1; y >= 1900; y--) { if (JIEQI[y]) { nearest = y; break; } }
  if (!JIEQI[nearest]) {
    for (let y = year + 1; y <= 2030; y++) { if (JIEQI[y]) { nearest = y; break; } }
  }
  if (JIEQI[nearest]) {
    const m = JIEQI[nearest][jieIndex * 2];
    const d = JIEQI[nearest][jieIndex * 2 + 1];
    return [effectiveYear, m, d];
  }
  const approx = [[2,4],[3,6],[4,5],[5,5],[6,6],[7,7],[8,7],[9,8],[10,8],[11,7],[12,7],[1,6]];
  return [effectiveYear, approx[jieIndex][0], approx[jieIndex][1]];
}

function gregorianToJDN(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const year = y + 4800 - a;
  const month = m + 12 * a - 3;
  return d + Math.floor((153 * month + 2) / 5) + 365 * year
    + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400) - 32045;
}

function getDayGan(jdn) { return (jdn + 9) % 10; }
function getDayZhi(jdn) { return (jdn + 1) % 12; }

function getYearPillar(year, month, day) {
  const lichun = getJieqi(year, 0);
  const isBeforeLichun = (month < lichun[1]) || (month === lichun[1] && day < lichun[2]);
  const baziYear = isBeforeLichun ? year - 1 : year;
  const gan = (baziYear - 4) % 10;
  const zhi = (baziYear - 4) % 12;
  return { gan: (gan + 10) % 10, zhi: (zhi + 12) % 12, year: baziYear };
}

function getMonthPillar(year, month, day, yearGan) {
  let yueZhiIndex = -1;
  for (let j = 0; j < 12; j++) {
    const jq = getJieqi(year, j);
    const jqDate = new Date(jq[0], jq[1] - 1, jq[2]);
    const curDate = new Date(year, month - 1, day);
    if (curDate >= jqDate) {
      yueZhiIndex = JIE_TO_YUE_ZHI[j];
    }
  }
  if (yueZhiIndex === -1) {
    const prevXiaohan = getJieqi(year - 1, 11);
    const curDate = new Date(year, month - 1, day);
    const xhDate = new Date(prevXiaohan[0], prevXiaohan[1] - 1, prevXiaohan[2]);
    yueZhiIndex = curDate >= xhDate ? 1 : 0;
  }
  const yinYueGan = ((yearGan % 5) * 2 + 2) % 10;
  const yueZhiOffset = (yueZhiIndex - 2 + 12) % 12;
  return { gan: (yinYueGan + yueZhiOffset) % 10, zhi: yueZhiIndex };
}

function getHourPillar(hour, dayGan) {
  const zhiIndex = Math.floor(((hour + 1) % 24) / 2);
  const ziShiGan = ((dayGan % 5) * 2) % 10;
  return { gan: (ziShiGan + zhiIndex) % 10, zhi: zhiIndex };
}

function getTenGods(dayGan, otherGan) {
  const wuxingDay = WUXING_GAN[GAN[dayGan]];
  const wuxingOther = WUXING_GAN[GAN[otherGan]];
  const yinYangDay = YIN_YANG_GAN[GAN[dayGan]] === '阳';
  const yinYangOther = YIN_YANG_GAN[GAN[otherGan]] === '阳';
  const sameYinYang = yinYangDay === yinYangOther;
  const relMap = {
    '木木':'同','火火':'同','土土':'同','金金':'同','水水':'同',
    '木火':'生','火土':'生','土金':'生','金水':'生','水木':'生',
    '木土':'克','火金':'克','土水':'克','金木':'克','水火':'克',
  };
  const rel = relMap[wuxingDay + wuxingOther];
  if (rel === '同') return sameYinYang ? '比肩' : '劫财';
  if (rel === '生') return sameYinYang ? '食神' : '伤官';
  const relReverse = relMap[wuxingOther + wuxingDay];
  if (relReverse === '生') return sameYinYang ? '偏印' : '正印';
  if (relReverse === '克') return sameYinYang ? '七杀' : '正官';
  return sameYinYang ? '偏财' : '正财';
}

function getDaYun(yearGan, yearZhi, monthGan, monthZhi, gender, birthYear, birthMonth, birthDay) {
  const yearGanYang = YIN_YANG_GAN[GAN[yearGan]] === '阳';
  const isMale = gender === '男';
  const forward = (isMale && yearGanYang) || (!isMale && !yearGanYang);
  const curJieIdx = (monthZhi - 2 + 12) % 12;

  let daysToJie;
  if (forward) {
    const nextJieIdx = (curJieIdx + 1) % 12;
    let nextJie = getJieqi(birthYear, nextJieIdx);
    if (nextJieIdx === 0) nextJie = getJieqi(birthYear + 1, 0);
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const jieDate = new Date(nextJie[0], nextJie[1] - 1, nextJie[2]);
    daysToJie = Math.round((jieDate - birthDate) / (1000 * 60 * 60 * 24));
  } else {
    const prevJie = getJieqi(birthYear, curJieIdx);
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    const jieDate = new Date(prevJie[0], prevJie[1] - 1, prevJie[2]);
    daysToJie = Math.round((birthDate - jieDate) / (1000 * 60 * 60 * 24));
  }

  const startAge = Math.round(daysToJie / 3);
  const dayuns = [];
  let currentGan = monthGan, currentZhi = monthZhi;

  for (let i = 0; i < 8; i++) {
    if (forward) { currentGan = (currentGan + 1) % 10; currentZhi = (currentZhi + 1) % 12; }
    else { currentGan = (currentGan - 1 + 10) % 10; currentZhi = (currentZhi - 1 + 12) % 12; }
    const startYear = birthYear + startAge + i * 10;
    dayuns.push({ gan: currentGan, zhi: currentZhi, startAge: startAge + i * 10, startYear, endYear: startYear + 9 });
  }
  return { startAge, dayuns, forward };
}

function calculate(event) {
  const { year, month, day, hour, minute, gender } = event;
  const jdn = gregorianToJDN(year, month, day);
  const dayGan = getDayGan(jdn);
  const dayZhi = getDayZhi(jdn);

  const yearPillar = getYearPillar(year, month, day);
  const lichun = getJieqi(year, 0);
  const beforeLichun = (month < lichun[1]) || (month === lichun[1] && day < lichun[2]);
  const effectiveYearGan = beforeLichun ? ((year - 5) % 10 + 10) % 10 : yearPillar.gan;
  const monthPillarFixed = getMonthPillar(year, month, day, effectiveYearGan);
  const hourPillar = getHourPillar(hour, dayGan);

  const pillars = [
    { name: '年', gan: yearPillar.gan, zhi: yearPillar.zhi },
    { name: '月', gan: monthPillarFixed.gan, zhi: monthPillarFixed.zhi },
    { name: '日', gan: dayGan, zhi: dayZhi },
    { name: '时', gan: hourPillar.gan, zhi: hourPillar.zhi },
  ];

  pillars.forEach(p => {
    p.tenGod = getTenGods(dayGan, p.gan);
    p.tenGodZhi = getTenGods(dayGan,
      ZANG_GAN[ZHI[p.zhi]][0] ? GAN.indexOf(ZANG_GAN[ZHI[p.zhi]][0]) : p.gan
    );
    p.wuxingGan = WUXING_GAN[GAN[p.gan]];
    p.wuxingZhi = WUXING_ZHI[ZHI[p.zhi]];
    p.zangGan = ZANG_GAN[ZHI[p.zhi]];
  });

  const daYun = getDaYun(yearPillar.gan, yearPillar.zhi,
    monthPillarFixed.gan, monthPillarFixed.zhi, gender, year, month, day);

  let dayGzIndex = 0;
  for (let i = 0; i < 60; i++) {
    if (i % 10 === dayGan && i % 12 === dayZhi) { dayGzIndex = i; break; }
  }
  const xunStart = Math.floor(dayGzIndex / 10) * 10;
  const kongWangMap = [[10,11],[8,9],[6,7],[4,5],[2,3],[0,1]];
  const kongWang = kongWangMap[(xunStart / 10) % 6];

  const dayWuxing = WUXING_GAN[GAN[dayGan]];
  const wuxingCount = { '木':0,'火':0,'土':0,'金':0,'水':0 };
  pillars.forEach(p => {
    wuxingCount[p.wuxingGan] = (wuxingCount[p.wuxingGan] || 0) + 1;
    wuxingCount[p.wuxingZhi] = (wuxingCount[p.wuxingZhi] || 0) + 1;
  });

  return {
    bazi: [
      { gan: GAN[yearPillar.gan], zhi: ZHI[yearPillar.zhi], tenGod: pillars[0].tenGod, wuxing: pillars[0].wuxingGan },
      { gan: GAN[monthPillarFixed.gan], zhi: ZHI[monthPillarFixed.zhi], tenGod: pillars[1].tenGod, wuxing: pillars[1].wuxingGan },
      { gan: GAN[dayGan], zhi: ZHI[dayZhi], tenGod: '日主', wuxing: dayWuxing },
      { gan: GAN[hourPillar.gan], zhi: ZHI[hourPillar.zhi], tenGod: pillars[3].tenGod, wuxing: pillars[3].wuxingGan },
    ],
    dayMaster: { gan: GAN[dayGan], zhi: ZHI[dayZhi], wuxing: dayWuxing },
    yearPillar: { gan: GAN[yearPillar.gan], zhi: ZHI[yearPillar.zhi] },
    daYun: daYun.dayuns.map(d => ({
      gan: GAN[d.gan], zhi: ZHI[d.zhi], startAge: d.startAge, startYear: d.startYear, endYear: d.endYear,
    })),
    startAge: daYun.startAge,
    kongWang: kongWang.map(i => ZHI[i]),
    wuxingRatio: wuxingCount,
    dayGanZhiIndex: dayGzIndex,
    _raw: {
      pillars, dayGan, dayZhi,
      yearGan: yearPillar.gan, yearZhi: yearPillar.zhi,
      monthGan: monthPillarFixed.gan, monthZhi: monthPillarFixed.zhi,
      hourGan: hourPillar.gan, hourZhi: hourPillar.zhi,
      dayGanZhiIndex: dayGzIndex, kongWangZhi: kongWang, daYunRaw: daYun,
    },
  };
}

module.exports = { calculate };
