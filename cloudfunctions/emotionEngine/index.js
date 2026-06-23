// ========== 情绪引擎 · 云函数 ==========
// 七层规则 → 每日情绪卡片数据

const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const WUXING_GAN = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };
const WUXING_ZHI = { '子':'水','丑':'土','寅':'木','卯':'木','辰':'土','巳':'火','午':'火','未':'土','申':'金','酉':'金','戌':'土','亥':'水' };
const YIN_YANG_GAN = { '甲':'阳','乙':'阴','丙':'阳','丁':'阴','戊':'阳','己':'阴','庚':'阳','辛':'阴','壬':'阳','癸':'阴' };

// ---------- 1. 六十甲子日柱 性情底色 ----------
const DAY_PILLAR_NATURE = {
  '甲子':'温润，心里有数，不轻易表态','甲寅':'自主，有主见，不喜欢被管',
  '甲辰':'表面干脆，心里盘算多','甲午':'个性鲜明，心里一把火',
  '甲申':'外在随和，内心有压力','甲戌':'表面随和，内心有目标感',
  '乙丑':'外表柔软，心里硬气','乙卯':'柔软但有底线',
  '乙巳':'心思活泛，情绪来得快去得快','乙未':'外表细腻，内心宽厚',
  '乙酉':'外表温和，内心有压力源','乙亥':'外柔内静，不急不躁',
  '丙子':'外表热情，内心有规矩','丙寅':'热情+思想，脑子里总有新想法',
  '丙辰':'阳光大方，情绪来得快散得快','丙午':'内外都热，精力旺盛',
  '丙申':'热情+行动力','丙戌':'热情但有分寸',
  '丁丑':'外在温和，心里有主意','丁卯':'心思细腻，感知力强',
  '丁巳':'敏感，对在意的事特别上心','丁未':'温火慢炖型',
  '丁酉':'心里有本账，不被人带着走','丁亥':'心里有规矩，自律',
  '戊子':'稳重务实','戊寅':'稳重下有压力源',
  '戊辰':'山一样的稳定感','戊午':'厚重但内心有温度',
  '戊申':'沉稳中带着灵活','戊戌':'内心有棱角，认准的事不轻易变',
  '己丑':'内心厚实','己卯':'外表随和，内心有持续紧张源',
  '己巳':'外表柔和，心里有温度','己未':'看似随和，内心有层次',
  '己酉':'心思灵巧','己亥':'心里有条线，不轻易越过',
  '庚子':'外表硬朗，内心灵巧','庚寅':'内心有目标',
  '庚辰':'硬中有韧','庚午':'刚硬之下有自我约束',
  '庚申':'硬骨头，不轻易弯','庚戌':'心里有决断力',
  '辛丑':'精致下有厚度','辛卯':'心思细，对得失敏感',
  '辛巳':'内心有标准，不放松自己','辛未':'追求完美，细节控',
  '辛酉':'追求极致和干净','辛亥':'心思灵动有灵气',
  '壬子':'情绪像江河，痛快','壬寅':'情绪有出口',
  '壬辰':'表面流动，内心有压感','壬午':'情绪有节制',
  '壬申':'思想深邃','壬戌':'表面流畅，内心有层次',
  '癸丑':'表面温柔，心里有城府','癸卯':'心思灵巧，情绪有自然的出口',
  '癸巳':'心里有账，情绪精细','癸未':'外柔内敛',
  '癸酉':'表面平静内心清澈','癸亥':'外表平静内心有暗涌',
};

// ---------- 2. 十神情绪映射 ----------
const TEN_GOD_EMOTION = {
  '正官': { mood:'责任约束', desc:'今天责任虽重，你已经够努力了。', style:'静' },
  '七杀': { mood:'压力挑战', desc:'今天容易遇到压力，退一步不等于怂。', style:'躁' },
  '正印': { mood:'学习沉淀', desc:'今天适合看点东西，不急着输出。', style:'静' },
  '偏印': { mood:'独处深思', desc:'今天适合独处，但记得留一扇窗。', style:'静' },
  '正财': { mood:'务实稳定', desc:'稳稳做事的一天，一步一脚印。', style:'稳' },
  '偏财': { mood:'机会变动', desc:'机会看着不错，先想清楚再出手。', style:'动' },
  '食神': { mood:'享受创意', desc:'今天适合对自己好一点。', style:'松' },
  '伤官': { mood:'表达叛逆', desc:'想法多，写下来比说出来更好。', style:'动' },
  '比肩': { mood:'竞争自我', desc:'今天是自己的主场，专注自己。', style:'稳' },
  '劫财': { mood:'消耗社交', desc:'不想去的局可以不去。', style:'躁' },
};

