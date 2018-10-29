var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0, // 提现申请id
    orderPage: 1,
    items: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.id) {
      wx.navigateBack()
      return
    }

    this.setData({
      id: options.id
    })

    // 取申请记录
    this.getOrders()
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
  
  },

  getOrders: function() {
    const that = this
    const id = that.data.id
    var page = that.data.orderPage
    if (!id) {
      return
    }

    wx.showLoading({
      title: '加载中...',
    })

    app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.log.orders',
        method: 'GET',
        data: {
          id: id,
          page: page
        },
        success: function (res) {
          wx.hideLoading()

          if (res.data.status == 1) {
            that.setData({
              items: res.data.result
            })
          } else {
            wx.showModal({
              title: '提现',
              content: res.data.result.message,
              showCancel: false,
              success: function(s) {
                if (s.confirm) {
                  wx.navigateBack()
                }
              }
            })
            return
          }
        },
        fail: function() {
          wx.hideLoading()
        }
      })
    })
  }
})