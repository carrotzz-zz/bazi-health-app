// ========== 每日卡片组装 · 云函数 ==========
// 八字 + 日期 + 天气 → 完整卡片数据

const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const WUXING_GAN = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };
const YIN_YANG_GAN = { '甲':'阳','乙':'阴','丙':'阳','丁':'阴','戊':'阳','己':'阴','庚':'阳','辛':'阴','壬':'阳','癸':'阴' };

// ---------- 情绪逻辑（核心版，从 emotionEngine 提取）----------

const TEN_GOD_EMOTION = {
  '正官':'今天责任虽重，你已经够努力了。',
  '七杀':'今天容易遇到压力，退一步不等于怂。',
  '正印':'今天心里比较静，适合一个人待着，不急不赶。',
  '偏印':'今天想一个人待着，别逼自己社交。',
  '正财':'稳稳做事的一天，一步一脚印。',
  '偏财':'机会看着不错，先想清楚再出手。',
  '食神':'今天轻松，适合对自己好一点。',
  '伤官':'想法多，写下来比说出来更好。',
  '比肩':'今天是自己的主场，专注自己。',
  '劫财':'不想去的局可以不去。',
};

const CHONG = { '子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳' };
const HE = { '子丑':true,'丑子':true,'寅亥':true,'亥寅':true,'卯戌':true,'戌卯':true,'辰酉':true,'酉辰':true,'巳申':true,'申巳':true,'午未':true,'未午':true };
const XING = { '子卯':true,'卯子':true,'寅巳':true,'巳申':true,'申寅':true,'丑戌':true,'戌未':true,'未丑':true };
const ZI_XING = ['辰','午','酉','亥'];
const HAI = { '子未':true,'未子':true,'丑午':true,'午丑':true,'寅巳':true,'巳寅':true,'卯辰':true,'辰卯':true,'申亥':true,'亥申':true,'酉戌':true,'戌酉':true };

const MONTH_QI = {
  '甲':[2,2,1,0,0,-1,-2,-2,-1,1,1,0],'乙':[2,2,1,0,0,-1,-2,-2,-1,1,1,0],
  '丙':[1,1,0,2,2,1,-1,-1,-2,-2,-2,-1],'丁':[1,1,0,2,2,1,-1,-1,-2,-2,-2,-1],
  '戊':[-1,-1,2,1,1,2,0,0,2,-1,-1,2],'己':[-1,-1,2,1,1,2,0,0,2,-1,-1,2],
  '庚':[-2,-2,1,-1,-1,0,2,2,1,0,0,-1],'辛':[-2,-2,1,-1,-1,0,2,2,1,0,0,-1],
  '壬':[0,0,-1,-2,-2,-1,1,1,-1,2,2,1],'癸':[0,0,-1,-2,-2,-1,1,1,-1,2,2,1],
};

const QUOTES = {
  '怒':[
    { c:'知其不可奈何而安之若命', m:'有些事改变不了，先和它待一会儿' },
    { c:'水善利万物而不争', m:'水的力量不是硬碰硬，是绕过去' },
    { c:'安时而处顺，哀乐不能入也', m:'顺着日子过，大的情绪波动就进不来' },
  ],
  '喜不足':[
    { c:'天地有大美而不言', m:'好东西安安静静在那里，你得自己去看' },
    { c:'知足者富', m:'觉得自己够了的人，才是真的富' },
  ],
  '思':[
    { c:'少则得，多则惑', m:'想得少反而抓住重点，想太多反而乱' },
    { c:'知止不殆', m:'知道什么时候该停，才不会把自己耗干' },
  ],
  '悲':[
    { c:'物来则应，过去不留', m:'东西来了接住，过去了就松手' },
    { c:'飘风不终朝，骤雨不终日', m:'再大的风也刮不了一整天' },
  ],
  '恐':[
    { c:'不怕念起，只怕觉迟', m:'冒出害怕是正常的，能察觉到就不算晚' },
    { c:'上善若水', m:'最好的状态像水，该流就流，该停就停' },
  ],
  '通用':[
    { c:'大道至简', m:'最根本的道理都不复杂' },
    { c:'朴素而天下莫能与之争美', m:'简简单单就很好，不用跟谁比' },
  ],
};

