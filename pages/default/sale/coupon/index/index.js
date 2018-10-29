var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    list: [], //优惠券
    page: 1,
    cateid: 0,
    loadingType: '', //加载类型 onRefresh:刷新 onMore:加载更多
    moreEnd: false, //下拉没有数据了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initView()
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
    //
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
    return {
      title: '快来领取你的优惠券',
      path: '/pages/default/sale/coupon/index/index',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },

  initView: function() {
    const that = this
    wx.showLoading({
      title: '加载中...',
    })

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=sale.coupon.index.get_main',
      success: function(res) {
        wx.hideLoading()

        if (res.data.status == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.result.message,
            showCancel: false
          })
          return
        } else {
          that.setData({
            items: res.data.result
          })
          that.getList()
        }
      },
      fail: function() {
        wx.hideLoading()
      }
    })
  },

  selector: function(e) {
    const cateid = e.currentTarget.dataset.cateid
    if (cateid == this.data.cateid) {
      return
    }
    this.setData({
      cateid: cateid
    })
    this.getList()
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

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=sale.coupon.index.getlist',
      data: {
        page: that.data.page,
        cateid: that.data.cateid
      },
      success: function(res) {
        wx.hideLoading()
        if (res.data.status == 0) {
          return
        } else {
          var d = res.data.result
          if (that.data.loadingType == 'onMore') {
            if (d.list.length == 0) {
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

            var list = that.data.list
            for (var i in d.list) {
              list.push(d.list[i])
            }
            that.setData({
              list: list
            })

          } else {
            that.setData({
              list: d.list
            })
          }
        }
      },
      fail: function() {
        wx.hideLoading()
      }
    })
  }
})