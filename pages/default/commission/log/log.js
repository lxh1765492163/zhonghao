var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    status: '',
    page: 1,
    loadingType: '', //加载类型 onRefresh:刷新 onMore:加载更多
    moreEnd: false, //下拉没有数据了
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
      loadingType: 'onRefresh'
    })

    // 取所有明细
    that.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this

    if (that.data.moreEnd == true) {
      wx.showToast({
        title: '没有数据了',
        icon: 'loading'
      })
      return
    }

    that.setData({
      loadingType: 'onMore'
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
    const tab = e.currentTarget.dataset.tab

    that.setData({
      status: tab,
      page: 1,
      loadingType: '',
      moreEnd: false
    })

    that.getList()
  },

  getList: function() {
    const that = this

    // 是否下拉刷新
    if (that.data.loadingType == 'onRefresh' || that.data.loadingType == '') {
      that.setData({
        page: 1,
        loadingType: ''
      })
    } else if (that.data.loadingType == 'onMore') {
      that.setData({
        page: that.data.page + 1
      })
    }

    wx.showLoading({
      title: '加载中...',
    })

    app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.log.get_list',
        data: {
          page: that.data.page,
          status: that.data.status
        },
        success: function(res) {
          wx.hideLoading()
          if (res.status == 0) {
            wx.showModal({
              title: '提示',
              content: '加载出错',
            })
            return
          }

          var rst = res.data.result

          if (that.data.loadingType == 'onMore') {
            if (rst.list.length == 0) {
              //没有数据了
              that.setData({
                moreEnd: true
              })

              wx.showToast({
                title: '没有数据了',
                icon: 'loading'
              })
              return
            }

            var list = that.data.items.list
            for (var i in rst.list) {
              list.push(rst.list[i])
            }
            rst.list = list
            that.setData({
              items: rst
            })

          } else {
            that.setData({
              order: rst.list,
              items: rst
            })
          }
        },
        fail: function(res) {
          wx.hideLoading()
        }
      })
    })
  }
})