// ---------- 3. 旺衰权重 ----------
// 天干在十二月令的气数: 旺禄/相/余冠/休/囚/死墓绝
const MONTH_QI = {
  '甲': [2,2,1,0,0,-1,-2,-2,-1,1,1,0], // 寅卯辰巳午未申酉戌亥子丑
  '乙': [2,2,1,0,0,-1,-2,-2,-1,1,1,0],
  '丙': [1,1,0,2,2,1,-1,-1,-2,-2,-2,-1],
  '丁': [1,1,0,2,2,1,-1,-1,-2,-2,-2,-1],
  '戊': [-1,-1,2,1,1,2,0,0,2,-1,-1,2],
  '己': [-1,-1,2,1,1,2,0,0,2,-1,-1,2],
  '庚': [-2,-2,1,-1,-1,0,2,2,1,0,0,-1],
  '辛': [-2,-2,1,-1,-1,0,2,2,1,0,0,-1],
  '壬': [0,0,-1,-2,-2,-1,1,1,-1,2,2,1],
  '癸': [0,0,-1,-2,-2,-1,1,1,-1,2,2,1],
};

function qiToWeight(qi) {
  if (qi >= 2) return 1.5;   // 旺禄
  if (qi === 1) return 1.2;  // 相
  if (qi === 0) return 1.0;  // 余冠
  if (qi === -1) return 0.7; // 休
  return 0.5;                 // 囚死墓绝
}

// ---------- 4. 地支刑冲合害 ----------
const CHONG = { '子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳' };
const HE = {
  '子丑':true,'丑子':true,'寅亥':true,'亥寅':true,'卯戌':true,'戌卯':true,
  '辰酉':true,'酉辰':true,'巳申':true,'申巳':true,'午未':true,'未午':true,
};
const XING = {
  '子卯':true,'卯子':true,
  '寅巳':true,'巳申':true,'申寅':true,
  '丑戌':true,'戌未':true,'未丑':true,
};
const ZI_XING = ['辰','午','酉','亥']; // 自刑
const HAI = {
  '子未':true,'未子':true,'丑午':true,'午丑':true,'寅巳':true,'巳寅':true,
  '卯辰':true,'辰卯':true,'申亥':true,'亥申':true,'酉戌':true,'戌酉':true,
};

function checkBranchInteraction(liuRiZhi, baziZhis) {

  // 冲（最重，立即返回）
  for (let i = 0; i < baziZhis.length; i++) {
    if (CHONG[liuRiZhi] === baziZhis[i]) {
      if (i === 2) {
        return { type: '冲', weight: 1.5, desc: '心里不太平，坐不住，有点烦躁' };
      }
      const pillarName = ['年','月','日','时'][i];
      return { type: '冲', weight: 1.3, desc: `${pillarName}上有点动荡，隐隐不安` };
    }
  }

  // 合
  for (let i = 0; i < baziZhis.length; i++) {
    if (HE[liuRiZhi + baziZhis[i]]) {
      return { type: '合', weight: 0.8, desc: '心里顺畅，有被接住的感觉' };
    }
  }

  // 自刑
  if (ZI_XING.includes(liuRiZhi)) {
    const hasSame = baziZhis.filter(z => z === liuRiZhi).length;
    if (hasSame > 0) {
      return { type: '刑', weight: 1.4, desc: '自己跟自己较劲，对自己温柔点' };
    }
  }

  // 刑
  for (let i = 0; i < baziZhis.length; i++) {
    if (XING[liuRiZhi + baziZhis[i]]) {
      return { type: '刑', weight: 1.2, desc: '有点小摩擦，别往心里去' };
    }
  }

  // 害
  for (let i = 0; i < baziZhis.length; i++) {
    if (HAI[liuRiZhi + baziZhis[i]]) {
      return { type: '害', weight: 1.1, desc: '说不清的别扭，不用细想' };
    }
  }

  return { type: 'none', weight: 1.0, desc: '' };
}

// ---------- 5. 流月背景 ----------
const MONTH_BG = ['生发有新想法','活跃易分心','收拾有点闷','动力上升易急躁',
  '能量高峰易亢奋','闷热思虑懒散','清爽果断易伤感','清冽追求完美',
  '收敛务实沉闷','内省安静退缩','深藏孤独低落','蓄力等待焦虑'];

