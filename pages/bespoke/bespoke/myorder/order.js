// pages/default/bespoke/order/order.js
var siteInfo = require('../../../../config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabArr : 1,
    datas : [],
    fid:1,
  },
  /**
   * 打开订单详情
  */
  openorder : function(){
    wx.navigateTo({
      url: '/pages/default/bespoke/order/index',
    })
  },
  /**
   * 选项卡
  */
  tabFun : function(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;
    this.setData({
      tabArr : index
    })
    var that = this;
    var status = that.data.tabArr;
    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&status=1&do=myorder&m=qwx_shangmen',
        method: 'GET',
        data: {
          i: siteInfo.uniacid,
          page: 1,
          is_ajax: 1,
          status: status,
        },
        header: {
          // "Accept": "application/json"
        },
        success: function (res) {
          console.log(res);
          var datas = res.data;
          that.setData({
            datas : datas
          })

        }
      })
    // })
  },
  /**
   * 获取订单
  */
  createorder : function(){
    var that = this;
    var status = that.data.tabArr;
    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&status=1&do=myorder&m=qwx_shangmen',
        method: 'GET',
        data: {
          i: siteInfo.uniacid,
          page: 1,
          is_ajax: 1,
          status: status,
        },
        header: {
          // "Accept": "application/json"
        },
        success: function (res) {
          console.log(res);
          var datas = res.data;
          that.setData({
            datas: datas
          })

        }
      })
    // })
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.createorder()
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