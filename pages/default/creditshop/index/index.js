var js = require('../../../../vendor/app.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagetype: 1256, // 页面类型
    page: {}, // 页面信息
    modules: [], // 模块
    items: {}, // 数据
    userInfo: {}, // 用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this

    // 读取模块信息
    this.getModule()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 取模块数据
   */
  getModule: function () {
    const that = this

    js.getModulesByPid(that.data.pagetype, function (res) {
      that.setData({
        modules: res.data.module,
        page: res.data.page
      })

      that.parseModules()
    })
  },

  /**
   * 解析模块
   */
  parseModules: function () {
    const that = this
    var modules = that.data.modules

    app.util.parseModules(modules, function (res) {
      that.setData({
        modules: res
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})