// ========== 水土不服冲突分析 · 云函数 ==========
// 迁移自吾乡帖 js/wuyunliuqi.js 的冲突分析部分
// 支持 action: 'analyze' | 'climateConflict' | 'constitutionEnv' | 'weatherDeviation' | 'crossCulture'

const EVIL_WUXING = { '风':'木','热':'火','暑':'火','湿':'土','燥':'金','寒':'水' };

// 气候区饮食文化特征
const REGION_FOOD_CULTURE = {
  '华南暖湿': { staple:'米饭', taste:'清淡、喜煲汤、喜海鲜', habit:'老火靓汤、凉茶' },
  '华东湿热': { staple:'米饭', taste:'咸鲜、偏甜', habit:'红烧、清蒸' },
  '华中湿热': { staple:'米饭', taste:'咸辣', habit:'重油重色' },
  '西南阴湿': { staple:'米饭', taste:'麻辣、重油', habit:'火锅、辣椒驱寒湿' },
  '华北干燥': { staple:'面食', taste:'咸香', habit:'面食为主、炖菜' },
  '东北寒燥': { staple:'米饭+面', taste:'咸、油大', habit:'炖菜、烧烤、腌菜' },
  '西北干寒': { staple:'面食', taste:'咸、酸辣', habit:'牛羊肉、面食' },
  '青藏高寒': { staple:'青稞', taste:'咸、奶制品', habit:'酥油茶、牛羊肉' },
};

