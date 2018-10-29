var app = getApp()
var siteInfo = require('../../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddress()
  },

  // 取地址
  getAddress: function () {
    var that = this

    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&source=order&do=myaddress&m=qwx_shangmen',
        method: 'GET',
        data: {
          i: siteInfo.uniacid,

        },
        success: function (res) {
          console.log(res)
          console.log(555555555555555);
          
          that.setData({
            address: res.data
          })
        }
      })
    })
  },

  // 选中地址
  radioChange: function (e) {
    console.log(e);
    const aid = e.currentTarget.dataset.id
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&do=myaddress&m=qwx_shangmen&op=select_address',
        method: 'GET',
        data: {
          i: siteInfo.uniacid,
          address_id : aid,
        },
        success: function (res) {
          console.log(res)
          console.log(12312312313);
        
            wx.navigateTo({
              url: '/pages/default/bespoke/order/index?select_address_id='+aid,
            })
        
        }
      })
    })
  
  },
 
  onShow : function(){
    this.getAddress()
  }
})