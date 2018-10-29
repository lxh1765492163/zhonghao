// pages/integralmall/index/index.js
var js = require('../../../../vendor/app.js')
var siteInfo = require('../../../../config.js');

var app = getApp();
Page({

      /**
       * 页面的初始数据
       */
      data: {
            tabbar: [
                  { pagePath: 'icon-home', text: '首页', id: 0, url: '/pages/default/integralmall/index/index' },
                  { pagePath: 'icon-list', text: '全部商品', id: 1, url: '/pages/default/integralmall/goods/list/list' },
                  { pagePath: 'icon-people', text: '我的', id: 2, url: '/pages/default/integralmall/person/person' },
            ],
            id: 0,
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            const that = this;
            wx.showLoading({
                  title: '加载中...',
            })
            app.util.getUserInfo(function () {
                  var userInfo = wx.getStorageSync("userInfo")
                  app.util.request({
                        url: 'entry&m=ewei_shopv2&do=mobile&r=creditshop.xcx',
                        method: 'GET',
                        data: {
                              i: siteInfo.uniacid,
                              openid: userInfo.openid,
                        },
                        header: {
                              'Accept': 'application/json'
                        },
                        success: function (res) {
                              wx.hideLoading();
                              that.setData({
                                    data: res.data,
                              })
                        }
                  })
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

      tabbar: function (res) {
            var id = res.currentTarget.dataset.id;
            var url = this.data.tabbar[id].url;
            wx.reLaunch({
                  url: url
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

      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function () {

      }
})