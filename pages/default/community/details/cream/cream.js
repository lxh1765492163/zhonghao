// pages/default/community/details/cream/cream.js
var siteInfo = require('../../../../../config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    icon: '/assets/images/pl.png',
    icon2: '/assets/images/dian.png',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var id = options.id;
    var that = this;
    // app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=sns.board.get_best',
            method: 'GET',
            data: {
                i: siteInfo.uniacid,
                id: id,
            },
            success: function (res) {

                console.log(res);


            }
        // })
    })
    // app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=sns.board.getlist',
            method: 'GET',
            data: {
                i: siteInfo.uniacid,
                bid: id,
                isbest : 1,
            },
            success: function (res) {
                var list = res.data.result.list;
                console.log(res);
                that.setData({
                    list:list,
                })

            }
        })
    // })
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