const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 0, // 当前页标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    // 取收藏商品
    this.getFavorite()
  },

  /**
   * 取收藏的商品
   */
  getFavorite: function() {
    const that = this
    var page = that.data.page

    wx.showLoading({
      title: '加载中...',
    })

    app.util.getUserInfo(function() {
      // 取用户关注商品
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=member.favorite.get_list',
        data: {
          page: page + 1
        },
        success: function(res) {
          wx.hideLoading()
          var result = res.data.result

          that.setData({
            list: result.list
          })
        },
        fail: function() {
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