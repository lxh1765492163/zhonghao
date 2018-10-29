// pages/default/sale/gifts/gifts.js
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
  onLoad: function (options) {
    var that = this
    var datas = {
      giftsid: options.giftsid
    }
    wx.setStorageSync('key', datas);
    var keys = wx.getStorageSync('key');
    var id = options.giftsid ? options.giftsid:keys.giftsid
    console.log(id);
    app.util.request({
      url:"entry/ewei_shopv2/mobile&r=goods.index.get_gift",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data:{
        id:id
      },
      success: function (res){
        console.log(res)
        wx.setNavigationBarTitle({
          title: res.data.gift.title,
        })
        that.setData({
          data:res.data,
        })
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