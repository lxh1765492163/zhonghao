// pages/default/bespoke/order/orderdetail/orderdetail.js
var siteInfo = require('../../../../../config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address : '',
    goods : [],
    staff : '',
    id : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var id = options.id;
    
    var that = this;
    that.setData({
      id : id,
    })
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&do=myorderdetail&m=qwx_shangmen&',
        method: 'GET',
        data: {
          i: siteInfo.uniacid,
          id : id,
        },
        success: function (res) {
          console.log(res)
          var address = res.data.address;
          var goods = res.data.goods;
          var staff = res.data.staff;
          var time = res.data.sum_time;
          var order = res.data.order;
          var get_store = res.data.get_store_arr;
          var price = parseInt(res.data.order.price);
          var sprice = parseInt(res.data.order.daojia_fee)
          var allprice = price + sprice;
          console.log(sprice)
          that.setData({
            address : address,
            goods : goods,
            staff : staff,
            time : time,
            order:order,
            get_store: get_store,
            allprice: allprice,
          })
        }
      })
    })
  },

  /**
   * 取消订单
  */
  removeorder : function(){

    var that = this;
    var id = that.data.id;
    wx.showModal({
      title: '提示',
      content: '您确定取消订单吗',
      success: function (res) {
        if (res.confirm) {
          app.util.getUserInfo(function () {
            app.util.request({
              url: 'entry&do=myorderdetail&m=qwx_shangmen&op=cancel_order',
              method: 'GET',
              data: {
                i: siteInfo.uniacid,
                id: id,
              },
              success: function (res) {
                console.log(res)
                wx.navigateBack()
              }
            })
          })
        }
      }
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