// pages/default/bespoke/percenter/percenter.js
var siteInfo = require('../../../../config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo : {},
    datas : '',
    member : '',
    fid : 2,
  },
  /**
    * 底部菜单
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&do=my&m=qwx_shangmen',
        method: 'GET',
        data: {
          i: siteInfo.uniacid,
        },
        header: {
          // "Accept": "application/json"
        },
        success: function (res) {
        console.log(res);
          var member = res.data.member;
          console.log(member.nickname)
          var datas = res.data;
          console.log(datas);
          that.setData({
            datas : datas,
            memeber : member
          })
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