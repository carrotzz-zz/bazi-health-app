const app = getApp();

// 体质问卷题目（复用吾乡帖）
const CONST_GROUPS = [
  {
    key: '平和质', label: '😊 平和相关',
    questions: [
      { key: 'ph1', text: '您精力充沛，很少感到疲劳吗？' },
      { key: 'ph2', text: '您面色红润、气色好吗？' },
      { key: 'ph3', text: '您睡眠质量好吗？很少失眠？' },
      { key: 'ph4', text: '您适应能力（换季、出差等）强吗？' },
    ],
  },
  {
    key: '气虚质', label: '😮‍💨 气虚相关',
    questions: [
      { key: 'qx1', text: '您容易疲乏、总想休息吗？' },
      { key: 'qx2', text: '您说话声音低弱无力吗？' },
      { key: 'qx3', text: '您稍微活动就容易出汗吗？' },
    ],
  },
  {
    key: '阳虚质', label: '🥶 阳虚相关',
    questions: [
      { key: 'yx1', text: '您比别人怕冷、手脚发凉吗？' },
      { key: 'yx2', text: '您吃凉的或生冷食物肠胃会不舒服吗？' },
      { key: 'yx3', text: '您冬天比别人穿得多还是觉得冷吗？' },
    ],
  },
  {
    key: '阴虚质', label: '🔥 阴虚相关',
    questions: [
      { key: 'yinx1', text: '您手心脚心发热、下午容易潮热吗？' },
      { key: 'yinx2', text: '您口干舌燥、总想喝水吗？' },
      { key: 'yinx3', text: '您大便干结、容易便秘吗？' },
    ],
  },
  {
    key: '痰湿质', label: '💨 痰湿相关',
    questions: [
      { key: 'ts1', text: '您感觉身体沉重、像裹了湿布一样不爽快吗？' },
      { key: 'ts2', text: '您腹部松软、比同龄人容易发胖吗？' },
      { key: 'ts3', text: '您嗓子总觉得有痰或黏腻感吗？' },
    ],
  },
  {
    key: '湿热质', label: '🌡 湿热相关',
    questions: [
      { key: 'sr1', text: '您面部或头发容易出油吗？' },
      { key: 'sr2', text: '您口苦、口臭或口腔有异味吗？' },
      { key: 'sr3', text: '您大便粘滞、冲不干净马桶吗？' },
    ],
  },
  {
    key: '血瘀质', label: '🩸 血瘀相关',
    questions: [
      { key: 'xyu1', text: '您身上容易出现瘀斑（青一块紫一块）吗？' },
      { key: 'xyu2', text: '您面色或口唇偏暗、没有光泽吗？' },
      { key: 'xyu3', text: '您身体某处有固定的刺痛感吗？' },
    ],
  },
  {
    key: '气郁质', label: '😔 气郁相关',
    questions: [
      { key: 'qy1', text: '您经常觉得闷闷不乐、情绪低落吗？' },
      { key: 'qy2', text: '您容易紧张、焦虑不安吗？' },
      { key: 'qy3', text: '您两胁胀痛或乳房胀痛吗（与情绪相关）？' },
    ],
  },
  {
    key: '特禀质', label: '🤧 特禀相关',
    questions: [
      { key: 'tb1', text: '您容易过敏（药物、食物、花粉等）吗？' },
      { key: 'tb2', text: '您有过敏性鼻炎、哮喘或皮肤荨麻疹吗？' },
      { key: 'tb3', text: '您换季或换环境时容易打喷嚏、流鼻涕吗？' },
    ],
  },
];

function buildGroups(scores) {
  return CONST_GROUPS.map(g => {
    const questions = g.questions.map(q => ({
      ...q,
      score: (scores && scores[q.key]) || 1,
    }));
    const avg = questions.reduce((s, q) => s + q.score, 0) / questions.length;
    let status = 'low', statusText = '— 不明显';
    if (avg >= 3.5) { status = 'high'; statusText = '✓ 明显'; }
    else if (avg >= 2.5) { status = 'mid'; statusText = '△ 有倾向'; }
    return { ...g, questions, status, statusText };
  });
}

function computeScores(groups) {
  const scores = {};
  groups.forEach(g => {
    g.questions.forEach(q => { scores[q.key] = q.score; });
  });
  return scores;
}

function determineConstitution(scores) {
  const groupAvgs = {};
  CONST_GROUPS.forEach(g => {
    let total = 0;
    g.questions.forEach(q => { total += scores[q.key] || 1; });
    groupAvgs[g.key] = total / g.questions.length;
  });

  const phAvg = groupAvgs['平和质'];
  const otherAvgs = Object.entries(groupAvgs).filter(([k]) => k !== '平和质').map(([, v]) => v);
  const otherMax = Math.max(...otherAvgs);

  if (phAvg >= 3.5 && otherMax < 2.5) return { primary: '平和质', secondary: null, isBalanced: true, groupAvgs };

  let primary = '平和质', maxS = 0;
  for (const [k, v] of Object.entries(groupAvgs)) {
    if (k === '平和质') continue;
    if (v > maxS) { maxS = v; primary = k; }
  }
  let secondary = null, s2 = 0;
  for (const [k, v] of Object.entries(groupAvgs)) {
    if (k === '平和质' || k === primary) continue;
    if (v >= 2.5 && v > s2) { s2 = v; secondary = k; }
  }

  return { primary, secondary, isBalanced: false, groupAvgs };
}

