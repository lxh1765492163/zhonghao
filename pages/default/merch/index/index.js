var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mid: 0,
    merchid: 0,
    items: null,
    page: 1,
    list: [],
    loadingType: '', //加载类型 onRefresh:刷新 onMore:加载更多
    moreEnd: false, //下拉没有数据了
    pagetype: 0, // 页面类型 0:默认 1:自定义
    merchname: '' // 商户名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mid = options.mid ? options.mid : this.data.mid
    var merchid = options.merchid ? options.merchid : this.data.merchid

    this.setData({
      mid: mid,
      merchid: merchid
    })

    // 加载数据
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
    if (this.data.merchname != '') {
      wx.setNavigationBarTitle({
        title: this.data.merchname,
      })
    }
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
    that.getRecommand()
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
    that.getRecommand()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 初始化视图
   */
  initView: function () {
    const that = this

    wx.showLoading({
      title: '加载中...',
    })

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=merch.index.get_main',
      method: 'GET',
      data: {
        mid: that.data.mid,
        merchid: that.data.merchid
      },
      success: function(res) {
        wx.hideLoading()
        var data = res.data
        if (data.status == 0) {
          wx.showModal({
            title: '提示',
            content: data.result.message,
            showCancel: false,
            success: function(e) {
              if (e.confirm) {
                wx.navigateBack()
              }
            }
          })
          return
        }

        that.setData({
          items: data.result
        })

        if (data.result.sorts) {
          that.setData({
            pagetype: 0
          })

          that.parseModule(data.result.sorts)

          wx.setNavigationBarTitle({
            title: data.result.merch_user.merchname,
          })
        } else {
          that.setData({
            pagetype: 1
          })
          if (that.data.merchname == '') {
            that.getMerch()
          }
        }
      },
      fail: function() {
        wx.hideLoading()
      }
    })
  },

  getMerch: function() {
    const that = this
    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=merch.index.get_merch',
      data: {
        mid: that.data.mid,
        merchid: that.data.merchid
      },
      success: function(res) {
        if (res.data.status == 1) {
          that.setData({
            merchname: res.data.result.merch_user.merchname
          })
          wx.setNavigationBarTitle({
            title: res.data.result.merch_user.merchname,
          })
        }
      }
    })
  },

  /**
   * 搜索提交
   */
  searchSubmit: function(e) {
    const keywords = e.detail.value
    this.postSubmit(keywords)
  },

  /**
   * 提交搜索
   */
  postSubmit: function (keywords) {
    if (keywords != '') {
      //跳转到列表页
      wx.navigateTo({
        url: '/pages/default/goods/list/list?r=goods.index.get_list&keywords=' + keywords,
      })
    }
  },

  parseModule: function(m) {
    for (var i in m) {
      if (i == 'recommand') {
        this.getRecommand()
      }
    }
  },

  getRecommand: function() {
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

    if (that.data.merchid == 0) {
      var url = 'index.get_recommand'
    } else {
      var url = 'merch.index.get_recommand'
    }

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=' + url,
      method: 'GET',
      data: {
        page: that.data.page,
        merchid: that.data.merchid
      },
      success: function(res) {
        if (res.data.status == 1) {
          that.data.recommand = res.data.result.list
        }
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
      },
      fail: function() {
      }
    })
  }
})