// 气候区冲突对 → 水土不服分析
function getClimateConflict(fromRegion, toRegion) {
  if (!fromRegion || !toRegion || fromRegion === toRegion) return null;

  // 湿 → 干
  if (fromRegion.includes('湿') && toRegion.includes('燥')) {
    return {
      level: 'high',
      title: '从"湿"到"燥"——身体的水分要被抽干了',
      body: `你从小在${fromRegion}长大，身体习惯了潮湿环境。到了${toRegion}，干燥是第一大挑战。皮肤干、喉咙干、容易干咳。但注意——不能一味猛喝水，因为你脾胃底子是"抗湿"模式，突然大量喝水反而加重负担。`,
      tips: ['少量多次喝水，不要一口气灌', '多吃沙参、玉竹、银耳这类润的东西', '辛辣烧烤要少碰，火上浇油'],
      dietPriority: ['燥'],
    };
  }

  // 燥 → 湿
  if (fromRegion.includes('燥') && toRegion.includes('湿')) {
    return {
      level: 'high',
      title: '从"干"到"湿"——身体像掉进了蒸笼',
      body: `你从小在${fromRegion}长大，身体习惯了干燥。到了${toRegion}，湿气是最陌生的敌人。容易困倦、身体沉重、没胃口、大便粘。你的身体还不懂得怎么"抗湿"，所以比本地人更容易被湿气困住。`,
      tips: ['适当运动出汗是排湿最快的方法', '多吃薏米、茯苓、陈皮这些祛湿食材', '生冷甜腻的东西要少碰，湿上加湿'],
      dietPriority: ['湿'],
    };
  }

  // 寒 → 热/暖
  if ((fromRegion.includes('寒')) && (toRegion.includes('热') || toRegion.includes('暖'))) {
    return {
      level: 'high',
      title: '从"冷"到"热"——身体像进了火炉',
      body: `你从小在${fromRegion}长大，身体习惯了寒冷，阳气偏旺。到了${toRegion}，热+可能的湿会让你比本地人更难受——你还没有"散热"的经验。容易上火、长痘、心烦。`,
      tips: ['慢慢适应，不要一到就狂吹空调吃冰', '绿豆、苦瓜、冬瓜这类清热食材可以多吃', '辣和酒要少碰，火上浇油'],
      dietPriority: ['热', '暑'],
    };
  }

  // 热/暖 → 寒
  if ((fromRegion.includes('热') || fromRegion.includes('暖')) && toRegion.includes('寒')) {
    return {
      level: 'high',
      title: '从"暖"到"冷"——身体还没准备好过冬',
      body: `你从小在${fromRegion}长大，身体习惯了温暖。到了${toRegion}，寒冷是你最大的挑战。手脚冰凉、容易感冒、关节不舒服。你的"抗寒基因"还没建立起来，比本地人怕冷得多。`,
      tips: ['腰腹和脚踝的保暖比穿厚衣服更重要', '生姜、肉桂、当归、羊肉这些温补食材多吃', '晚上热水泡脚是性价比最高的养生法'],
      dietPriority: ['寒'],
    };
  }

  // 湿 → 湿（不同湿）
  if (fromRegion.includes('湿') && toRegion.includes('湿') && fromRegion !== toRegion) {
    const wetTypes = {
      '华南暖湿': { desc:'终年暖热潮湿', bias:'热' },
      '华东湿热': { desc:'四季分明、梅雨季湿气尤重', bias:'热' },
      '华中湿热': { desc:'夏热冬冷、寒湿交替', bias:'寒热都有' },
      '西南阴湿': { desc:'多雾少太阳、湿气偏寒', bias:'寒' },
    };
    const fromDesc = wetTypes[fromRegion]?.desc || fromRegion;
    const toDesc = wetTypes[toRegion]?.desc || toRegion;
    const fromBias = wetTypes[fromRegion]?.bias || '';
    const toBias = wetTypes[toRegion]?.bias || '';
    let diffNote = '';
    if (fromBias === '热' && toBias === '寒') diffNote = '你习惯的湿偏热，但这里的湿偏寒——祛湿方法要从"清热化湿"改成"温化寒湿"';
    else if (fromBias === '热' && toBias === '寒热都有') diffNote = '你习惯的湿偏热，但这里的湿寒热交替——冬天需要温化，夏天需要清化，不能一根筋';
    else if (fromBias === '寒' && toBias === '热') diffNote = '你习惯的湿偏寒，但这里的湿偏热——不能照搬老家的温化方法，要改用清热祛湿';
    else if (fromBias === '寒热都有' && toBias === '热') diffNote = '你习惯的湿随季节变，但这里的湿常年偏热——重点在清热而非温化';
    else if (fromBias === '热' && toBias === '热') diffNote = '虽然都是湿热型，但节奏不同——一个是常年闷着，一个是季节性的，身体需要时间调整祛湿的节奏';
    else diffNote = '两地的湿有微妙不同，观察身体的反应再决定方向';
    return {
      level: 'medium',
      title: '同样是"湿"，但湿法不一样',
      body: `你家乡${fromRegion}的湿是"${fromDesc}"，现居地${toRegion}的湿是"${toDesc}"。${diffNote}。`,
      tips: ['观察自己身体的反应，不要照搬老家的方法', '如果是寒湿→温化（生姜、陈皮）；湿热→清化（薏米、冬瓜）'],
      dietPriority: ['湿'],
    };
  }

  // 燥 → 燥（不同燥）
  if (fromRegion.includes('燥') && toRegion.includes('燥') && fromRegion !== toRegion) {
    return {
      level: 'medium',
      title: '同样是"燥"，冷的燥和热的燥不一样',
      body: `你在${fromRegion}习惯了干燥，但${toRegion}的燥可能更偏寒或者更偏热。寒燥伤肺更伤肾，热燥主要伤肺和皮肤。润的方法不一样。`,
      tips: ['观察自己是偏寒还是偏热，再决定用温润还是凉润', '北方燥偏寒→蜂蜜、核桃温润；西北燥偏热→沙参、玉竹凉润'],
      dietPriority: ['燥'],
    };
  }

  return {
    level: 'low',
    title: '两地的气候差异不大',
    body: `${fromRegion}和${toRegion}气候相近，你的身体应该能较快适应。`,
    tips: ['按当地当季的饮食节奏来就行'],
    dietPriority: [],
  };
}

