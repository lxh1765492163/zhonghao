var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    list: [],
    page: 1,
    end: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initView()
  },

  initView: function() {
    var that = this
    app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.myshop.index.get_main',
        success: function(res) {
        //   if (res.data.status == 1) {
            that.setData({
              items: res.data
            })
            that.getList()
          }
        // }
      })
    })
  },

  getList: function() {
    var that = this

    app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.myshop.index.get_goods',
        data: {
          page: that.data.page,
          mid: ''
        },
        success: function(res) {
          var ret = res.data.result
          if (ret.total <= 0) {
            that.setData({
              end: true
            })
          } else {
            if (ret.list.length <= 0 || ret.list.length < ret.pagesize) {
              that.setData({
                end: true
              })
            } else {
            }
          }
          that.setData({
            list: ret.list
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
})