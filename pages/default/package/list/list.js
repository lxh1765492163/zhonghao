// pages/default/package/list/list.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    packages:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '',
      mask:true
    })
    var datas = {
      goodsid: options.goodsid 
    }
    wx.setStorageSync('key', datas)
    var keys = wx.getStorageSync('key');
    var goodsid = options.goodsid ? options.goodsid : keys.goodsid;
    app.util.request({
      url: "entry/ewei_shopv2/mobile&r=goods.package.get_main",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        goodsid: goodsid,
      },
      success: function (res) {
        that.setData({
          packages: res.data.packages,
        })
        wx.hideLoading();
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