// 体质 vs 环境冲突
function getConstitutionEnvConflict(constitution, region) {
  const conflicts = {
    '阳虚质': {
      '华南暖湿': { note:'阳虚怕冷，但环境湿热——外湿内寒，不能一味祛湿，要温阳+祛湿一起', foods:['干姜','肉桂','白术'] },
      '华东湿热': { note:'同上，湿冷天尤其难受，关节和胃最容易出问题', foods:['干姜','茯苓','桂枝'] },
      '西南阴湿': { note:'阴湿最伤阳气，你比本地人更容易关节冷痛', foods:['附子','肉桂','杜仲'] },
      '东北寒燥': { note:'寒+燥双重打击，比别人更怕冷也更干', foods:['当归','黄芪','核桃'] },
      '西北干寒': { note:'跟东北类似，干寒交加，阳虚的人在这里最难熬', foods:['羊肉','肉桂','生姜'] },
    },
    '阴虚质': {
      '华北干燥': { note:'阴虚+环境干燥——干上加干，比别人更容易口干、皮肤干、便秘', foods:['沙参','玉竹','麦冬'] },
      '西北干寒': { note:'燥+寒双重打击，但你是阴虚，要润不能温补', foods:['沙参','麦冬','枸杞'] },
      '东北寒燥': { note:'外寒内燥，不能因为冷就猛吃羊肉——会更燥', foods:['银耳','百合','雪梨'] },
    },
    '痰湿质': {
      '华南暖湿': { note:'痰湿+湿热环境——湿上加湿，比本地人更容易困倦、发胖', foods:['薏米','茯苓','陈皮'] },
      '华东湿热': { note:'同上，梅雨季是你最难熬的时候', foods:['薏米','冬瓜','藿香'] },
      '西南阴湿': { note:'阴湿入体最难除，你需要比别人更积极祛湿', foods:['白术','苍术','茯苓'] },
    },
    '湿热质': {
      '华南暖湿': { note:'湿热+湿热——火上浇油，比本地人更容易长痘、口臭、便秘', foods:['绿豆','薏米','苦瓜'] },
      '华东湿热': { note:'同上，夏天对你来说是双重考验', foods:['荷叶','冬瓜','赤小豆'] },
    },
    '气虚质': {
      '青藏高寒': { note:'气虚+高寒缺氧——气更不够用，容易疲劳气喘', foods:['黄芪','党参','红景天'] },
      '西南阴湿': { note:'湿气困脾，脾虚气更虚——恶性循环', foods:['黄芪','山药','白术'] },
    },
    '血瘀质': {
      '东北寒燥': { note:'寒凝血瘀——冷会让你的循环更差', foods:['当归','川芎','红花'] },
      '西北干寒': { note:'同上，寒凝血瘀，冬天尤其难熬', foods:['当归','生姜','桂枝'] },
      '青藏高寒': { note:'高寒缺氧+血瘀——循环不好的人在这里最难受', foods:['红景天','当归','丹参'] },
    },
  };

  const c = conflicts[constitution];
  if (!c || !c[region]) return null;
  return c[region];
}

// 天气偏差 → 调整饮食优先级
function getWeatherDeviationPriority(weather, wylq) {
  if (!weather) return { hasDeviation: false, message: '', priorityEvils: [] };

  const keEvil = wylq.currentQi.keInfo.evil;
  const t = weather.temp;
  const h = weather.humidity;

  if (keEvil === '寒' && t > 20) {
    return { hasDeviation: true, level: 'high', message: `这几天比往年同期暖和不少（${t}°C），该冷的时候不冷——身体容易"上当"。毛孔开了，寒气突然回来就容易感冒。`, priorityEvils: ['风', '热'] };
  }
  if (keEvil === '热' && t < 8) {
    return { hasDeviation: true, level: 'high', message: `这几天比往年同期冷不少（${t}°C），该暖的时候冷——寒热错杂最难将息。既要注意保暖，又不能补过头。`, priorityEvils: ['寒', '风'] };
  }
  if (keEvil === '湿' && h < 45) {
    return { hasDeviation: true, level: 'high', message: `这阵子反常偏干（湿度${h}%），别按常规祛湿了——润燥比祛湿更急。`, priorityEvils: ['燥'] };
  }
  if (keEvil === '燥' && h > 80) {
    return { hasDeviation: true, level: 'high', message: `这阵子反常偏湿（湿度${h}%），燥被湿掩盖了——化湿比润燥更急。`, priorityEvils: ['湿'] };
  }
  if (keEvil === '寒' && t > 12) {
    return { hasDeviation: true, level: 'low', message: `这几天偏暖（${t}°C），比预期的暖和，注意衣服别穿太多捂出汗。`, priorityEvils: ['风'] };
  }
  if (keEvil === '热' && t < 12) {
    return { hasDeviation: true, level: 'low', message: `这几天偏凉（${t}°C），比预期的冷一些，加件衣服就好。`, priorityEvils: ['寒'] };
  }

  return { hasDeviation: false, message: '', priorityEvils: [] };
}

