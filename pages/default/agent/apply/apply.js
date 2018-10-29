// pages/default/agent/apply/apply.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agenttype: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let data = options.data ? JSON.parse(options.data) : '';
    // console.log(status);
    // console.log(type);
    if (data == '') {
      wx.showLoading({
        title: '',
      })
      app.util.getUserInfo(function() {
        app.util.request({
          url: 'entry&m=ewei_shopv2&do=mobile&r=abonus.abapi.gettype',
          method: 'GET',
          data: {},
          success: function(res) {
            wx.hideLoading();
            // console.log(res)
            if (res.data.status == 0) {
              that.setData({
                type: res.data.type,
                status: res.data.status,
                name: res.data.name,
                img: res.data.img
              })
            } else {
              wx.reLaunch({
                url: '../index/index?status=' + res.data.status + '&type=' + res.data.type,
              })
            }
          }
        })
      })
    } else {
      that.setData({
        type: data.type,
        status: data.status,
        name: data.name,
        img: data.img
      })
    }
  },

  radioChange: function(e) {
    console.log(e.detail.value);
    this.setData({
      agenttype: e.detail.value,
    })
  },
  submitApply: function(res) {
    console.log(res.detail.value);
    let that = this;
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=abonus.abapi.send',
      method: 'GET',
      data: res.detail.value,
      success: function(res) {
        console.log(res)
        if (res.data.status == 1) {
          wx.showToast({
            title: '提交成功',
            mask: true,
            success: function(res) {
              setTimeout(function() {
                wx.reLaunch({
                  url: '../index/index'
                })
              }, 2000)
            },
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        }
      }
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