// ---------- 6. 大运底色 ----------
const DAYUN_MOOD = {
  '正官':'学着承担','七杀':'顶着压力长','正印':'沉淀吸收','偏印':'向内走',
  '正财':'踏实积累','偏财':'折腾尝试','食神':'对自己好一点','伤官':'打破框框',
  '比肩':'靠自己','劫财':'和人打交道',
};

// ---------- 7. 情志五脏 ----------
const QINGZHI = {
  '木': { excess:'急，容易上火', lack:'憋着不说不痛快', organ:'肝', tip:'少生气，气顺了什么都好' },
  '火': { excess:'停不下来，心火旺', lack:'提不起劲，心气弱', organ:'心', tip:'给自己踩个刹车' },
  '土': { excess:'脑子转太多圈', lack:'懒得想事没主见', organ:'脾', tip:'不如动手做一件' },
  '金': { excess:'容易感伤压得慌', lack:'有话说不出来', organ:'肺', tip:'出门走走换个空气' },
  '水': { excess:'容易多想害怕退缩', lack:'定不住心神不安', organ:'肾', tip:'只看眼前的事' },
};

// ---------- 8. 季节加权 ----------
function seasonWeight(month) {
  if (month >= 2 && month <= 4) return { bias:'怒', weight:1.2 };
  if (month >= 5 && month <= 7) return { bias:'喜', weight:1.2 };
  if (month === 8) return { bias:'思', weight:1.2 };
  if (month >= 9 && month <= 11) return { bias:'悲', weight:1.2 };
  return { bias:'恐', weight:1.2 };
}

// ---------- 9. 空亡 ----------
function isKongWang(liuRiZhi, kongWangZhis) {
  return kongWangZhis.includes(liuRiZhi);
}

// ---------- 10. 短句库 ----------
const QUOTES = {
  '怒': [
    { classical:'知其不可奈何而安之若命', modern:'有些事改变不了，先和它待一会儿' },
    { classical:'水善利万物而不争', modern:'水的力量不是硬碰硬，是绕过去' },
    { classical:'安时而处顺，哀乐不能入也', modern:'顺着日子过，大的情绪波动就进不来' },
  ],
  '喜不足': [
    { classical:'天地有大美而不言', modern:'好东西安安静静在那里，你得自己去看' },
    { classical:'知足者富', modern:'觉得自己够了的人，才是真的富' },
  ],
  '思': [
    { classical:'少则得，多则惑', modern:'想得少反而抓住重点，想太多反而乱' },
    { classical:'知止不殆', modern:'知道什么时候该停，才不会把自己耗干' },
  ],
  '悲': [
    { classical:'物来则应，过去不留', modern:'东西来了接住，过去了就松手' },
    { classical:'飘风不终朝，骤雨不终日', modern:'再大的风也刮不了一整天' },
  ],
  '恐': [
    { classical:'不怕念起，只怕觉迟', modern:'冒出害怕是正常的，能察觉到就不算晚' },
    { classical:'上善若水', modern:'最好的状态像水，该流就流，该停就停' },
  ],
  '通用': [
    { classical:'大道至简', modern:'最根本的道理都不复杂，复杂的是自己绕自己' },
    { classical:'朴素而天下莫能与之争美', modern:'简简单单就很好，不用跟谁比' },
  ],
};

