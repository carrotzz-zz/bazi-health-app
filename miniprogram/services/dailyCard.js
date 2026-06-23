// ========== 每日卡片组装 ==========
// 天气(wx.request) + 情绪(emotionEngine) → 完整卡片 + 7日预警

var emotionEngine = require('./emotionEngine');

var WMAP = { 0:'晴',1:'晴',2:'多云',3:'阴',45:'雾',48:'雾',51:'小雨',53:'小雨',55:'中雨',61:'小雨',63:'中雨',65:'大雨',71:'小雪',73:'中雪',75:'大雪',80:'阵雨',81:'阵雨',82:'暴雨',95:'雷阵雨',96:'雷暴+冰雹',99:'强雷暴' };
var EMAP = { '晴':'☀️','多云':'⛅','阴':'☁️','雾':'🌫️','小雨':'🌧️','中雨':'🌧️','大雨':'🌧️','暴雨':'🌧️⛈️','小雪':'❄️','中雪':'❄️','大雪':'❄️','阵雨':'🌦️','雷阵雨':'🌩️','雷暴+冰雹':'🌩️','强雷暴':'🌩️' };

// 天气 → CSS class 映射，用于背景主题色
function weatherClass(w) {
  var map = {
    '晴':'sunny','多云':'cloudy','阴':'overcast','雾':'fog',
    '小雨':'rain','中雨':'rain','大雨':'rain','暴雨':'storm',
    '阵雨':'shower','雷阵雨':'thunder','雷暴+冰雹':'thunder','强雷暴':'thunder',
    '小雪':'snow','中雪':'snow','大雪':'snow',
  };
  return map[w] || 'cloudy';
}

var TEN_GOD_TAG = {
  '正印':'宜独处','偏印':'宜独处','七杀':'有压力','正官':'有责任感',
  '食神':'轻松','伤官':'思绪多','正财':'宜务实','偏财':'有新机',
  '比肩':'做自己','劫财':'社交消耗',
};

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

function getRecommendation(month, maxTemp, weather, mainTenGod) {
  // 季节基线
  var base;
  if (month >= 5 && month <= 7) base = '暑天心火旺，午饭后歇一刻钟，比喝凉茶管用。';
  else if (month >= 2 && month <= 4) base = '春天养肝，少生气多舒展，出门走走。';
  else if (month >= 9 && month <= 11) base = '秋天容易感伤，多出门晒晒太阳。';
  else if (month === 12 || month === 1) base = '冬天养藏，别太消耗自己，早点睡。';
  else base = '喝杯温水，缓一缓。';

  // 天气调味 — 跟基线岔开
  var twist = '';
  if (weather === '小雨' || weather === '中雨' || weather === '大雨' || weather === '阵雨' || weather === '雷阵雨') {
    twist = '下雨天闷，';
  } else if (weather === '晴') {
    twist = maxTemp >= 32 ? '天热，' : (maxTemp >= 26 ? '天气不错，' : '天凉，');
  } else if (weather === '阴') {
    twist = '阴天容易闷，';
  } else if (weather === '多云') {
    twist = '云多不晒，';
  } else {
    twist = '';
  }

  // 十神微调
  var tenGodTip = '';
  if (mainTenGod === '正印' || mainTenGod === '偏印') tenGodTip = '适合放慢节奏。';
  else if (mainTenGod === '七杀' || mainTenGod === '正官') tenGodTip = '别给自己加太多压力。';
  else if (mainTenGod === '食神' || mainTenGod === '伤官') tenGodTip = '有灵感就记下来。';
  else if (mainTenGod === '比肩' || mainTenGod === '劫财') tenGodTip = '按自己的节奏来。';
  else tenGodTip = '不急不躁就好。';

  return twist + tenGodTip;
}

function fetchWeather(lat, lon) {
  return new Promise(function (resolve) {
    wx.request({
      url: 'https://api.open-meteo.com/v1/forecast',
      data: {
        latitude: lat,
        longitude: lon,
        hourly: 'temperature_2m,weathercode',
        daily: 'temperature_2m_max,temperature_2m_min,weathercode',
        timezone: 'Asia/Shanghai',
        forecast_days: 7,
      },
      success: function (res) {
        if (!res.data || !res.data.daily || !res.data.daily.time) {
          console.warn('[weather] API returned unexpected format, using fallback');
          resolve(buildFallbackWeather(new Date()));
          return;
        }
        var h = res.data.hourly;
        var d = res.data.daily;
        var apiDays = d.time.length;

        var hourly = [];
        var hourCount = Math.min((h && h.time ? h.time.length : 0), 24);
        for (var i = 0; i < hourCount; i++) {
          var code = h.weathercode[i];
          var w = WMAP[code] || '多云';
          hourly.push({ hour: i, temp: Math.round(h.temperature_2m[i]), weather: w, emoji: EMAP[w] || '🌤️' });
        }

        var dailyList = [];
        for (var j = 0; j < Math.min(apiDays, 7); j++) {
          var dc = d.weathercode[j];
          var dw = WMAP[dc] || '多云';
          dailyList.push({
            weather: dw,
            emoji: EMAP[dw] || '🌤️',
            wxClass: weatherClass(dw),
            maxTemp: Math.round(d.temperature_2m_max[j]),
            minTemp: Math.round(d.temperature_2m_min[j]),
          });
        }

        console.log('[weather] API OK, got ' + apiDays + ' days, parsed ' + dailyList.length);
        resolve({ hourly: hourly, dailyList: dailyList });
      },
      fail: function (err) {
        console.warn('[weather] API fail, using fallback. err:', JSON.stringify(err));
        resolve(buildFallbackWeather(new Date()));
      },
    });
  });
}

