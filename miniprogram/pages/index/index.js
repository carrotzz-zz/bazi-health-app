const app = getApp();
const baziCalc = require('../../services/baziCalc');
const dailyCard = require('../../services/dailyCard');

Page({
  data: {
    loading: true,
    card: null,
    weekForecast: [],
    activeIndex: 0,
  },

  onLoad() {
    this.fetchCard();
  },

  onShow() {
    if (!this.data.card) {
      this.fetchCard();
    }
  },

  _animateIn() {
    const self = this;
    setTimeout(function () {
      self.setData({ pageIn: true });
    }, 80);
  },

  async fetchCard() {
    const user = app.globalData.userProfile;
    if (!user || !user.year) {
      this.setData({ loading: false });
      return;
    }

    try {
      const savedLoc = app.globalData.savedLocation;
      if (!savedLoc || savedLoc.lat == null) {
        this.setData({ loading: false });
        wx.showModal({
          title: '需要位置信息',
          content: '获取天气需要选择您所在的城市。请前往设置页设置。',
          confirmText: '去设置',
          success: (res) => { if (res.confirm) wx.navigateTo({ url: '/pages/setup/setup' }); }
        });
        return;
      }
      const lat = savedLoc.lat;
      const lon = savedLoc.lon;
      console.log('[location] using saved:', savedLoc.name);

      let baziData = app.globalData.baziCache;
      if (!baziData) {
        baziData = baziCalc.calculate({
          year: user.year, month: user.month, day: user.day,
          hour: user.hour, minute: user.minute || 0, gender: user.gender,
        });
        app.globalData.baziCache = baziData;
      }

      const today = new Date();
      const card = await dailyCard.calculate(
        baziData,
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate(),
        lat, lon
      );

      // daysData 存 page 实例上，不进 data（避免传给渲染层）
      this._daysData = card.daysData;
      delete card.daysData;

      this.setData({
        card: card,
        weekForecast: card.weekForecast,
        activeIndex: 0,
        loading: false,
      });

      this._animateIn();
    } catch (e) {
      console.error('fetchCard error:', e);
      this.setData({ loading: false });
    }
  },

  onDayTap(e) {
    const idx = e.currentTarget.dataset.index;
    if (idx === this.data.activeIndex) return;

    const dayData = this._daysData && this._daysData[idx];
    if (!dayData) return;

    // 更新预报条高亮
    const weekForecast = this.data.weekForecast.map(function (wf) {
      return Object.assign({}, wf, { isActive: wf.index === idx });
    });

    // 用数据路径逐条更新，触发可靠渲染
    this.setData({
      'card.dateStr': dayData.dateStr,
      'card.emotionDesc': dayData.emotionDesc,
      'card.shichenTip': dayData.shichenTip,
      'card.clothing': dayData.clothing,
      'card.recommendation': dayData.recommendation,
      'card.quote': dayData.quote,
      'card.weather.daily': dayData.weather,
      activeIndex: idx,
      weekForecast: weekForecast,
    });
  },

  goSetup() {
    wx.navigateTo({ url: '/pages/setup/setup' });
  },
});
