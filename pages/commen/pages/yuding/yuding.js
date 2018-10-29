// pages/yuding/yuding.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  home:function(){
    wx.switchTab({
      url: '../shouye/shouye'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: wx.getStorageSync('platform_color'),
        animation: {
          duration: 0,
          timingFunc: 'easeIn'
        }
      })
      var store = wx.getStorageSync('store')
      var url = wx.getStorageSync('url')
      var ewm_logo = store.ewm_logo
      console.log(options)
      that.setData({
        hotel_name: options.hotel_name,
        start_time: options.start_time,
        end_time: options.end_time,
        room_name: options.room_name,
        day: options.day,
        url: url,
        ewm_logo: ewm_logo,
        money: options.money
      }),
      app.util.request({
          'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageSeller',
        'cachetime': '0',
        success: function (res) {
          console.log(res)
          that.setData({
            seller: res.data
          })
        },
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})