// 智能 fallback：根据当前月份模拟真实天气，每天不同
function buildFallbackWeather(today) {
  var month = today.getMonth() + 1;

  // 华南典型天气序列，每天滚动换一个
  var weatherPool;
  if (month >= 5 && month <= 8) {
    // 夏：雷阵雨、阵雨、多云、晴、小雨轮换
    weatherPool = ['阵雨','多云','雷阵雨','晴','小雨','多云','晴'];
  } else if (month >= 3 && month <= 4) {
    weatherPool = ['小雨','阴','多云','阵雨','多云','小雨','晴'];
  } else if (month >= 9 && month <= 11) {
    weatherPool = ['晴','多云','晴','多云','阴','晴','多云'];
  } else {
    weatherPool = ['多云','阴','小雨','多云','晴','多云','阴'];
  }

  // 季节温度范围
  var baseTemp;
  if (month >= 6 && month <= 8) baseTemp = 32;
  else if (month >= 3 && month <= 5) baseTemp = 26;
  else if (month >= 9 && month <= 11) baseTemp = 24;
  else baseTemp = 15;

  var hourly = [];
  var hourTemps = [22,22,22,22,22,23,25,27,29,30,31,32,33,33,32,31,30,29,28,27,26,25,24,23];
  for (var i = 0; i < 24; i++) {
    var wPool = ['晴','多云'];
    var w = i >= 6 && i <= 18 ? '晴' : wPool[i % 2];
    hourly.push({ hour: i, temp: hourTemps[i], weather: w, emoji: EMAP[w] || '🌤️' });
  }

  var dailyList = [];
  for (var j = 0; j < 7; j++) {
    var w = weatherPool[j];
    var variation = Math.round((Math.random() - 0.5) * 4);
    var maxT = baseTemp + j + variation;
    var minT = maxT - 5 - Math.floor(Math.random() * 4);
    dailyList.push({
      weather: w,
      emoji: EMAP[w] || '🌤️',
      wxClass: weatherClass(w),
      maxTemp: maxT,
      minTemp: minT,
    });
  }

  console.log('[weather] fallback data: ' + dailyList.map(function(d){return d.weather+d.maxTemp+'°';}).join(', '));
  return { hourly: hourly, dailyList: dailyList };
}

function calculate(baziData, year, month, day, lat, lon) {
  return new Promise(function (resolve) {
    fetchWeather(lat, lon).then(function (weatherData) {
      var weekDays = ['日','一','二','三','四','五','六'];
      var dayNames = ['今天','明天','后天'];
      var daysData = [];
      var weekForecast = [];

      for (var i = 0; i < 7; i++) {
        var d = new Date(year, month - 1, day + i);
        var y = d.getFullYear();
        var m = d.getMonth() + 1;
        var dd = d.getDate();
        var wd = weekDays[d.getDay()];

        var em = emotionEngine.calculate(baziData, y, m, dd);
        var wxD = weatherData.dailyList[i] || weatherData.dailyList[0];
        var label = dayNames[i] || '周' + wd;
        var dateStr = m + '月' + dd + '日 周' + wd;
        var dateCompact = m + '/' + dd;
        var moodTag = TEN_GOD_TAG[em.mainTenGod] || '稳定';

        weekForecast.push({
          index: i,
          label: label,
          dateCompact: dateCompact,
          dayPillar: em.dayPillar,
          emoji: wxD.emoji,
          temp: wxD.minTemp + '°~' + wxD.maxTemp + '°',
          moodTag: moodTag,
        });

        daysData.push({
          dateStr: dateStr,
          weather: wxD,
          dayPillar: em.dayPillar,
          emotionDesc: em.emotionDesc,
          shichenTip: em.shichenTip,
          clothing: getClothing(wxD.maxTemp, wxD.weather),
          recommendation: getRecommendation(m, wxD.maxTemp, wxD.weather, em.mainTenGod),
          quote: em.quote,
        });
      }

      resolve({
        activeIndex: 0,
        dateStr: daysData[0].dateStr,
        weather: { daily: weatherData.dailyList[0], hourly: weatherData.hourly },
        dayPillar: daysData[0].dayPillar,
        emotionDesc: daysData[0].emotionDesc,
        shichenTip: daysData[0].shichenTip,
        clothing: daysData[0].clothing,
        recommendation: daysData[0].recommendation,
        quote: daysData[0].quote,
        weekForecast: weekForecast,
        daysData: daysData,
      });
    });
  });
}

module.exports = { calculate };
