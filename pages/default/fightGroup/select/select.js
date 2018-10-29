// pages/default/fightGroup/select/select.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address : [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=groups.address.get_selectors',
        method : 'GET',
        data: {

        },
        success: function (res) {
          console.log(res);
          console.log(2222);
          var address = res.data;
          that.setData({
            address : address
          })
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    })

  },

  // 选中地址
  radioChange: function (e) {
    console.log(e);
    const aid = parseInt(e.currentTarget.dataset.id);
    const index = parseInt(e.currentTarget.dataset.index);

    // wx.redirectTo({
    //   url: '/pages/default/fightGroup/order/creat/creat?aid=' + aid,
    // })
    wx.setStorageSync('address',this.data.address[index]);
    wx.navigateBack({
      delta : 1
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
    var that = this;
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=groups.address.get_selectors',
        method: 'GET',
        data: {

        },
        success: function (res) {
          console.log(res);
          console.log(2222);
          var address = res.data;
          that.setData({
            address: address
          })
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    })
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