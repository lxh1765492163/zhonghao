// pages/default/agent/index/index.js
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
    let status = options.status ? options.status : '';
    let type = options.type ? options.type : '';
    // console.log(status);
    // console.log(type);
    if (status == '') {
      wx.showLoading({
        title: '',
        mask: true,
      })
      app.util.getUserInfo(function() {
        app.util.request({
          url: 'entry&m=ewei_shopv2&do=mobile&r=abonus.abapi.gettype',
          method: 'GET',
          data: {},
          success: function(res) {
            wx.hideLoading();
            // console.log(res.data.status)
            status = res.data.status;
            type = res.data.type;
            if (status == 0) {
              wx.reLaunch({
                url: '../apply/apply?data=' + JSON.stringify(res.data),
              })
            } else {
              that.setData({
                status: status,
                type: type,
              });
            }
          }
        })
      })
    } else {
      that.setData({
        status: status,
        type: type,
      });
    }
    that.getAgentInfo();
  },

  getAgentInfo: function() {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    // console.log(userInfo)
    app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry&m=ewei_shopv2&do=mobile&r=abonus&token=bf8d3dc65bc84f',
        method: 'GET',
        data: {},
        success: function(res) {
          wx.hideLoading();
          // console.log(res)
          that.setData({
            abonus: res.data,
            userInfo: userInfo.wxInfo
          })
        }
      })
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