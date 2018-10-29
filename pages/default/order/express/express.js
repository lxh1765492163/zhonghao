var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    id: 0,
    sendtype: 0,
    bundle: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id ? options.id : 0
    const sendtype = options.sendtype ? options.sendtype : 0
    const bundle = options.bundle ? options.bundle : ''
    if (!id) {
      return
    }

    this.setData({
      id: id,
      sendtype: sendtype,
      bundle: bundle
    })

    // 取物流信息
    this.getExpress()
  },

  getExpress: function() {
    const that = this

    wx.showLoading({
      title: '加载中...',
    })

    app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=order.index.get_express',
        method: 'GET',
        data: {
          id: that.data.id,
          sendtype: that.data.sendtype,
          bundle: that.data.bundle
        },
        success: function(res) {
          wx.hideLoading()

          if (res.data.status == 1) {
            that.setData({
              items: res.data.result
            })
            return
          } else {
            wx.showModal({
              title: '提示',
              content: '获取物流失败',
              showCancel: false,
              success: function(re) {
                if (re.confirm) {
                  wx.navigateBack()
                }
              }
            })
          }
        },
        fail: function() {
          wx.hideLoading()
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