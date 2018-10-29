// pages/default/integralmall/order/order.js
var siteInfo = require('../../../../config.js');
var js = require('../../../../vendor/app.js');

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
    const that = this;
    console.log(options)
    var keys = wx.getStorageSync('key');
    var id = options.id ? options.id : keys.id;
    var sid = options.sid ? options.sid : keys.sid;
    var aid = options.aid ? options.aid : keys.aid ? keys.aid : '';
    // console.log(options.id)
    that.setData({
      id: id,
      aid: aid,
      sid: sid
    })
    wx.showLoading({
      title: '',
      mask: true,
    })
    // app.util.getUserInfo(function () {
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=creditshop.xcx.integral',
      method: 'GET',
      data: {
        i: siteInfo.uniacid,
        id: id,
        sid: sid,
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
    this.initShippingAddress();
    var datas = {
      id: this.data.id,
      aid: this.data.aid,
    }
    wx.setStorageSync('key', datas)
  },

  initShippingAddress: function () {
    const that = this
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=member.address.get_address&id=' + that.data.aid,
        success: function (res) {
          if (res.data.status == 1) {
            that.setData({
              address: res.data.result.address,
              aid: res.data.result.address.id
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '获取用户地址失败',
          })
        }
      })
    })
  },

  pay: function () {
    var that = this;
    var addressid = that.data.aid;
    console.log(addressid)
    if (!that.data.address) {
      wx.showModal({
        title: '提示',
        content: '请填写收货地址'
      })
    }
    else {
      wx.showActionSheet({
        itemList: ['积分兑换', '余额支付', '微信支付'],
        itemColor: '#FF4500',
        success: function (res) {
          console.log(res.tapIndex)
          if (res.tapIndex == 1 || res.tapIndex==0) {
            that.balancepay();
          }
          if (res.tapIndex == 2) {
            that.wxpay();
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })

    }
  },

  balancepay: function () {
    var that = this;
    var addressid = that.data.aid;
    var id = that.data.id;
    var sid = that.data.sid
    wx.showModal({
      title: '确认要兑换吗?',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '确认订单中...',
            mask: true,
          })
          app.util.getUserInfo(function () {
            var userInfo = wx.getStorageSync("userInfo")
            app.util.request({
              url: 'entry&m=ewei_shopv2&do=mobile&r=creditshop.xcx.pay',
              method: 'GET',
              data: {
                i: siteInfo.uniacid,
                id: id,
                sid: sid,
                addressid: addressid,
                openid: userInfo.openid,
              },
              header: {
                'Accept': 'application/json'
              },
              success: function (res) {
                console.log(res.data)
                wx.hideLoading();
                that.setData({
                  data: res.data,
                })
                wx.redirectTo({
                  url: 'detail/detail?id=' + res.data.order.id,
                })
              }
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  wxpay: function () {
    var that = this;
    var addressid = that.data.aid;
    var id = that.data.id;
    var sid = that.data.sid
    wx.showModal({
      title: '确认要兑换吗?',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '确认订单中...',
            mask: true,
          })
          app.util.getUserInfo(function () {
            var userInfo = wx.getStorageSync("userInfo")
            app.util.request({
              url: 'entry&m=ewei_shopv2&do=mobile&r=creditshop.buy.wechatpay',
              method: 'GET',
              data: {
                uid: siteInfo.acid,
                id: id,
                sid: sid,
                addressid: addressid,
                openid: userInfo.openid,
              },
              header: {
                'Accept': 'application/json'
              },
              success: function (e) {
                console.log(e);
                wx.hideLoading();
                var logid = e.data.logid;
                if (logid) {
                  wx.requestPayment({
                    timeStamp: e.data.wechat.timeStamp,
                    nonceStr: e.data.wechat.nonceStr,
                    package: e.data.wechat.package,
                    signType: e.data.wechat.signType,
                    paySign: e.data.wechat.paySign,
                    success: function (res) {
                      console.log(res);
                      app.util.request({
                        url: 'entry&m=ewei_shopv2&do=mobile&r=creditshop.buy.wechatsuc',
                        method: 'GET',
                        data: {
                          openid: userInfo.openid,
                          logid: logid,
                        },
                        header: {
                          'Accept': 'application/json'
                        },
                        success: function (res) {
                          console.log(res);
                          that.setData({
                            data: res.data,
                          })
                          wx.redirectTo({
                            url: 'detail/detail?id=' + res.data.order.id,
                          })
                        }
                      })
                    },
                    fail: function (res) {
                      console.log(res)
                    }
                  })
                }
                else {

                }
              }
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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