// 综合冲突分析
function getConflictAnalysis(hometownRegion, currentRegion, constitution, weather, wylq) {
  const conflicts = [];

  // 1. 水土不服
  const migrationConflict = getClimateConflict(hometownRegion, currentRegion);
  if (migrationConflict && migrationConflict.level !== 'low') {
    conflicts.push({ type: 'migration', ...migrationConflict });
  }

  // 2. 体质 vs 环境
  const constConflict = getConstitutionEnvConflict(constitution, currentRegion);
  if (constConflict) {
    conflicts.push({ type: 'constitution_env', level: 'medium', ...constConflict });
  }

  // 3. 天气偏差
  if (weather) {
    const dev = getWeatherDeviationPriority(weather, wylq);
    if (dev.hasDeviation) {
      conflicts.push({ type: 'weather_deviation', ...dev });
    }
  }

  // 综合优先级
  const priorityEvils = [];
  conflicts.forEach(c => {
    if (c.priorityEvils) priorityEvils.push(...c.priorityEvils);
    if (c.dietPriority) priorityEvils.push(...c.dietPriority);
  });
  const uniqueEvils = [...new Set(priorityEvils)];

  // 气候饮食文化差异
  const homeFood = REGION_FOOD_CULTURE[hometownRegion];
  const currFood = REGION_FOOD_CULTURE[currentRegion];

  return {
    conflicts,
    priorityEvils: uniqueEvils,
    hasConflict: conflicts.length > 0,
    homeFood,
    currFood,
    foodClash: (homeFood && currFood && homeFood.taste !== currFood.taste) ? {
      home: homeFood,
      current: currFood,
      note: `你从小吃${homeFood.taste}（${homeFood.habit}），现在身在${currFood.taste}的地方——吃老家的习惯不合适，完全照搬当地也可能不适应。`,
    } : null,
  };
}

