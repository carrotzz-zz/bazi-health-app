// ========== 药膳推荐 · 云函数 ==========
// 迁移自吾乡帖 js/recommend.js，去除 DOM 依赖
// 支持 action: 'recommend' | 'byEvil' | 'search' | 'cities'

const { diets, cityData, cityRegionMap, provinceCities } = require('./data.js');

const EVIL_WUXING = { '风':'木','热':'火','暑':'火','湿':'土','燥':'金','寒':'水' };

// 季节
const seasonMonths = { "春":[2,3,4],"夏":[5,6,7],"长夏":[8],"秋":[9,10,11],"冬":[12,1] };
function getCurrentSeason(date) {
  if (!date) date = new Date();
  const m = date.getMonth() + 1;
  for (let [s, ms] of Object.entries(seasonMonths)) if (ms.includes(m)) return s;
  return "春";
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ========== 偏好过滤 ==========
function checkDislikes(diet, prefs) {
  const t = diet.ingredients + diet.method + diet.effect;
  const avoid = prefs.prefAvoid || [];
  for (let a of avoid) {
    if (a === "素食" && /[肉鸭羊鸡排骨猪腰鲫鱼]/i.test(t)) return true;
    if (a === "海鲜过敏" && /[鱼虾蟹]/i.test(t)) return true;
    if (a === "酒精过敏" && /酒/.test(t)) return true;
  }
  return false;
}

// ========== 偏好 → 预警 ==========
function getPrefWarnings(prefs, region) {
  const warnings = [];
  const spicy = prefs.prefSpicy || [];
  const taste = prefs.prefTaste || [];

  if (spicy.includes("无辣不欢") && (region.includes("湿") || region.includes("热"))) {
    warnings.push("你爱吃辣，但当前环境湿热偏重——辣会火上浇油，建议暂时减量，多用胡椒、生姜代替辣椒");
  }
  if (spicy.includes("无辣不欢") && region.includes("燥")) {
    warnings.push("你爱吃辣，但当前环境偏燥——辣加重干燥，皮肤和喉咙会更不舒服");
  }
  if (taste.includes("重油") && region.includes("湿")) {
    warnings.push("你喜欢重油口味，但当前环境多湿——油腻加重湿气，身体会更沉重");
  }
  const drink = prefs.prefDrink || [];
  if (drink.includes("爱喝冷饮") && region.includes("湿")) {
    warnings.push("你爱喝冷饮，但湿气重的环境里冷饮伤脾胃、助湿气");
  }

  return warnings;
}

// ========== 冲突驱动打分 ==========
function scoreDiet(diet, analysis, constitution, keEvil) {
  let score = 0;
  if (!analysis) return score;

  if (analysis.weatherDeviation && analysis.weatherDeviation.hasDeviation && analysis.weatherDeviation.level === 'high') {
    if (diet.qiEvil) {
      for (let e of analysis.priorityEvils) {
        if (diet.qiEvil.includes(e)) score += 4;
        else if (diet.qiEvil.some(de => EVIL_WUXING[de] === EVIL_WUXING[e])) score += 2;
      }
    }
  }
  if (analysis.migrationConflict && analysis.migrationConflict.level === 'high') {
    if (diet.qiEvil && analysis.priorityEvils) {
      for (let e of analysis.priorityEvils) if (diet.qiEvil.includes(e)) score += 3;
    }
  }
  if (diet.target.includes(constitution.primary)) score += 2;
  if (diet.qiEvil && diet.qiEvil.includes(keEvil)) score += 2;
  else if (diet.qiEvil) {
    for (let e of diet.qiEvil) { if (EVIL_WUXING[e] === EVIL_WUXING[keEvil]) score += 1; }
  }
  return score;
}

// ========== 本地菜判断 ==========
function isLocalDish(diet, cityInfo) {
  if (!diet.origin || !cityInfo) return false;
  const o = diet.origin;
  const lp = cityInfo.province || '';
  const lr = cityInfo.region || '';
  if (lp && (o.includes(lp) || lp.includes(o))) return true;
  const regionParts = lr.split(/[东西南北中]/).filter(Boolean);
  for (let rp of regionParts) {
    if (rp.length >= 2 && o.includes(rp)) return true;
  }
  if (o === lr) return true;
  return false;
}

// ========== 主推荐逻辑 ==========
function recommend(params) {
  const {
    constitution,     // { primary, secondary, scores, isBalanced }
    hometownCity,     // 家乡城市名
    currentCity,      // 现居城市名
    prefs,            // 饮食偏好
    conflictAnalysis, // 冲突分析结果 { migrationConflict, weatherDeviation, priorityEvils }
    crossCulture,     // 跨文化推荐结果
    wylq,             // 五运六气
    weather,          // 天气数据
    count,            // 返回数量
  } = params;

  const cInfo = cityData[currentCity];
  const hInfo = cityData[hometownCity];
  if (!cInfo) return { error: '未找到现居城市' };
  if (!hInfo) return { error: '未找到家乡城市' };

  const cRegion = cInfo.region;
  const hRegion = hInfo.region;
  const currentSeason = getCurrentSeason();
  const keEvil = wylq?.currentQi?.keInfo?.evil || '风';
  const prefsSafe = prefs || {};

  // 偏好预警
  const prefWarnings = getPrefWarnings(prefsSafe, cRegion);

  // 匹配候选
  let candidates = diets.filter(d =>
    d.season.includes(currentSeason) &&
    d.region.includes(cRegion) &&
    d.target.includes(constitution.primary) &&
    !d.avoid.includes(constitution.primary) &&
    !checkDislikes(d, prefsSafe)
  );
  if (candidates.length < 5) {
    candidates = diets.filter(d =>
      d.season.includes(currentSeason) &&
      d.region.includes(cRegion) &&
      !d.avoid.includes(constitution.primary) &&
      !checkDislikes(d, prefsSafe)
    );
  }
  if (candidates.length < 5) {
    candidates = diets.filter(d =>
      d.season.includes(currentSeason) &&
      !d.avoid.includes(constitution.primary) &&
      !checkDislikes(d, prefsSafe)
    );
  }

  // 打分排序
  candidates.forEach(d => { d._score = scoreDiet(d, conflictAnalysis, constitution, keEvil); });
  candidates.sort((a, b) => b._score - a._score);

  // 家乡胃加分
  if (crossCulture) {
    const ccFoods = crossCulture.foods.map(f => f.replace(/[（(].+[）)]/g, '').trim());
    candidates.forEach(d => {
      const nameNoSuffix = d.name.replace(/[（(].+[）)]/g, '').trim();
      if (ccFoods.some(f => nameNoSuffix.includes(f) || f.includes(nameNoSuffix))) d._score += 3;
      if (d.origin && hRegion && d.origin.includes(hRegion.split(/[东西南北中]/)[0])) d._score += 2;
    });
  }

  // 本地菜优先
  const localDishes = candidates.filter(d => isLocalDish(d, cInfo));
  const nonLocal = candidates.filter(d => !isLocalDish(d, cInfo));
  const merged = [];
  for (let d of localDishes) { if (merged.length < 10) merged.push(d); }
  for (let d of nonLocal) { if (merged.length < 10) merged.push(d); }

  const pool = merged.slice(0, Math.min(10, merged.length));
  shuffleArray(pool);
  let results = pool.slice(0, Math.min(count || 6, pool.length));

  // 保证至少2道本地菜
  if (localDishes.length >= 2 && results.filter(d => isLocalDish(d, cInfo)).length < 2) {
    for (let li = 0; li < localDishes.length && results.filter(d => isLocalDish(d, cInfo)).length < 2; li++) {
      if (!results.some(r => r.id === localDishes[li].id)) {
        results[results.length - 1] = localDishes[li];
      }
    }
  } else if (localDishes.length === 1 && !results.some(d => isLocalDish(d, cInfo))) {
    results[results.length - 1] = localDishes[0];
  }

  // 天气预警药膳
  let weatherAlertDiets = [];
  if (weather && weather.daily) {
    const alertEvils = [...new Set((weather.alerts || []).map(a => a.evil))];
    if (alertEvils.length > 0) {
      weatherAlertDiets = diets.filter(d => {
        if (!d.qiEvil || d.qiEvil.length === 0) return false;
        return alertEvils.some(e => d.qiEvil.includes(e)) && d.season.includes(currentSeason);
      });
      weatherAlertDiets.forEach(d => {
        d._alertScore = d.qiEvil.filter(e => alertEvils.includes(e)).length;
      });
      weatherAlertDiets.sort((a, b) => b._alertScore - a._alertScore);
      weatherAlertDiets = weatherAlertDiets.slice(0, 6);
    }
  }

  // 跨文化药膳匹配
  let crossCultureDiets = [];
  if (crossCulture && hRegion !== cRegion) {
    crossCulture.foods.forEach(foodName => {
      const coreName = foodName.replace(/[（(].+[）)]/g, '').trim();
      const match = diets.find(d => {
        const dCore = d.name.replace(/[（(].+[）)]/g, '').trim();
        return dCore.includes(coreName) || coreName.includes(dCore) ||
               foodName.includes(d.name) || d.name.includes(coreName);
      });
      if (match && !crossCultureDiets.some(m => m.id === match.id)) crossCultureDiets.push(match);
    });
    crossCultureDiets = crossCultureDiets.slice(0, 3);
  }

  return {
    season: currentSeason,
    region: cRegion,
    constitution,
    prefWarnings,
    primaryDiets: results,
    weatherAlertDiets,
    crossCultureDiets,
    crossCulture,
    totalMatched: candidates.length,
  };
}

// ========== 云函数入口 ==========
exports.main = async (event, context) => {
  const { action } = event;

  try {
    if (action === 'byEvil') {
      // 按邪气查询药膳
      const { evil, season, count } = event;
      let results = diets.filter(d => {
        if (!d.qiEvil || !d.qiEvil.includes(evil)) return false;
        if (season && !d.season.includes(season)) return false;
        return true;
      });
      return { success: true, data: results.slice(0, count || 10) };
    }

    if (action === 'search') {
      // 按名称搜索
      const { keyword } = event;
      if (!keyword) return { success: false, error: '缺少 keyword' };
      const results = diets.filter(d =>
        d.name.includes(keyword) || d.ingredients.includes(keyword) || d.effect.includes(keyword)
      );
      return { success: true, data: results.slice(0, 20) };
    }

    if (action === 'cities') {
      // 返回城市列表
      return {
        success: true,
        data: {
          provinceCities,
          cities: Object.keys(cityData).sort(),
        }
      };
    }

    if (action === 'detail') {
      // 查询单个药膳详情
      const { id } = event;
      const diet = diets.find(d => d.id === id);
      if (!diet) return { success: false, error: '未找到该药膳' };
      return { success: true, data: diet };
    }

    // 默认：推荐
    const result = recommend(event);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
