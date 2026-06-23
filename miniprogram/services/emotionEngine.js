// ========== 情绪引擎 ==========
// 七层规则 → 每日情绪卡片数据

var GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var WUXING_GAN = { '甲':'木','乙':'木','丙':'火','丁':'火','戊':'土','己':'土','庚':'金','辛':'金','壬':'水','癸':'水' };
var YIN_YANG_GAN = { '甲':'阳','乙':'阴','丙':'阳','丁':'阴','戊':'阳','己':'阴','庚':'阳','辛':'阴','壬':'阳','癸':'阴' };

var DAY_PILLAR_NATURE = {
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

var MONTH_QI = {
  '甲': [2,2,1,0,0,-1,-2,-2,-1,1,1,0],
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

var CHONG = { '子':'午','午':'子','丑':'未','未':'丑','寅':'申','申':'寅','卯':'酉','酉':'卯','辰':'戌','戌':'辰','巳':'亥','亥':'巳' };
var HE = { '子丑':true,'丑子':true,'寅亥':true,'亥寅':true,'卯戌':true,'戌卯':true,'辰酉':true,'酉辰':true,'巳申':true,'申巳':true,'午未':true,'未午':true };
var XING = { '子卯':true,'卯子':true,'寅巳':true,'巳申':true,'申寅':true,'丑戌':true,'戌未':true,'未丑':true };
var ZI_XING = ['辰','午','酉','亥'];
var HAI = { '子未':true,'未子':true,'丑午':true,'午丑':true,'寅巳':true,'巳寅':true,'卯辰':true,'辰卯':true,'申亥':true,'亥申':true,'酉戌':true,'戌酉':true };

var ZANG_GAN = { '子':'癸','丑':'己','寅':'甲','卯':'乙','辰':'戊','巳':'丙','午':'丁','未':'己','申':'庚','酉':'辛','戌':'戊','亥':'壬' };

var QUOTES = {
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
    { classical:'大道至简', modern:'最根本的道理都不复杂' },
    { classical:'朴素而天下莫能与之争美', modern:'简简单单就很好，不用跟谁比' },
  ],
};

function getTenGod(dayG, otherG) {
  var wxD = WUXING_GAN[GAN[dayG]];
  var wxO = WUXING_GAN[GAN[otherG]];
  var sameYY = YIN_YANG_GAN[GAN[dayG]] === YIN_YANG_GAN[GAN[otherG]];
  var relMap = { '木木':'同','火火':'同','土土':'同','金金':'同','水水':'同',
    '木火':'生','火土':'生','土金':'生','金水':'生','水木':'生',
    '木土':'克','火金':'克','土水':'克','金木':'克','水火':'克' };
  var rel = relMap[wxD + wxO];
  if (rel === '同') return sameYY ? '比肩' : '劫财';
  if (rel === '生') return sameYY ? '食神' : '伤官';
  var rev = relMap[wxO + wxD];
  if (rev === '生') return sameYY ? '偏印' : '正印';
  if (rev === '克') return sameYY ? '七杀' : '正官';
  return sameYY ? '偏财' : '正财';
}

function qiToWeight(qi) {
  if (qi >= 2) return 1.5;
  if (qi === 1) return 1.2;
  if (qi === 0) return 1.0;
  if (qi === -1) return 0.7;
  return 0.5;
}

function checkBranchInteraction(liuRiZhi, baziZhis) {
  for (var i = 0; i < baziZhis.length; i++) {
    if (CHONG[liuRiZhi] === baziZhis[i]) {
      if (i === 2) return { type: '冲', weight: 1.5, desc: '心里不太平，坐不住，有点烦躁' };
      return { type: '冲', weight: 1.3, desc: '隐隐不安，说不上来哪里不对' };
    }
  }
  for (var i = 0; i < baziZhis.length; i++) {
    if (HE[liuRiZhi + baziZhis[i]]) return { type: '合', weight: 0.8, desc: '心里顺畅，有被接住的感觉' };
  }
  if (ZI_XING.indexOf(liuRiZhi) >= 0) {
    var hasSame = baziZhis.filter(function(z) { return z === liuRiZhi; }).length;
    if (hasSame > 0) return { type: '刑', weight: 1.4, desc: '自己跟自己较劲，对自己温柔点' };
  }
  for (var i = 0; i < baziZhis.length; i++) {
    if (XING[liuRiZhi + baziZhis[i]]) return { type: '刑', weight: 1.2, desc: '有点小摩擦，别往心里去' };
  }
  for (var i = 0; i < baziZhis.length; i++) {
    if (HAI[liuRiZhi + baziZhis[i]]) return { type: '害', weight: 1.1, desc: '说不清的别扭，不用细想' };
  }
  return { type: 'none', weight: 1.0, desc: '' };
}

function gregorianToJDN(y, m, d) {
  var a = Math.floor((14 - m) / 12);
  var yr = y + 4800 - a;
  var mo = m + 12 * a - 3;
  return d + Math.floor((153 * mo + 2) / 5) + 365 * yr + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
}

function getQuote(emotionType) {
  var pool = QUOTES[emotionType] || QUOTES['通用'];
  return pool[Math.floor(Math.random() * pool.length)];
}

function calculate(baziData, year, month, day) {
  var raw = baziData._raw;
  var dayGan = raw.dayGan;
  var dayZhi = raw.dayZhi;

  var jdn = gregorianToJDN(year, month, day);
  var liuRiGan = (jdn + 9) % 10;
  var liuRiZhiIdx = (jdn + 1) % 12;
  var liuRiZhi = ZHI[liuRiZhiIdx];

  var mainTenGod = getTenGod(dayGan, liuRiGan);
  var auxGan = GAN.indexOf(ZANG_GAN[liuRiZhi]);
  var auxTenGod = auxGan >= 0 ? getTenGod(dayGan, auxGan) : mainTenGod;

  var ganWx = WUXING_GAN[GAN[liuRiGan]];
  var qiVal = MONTH_QI[ganWx] ? MONTH_QI[ganWx][month - 1] : 0;

  var baziZhis = [raw.yearZhi, raw.monthZhi, raw.dayZhi, raw.hourZhi].map(function(z) { return ZHI[z]; });
  var interaction = checkBranchInteraction(liuRiZhi, baziZhis);

  var isKongWang = baziData.kongWang.indexOf(liuRiZhi) >= 0;

  var moods = {
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
  var base = moods[mainTenGod] || '今天按自己的节奏走。';
  var emotionDesc;

  if (interaction.type === '冲' && interaction.weight >= 1.4) {
    emotionDesc = '今天心里不太平，坐不住。' + base.replace(/。/,'，') + '可能会有点烦躁，不是什么大事，过去了就好。';
  } else if (interaction.type === '冲') {
    emotionDesc = base.replace(/。$/, '。') + '但可能会有点说不上来的不踏实，不是什么大事，别细想。';
  } else if (interaction.type === '合') {
    emotionDesc = base.replace(/。$/, '。') + '心里顺畅，有被接住的感觉。';
  } else if (interaction.type === '刑') {
    emotionDesc = base.replace(/。$/, '。') + '但容易跟自己较劲，对自己温柔点。';
  } else if (isKongWang) {
    emotionDesc = '今天做什么都觉得差口气，不是你的问题。' + base;
  } else {
    emotionDesc = base;
  }

  // 时辰建议 — 十神 × 子午流注，每天不同
  var shichenMap = {
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
  var shichenTip = shichenMap[mainTenGod] || '按自己节奏来，身体知道什么时候该做什么。';

  var styleMap = { '正官':'思','七杀':'怒','正印':'思','偏印':'思','正财':'通用','偏财':'通用','食神':'喜不足','伤官':'怒','比肩':'通用','劫财':'思' };
  var quotePool = QUOTES[styleMap[mainTenGod]] || QUOTES['通用'];
  var quote = quotePool[Math.floor(Math.random() * quotePool.length)];

  var tieMap = { '合':'今天顺畅，享受就好。','冲':'今天这点动荡，过去了就好了。','刑':'今天这个坎是自己给自己设的，松开就好。','害':'这点不对劲不用细想，明天就好。' };
  var tie = tieMap[interaction.type] || '今天就是这样，来了就接着，过了就放下。';

  return {
    dayPillar: GAN[liuRiGan] + liuRiZhi,
    emotionDesc: emotionDesc,
    shichenTip: shichenTip,
    quote: { classical: quote.classical, modern: quote.modern, tieToToday: tie },
    mainTenGod: mainTenGod,
    interaction: interaction,
    qiWeight: qiToWeight(qiVal),
  };
}

module.exports = { calculate };