// 跨文化饮食推荐
const CROSS_CULTURE_FOODS = {
  '清淡、喜煲汤、喜海鲜': {
    '燥': { principle:'你的家乡煲汤习惯是润燥利器——在干燥环境里继续煲起来，但汤料要从祛湿型换成滋润型', foods:['沙参玉竹汤（替代土茯苓汤）','银耳莲子羹','花胶炖奶','生滚鱼片粥','白灼海鲜（清润不燥）'] },
    '寒': { principle:'海鲜偏寒但煲汤可以温补——用姜和胡椒平衡海鲜的寒性', foods:['胡椒猪肚鸡','姜葱炒蟹','当归生姜鱼汤','花雕蛋白蒸蟹','沙姜白切鸡'] },
    '湿': { principle:'你的清淡口味正好适合祛湿——少油少盐是祛湿的基础，继续保持', foods:['薏米冬瓜煲汤','清蒸鱼','白切鸡蘸沙姜','四神汤','陈皮蒸排骨'] },
  },
  '咸鲜、偏甜': {
    '燥': { principle:'红烧偏油，在干燥环境可以保留但减油增润——多用蒸和炖', foods:['清炖狮子头','冰糖炖雪梨','桂花糯米藕','酒酿圆子','莼菜鱼羹'] },
    '寒': { principle:'江南的甜可以中和温补药的燥——红枣桂圆入菜是天然搭配', foods:['红烧羊肉（加萝卜）','姜丝炒米粥','东坡肉（加黄芪）','老姜鸭汤','红糖糍粑'] },
    '湿': { principle:'甜腻助湿，在湿气重的环境要暂时减糖——咸鲜口味可以保留', foods:['盐水鸭','清蒸鲈鱼','雪菜肉丝面','榨菜蛋花汤','葱油拌面（少油版）'] },
  },
  '咸辣': {
    '燥': { principle:'辣在干燥环境是大忌——但家乡的腊味和腌菜（不过辣）可以保留', foods:['莲藕排骨汤（不加辣）','粉蒸肉','蛋酒','葛粉糊','清炒红菜苔'] },
    '寒': { principle:'你的辣正好可以用来驱寒！但要控制在"微辣出汗"的程度', foods:['胡辣汤（少辣多胡椒）','姜辣鸭','老姜肉片汤','羊肉锅（微辣版）','剁椒蒸鱼（少剁椒）'] },
    '湿': { principle:'辣能祛湿，但你家乡的重油做法在湿热环境要调整——减油不减辣', foods:['剁椒鱼头（少油版）','老姜炒肉','紫苏黄瓜','酸豆角肉末','擂辣椒皮蛋'] },
  },
  '麻辣、重油': {
    '燥': { principle:'麻辣在干燥环境等于火上浇油——但泡菜、酸汤、水煮（清汤）是宝藏', foods:['酸萝卜老鸭汤','酸汤鱼（贵州清汤版）','四川泡菜','滑肉汤（清汤）','红糖冰粉（不加辣）'] },
    '寒': { principle:'你的麻辣正好驱寒！但重油要减——改成"麻辣轻油"模式', foods:['麻辣火锅（减油版锅底）','姜汁热窝鸡','水煮牛肉（少油）','酸菜鱼（清汤）','夫妻肺片（少红油）'] },
    '湿': { principle:'麻辣祛湿是最强武器之一，但油大助湿——减油保持麻辣', foods:['酸菜鱼（少油版）','毛血旺（清汤版）','泡椒凤爪','折耳根拌菜','麻辣香锅（少油多菜）'] },
  },
  '咸香': {
    '燥': { principle:'面食炖菜在干燥环境需要加点"润"——多喝汤、面配汤', foods:['羊肉泡馍（多加汤）','清炖狮子头','刀削面（配骨汤）','莜面栲栳栳（蒸制）','山药小米粥'] },
    '寒': { principle:'你的面食+炖菜是天生的抗寒组合，保持！多放姜和葱', foods:['牛肉面（重姜葱版）','羊肉烩面','酸汤水饺','葱花饼配羊汤','大烩菜（加胡椒）'] },
    '湿': { principle:'面食在湿气环境偏滞——可以混入杂粮，炖菜多放祛湿料', foods:['荞面饸饹','杂粮煎饼','莜面鱼鱼','山药茯苓糕','陈皮炖牛肉'] },
  },
  '咸、油大': {
    '燥': { principle:'油大在干燥环境加重燥热——但炖菜和腌菜的"咸"可以生津', foods:['酸菜炖大骨（少油）','小鸡炖蘑菇（去鸡皮）','地三鲜（少油版）','大拉皮（麻酱版）','玉米碴子粥'] },
    '寒': { principle:'你的炖菜基因就是为寒冷而生的！保持重炖，加温补料', foods:['猪肉炖粉条（加肉桂）','铁锅炖大鹅','酸菜白肉锅','酱骨架（加当归）','韭菜盒子'] },
    '湿': { principle:'东北菜在湿气环境偏"滞"——多做炖菜少做烧烤，多放祛湿香料', foods:['小鸡炖蘑菇（加薏米）','鲫鱼炖豆腐','排骨炖豆角（加白胡椒）','大丰收（蘸酱菜）','疙瘩汤'] },
  },
  '咸、酸辣': {
    '燥': { principle:'酸辣在干燥环境伤阴——但新疆的奶制品和干果是润燥宝库', foods:['羊肉抓饭（少油多胡萝卜）','酸奶配核桃','大盘鸡（去辣留香）','馕配奶茶','巴旦木杏仁露'] },
    '寒': { principle:'牛羊肉+面食是天选抗寒组合，酸辣调味恰到好处', foods:['羊肉泡馍（西北版）','牛肉面（清汤重料）','手抓羊肉（配蒜）','胡辣羊蹄','馕坑烤肉'] },
    '湿': { principle:'酸辣能开胃祛湿，但面食偏滞——多喝汤、多吃烤肉（去湿）', foods:['羊肉串（孜然祛湿）','酸汤面片','大盘鸡（多放花椒）','拌面（少面多菜）','酸奶（促消化）'] },
  },
  '咸、奶制品': {
    '燥': { principle:'奶制品和酥油是天生的润燥品，在你的高原饮食里继续保留', foods:['酥油茶','牦牛奶茶','糌粑酥油粥','酸奶拌青稞','酥油蜂蜜拌燕麦'] },
    '寒': { principle:'酥油+牛羊肉是最强抗寒组合，青稞提供持久能量', foods:['酥油茶（多加酥油）','牦牛肉炖萝卜','糌粑（加酥油红糖）','羊肉青稞粥','酥油煎饼'] },
    '湿': { principle:'奶制品偏滋腻，在湿气环境要减量——青稞可以保留', foods:['青稞粥（少酥油）','牦牛肉干（风干去湿）','清茶（少奶）','青稞饼','风干肉配茶'] },
  },
};

