// pages/integralmall/goods/list/list.js
var js = require('../../../../../vendor/app.js')
var siteInfo = require('../../../../../config.js');

var app = getApp();

Page({

      /**
       * 页面的初始数据
       */
      data: {
            name: '',
            cate: '',
            keywords: '',
            show: false,
            tabbar: [
              { pagePath: 'icon-home', text: '首页', id: 0, url: '/pages/default/integralmall/index/index' },
              { pagePath: 'icon-list', text: '全部商品', id: 1, url: '/pages/default/integralmall/goods/list/list' },
              { pagePath: 'icon-people', text: '我的', id: 2, url: '/pages/default/integralmall/person/person' },
            ],
            id: 1
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            var that = this;
            var cate = options.id;
            var name = options.name;
            that.setData({
                  cate: cate,
                  name: name,
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

/**
 * 请求商品列表
 */
      getlist: function () {
            var that = this;
            wx.showLoading({
                  title: '加载中...',
            })
            // app.util.getUserInfo(function () {
            app.util.request({
                  url: 'entry&m=ewei_shopv2&do=mobile&r=creditshop.xcx.lists',
                  method: 'GET',
                  data: {
                        i: siteInfo.uniacid,
                        cate: that.data.cate,
                        keywords: that.data.keywords,
                  },
                  success: function (res) {
                        wx.hideLoading();
                        that.setData({
                              data: res.data,
                        })
                  }
            })
            // })
      },

      /**
       * 底部导航
       */

      tabbar: function (res) {
            var id = res.currentTarget.dataset.id;
            var url = this.data.tabbar[id].url;
            wx.reLaunch({
                  url: url
            })
      },

      /**
       * 选择分类
       */
      selected: function (res) {
            var name = res.currentTarget.dataset.name;
            var cate = res.currentTarget.dataset.cate;
            this.setData({
                  cate: cate,
                  name: name,
                  show: false,
            })
            this.getlist();
      },
      show: function () {
            var show = this.data.show;
            this.setData({
                  show: !show,
            })
      },

      /**
       * 搜索
       */

      search: function (res) {
            var input = res.detail.value
            console.log(input)
            this.setData({
                  keywords: input,
            })
            this.getlist();
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