function getQuote(emotionType) {
  const pool = QUOTES[emotionType] || QUOTES['通用'];
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

// ---------- 11. 穿衣推荐 ----------
function getClothing(temp, wuxingBias) {
  if (temp >= 30) return '轻薄透气，注意防晒';
  if (temp >= 22) return '薄衫出门，早晚加件';
  if (temp >= 14) return '薄外套刚好，不冷不热';
  if (temp >= 5) return '注意保暖，毛衣加外套';
  return '穿暖和一些，别冻着';
}

function getRecommendation(season, temp, wuxingBias) {
  const seasonTips = {
    '春': '春天养肝，少生气多舒展',
    '夏': '暑天心火旺，午饭后歇一刻钟',
    '秋': '秋天容易感伤，多出门走走',
    '冬': '冬天养藏，别太消耗自己',
  };
  return seasonTips[season] || '喝杯温水，缓一缓';
}

// ---------- 12. 子午流注 时辰建议 ----------
const SHICHEN_NA = {
  0: '胆经当令，该睡了', 1: '肝经当令，还在熬夜就亏了',
  2: '肺经当令，深睡修复中', 3: '肺经，睡不着也别焦虑',
  4: '大肠经，早起一杯温水', 5: '大肠经，适合起床排毒',
  6: '胃经，早餐吃好', 7: '胃经当令，早餐别省',
  8: '脾经，适合处理精细的事', 9: '脾经，效率最高的时候',
  10: '心经，心气最顺', 11: '心经当令，重要的事放这时',
  12: '小肠经，午饭后歇一刻钟', 13: '小肠经，别立刻趴桌上午睡',
  14: '膀胱经，下午容易犯困', 15: '膀胱经，喝杯水活动一下',
  16: '肾经，别排太费脑的事', 17: '肾经，适合收尾整理',
  18: '心包经，放松准备收工', 19: '心包经，别想工作的事了',
  20: '三焦经，适合泡脚放松', 21: '三焦经，准备进入休息状态',
  22: '胆经，该睡了别刷手机', 23: '胆经，熬夜伤胆气',
};

function getShichenTip(dayEmotion) {
  // 根据当日情绪推荐最有利的时辰
  const calmHours = [10, 11]; // 午时11-13点，心经
  if (dayEmotion.includes('静') || dayEmotion.includes('沉淀')) {
    return `上午9点到11点精神最好，重要的事放这时。`;
  }
  return `中午11点到1点心气最顺，重要的事放这时。`;
}

// ---------- 主函数 ----------

exports.main = async (event, context) => {
  const { baziData, year, month, day } = event;
  // baziData = baziCalc 的返回结果（包含 _raw）

  const raw = baziData._raw;
  const dayGan = raw.dayGan;
  const dayZhi = raw.dayZhi;

  // --- 计算流日 ---
  // 使用儒略日
  function gregorianToJDN(y, m, d) {
    const a = Math.floor((14 - m) / 12);
    const yr = y + 4800 - a;
    const mo = m + 12 * a - 3;
    return d + Math.floor((153 * mo + 2) / 5) + 365 * yr
      + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
  }
  const jdn = gregorianToJDN(year, month, day);
  const liuRiGan = (jdn + 9) % 10;
  const liuRiZhi = (jdn + 1) % 12;
  const liuRiGzIdx = (() => {
    for (let i = 0; i < 60; i++) {
      if (i % 10 === liuRiGan && i % 12 === liuRiZhi) return i;
    }
    return 0;
  })();
  const liuRiDayPillar = GAN[liuRiGan] + ZHI[liuRiZhi];

  // --- 层1: 日柱底色 ---
  const dayPillarKey = GAN[dayGan] + ZHI[dayZhi];
  const dayNature = DAY_PILLAR_NATURE[dayPillarKey] || '有自己独特的性格底色';

  // --- 层2+3: 十神（主+辅+旺衰）---
  function getTenGod(dayG, otherG) {
    const wxD = WUXING_GAN[GAN[dayG]];
    const wxO = WUXING_GAN[GAN[otherG]];
    const sameYY = YIN_YANG_GAN[GAN[dayG]] === YIN_YANG_GAN[GAN[otherG]];
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

  const mainTenGod = getTenGod(dayGan, liuRiGan);

  // 辅十神：流日支藏干主气
  const ZANG_GAN = {
    '子':['癸'],'丑':['己'],'寅':['甲'],'卯':['乙'],'辰':['戊'],'巳':['丙'],
    '午':['丁'],'未':['己'],'申':['庚'],'酉':['辛'],'戌':['戊'],'亥':['壬'],
  };
  const auxTenGod = getTenGod(dayGan, GAN.indexOf(ZANG_GAN[ZHI[liuRiZhi]][0]));

  // 旺衰
  const ganWx = WUXING_GAN[GAN[liuRiGan]];
  const qi = MONTH_QI[ganWx] ? MONTH_QI[ganWx][month - 1] : 0;
  const qiWeight = qiToWeight(qi);

  // --- 层4: 刑冲合害 ---
  const baziZhis = [raw.yearZhi, raw.monthZhi, raw.dayZhi, raw.hourZhi]
    .map(z => ZHI[z]);
  const branchInteraction = checkBranchInteraction(ZHI[liuRiZhi], baziZhis);

  // --- 层5: 流月 ---
  // 简化：用当前公历月份估算月支
  const estimateMonthZhi = (month + 1) % 12; // 近似：1月→丑(1), 2月→寅(2), ...
  // 实际应查节气，这里简化
  const monthMood = MONTH_BG[(month - 1 + 12) % 12];
  const liuYueGan = (raw.yearGan * 2 + ((month + 1) % 12)) % 10;
  const liuYueTenGod = getTenGod(dayGan, liuYueGan);

  // --- 层6: 大运 ---
  const currentDaYun = baziData.daYun.find(d => year >= d.startYear && year <= d.endYear);
  const daYunKey = currentDaYun ? currentDaYun.gan + currentDaYun.zhi : '';

  // --- 层7: 空亡 ---
  const kong = isKongWang(ZHI[liuRiZhi], baziData.kongWang);

  // --- 层8: 情志五脏 ---
  const wuxingCount = baziData.wuxingRatio;
  const sortedWx = Object.entries(wuxingCount).sort((a,b) => b[1] - a[1]);
  const topWx = sortedWx[0][0];
  // 五行强度和占比
  const total = Object.values(wuxingCount).reduce((s,v) => s+v, 0);
  const topRatio = sortedWx[0][1] / total;
  let qingZhiKey = topWx;
  let qingZhiType = topRatio >= 0.3 ? 'excess' : 'lack';

  // --- 层9: 季节 ---
  const seasonMap = { 2:'春',3:'春',4:'春',5:'夏',6:'夏',7:'夏',8:'长夏',9:'秋',10:'秋',11:'秋',12:'冬',1:'冬' };
  const season = seasonMap[month];
  const sw = seasonWeight(month);

  // ========== 综合 ==========
  // 输出：直接说人话

  // 情绪主描述
  const tenGodInfo = TEN_GOD_EMOTION[mainTenGod] || TEN_GOD_EMOTION['正印'];
  let emotionDesc = '';

  // 十神主情绪
  const moods = {
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
  const baseEmotion = moods[mainTenGod] || tenGodInfo.desc;

  // 根据刑冲合害组合调整
  if (branchInteraction.type === '冲' && branchInteraction.weight >= 1.4) {
    emotionDesc = `今天心里不太平，坐不住。${baseEmotion.replace(/。/,'，')}可能会有点烦躁，不是什么大事，过去了就好。`;
  } else if (branchInteraction.type === '冲') {
    emotionDesc = `${baseEmotion.replace(/。$/,'。')}但可能会有点说不上来的不踏实，不是什么大事，别细想。`;
  } else if (branchInteraction.type === '合') {
    emotionDesc = `${baseEmotion.replace(/。$/,'。')}心里顺畅，有被接住的感觉。`;
  } else if (branchInteraction.type === '刑') {
    emotionDesc = `${baseEmotion.replace(/。$/,'。')}但容易跟自己较劲，对自己温柔点。`;
  } else if (kong) {
    emotionDesc = `今天做什么都觉得差口气，不是你的问题。${baseEmotion}`;
  } else {
    emotionDesc = baseEmotion;
  }

  // 情志附加（不每次都加，只在明显偏颇时加）
  const qzInfo = QINGZHI[qingZhiKey];
  const organNote = topRatio >= 0.35 ? ` ${qzInfo[qingZhiType === 'excess' ? 'excess' : 'lack']}。` : '';

  // 时辰建议
  const shichenTip = getShichenTip(emotionDesc);

  // 短句
  const emotionTypeMap = {
    '怒':'怒','躁':'怒','静':'思','稳':'通用','动':'喜不足','松':'喜不足',
  };
  const emoType = emotionTypeMap[tenGodInfo.style] || '通用';
  const quote = getQuote(emoType);

  // 拉回今天
  const tieToToday = `今天这点不踏实也是，来了就来了，别攥着不放。`;
  const tieToTodayMap = {
    '合': '今天顺畅，享受就好。',
    '冲': '今天这点动荡，过去了就好了。',
    '刑': '今天这个坎是自己给自己设的，松开就好。',
    '害': '这点不对劲不用细想，明天就好。',
  };
  const tie = tieToTodayMap[branchInteraction.type] || tieToToday;

  return {
    date: `${year}年${month}月${day}日`,
    dayPillar: liuRiDayPillar,
    mainTenGod,
    auxTenGod,
    qiWeight,
    branchInteraction,
    kong,

    // 卡片输出
    emotionDesc,
    bodyNote: organNote.trim(),
    shichenTip,
    quote: {
      classical: quote.classical,
      modern: quote.modern,
      tieToToday: tie,
    },

    // 辅助信息
    dayNature,
    monthMood,
    daYunMood: daYunKey ? `${daYunKey}运，${DAYUN_MOOD[mainTenGod] || '做好自己'}` : '',
    season,
  };
};
