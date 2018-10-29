// pages/default/integralmall/logs/logs.js
var js = require('../../../../vendor/app.js')
var siteInfo = require('../../../../config.js');
var time = require('../../../../utils/util.js')
var app = getApp();

Page({

      /**
       * 页面的初始数据
       */
      data: {
            pagesize: 8,
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            var that = this
            var credit = options.credit
            that.setData({
                  credit: credit
            })
            that.getlist();
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

      getlist: function () {
            var that = this
            wx.showLoading({
                  title: '加载中...',
                  mask: true,
            })
            app.util.getUserInfo(function () {
                  var userInfo = wx.getStorageSync("userInfo")
                  app.util.request({
                        url: 'entry&m=ewei_shopv2&do=mobile&r=creditshop.xcx.listlog',
                        method: 'GET',
                        data: {
                              openid: userInfo.openid,
                              i: siteInfo.uniacid,
                              pagesize: that.data.pagesize,
                        },
                        success: function (res) {
                              wx.hideLoading();
                              console.log(res)
                              for (var i = 0; i < res.data.list.length; i++) {
                                    res.data.list[i].createtime = time.formatTime(res.data.list[i].createtime, 'Y/M/D h:m:s')
                              }
                              if (res.data.list.length == that.data.listlength) {
                                    wx.showToast({
                                          title: '呵呵！没了',
                                          icon: 'none'
                                    })
                              }
                              that.setData({
                                    list: res.data.list,
                                    listlength: res.data.list.length,
                              })
                              console.log(that.data.list)
                        }
                  })
            })
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
            var pagesize = this.data.pagesize
            this.setData({
                  pagesize: pagesize + 5,
            })
            this.getlist();
      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function () {

      }
})