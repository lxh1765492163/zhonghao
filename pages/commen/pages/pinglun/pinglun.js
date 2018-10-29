// pinglun.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
    var user_info = wx.getStorageSync('user_info')
    console.log(options)
    app.util.request({
        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageAssessList',
      'cachetime': '0',
      data: { seller_id: options.seller_id },
      success: function (res) {
        console.log(res.data)
        that.setData({
          assesslist: res.data
        })
      },
    })
    // 获取酒店信息
    app.util.request({
        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageSeller',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          seller: res.data,
          user_info: user_info
        })
        // 获取评价信息
        console.log(that.data)
        
        
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