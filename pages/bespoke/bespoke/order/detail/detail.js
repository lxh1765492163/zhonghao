// pages/default/bespoke/order/detail/detail.js
var siteInfo = require('../../../../../config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods : {},
    datas : {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
      var that = this;
      var orderid = parseInt(options.orderid);
      var uid = options.uid;
      that.setData({
        //   id: id,
      })
      app.util.getUserInfo(function () {
          app.util.request({
              url: 'entry&order_sn=' + orderid + '&do=pay&m=qwx_shangmen&t=' + siteInfo.uniacid,
              method: 'GET',
              data: {
                  i: siteInfo.uniacid,
                  uid : uid,
              },
              success: function (res) {
                  console.log(res)
                  var goods = res.data.params;
                  var datas = res.data;
                  that.setData({
                    goods : goods,
                    datas : datas,
                    
                  })
              }
          })
      })
  },
  // 支付
  orderPay: function (e) {
      var that = this
      // 统一下单
      wx.request({
          url: app.siteInfo.domain + '/bale/pay.php?do=okpay&uniacid=' + app.siteInfo.acid + '&t=' + app.siteInfo.uniacid,
          data: {
              openid: that.data.datas.openid,
              body: '订单' + that.data.goods.ordersn,
              tradeNo: that.data.goods.ordersn + app.util.random(123),
              totalFee: parseFloat(that.data.goods.fee) * 100
              // uniacid: app.siteInfo.uniacid
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
                          // 跳转到首页
                          wx.reLaunch({
                              url: '/pages/default/bespoke/myorder/order',
                          })
                          // 清除购物车
                        //   wx.request({
                        //       url: app.siteInfo.domain + '/bale/pay.php?do=uporder',
                        //       data: {
                        //           openid: that.data.datas.openid
                        //       },
                        //       method: 'POST',
                        //       header: {
                        //           'content-type': 'application/x-www-form-urlencoded'
                        //       },
                        //       success: function () {
                        //           console.log('清除购物车完成')
                        //       }
                        //   })
                        //   // 更新订单
                        //   app.util.request({
                        //       url: 'entry/ewei_shopv2/mobile&r=order.pay.paysuess',
                        //       data: {
                        //           do : daojia,
                        //           order_sn: that.data.goods.ordersn,
                        //       },
                        //       method: 'POST',
                        //       header: {
                        //           'content-type': 'application/x-www-form-urlencoded'
                        //       },
                        //       success: function (res) {
                        //           console.log('更新订单完成')
                        //       }
                        //   })

                       
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