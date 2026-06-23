// ========== 中医体质测评 · 云函数 ==========
// 迁移自吾乡帖 js/quiz.js，去除 DOM 依赖
// 支持 action: 'questions' | 'submit'

// ========== 体质测评：28题 × 9组 ==========
const constGroups = [
  {
    key:"平和质", label:"😊 平和相关",
    questions: [
      { key:"ph1", text:"您精力充沛，很少感到疲劳吗？" },
      { key:"ph2", text:"您面色红润、气色好吗？" },
      { key:"ph3", text:"您睡眠质量好吗？很少失眠？" },
      { key:"ph4", text:"您适应能力（换季、出差等）强吗？" },
    ],
  },
  {
    key:"气虚质", label:"😮‍💨 气虚相关",
    questions: [
      { key:"qx1", text:"您容易疲乏、总想休息吗？" },
      { key:"qx2", text:"您说话声音低弱无力吗？" },
      { key:"qx3", text:"您稍微活动就容易出汗吗？" },
    ],
  },
  {
    key:"阳虚质", label:"🥶 阳虚相关",
    questions: [
      { key:"yx1", text:"您比别人怕冷、手脚发凉吗？" },
      { key:"yx2", text:"您吃凉的或生冷食物肠胃会不舒服吗？" },
      { key:"yx3", text:"您冬天比别人穿得多还是觉得冷吗？" },
    ],
  },
  {
    key:"阴虚质", label:"🔥 阴虚相关",
    questions: [
      { key:"yinx1", text:"您手心脚心发热、下午容易潮热吗？" },
      { key:"yinx2", text:"您口干舌燥、总想喝水吗？" },
      { key:"yinx3", text:"您大便干结、容易便秘吗？" },
    ],
  },
  {
    key:"痰湿质", label:"💨 痰湿相关",
    questions: [
      { key:"ts1", text:"您感觉身体沉重、像裹了湿布一样不爽快吗？" },
      { key:"ts2", text:"您腹部松软、比同龄人容易发胖吗？" },
      { key:"ts3", text:"您嗓子总觉得有痰或黏腻感吗？" },
    ],
  },
  {
    key:"湿热质", label:"🌡 湿热相关",
    questions: [
      { key:"sr1", text:"您面部或头发容易出油吗？" },
      { key:"sr2", text:"您口苦、口臭或口腔有异味吗？" },
      { key:"sr3", text:"您大便粘滞、冲不干净马桶吗？" },
    ],
  },
  {
    key:"血瘀质", label:"🩸 血瘀相关",
    questions: [
      { key:"xyu1", text:"您身上容易出现瘀斑（青一块紫一块）吗？" },
      { key:"xyu2", text:"您面色或口唇偏暗、没有光泽吗？" },
      { key:"xyu3", text:"您身体某处有固定的刺痛感吗？" },
    ],
  },
  {
    key:"气郁质", label:"😔 气郁相关",
    questions: [
      { key:"qy1", text:"您经常觉得闷闷不乐、情绪低落吗？" },
      { key:"qy2", text:"您容易紧张、焦虑不安吗？" },
      { key:"qy3", text:"您两胁胀痛或乳房胀痛吗（与情绪相关）？" },
    ],
  },
  {
    key:"特禀质", label:"🤧 特禀相关",
    questions: [
      { key:"tb1", text:"您容易过敏（药物、食物、花粉等）吗？" },
      { key:"tb2", text:"您有过敏性鼻炎、哮喘或皮肤荨麻疹吗？" },
      { key:"tb3", text:"您换季或换环境时容易打喷嚏、流鼻涕吗？" },
    ],
  },
];

// 体质大白话
const CONST_PLAIN = {
  '平和质': '体质均衡，继续保持',
  '气虚质': '容易累、气不够用——像手机电量总在20%以下，需要"充电"',
  '阳虚质': '怕冷、火力不足——像冬天暖气不够热，需要"加温"',
  '阴虚质': '身体水分不足——像锅里的水快烧干了，需要"加水"',
  '痰湿质': '代谢慢、湿气重——像排水管堵了，需要"疏通"',
  '湿热质': '又湿又热——像闷热的桑拿天，需要"清热除湿"',
  '血瘀质': '循环不畅——像水管有沉积物，需要"活血"',
  '气郁质': '气机不顺，容易闷——像琴弦绷太紧，需要"疏解"',
  '特禀质': '天生敏感——像对花粉灰尘都起反应的猫，需要"保护"',
};

// ========== 体质判定 ==========
function determineConstitution(answers) {
  // answers: { "ph1": 3, "ph2": 4, ... }  值 1-5
  const scores = {};
  constGroups.forEach(g => {
    let total = 0, count = 0;
    g.questions.forEach(q => {
      const val = answers[q.key];
      if (val != null) { total += val; count++; }
    });
    scores[g.key] = count > 0 ? total / count : 1;
  });

  const phAvg = scores["平和质"];

  // 全低分检测
  const allAvgs = Object.values(scores);
  const maxAvg = Math.max(...allAvgs);
  if (maxAvg < 2) {
    return { primary: null, scores, lowQuality: true };
  }

  // 平和质 = 积极诊断
  const otherAvgs = Object.entries(scores).filter(([k]) => k !== "平和质").map(([,v]) => v);
  const otherMax = Math.max(...otherAvgs);
  if (phAvg >= 3.5 && otherMax < 2.5) {
    return { primary: "平和质", secondary: null, scores, isBalanced: true };
  }

  // 偏颇质判定
  let primary = "平和质", maxS = 0;
  for (let [k, v] of Object.entries(scores)) {
    if (k === "平和质") continue;
    if (v > maxS) { maxS = v; primary = k; }
  }
  let secondary = null, s2 = 0;
  for (let [k, v] of Object.entries(scores)) {
    if (k === "平和质" || k === primary) continue;
    if (v >= 2.5 && v > s2) { s2 = v; secondary = k; }
  }

  return {
    primary,
    secondary,
    scores,
    isBalanced: false,
    primaryDesc: CONST_PLAIN[primary] || '',
    secondaryDesc: secondary ? CONST_PLAIN[secondary] || '' : '',
  };
}

// ========== 云函数入口 ==========
exports.main = async (event, context) => {
  const { action, answers } = event;

  try {
    if (action === 'submit') {
      // 提交测评答案
      if (!answers) {
        return { success: false, error: '缺少 answers 参数' };
      }
      const result = determineConstitution(answers);
      return { success: true, data: result };
    }

    // 默认：返回题目列表
    const questions = constGroups.map(g => ({
      key: g.key,
      label: g.label,
      questions: g.questions,
    }));
    return { success: true, data: { questions, constPlain: CONST_PLAIN } };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
