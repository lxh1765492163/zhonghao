const app = getApp()
const siteInfo = require('../../../../config.js');
Page({

      /**
       * 页面的初始数据
       */
      data: {
            items: null,
            title: "当前余额：",
            credit: 0,
            acts: 0,
            payinfo: 0
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            this.views();
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

      },

      views: function () {
            const that = this
            wx.showLoading({
              title: '加载中...',
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
            app.util.getUserInfo(function () {
                  var userInfo = wx.getStorageSync("userInfo")
                  app.util.request({
                        url: 'entry/ewei_shopv2/mobile&r=member.recharge.get_main',
                        data: {
                              i: siteInfo.uniacid,
                              openid: userInfo.openid,
                              xcx: 'xcx'
                        },
                        success: function (res) {
                              that.setData({
                                    items: res.data,
                                    openid: userInfo.openid,
                              })
                              wx.hideLoading();
                        },
                        fail: function (res) {
                              console.log(res)
                              wx.hideLoading();
                        }
                  })
            })
      },

      formPost: function (e) {
            var d = e.detail.value
            const that = this
            if (d.money == '') {
                  wx.showModal({
                        title: '提示',
                        content: '请填写充值金额',
                        showCancel: false
                  })
            } else {
                  app.util.request({
                        url: "entry&m=ewei_shopv2&do=mobile&r=creditshop.buy.paywechat",
                        data: {
                              i: siteInfo.acid,
                              openid: that.data.openid,
                              body: '充值' + that.data.items.tradeNo,
                              tradeNo: that.data.items.tradeNo + app.util.random(123),
                              totalFee: d.money,
                        },
                        method: 'POST',
                        success: function (res) {
                              if (res.data.appId != undefined) {
                                    wx.requestPayment({
                                          timeStamp: res.data.timeStamp,
                                          nonceStr: res.data.nonceStr,
                                          package: res.data.package,
                                          signType: 'MD5',
                                          paySign: res.data.paySign,
                                          success: function (e) {
                                                app.util.request({
                                                      url: 'entry&m=ewei_shopv2&do=mobile&r=creditshop.buy.paytype',
                                                      data: {
                                                            i: siteInfo.acid,
                                                            t: siteInfo.uniacid,
                                                            money: d.money,
                                                            tradeNo: that.data.items.tradeNo,
                                                            type: 2,
                                                            openid: that.data.openid,
                                                      },
                                                      method: 'POST',
                                                      success: function (res) {
                                                            wx.showToast({
                                                                  title: '充值成功',
                                                            })
                                                            setTimeout(function () {
                                                                  wx.navigateBack({
                                                                        delta: 1,
                                                                  })
                                                            }, 2000)
                                                      },
                                                })
                                          }
                                    })
                              } else {
                                    wx.showToast({
                                          title: '充值失败',
                                          icon: 'loading'
                                    })
                              }
                        }
                  })
            }
      }
})