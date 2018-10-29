// pages/detail/detail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let id = options.id;
    let title = options.title;
    let level = options.level;
    // console.log(level)
    let chapter;
    let data;
    if (level == 1) {
      data = {
        master_level_id: id,
      }
    } else {
      data = {
        follow_level_id: id,
      }
    }
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=question.chapter',
      data: data,
      success: function(res) {
        wx.hideLoading();
        if (res.data.status != 0) {
          chapter = res.data.chapter
          let answerChapterCount = res.data.answerChapterCount
          for (let i = 0; i < chapter.length; i++) {
            for (let j = 0; j < answerChapterCount.length; j++) {
              if (chapter[i].id == answerChapterCount[j].chapter_id) {
                chapter[i].answer_submit = answerChapterCount[j].answer_submit;
                chapter[i].answer_total = answerChapterCount[j].answer_total;
              }
            }
          }
          that.setData({
            id: id,
            menu: res.data.image,
            answerChannelCount: res.data.answerChannelCount,
            data: data,
          })
        } else {
          chapter = '';
        }
        that.setData({
          chapter: chapter,
          title: title,
        })
      }
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
  },
  getcontent: function(e) {
    const that = this;
    let pay = e.currentTarget.dataset.pay;
    let id = e.currentTarget.dataset.id;
    let price = e.currentTarget.dataset.price;
    if (pay == 0) {
      wx.navigateTo({
        url: '/pages/qstbank/screen/screen?id=' + id,
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
                                    url: '/pages/qstbank/screen/screen?id=' + id,
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
  getpaper: function(e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data.id;
    let chapter_type;
    let data = this.data.data;
    switch (index) {
      case 0:
        data.chapter_type = '2';
        data = JSON.stringify(data);
        wx.navigateTo({
          url: '/pages/qstbank/testpaper/testpaper?data=' + data,
        });
        break;
      case 1:
        data.chapter_type = '3';
        data = JSON.stringify(data);
        wx.navigateTo({
          url: '/pages/qstbank/testpaper/testpaper?data=' + data,
        });
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/qstbank/error/error?id=' + id,
        });
        break;
      case 3:
        data.chapter_type = '1';
        data = JSON.stringify(data);
        wx.navigateTo({
          url: '/pages/qstbank/testpaper/testpaper?data=' + data,
        });
        break;
    }
  },

  goindex: function () {
    wx.reLaunch({
      url: '/pages/default/index/index',
    })
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