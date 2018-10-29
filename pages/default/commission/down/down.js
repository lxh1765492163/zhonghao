var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    page: 1,
    level: 1
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
    var that = this
    // 取所有明细
    that.getList()
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
    var that = this

    that.setData({
      page: 1
    })

    // 取所有明细
    that.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this

    that.setData({
      page: that.data.page + 1
    })

    that.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * Tab 选项卡
   */
  switchTab: function(e) {
    const that = this
    var tab = e.currentTarget.dataset.tab

    that.setData({
      level: tab,
      page: 1
    })
    that.getList()
  },

  getList: function() {
    const that = this 
    wx.showLoading({
      title: '加载中...',
    })
    app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.down.get_list',
        data: {
          page: that.data.page,
          level: that.data.level
        },
        success: function(res) {
          console.log(res)
          wx.hideLoading();
          if (res.status == 0) {
            wx.showModal({
              title: '提示',
              content: '加载出错',
            })
            return
          }
          that.setData({
            items: res.data.result,
            thisset: res.data.result.thisset ? res.data.result.thisset : that.data.thisset,
            levels: res.data.result.level ? res.data.result.level : that.data.level,
          })
        },
        fail: function(res) {
          console.log(res)
        }
      })
    })
  }
})