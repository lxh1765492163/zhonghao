// pages/qstbank/error/error.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    psize: 20,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=question.answer.wrong',
      data: {
        psize: that.data.psize,
      },
      success: function(res) {
        wx.hideLoading();
        // console.log(res)
        that.setData({
          list: res.data
        })
      }
    })
  },
  gettest: function(e) {
    let data = e.currentTarget.dataset.info;
    wx.navigateTo({
      url: '/pages/qstbank/test/test?data=' + JSON.stringify(data),
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
    let that = this;
    let length = that.data.list.length;
    let psize = that.data.psize + 10;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=question.answer.wrong',
      data: {
        psize: psize,
      },
      success: function(res) {
        // console.log(res)
        wx.hideLoading();
        if (res.data.length == length) {
          wx.showToast({
            title: '没有数据了',
            icon: 'none',
          })
        } else {
          that.setData({
            list: res.data,
            psize: psize,
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})