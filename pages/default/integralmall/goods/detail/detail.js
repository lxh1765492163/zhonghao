// pages/integralmall/goods/detail/detail.js
var siteInfo = require('../../../../../config.js');
var js = require('../../../../../vendor/app.js');
var WxParse = require('../../../../../vendor/wxParse/wxParse.js');
var util = require('../../../../../utils/util.js');
var app = getApp();
Page({

      /**
       * 页面的初始数据
       */
      data: {
            cid: 0,
            data: {},
            selected: [],
            num: 1,
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            const that = this;
            var id = options.id;
            that.setData({
                  id: id,
            })
            that.getdata();
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

      getdata: function () {
            const that = this;
            wx.showLoading({
                  title: '',
                  mask: true,
            })
            app.util.getUserInfo(function () {
                  var userInfo = wx.getStorageSync("userInfo")
                  app.util.request({
                        url: 'entry&m=ewei_shopv2&do=mobile&r=creditshop.xcx.detail',
                        method: 'GET',
                        data: {
                              i: siteInfo.uniacid,
                              id: that.data.id,
                              openid: userInfo.openid,
                        },
                        header: {
                              'Accept': 'application/json'
                        },
                        success: function (res) {
                              wx.hideLoading();
                              var credit = parseInt(res.data.credit);
                              that.setData({
                                    data: res.data,
                                    credit: credit,
                                    total: res.data.goods.total
                              })
                              WxParse.wxParse('goodsdetail', 'html', res.data.goods.goodsdetail, that, 5);
                              if (res.data.goods.istime == 1) {
                                    var nowtime = Date.parse(new Date()) / 1000;
                                    var timeend = parseInt(res.data.goods.timeend);
                                    var counttime = timeend - nowtime;
                                    that.setData({
                                          counttime: counttime,
                                    })
                                    if (that.data.counttime >= 0) {
                                          setInterval(function () {
                                                var counttime = that.data.counttime - 1
                                                var day = Math.floor(counttime / 24 / 3600)
                                                var hour = Math.floor((counttime - day * 3600 * 24) / 3600);
                                                var minute = Math.floor((counttime - day * 3600 * 24 - hour * 3600) / 60);
                                                var second = counttime - day * 3600 * 24 - hour * 3600 - minute * 60;
                                                that.setData({
                                                      counttime: counttime,
                                                      day: day,
                                                      hour: hour,
                                                      minute: minute,
                                                      second: second,
                                                })
                                          }.bind(that), 1000)
                                    }
                                    else {
                                          return
                                    }
                              }
                        }
                  })
            })
      },

      selected: function (e) {
            var cid = e.currentTarget.dataset.cid
            this.setData({
                  cid: cid,
            })
      },

      showmodal: function () {
            var animation = wx.createAnimation({
                  duration: 500,
                  timingFunction: "linear",
                  delay: 0
            })
            this.animation = animation
            animation.translateY(-370).step()
            this.setData({
                  animationData: animation.export(),
                  showModalStatus: true
            })
      },

      hidemodal: function () {
            var animation = wx.createAnimation({
                  duration: 500,
                  timingFunction: "linear",
                  delay: 0
            })
            this.animation = animation
            animation.translateY(370).step()
            this.setData({
                  animationData: animation.export(),
                  showModalStatus: false
            })
      },

      choicespec: function (e) {
            var tid = e.currentTarget.dataset.tid;
            var index = e.currentTarget.dataset.index;
            var src = e.currentTarget.dataset.src;
            var data = this.data.data
            var selected = this.data.selected;
            selected[index] = tid;
            data.specs[index].selected = tid
            this.setData({
                  src: src,
                  data: data,
                  selected: selected,
            })
            var specs = this.data.data.specs;
            if (selected.length == specs.length) {
                  var choosespecs = selected.join("_")
                  for (var i = 0; i < this.data.data.options.length; i++) {
                        if (choosespecs == this.data.data.options[i].specs) {
                              var specsid = this.data.data.options[i].id
                              var total = this.data.data.options[i].total
                              if (total <= 0) {
                                    wx.showToast({
                                          title: '该规格已售罄',
                                          icon: 'loading'
                                    })
                              }
                              this.setData({
                                    specsid: specsid,
                                    total: total,
                                    num:1,
                              })
                        }
                  }
            }
      },

      exchange: function (e) {
            console.log(this.data)
            if (this.data.specsid || this.data.data.options == null) {
                  if (this.data.total > 0) {
                        wx.navigateTo({
                              url: '../../order/order?id=' + this.data.id + '&sid=' + this.data.specsid
                        })
                  } else {
                        wx.showToast({
                              title: '该规格已售罄',
                              icon: 'loading'
                        })
                  }
            } else {
                  wx.showToast({
                        title: '请选择商品规格',
                        icon: 'loading'
                  })
            }
      },

      addnum: function () {
            var num = this.data.num
            this.setData({
                  num: num + 1
            })
      },

      reducenum: function () {
            var num = this.data.num
            if (num==1){num=2}
            this.setData({
                  num: num - 1
            })
      },
      gocart: function () {
        wx.navigateTo({
          url: '../../cart/cart',
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