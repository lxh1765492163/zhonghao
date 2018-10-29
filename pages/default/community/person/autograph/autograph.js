// pages/community/person/autograph/autograph.js
var siteInfo = require('../../../../../config.js');
var app =getApp();
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
    this.setData({
      autograph: options.autograph
    })
  },

    formqm : function(e){
        var val = e.detail.value.val;
        var that = this;
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=sns.user.submit_sign',
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                    sign : val,
                },
                success: function (res) {
                    console.log(res);
                    if (res.data.status == 1){
                        wx.navigateBack({
                            delta : 1,
                        })
                    }else{
                        wx.showToast({
                            title: res.data.result.message,
                        })
                    }
                }
            })
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