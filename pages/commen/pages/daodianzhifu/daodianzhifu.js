// pages/daodianzhifu/daodianzhifu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    fouhidden: true
  },
  click1: function () {
    this.setData({ hidden: false, fouhidden: true })
  },
  click2: function () {
    this.setData({ hidden: true, fouhidden: false })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //  获取平台信息
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
  }
})