const ZANG_GAN_MAIN = { '子':'癸','丑':'己','寅':'甲','卯':'乙','辰':'戊','巳':'丙','午':'丁','未':'己','申':'庚','酉':'辛','戌':'戊','亥':'壬' };

function getTenGod(dayGan, otherGan) {
  const wxD = WUXING_GAN[GAN[dayGan]];
  const wxO = WUXING_GAN[GAN[otherGan]];
  const sameYY = YIN_YANG_GAN[GAN[dayGan]] === YIN_YANG_GAN[GAN[otherGan]];
  const relMap = { '木木':'同','火火':'同','土土':'同','金金':'同','水水':'同',
    '木火':'生','火土':'生','土金':'生','金水':'生','水木':'生',
    '木土':'克','火金':'克','土水':'克','金木':'克','水火':'克' };
  const rel = relMap[wxD + wxO];
  if (rel === '同') return sameYY ? '比肩' : '劫财';
  if (rel === '生') return sameYY ? '食神' : '伤官';
  const rev = relMap[wxO + wxD];
  if (rev === '生') return sameYY ? '偏印' : '正印';
  if (rev === '克') return sameYY ? '七杀' : '正官';
  return sameYY ? '偏财' : '正财';
}

function gregorianToJDN(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yr = y + 4800 - a;
  const mo = m + 12 * a - 3;
  return d + Math.floor((153 * mo + 2) / 5) + 365 * yr
    + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
}

function checkBranchInteraction(liuRiZhi, baziZhis) {
  for (let i = 0; i < baziZhis.length; i++) {
    if (CHONG[liuRiZhi] === baziZhis[i]) {
      if (i === 2) return { type:'冲',desc:'心里不太平，坐不住，有点烦躁' };
      return { type:'冲',desc:'隐隐不安，说不上来哪里不对' };
    }
  }
  for (let i = 0; i < baziZhis.length; i++) {
    if (HE[liuRiZhi + baziZhis[i]]) return { type:'合',desc:'心里顺畅，有被接住的感觉' };
  }
  if (ZI_XING.includes(liuRiZhi) && baziZhis.filter(z => z === liuRiZhi).length > 0) {
    return { type:'刑',desc:'自己跟自己较劲，对自己温柔点' };
  }
  for (let i = 0; i < baziZhis.length; i++) {
    if (XING[liuRiZhi + baziZhis[i]]) return { type:'刑',desc:'有点小摩擦，别往心里去' };
  }
  for (let i = 0; i < baziZhis.length; i++) {
    if (HAI[liuRiZhi + baziZhis[i]]) return { type:'害',desc:'说不清的别扭，不用细想' };
  }
  return { type:'none',desc:'' };
}

function qiToWeight(qi) {
  if (qi >= 2) return 1.5;
  if (qi === 1) return 1.2;
  if (qi === 0) return 1.0;
  if (qi === -1) return 0.7;
  return 0.5;
}

function getClothing(temp, weather) {
  var base;
  if (temp >= 30) base = '轻薄透气';
  else if (temp >= 22) base = '薄衫出门';
  else if (temp >= 14) base = '薄外套刚好';
  else if (temp >= 5) base = '毛衣加外套';
  else base = '穿暖和些';

  var twist = '';
  if (weather === '小雨' || weather === '中雨' || weather === '大雨' || weather === '阵雨' || weather === '暴雨') {
    twist = '，带把伞，别淋着';
  } else if (weather === '晴' && temp >= 28) {
    twist = '，太阳大，戴个帽子';
  } else if (weather === '阴') {
    twist = '，天阴有风，脖子别受凉';
  } else if (weather === '雾') {
    twist = '，雾天出门慢一点';
  } else {
    twist = '，舒舒服服出门';
  }

  return base + twist;
}

