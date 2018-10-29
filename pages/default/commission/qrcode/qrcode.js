var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    img: '', //海报
    mid: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mid = options.mid ? options.mid : 0
    this.setData({
      mid: mid
    })

    // 获取数据
    this.getList();
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

  getList: function() {
    const that = this

    app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.qrcode.get_main',
        data: {
          mid: that.data.mid
        },
        success: function(res) {
          if (res.status == 0) {
            wx.showModal({
              title: '提示',
              content: '加载出错',
            })
            return
          }

          that.setData({
            items: res.data.result
          })

          // 生成海报
          that.createQrcode()
        },
        fail: function(res) {
          console.log(res)
        }
      })
    })
  },

  /**
   * 生成海报
   */
  createQrcode: function() {
    const that = this

    app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.qrcode.get_main',
        method: 'POST',
        data: {
          'goodsid': that.data.items.goodsid,
          'mid': that.data.mid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          if (res.data.status == 0) {
            wx.showModal({
              title: '提示',
              content: res.data.result.message,
              showCancel: false
            })
            return
          }

          if (res.data.status == 1) {
            that.setData({
              img: res.data.result.img
            })
          }
        },
        fail: function(res) {
          console.log(res)
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