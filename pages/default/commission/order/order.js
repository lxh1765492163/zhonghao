var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    status: 'all',
    page: 1,
    list: [],
    over: false,
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
      page: 1,
      over: false,
      list: [],
    })
    // 取所有明细
    that.getList()

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    if (that.data.over != true) {
      that.setData({
        page: that.data.page + 1
      })
      that.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * Tab 选项卡
   */
  switchTab: function (e) {
    const that = this
    var tab = e.currentTarget.dataset.tab
    that.setData({
      status: tab,
      page: 1,
      over: false,
      list: [],
    })
    that.getList()
  },

  getList: function () {
    const that = this
    wx.showLoading({
      title: '...',
      mask: true,
    })
    var tab = that.data.status
    if (tab == 'all') {
      tab = ''
    }
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.order.get_list',
        data: {
          page: that.data.page,
          status: tab,
        },
        success: function (res) {
          wx.hideLoading();
          if (res.status == 0) {
            wx.showModal({
              title: '提示',
              content: '加载出错',
            })
            return
          } else if (res.data.result.list != '') {
            var list = that.data.list;
            for (var i = 0; i < res.data.result.list.length; i++) {
              list.push(res.data.result.list[i]);
            }
            that.setData({
              items: res.data.result,
              list: list,
            })
          }
          else {
            that.setData({
              over: true,
            })
          }
        },
        fail: function (res) {
          wx.hideLoading();
          console.log(res)
        }
      })
    })
  }
})