function getRecommendation(month, temp, weather, mainTenGod) {
  var base;
  if (month >= 5 && month <= 7) base = '暑天心火旺，午饭后歇一刻钟，比喝凉茶管用。';
  else if (month >= 2 && month <= 4) base = '春天养肝，少生气多舒展，出门走走。';
  else if (month >= 9 && month <= 11) base = '秋天容易感伤，多出门晒晒太阳。';
  else if (month === 12 || month === 1) base = '冬天养藏，别太消耗自己，早点睡。';
  else base = '喝杯温水，缓一缓。';

  var twist = '';
  if (weather === '小雨' || weather === '中雨' || weather === '大雨' || weather === '阵雨' || weather === '雷阵雨') {
    twist = '下雨天闷，';
  } else if (weather === '晴') {
    twist = temp >= 32 ? '天热，' : (temp >= 26 ? '天气不错，' : '天凉，');
  } else if (weather === '阴') {
    twist = '阴天容易闷，';
  } else if (weather === '多云') {
    twist = '云多不晒，';
  } else {
    twist = '';
  }

  var tenGodTip = '';
  if (mainTenGod === '正印' || mainTenGod === '偏印') tenGodTip = '适合放慢节奏。';
  else if (mainTenGod === '七杀' || mainTenGod === '正官') tenGodTip = '别给自己加太多压力。';
  else if (mainTenGod === '食神' || mainTenGod === '伤官') tenGodTip = '有灵感就记下来。';
  else if (mainTenGod === '比肩' || mainTenGod === '劫财') tenGodTip = '按自己的节奏来。';
  else tenGodTip = '不急不躁就好。';

  return twist + tenGodTip;
}

// ---------- 主函数 ----------

