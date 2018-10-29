var WxParse = require('../../../../vendor/wxParse/wxParse.js');
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    showProtocol: false, //显示协议内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  initView: function () {
    const that = this

    wx.showLoading({
      title: '加载中...',
    })

    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=merch.register.get_main',
        method: 'GET',
        success: function (res) {
          wx.hideLoading();
          if (res.data.status == 0) {
            wx.showModal({
              title: '提示',
              content: res.data.result.message,
              showCancel: false,
              success: function (e) {
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
            if (res.data.result.set.applycontent) {
              WxParse.wxParse('article', 'html', res.data.result.set.applycontent, that, 5);
            }
          }
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    })
  },

  doAgree: function () {
    const that = this
    that.setData({
      showProtocol: that.data.showProtocol == true ? false : true
    })
  },

  formSubmit: function (e) {
    const val = e.detail.value
    if (val.merchname == '') {
      wx.showToast({
        title: '请填写商户名称!',
      })
      return
    }
    if (val.salecate == '') {
      wx.showToast({
        title: '请填写主营项目!',
      })
      return
    }
    if (val.realname == '') {
      wx.showToast({
        title: '请填写联系人!',
      })
      return
    }
    if (val.mobile == '') {
      wx.showToast({
        title: '请填写联系人手机!',
      })
      return
    }

    wx.showLoading({
      title: '正在处理...',
    })

    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=merch.register.get_main',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: val,
        success: function (res) {
          wx.hideLoading()
          if (res.data.status == 0) {
            wx.showModal({
              title: '提示',
              content: res.data.result.message,
              showCancel: false
            })
            return
          }

          wx.showModal({
            title: '提示',
            content: '您的申请已经提交，请等待我们联系您!',
            showCancel: false,
            success: function (rs) {
              if (rs.confirm) {
                wx.reLaunch({
                  url: '/pages/default/index/index',
                })
              }
            }
          })
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    })
  }
})