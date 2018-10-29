// pages/testpaper/detail/detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let id = options.id;
    let pay = options.pay;
    let title = options.title;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    app.util.getUserInfo(function() {
      var userInfo = wx.getStorageSync("userInfo")
      app.util.request({
        url: 'entry&m=ewei_shopv2&do=mobile&r=question.member',
        method: 'GET',
        data: {},
        success: function(res) {
          that.setData({
            openid: userInfo.openid,
          })
        }
      })
    })
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=question.answer.papar_details',
      data: {
        chapter_id: id,
      },
      success: function(res) {
        wx.hideLoading();
        // console.log(res.data)
        if (res.data.status == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.name,
            showCancel: false,
            success: function(res) {
              if(res.confirm){
                wx.navigateBack({
                  delta: 1,
                })
              }
            },
          })
        } else {
          that.setData({
            info: res.data,
            title: title,
            pay: pay
          })
        }
      }
    })
  },

  gotest: function(e) {
    const that = this;
    let mode = e.currentTarget.dataset.mode;
    let data = that.data.info
    let pay = that.data.pay;
    let price = data.price;
    let id = data.chapter_id;
    let info = JSON.stringify({
      chapter_id: id,
      mode: mode,
      pagesize: data.total,
      time: data.time,
      types: [],
    });
    console.log(info)
    if (pay == 0) {
      wx.navigateTo({
        url: '/pages/qstbank/test/test?info=' + info,
      })
    } else {
      wx.showLoading({
        title: '',
        mask: true,
      })
      app.util.request({
        url: 'entry&m=ewei_shopv2&do=mobile&r=question.member.validate_buy',
        method: 'GET',
        data: {
          chapter_id: id,
        },
        success: function(by) {
          wx.hideLoading();
          if (by.data.status == 0) {
            wx.showModal({
              title: '您暂无做题权限',
              content: '需付￥' + price,
              confirmText: '购买',
              success: function(res) {
                if (res.confirm) {
                  app.util.getUserInfo(function() {
                    app.util.request({
                      url: 'entry&m=ewei_shopv2&do=mobile&r=question.member.ordersn',
                      method: 'GET',
                      data: {
                        chapter_id: id,
                        prcie: price,
                      },
                      success: function(ord) {
                        wx.request({
                          url: app.siteInfo.domain + '/bale/pay.php?do=okpay&uniacid=' + app.siteInfo.acid + '&t=' + app.siteInfo.uniacid,
                          data: {
                            openid: that.data.openid,
                            body: '订单' + ord.data,
                            tradeNo: ord.data + app.util.random(123),
                            totalFee: parseFloat(price) * 100
                          },
                          method: 'POST',
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          success: function(res) {
                            console.log(res);
                            // 发起支付
                            if (res.data.appId != undefined) {
                              wx.requestPayment({
                                timeStamp: res.data.timeStamp,
                                nonceStr: res.data.nonceStr,
                                package: res.data.package,
                                signType: 'MD5',
                                paySign: res.data.paySign,
                                'success': function(e) {
                                  console.log(e);
                                  wx.showToast({
                                    title: '购买成功',
                                  })
                                  wx.redirectTo({
                                    url: '/pages/qstbank/test/test?info=' + info,
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
                      }
                    })
                  })
                }
              }
            })
          }
          if (by.data.status == 1) {
            wx.navigateTo({
              url: '/pages/qstbank/screen/screen?id=' + id,
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})