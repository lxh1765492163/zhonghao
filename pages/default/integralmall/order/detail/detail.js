// pages/default/integralmall/order/detail/detail.js
var siteInfo = require('../../../../../config.js');
var time = require('../../../../../utils/util.js')
var app = getApp();
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
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    app.util.getUserInfo(function () {
      var userInfo = wx.getStorageSync("userInfo")
      app.util.request({
        url: 'entry&m=ewei_shopv2&do=mobile&r=creditshop.xcx.logdetail',
        method: 'GET',
        data: {
          openid: userInfo.openid,
          id: options.id
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res)
          var createtime = time.formatTime(res.data.order.createtime, 'Y/M/D h:m:s')
          var timesend = time.formatTime(res.data.order.time_send, 'Y/M/D h:m:s')
          var timefinish = time.formatTime(res.data.order.time_finish, 'Y/M/D h:m:s')
          that.setData({
            order: res.data.order,
            createtime: createtime,
            timesend: timesend,
            timefinish: timefinish
          })
        }
      })
    })
  },
  collect: function () {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=creditshop.xcx.finishcommodity',
      method: 'GET',
      data: {
        openid: that.data.order.openid,
        id: that.data.order.id
      },
      success: function (res) {
        wx.hideLoading();
        // console.log(res)
        wx.showToast({
          title: res.data.suc,
          icon: 'none',
          duration: 0,
          mask: true,
          success: function(res) {
            wx.reLaunch({
              url: '../order',
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }
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