// zh_jd/pages/logs/rurle.js
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
    console.log(options)
    if (options.id == 1) {
      app.util.request({
          'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGetplatform',
        'cachetime': '0',
        success: function (res) {
          console.log(res)
          that.setData({
            rurle: res.data.jf_rule,
          })
        },
      })
      wx.setNavigationBarTitle({
        title: '积分规则'
      })
    }else{
      app.util.request({
          'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGetplatform',
        'cachetime': '0',
        success: function (res) {
          console.log(res)
          that.setData({
            rurle: res.data.hy_rule,
          })
        },
      })
      wx.setNavigationBarTitle({
        title: '会员规则'
      })
    }

    // 平台基本信息
    // app.util.request({
    //   'url': 'entry/wxapp/getplatform',
    //   'cachetime': '0',
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       rurle: res.data.jf_rule,
    //     })
    //   },
    // })
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