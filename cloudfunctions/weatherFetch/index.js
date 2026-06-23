// ========== 天气获取 · 云函数 ==========
// 调用 Open-Meteo 免费 API

exports.main = async (event, context) => {
  const { lat, lon } = event;

  // 输入校验：lat/lon 必须是合法数值且在有效范围内
  if (typeof lat !== 'number' || typeof lon !== 'number' ||
      isNaN(lat) || isNaN(lon) ||
      lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return {
      weather: '多云',
      emoji: '🌤',
      maxTemp: 25,
      minTemp: 18,
      precip: 0,
      summary: '🌤 多云 18°~25°C',
      _fallback: true,
      error: 'invalid coordinates',
    };
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum&timezone=Asia/Shanghai&forecast_days=1`;
    const res = await fetch(url);
    const data = await res.json();

    const daily = data.daily;
    const maxTemp = daily.temperature_2m_max[0];
    const minTemp = daily.temperature_2m_min[0];
    const weatherCode = daily.weathercode[0];
    const precip = daily.precipitation_sum[0];

    // WMO 天气码 → 中文
    const weatherMap = {
      0: '晴', 1: '晴', 2: '多云', 3: '阴',
      45: '雾', 48: '雾凇',
      51: '小雨', 53: '小雨', 55: '中雨',
      61: '小雨', 63: '中雨', 65: '大雨',
      71: '小雪', 73: '中雪', 75: '大雪',
      80: '阵雨', 81: '阵雨', 82: '暴雨',
      95: '雷阵雨', 96: '雷暴+冰雹', 99: '强雷暴',
    };
    const weather = weatherMap[weatherCode] || '多云';

    const emoji = {
      '晴':'☀️','多云':'⛅','阴':'☁️','雾':'🌫',
      '小雨':'🌧','中雨':'🌧','大雨':'🌧','暴雨':'⛈',
      '小雪':'❄️','中雪':'❄️','大雪':'❄️',
      '阵雨':'🌦','雷阵雨':'⛈','雷暴+冰雹':'⛈','强雷暴':'⛈',
      '雾凇':'🌫',
    };

    return {
      weather,
      emoji: emoji[weather] || '🌤',
      maxTemp: Math.round(maxTemp),
      minTemp: Math.round(minTemp),
      precip: precip,
      summary: `${emoji[weather] || '🌤'} ${weather} ${Math.round(minTemp)}°~${Math.round(maxTemp)}°C`,
    };
  } catch (e) {
    // 兜底：返回默认天气
    return {
      weather: '多云',
      emoji: '🌤',
      maxTemp: 25,
      minTemp: 18,
      precip: 0,
      summary: '🌤 多云 18°~25°C',
      _fallback: true,
    };
  }
};
