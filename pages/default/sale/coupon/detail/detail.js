var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    items: null,
    logid: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.id) {
      wx.showModal({
        title: '提示',
        content: '无效的优惠券',
        showCancel: false,
        success: function(e) {
          if (e.confirm) {
            wx.navigateBack()
          }
        }
      })
      return
    }

    this.setData({
      id: options.id
    })

    this.initView()
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var data = this.data
    var title = data.items != null ? data.items.coupon.couponname : '快来领取你的优惠券~'
    return {
      title: title,
      path: '/pages/default/sale/coupon/detail/detail?id=' + data.id,
      success: function (res) {
      },
      fail: function () {
      }
    }
  },

  initView: function() {
    const that = this
    if (!that.data.id) {
      return
    }
    wx.showLoading({
      title: '加载中...',
    })
    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=sale.coupon.detail.get_main&id=' + that.data.id,
      success: function(res) {
        wx.hideLoading()
        if (res.data.status == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.result.message,
            showCancel: false,
            success: function(e) {
              if (e.confirm) {
                wx.navigateBack()
              }
            }
          })
          return
        } else {
          that.setData({
            items: res.data.result
          })
        }
      },
      fail: function() {
        wx.hideLoading()
      }
    })
  },

  btncoupon: function() {
    const that = this
    const data = that.data
    if (!data.id || !data.items.coupon) {
      wx.showToast({
        title: '领取出错',
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确认 ' + data.items.coupon.gettypestr + '吗?',
      success: function(e) {
        if (e.confirm) {
          wx.showLoading({
            title: '正在处理...',
          })
          app.util.getUserInfo(function () {
            app.util.request({
              url: 'entry/ewei_shopv2/mobile&r=sale.coupon.detail.pay',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                id: data.id
              },
              success: function (res) {
                wx.hideLoading()
                var ret = res.data

                if (ret.status <= 0) {
                  wx.showModal({
                    title: '提示',
                    content: res.data.result.message,
                    showCancel: false
                  })
                  return
                }

                that.setData({
                  logid: ret.result.logid
                })

                if (ret.result.needpay) {
                  console.log('need pay')
                }

                if (ret.result.wechat) {
                  var wechat = ret.result.wechat
                  if (wechat.weixin) {
                    console.log('发起支付')
                    wx.requestPayment({
                      timeStamp: wechat.timeStamp,
                      nonceStr: wechat.nonceStr,
                      package: wechat.package,
                      signType: wechat.signType,
                      paySign: wechat.paySign,
                      'success': function (e) {
                        // requestPayment:ok
                        if (e.errMsg == 'requestPayment:ok') {
                          that.payResult()
                        } else {
                          wx.showToast({
                            title: e.errMsg,
                            icon: 'loading'
                          })
                          return
                        }
                      },
                      fail: function(e) {
                        var title = ''
                        if (e.errMsg == 'requestPayment:fail cancel') {
                          title = '取消支付'
                        } else {
                          title = e.errMsg
                        }
                        wx.showToast({
                          title: title,
                          icon: 'success'
                        })
                        return
                      }
                    })
                  }
                  console.log('payWechatJie')
                  console.log(wechat)
                } else {
                  console.log('payResult')
                  that.payResult()
                }
              },
              fail: function () {
                wx.hideLoading()
              }
            })
          })
        }
      }
    })
  },

  payResult: function() {
    const that = this
    if (!that.data.id || !that.data.logid) {
      return
    }

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=sale.coupon.detail.payresult',
      data: {
        id: that.data.id,
        logid: that.data.logid
      },
      success: function(res) {
        if (res.data.status == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.result.message,
            showCancel: false
          })
          return
        }

        if (res.data.status == 1) {
          var text = ""
          var button = ""
          var href = ""
          if (res.data.result.coupontype == 0) {
            // wx.redirectTo({
            //   url: '/pages/default/sale/coupon/my/showcoupons2/showcoupons2?id='+res.data.result.dataid,
            // })
            wx.showModal({
              title: '',
              content: '领取成功',
              confirmText: '去使用',
              success: function(res){
                if (res.confirm){
                  wx.redirectTo({
                     url: '/pages/default/goods/list/list',
                   })
                } else if (res.cancel){
                   wx.navigateBack({
                     delta: 1,
                   })
                 }
              }
            })
            return
          } else if (res.data.result.coupontype == 1) {
            text = "恭喜您，优惠券到手啦，您想现在就去充值吗?"
            button = "马上充值"
            href = '/pages/default/member/recharge/recharge'
          } else if (res.data.result.coupontype == 2) {
            text = "恭喜您，收银台优惠券到手啦"
            button = "立即查看"
            href = '/pages/default/sale/coupon/my/index/index'
          } else {
            text = "恭喜您，优惠券到手啦"
            button = "立即查看"
            href = '/pages/default/sale/coupon/my/index/index'
          }
          wx.showModal({
            title: '提示',
            content: text,
            confirmText: button,
            success: function(e) {
              if (e.confirm) {
                wx.redirectTo({
                  url: href
                })
                return
              } else if (e.cancel) {
                wx.redirectTo({
                  url: '/pages/default/sale/coupon/index/index',
                })
                return
              }
            }
          })
        }
      }
    })
  }
})