exports.main = async (event, context) => {
  const { baziData, year, month, day, lat, lon } = event;

  // === 1. 天气 ===
  let weatherData;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=Asia/Shanghai&forecast_days=1`;
    const res = await fetch(url);
    const wx = await res.json();
    const d = wx.daily;
    const code = d.weathercode[0];
    const wMap = { 0:'晴',1:'晴',2:'多云',3:'阴',45:'雾',51:'小雨',53:'小雨',55:'中雨',61:'小雨',63:'中雨',65:'大雨',71:'小雪',73:'中雪',75:'大雪',80:'阵雨',81:'阵雨',82:'暴雨',95:'雷阵雨',96:'雷暴+冰雹',99:'强雷暴' };
    const w = wMap[code] || '多云';
    const eMap = { '晴':'☀️','多云':'⛅','阴':'☁️','雾':'🌫️','小雨':'🌧️','中雨':'🌧️','大雨':'🌧️','暴雨':'🌧️⛈️','小雪':'❄️','中雪':'❄️','大雪':'❄️','阵雨':'🌦️','雷阵雨':'🌩️','雷暴+冰雹':'🌩️','强雷暴':'🌩️' };
    weatherData = {
      weather:w, emoji:eMap[w]||'🌤️',
      maxTemp:Math.round(d.temperature_2m_max[0]),
      minTemp:Math.round(d.temperature_2m_min[0]),
      precip:d.precipitation_sum[0],
    };
  } catch(e) {
    weatherData = { weather:'多云',emoji:'🌤',maxTemp:25,minTemp:18,precip:0 };
  }

  // === 2. 情绪计算 ===
  const raw = baziData._raw;
  const dayGan = raw.dayGan;
  const dayZhi = raw.dayZhi;

  const jdn = gregorianToJDN(year, month, day);
  const liuRiGan = (jdn + 9) % 10;
  const liuRiZhiIdx = (jdn + 1) % 12;
  const liuRiZhi = ZHI[liuRiZhiIdx];

  const mainTenGod = getTenGod(dayGan, liuRiGan);
  const auxGan = GAN.indexOf(ZANG_GAN_MAIN[liuRiZhi]);
  const auxTenGod = auxGan >= 0 ? getTenGod(dayGan, auxGan) : mainTenGod;

  const ganWx = WUXING_GAN[GAN[liuRiGan]];
  const qiVal = MONTH_QI[ganWx] ? MONTH_QI[ganWx][month - 1] : 0;

  const baziZhis = [raw.yearZhi, raw.monthZhi, raw.dayZhi, raw.hourZhi].map(z => ZHI[z]);
  const interaction = checkBranchInteraction(liuRiZhi, baziZhis);

  const isKongWang = baziData.kongWang.includes(liuRiZhi);

  // 十神基础情绪
  const baseMoods = {
    '正印':'今天心里比较静，适合一个人待着，不急不赶。',
    '偏印':'今天想一个人待着，别逼自己社交。',
    '七杀':'今天容易有人跟你过不去，退一步不丢人。',
    '正官':'今天责任感比较重，你已经够努力了，别太绷着。',
    '食神':'今天轻松，适合吃好的。',
    '伤官':'今天脑子灵光，想法多，写下来比说出来好。',
    '正财':'今天是踏实做事的好日子。',
    '偏财':'今天可能有新想法，先掂量再动手。',
    '比肩':'今天是自己的主场，专注自己。',
    '劫财':'今天社交可能会消耗精力，不想去的可以不去。',
  };
  const base = baseMoods[mainTenGod] || TEN_GOD_EMOTION[mainTenGod] || '今天按自己的节奏走。';

  // 交互调整
  let emotionDesc;
  if (interaction.type === '冲' && interaction.desc.includes('心里不太平')) {
    emotionDesc = `今天心里不太平，坐不住。${base.replace(/。/,'，')}可能会有点烦躁，不是什么大事，过去了就好。`;
  } else if (interaction.type === '冲') {
    emotionDesc = `${base.replace(/。$/,'。')}但可能会有点说不上来的不踏实，不是什么大事，别细想。`;
  } else if (interaction.type === '合') {
    emotionDesc = `${base.replace(/。$/,'。')}心里顺畅，有被接住的感觉。`;
  } else if (interaction.type === '刑') {
    emotionDesc = `${base.replace(/。$/,'。')}但容易跟自己较劲，对自己温柔点。`;
  } else if (isKongWang) {
    emotionDesc = `今天做什么都觉得差口气，不是你的问题。${base}`;
  } else {
    emotionDesc = base;
  }

  // 时辰建议
  const shichenMap = {
    '正印':'上午9点到11点精神最好，重要的事放这时。',
    '偏印':'晚上7点到9点脑子最静，适合给自己一点独处时间。',
    '比肩':'上午7点到9点精力最旺，趁早把想做的事干了。',
    '劫财':'下午3点到5点效率最高，别在上午磨叽。',
    '食神':'中午11点到1点心情最好，适合吃顿好的犒劳自己。',
    '伤官':'上午9点到11点思路最清，有想法赶紧记下来。',
    '正财':'上午9点到11点头脑清醒，适合处理钱和数字。',
    '偏财':'下午1点到3点灵光乍现，适合琢磨新方向。',
    '正官':'上午7点到9点状态最到位，先啃硬骨头。',
    '七杀':'下午5点到7点体力回升，适合出去走走散散心。',
  };
  const shichenTip = shichenMap[mainTenGod] || '按自己节奏来，身体知道什么时候该做什么。';

  // 短句
  const styleMap = { '正官':'思','七杀':'怒','正印':'思','偏印':'思','正财':'通用','偏财':'通用','食神':'喜不足','伤官':'怒','比肩':'通用','劫财':'思' };
  const quotePool = QUOTES[styleMap[mainTenGod]] || QUOTES['通用'];
  const quote = quotePool[Math.floor(Math.random() * quotePool.length)];

  const tieMap = { '合':'今天顺畅，享受就好。','冲':'今天这点动荡，过去了就好了。','刑':'今天这个坎是自己给自己设的，松开就好。','害':'这点不对劲不用细想，明天就好。' };
  const tie = tieMap[interaction.type] || '今天就是这样，来了就接着，过了就放下。';

  // 穿衣 + 推荐
  const clothing = getClothing(weatherData.maxTemp, weatherData.weather);
  const recommendation = getRecommendation(month, weatherData.maxTemp, weatherData.weather, mainTenGod);

  // 星期
  const weekDays = ['日','一','二','三','四','五','六'];
  const dateObj = new Date(year, month - 1, day);
  const weekDay = weekDays[dateObj.getDay()];

  return {
    dateStr: `${month}月${day}日 周${weekDay}`,
    weather: weatherData,
    dayPillar: GAN[liuRiGan] + liuRiZhi,
    emotionDesc,
    shichenTip,
    clothing,
    recommendation,
    quote: {
      classical: quote.c,
      modern: quote.m,
      tieToToday: tie,
    },
  };
};