Page({
  data: {
    birthDate: '',
    birthTime: '',
    gender: '男',
    today: '',
    groups: buildGroups(),
    saved: false,
    showQuiz: false,
    region: [],
    regionName: '',
    locationStatus: '',
    locOk: false,
  },

  _locResolve: null,
  _locReject: null,

  onLoad() {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    this.setData({ today });

    // 回填已有数据
    const user = app.globalData.userProfile;
    if (user && user.year) {
      const d = `${user.year}-${String(user.month).padStart(2, '0')}-${String(user.day).padStart(2, '0')}`;
      const t = `${String(user.hour).padStart(2, '0')}:${String(user.minute || 0).padStart(2, '0')}`;
      this.setData({ birthDate: d, birthTime: t, gender: user.gender || '男' });
    }
    if (app.globalData.constitutionResult) {
      this.setData({ groups: buildGroups(app.globalData.constitutionResult.scores) });
    }
    // 回填已保存位置
    const loc = app.globalData.savedLocation;
    if (loc) {
      this.setData({ regionName: loc.name || '', locationStatus: '✓ 已保存: ' + loc.name, locOk: true });
    }
  },

  onDateChange(e) {
    this.setData({ birthDate: e.detail.value, saved: false });
  },

  onTimeChange(e) {
    this.setData({ birthTime: e.detail.value, saved: false });
  },

  setGender(e) {
    this.setData({ gender: e.currentTarget.dataset.v, saved: false });
  },

  onRegionChange(e) {
    const val = e.detail.value; // ['广东省','广州市','天河区']
    const name = val[0] + ' ' + val[1];
    this.setData({ region: val, regionName: name, locationStatus: '查询坐标中...', locOk: false });
    const self = this;
    this._locPromise = new Promise((resolve, reject) => {
      self._locResolve = resolve;
      self._locReject = reject;
    });
    wx.request({
      url: 'https://geocoding-api.open-meteo.com/v1/search',
      data: { name: val[1] + ' ' + val[0], count: 1, language: 'zh' },
      success(res) {
        if (res.data && res.data.results && res.data.results.length) {
          const r = res.data.results[0];
          self._saveLocation(name, r.latitude, r.longitude);
        } else {
          // 降级：只用城市查
          wx.request({
            url: 'https://geocoding-api.open-meteo.com/v1/search',
            data: { name: val[1], count: 1, language: 'zh' },
            success(res2) {
              if (res2.data && res2.data.results && res2.data.results.length) {
                const r2 = res2.data.results[0];
                self._saveLocation(name, r2.latitude, r2.longitude);
              } else {
                self.setData({ locationStatus: '未找到坐标，请重试', locOk: false });
                if (self._locReject) { self._locReject(); self._locResolve = null; self._locReject = null; }
              }
            },
            fail() {
              self.setData({ locationStatus: '查询失败，请重试', locOk: false });
              if (self._locReject) { self._locReject(); self._locResolve = null; self._locReject = null; }
            }
          });
        }
      },
      fail() {
        self.setData({ locationStatus: '查询失败，请检查网络', locOk: false });
        if (self._locReject) { self._locReject(); self._locResolve = null; self._locReject = null; }
      }
    });
  },

  _saveLocation(name, lat, lon) {
    const loc = { name, lat, lon };
    app.globalData.savedLocation = loc;
    wx.setStorageSync('savedLocation', loc);
    this.setData({ locationStatus: '✓ 已保存: ' + name, locOk: true });
    if (this._locResolve) { this._locResolve(); this._locResolve = null; this._locReject = null; }
  },

  toggleQuiz() {
    this.setData({ showQuiz: !this.data.showQuiz });
  },

  onSlide(e) {
    const { group, qkey } = e.currentTarget.dataset;
    const score = e.detail.value;
    const groups = this.data.groups.map(g => {
      if (g.key !== group) return g;
      const questions = g.questions.map(q =>
        q.key === qkey ? { ...q, score } : q
      );
      const avg = questions.reduce((s, q) => s + q.score, 0) / questions.length;
      let status = 'low', statusText = '— 不明显';
      if (avg >= 3.5) { status = 'high'; statusText = '✓ 明显'; }
      else if (avg >= 2.5) { status = 'mid'; statusText = '△ 有倾向'; }
      return { ...g, questions, status, statusText };
    });
    this.setData({ groups, saved: false });
  },

  async onSave() {
    const { birthDate, birthTime, gender } = this.data;
    if (!birthDate) {
      wx.showToast({ title: '请选择出生日期', icon: 'none' });
      return;
    }

    // 等待位置查询完成
    if (this._locPromise) {
      try { await this._locPromise; } catch (e) {}
      this._locPromise = null;
    }

    const [y, m, d] = birthDate.split('-').map(Number);
    const [h, min] = (birthTime || '12:00').split(':').map(Number);

    app.globalData.userProfile = { year: y, month: m, day: d, hour: h, minute: min, gender };
    app.globalData.baziCache = null; // 清除旧的排盘缓存

    const scores = computeScores(this.data.groups);
    const result = determineConstitution(scores);
    app.globalData.constitutionResult = result;

    // 持久化到本地
    wx.setStorageSync('userProfile', app.globalData.userProfile);
    wx.setStorageSync('constitutionResult', result);

    this.setData({ saved: true });
    wx.showToast({ title: '已保存', icon: 'success' });
    setTimeout(() => { wx.navigateBack(); }, 800);
  },
});
