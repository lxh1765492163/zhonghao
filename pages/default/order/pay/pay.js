var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: 0,
    order: {},
    userInfo: {},
    openid: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      orderid: options.orderid
    })

    this.getOrder()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //
  },

  // 取订单
  getOrder: function () {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    // 订单id
    const id = this.data.orderid
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=order.pay.get_order',
        data: { id: id },
        success: function (e) {
          wx.hideLoading()
          var s = e.data
          var r = e.data.result
          if (s.status == 0) {
            wx.showModal({
              title: '提示',
              content: r.message,
              success: function (e) {
                app.util.gotoHome()
              }
            })
          } else {
            that.setData({
              order: r.order,
              money: r.money,
              openid: r.order.openid
            })
          }
        }
      })
    })
  },

  // 微信支付
  orderPay: function (e) {
    var that = this
    const orderid = that.data.order.id
    console.log(e);
    // 统一下单
    wx.request({
      url: app.siteInfo.domain + '/bale/pay.php?do=okpay&uniacid=' + app.siteInfo.acid + '&t=' + app.siteInfo.uniacid,
      data: {
        openid: that.data.order.openid,
        body: '订单' + that.data.order.ordersn,
        tradeNo: that.data.order.ordersn + app.util.random(123),
        totalFee: parseFloat(that.data.order.price) * 100
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        // 发起支付
        if (res.data.appId != undefined) {
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            'success': function (e) {
              wx.showToast({
                title: '支付成功',
              })
              // 更新订单
              app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=order.pay.paysuess',
                data: {
                  id: orderid,
                  type: 'wechat',
                  ordersn: that.data.order.ordersn,
                  deduct: 0
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  console.log('更新订单完成')
                }
              })
              // 清除购物车
              wx.request({
                url: app.siteInfo.domain + '/bale/pay.php?do=uporder',
                data: {
                  openid: that.data.order.openid
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function () {
                  console.log('清除购物车完成')
                }
              })
              // 跳转到首页
              wx.redirectTo({
                url: '/pages/default/order/detail/detail?id=' + that.data.orderid,
              })
            }
          })
        } else {
          wx.showToast({
            title: '支付失败',
            icon: 'loading'
          })
        }
      }
    })
  },

  //余额支付
  balancepay: function () {
    var that = this
    const orderid = that.data.order.id
    wx.showModal({
      title: '提示',
      content: '确认支付',
      success: function (res) {
        console.log(res)
        if (res.confirm) {
          app.util.request({
            url: "entry&m=ewei_shopv2&do=mobile&r=creditshop.buy.payment",
            data: {
              openid: that.data.order.openid,
              ordersn: that.data.order.ordersn,
            },
            method: 'POST',
            success: function (e) {
              console.log(e.data.msg)
              if (e.data.suc == 1) {
                wx.showToast({
                  title: '支付成功',
                })

                // 清除购物车
                wx.request({
                  url: app.siteInfo.domain + '/bale/pay.php?do=uporder',
                  data: {
                    openid: that.data.order.openid
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function () {
                    console.log('清除购物车完成')
                  }
                })

                // 更新订单
                app.util.request({
                  url: 'entry/ewei_shopv2/mobile&r=order.pay.paysuess',
                  data: {
                    id: orderid,
                    type: 'wechat',
                    ordersn: that.data.order.ordersn,
                    deduct: 0
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    console.log('更新订单完成')
                  }
                })

                // 跳转到首页
                wx.redirectTo({
                  url: '/pages/default/order/detail/detail?id=' + that.data.orderid,
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: e.data.msg,
                  confirmText: '充值',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '/pages/default/member/recharge/recharge',
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})