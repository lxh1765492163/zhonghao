var js = require('../../../../vendor/app.js')
var app = getApp()
var siteInfo = require('../../../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pagetype: 4, // 页面类型
    page: {}, // 页面信息
    modules: [], // 模块
    items: null,
    userInfo: {}, // 用户信息
    data: [],
    tabid: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.showLoading({
      title: '努力加载中...',
      mask: true,
    });

    // const mark = wx.getStorageSync('mark');
    app.util.getUserInfo(function () {
      var userInfo = wx.getStorageSync("userInfo");
      var openid = userInfo.openid;
      // 判断身份
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.index.get_main',
        data : {
          openid: openid
        },
        success: function (res) {
          wx.hideLoading();
          console.log(res)
          if (res.data.status == 0) {
            //跳转到注册页
            // if (mark == 'mark')
            that.setData({
              items: res.data,
            })
            if (res.data.result.register == 0) {
              wx.showLoading({
                title: '正在前往申请分销',
                mask: true,
              });
              var timer = setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/default/commission/register/register'
                })
              }, 2000)

            }
          }
          else {
            that.setData({
              items: res.data.result,
            })
            wx.request({
              url: app.siteInfo.domain + '/app/index.php?c=wxapp&a=module&do=nav&uniacid=' + app.siteInfo.uniacid + '&type=' + that.data.pagetype + '&openid=' + userInfo.openid,
              method: 'GET',
              success: function (res) {
                wx.hideLoading();
                if (res.data.errno == 0) {
                  that.setData({
                    modules: res.data.module,
                    page: res.data.page
                  })
                } else {
                  console.log(res.data.message);
                }
              },
              fail: function (res) {
                wx.hideLoading();
                console.log('加载失败');
                console.log(res);
              }
            })
            wx.setNavigationBarTitle({
              title: '我的小店',
            })
          }
        },
        fail: function (res) {
          console.log(res)
        }
      })
    })
  },
  changetab: function (e) {
    console.log(e)
    var tabid = e.currentTarget.dataset.id;
    this.setData({
      tabid: tabid
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=index.get_diyMenus',
      method: 'GET',
      data: {
        id: siteInfo.template_id
      },
      success: function (res) {
        // console.log(res)
        var datas = res.data.data;
        var data = res.data;
        var style = res.data.style;
        // console.log(datas)
        that.setData({
          datas: datas,
          style: style,
          data: data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // const that = this;

    // console.log(mark);
    // wx.clearStorage();
    // 读取模块信息
    // this.getModule()
  },

  /**
   * 取模块数据
   */
  // getModule: function () {
  //   const that = this

  //   js.getModules(that.data.pagetype, function (res) {
  //     console.log(res);
  //     that.setData({
  //       modules: res.data.module,
  //       page: res.data.page
  //     })
  //     that.parseModules()
  //   })
  // },

  /**
   * 解析模块
   */
  // parseModules: function () {
  //   const that = this
  //   var modules = that.data.modules

  //   app.util.parseModules(modules, function (res) {
  //     that.setData({
  //       modules: res
  //     })
  //   })
  // },

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