function getCrossCultureFoods(homeRegion, currRegion) {
  if (!homeRegion || !currRegion || homeRegion === currRegion) return null;
  const homeCulture = REGION_FOOD_CULTURE[homeRegion];
  if (!homeCulture) return null;

  const keys = Object.keys(CROSS_CULTURE_FOODS);
  let tasteKey = keys.find(k => k === homeCulture.taste);
  if (!tasteKey) {
    tasteKey = keys.find(k => homeCulture.taste.includes(k) || k.includes(homeCulture.taste));
  }
  const cultureData = CROSS_CULTURE_FOODS[tasteKey] || CROSS_CULTURE_FOODS['咸香'];

  let challenge = '湿';
  if (currRegion.includes('燥')) challenge = '燥';
  else if (currRegion.includes('寒') && !currRegion.includes('湿')) challenge = '寒';
  else if (currRegion.includes('湿')) challenge = '湿';
  else if (currRegion.includes('热') || currRegion.includes('暖')) challenge = '湿';

  const advice = cultureData[challenge] || Object.values(cultureData)[0];
  return {
    homeTaste: homeCulture.taste,
    homeHabit: homeCulture.habit,
    currRegion,
    challenge,
    principle: advice.principle,
    foods: advice.foods,
  };
}

// ========== 云函数入口 ==========
exports.main = async (event, context) => {
  const { action } = event;

  try {
    if (action === 'climateConflict') {
      const { fromRegion, toRegion } = event;
      return { success: true, data: getClimateConflict(fromRegion, toRegion) };
    }

    if (action === 'constitutionEnv') {
      const { constitution, region } = event;
      return { success: true, data: getConstitutionEnvConflict(constitution, region) };
    }

    if (action === 'weatherDeviation') {
      const { weather, wylq } = event;
      return { success: true, data: getWeatherDeviationPriority(weather, wylq) };
    }

    if (action === 'crossCulture') {
      const { homeRegion, currRegion } = event;
      return { success: true, data: getCrossCultureFoods(homeRegion, currRegion) };
    }

    // 默认：综合冲突分析
    const { hometownRegion, currentRegion, constitution, weather, wylq } = event;
    const result = getConflictAnalysis(hometownRegion, currentRegion, constitution, weather, wylq);
    return { success: true, data: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
