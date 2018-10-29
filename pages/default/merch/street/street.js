var app = getApp()

var loading = false
var endMore = false

Page({

  data: {
    cateid: 0,
    list: [],
    category: [],
    page: 1,
    loadingType: '',
  },

  onLoad: function (options) {
    this.initView()
  },

  onShow: function() {
    loading = false
    endMore = false
  },

  onShareAppMessage: function () {

  },

  initView: function() {
    var that = this
    loading = true
    wx.showLoading({
      title: '加载中...',
    })

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=merch.list.ajaxmerchuser',
      data: {
        page: that.data.page,
        cateid: that.data.cateid
      },
      success: function(res) {
        wx.hideLoading()
        loading = false
        if (res.data.status == 1) {
          if (res.data.result.list.length == 0) {
            endMore = true
            return
          }
          if (that.data.category.length == 0) {
            that.setData({
              category: res.data.result.category
            })
          }

          var list = []
          if (that.data.loadingType == 'onMore') {
            list = that.data.list
            var resList = res.data.result.list
            for (var i in resList) {
              list.push(resList[i])
            }
          } else {
            list = res.data.result.list
          }

          that.setData({
            list: list
          })
        }
      },
      fail: function() {
        loading = false
        wx.hideLoading()
      }
    })
  },

  getMore: function() {
    console.log('加载更多')
    if (loading || endMore) {
      return
    }
    var that = this
    var page = parseInt(that.data.page)
    that.setData({
      page: page + 1,
      loadingType: 'onMore'
    })

    that.initView()
  },

  telPhone: function(e) {
    var tel = e.currentTarget.dataset.tel
    if (!tel) {
      return
    }

    wx.makePhoneCall({
      phoneNumber: tel
    })
  },

  swichNav: function(e) {
    var cateid = parseInt(e.currentTarget.dataset.cateid)
    this.setData({
      cateid: cateid,
      list: [],
      page: 1,
      loadingType: ''
    })
    loading = false
    endMore = false

    this.initView()
  }

})