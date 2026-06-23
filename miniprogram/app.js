App({
  globalData: {
    userProfile: null,
    baziCache: null,
    constitutionResult: null,
    savedLocation: null,
  },

  onLaunch() {
    const profile = wx.getStorageSync('userProfile');
    if (profile) this.globalData.userProfile = profile;

    const constResult = wx.getStorageSync('constitutionResult');
    if (constResult) this.globalData.constitutionResult = constResult;

    const loc = wx.getStorageSync('savedLocation');
    if (loc) this.globalData.savedLocation = loc;
  },
});
