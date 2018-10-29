var js = require('../../../vendor/app.js')
var app = getApp()
var siteInfo = require('../../../config.js');
var WxParse = require('../../../vendor/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    pagetype: 0, // 页面类型 0:默认 1:自定义
    location: null, // 用户位置
    local: null,
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const id = options.id
    if (id) {
      that.setData({
        id: id
      })
    }
   
    app.util.getUserInfo(function () {
      //更新数据 
      that.initView()
    })  
    app.util.request({
        url: 'entry&m=ewei_shopv2&do=mobile&r=index.get_diyMenus',
        method: 'GET',
        data: {
            id: siteInfo.template_id
        },
        success: function (res) {

            var datas = res.data.data;

            var data = res.data;
            var style = res.data.style;

            that.setData({
                datas: datas,
                style: style,
                data: data,

            })

        }
    })
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
    this.initView()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    //
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
  },

  /**
   * 初始化视图
   */
  initView: function () {
    const that = this   
    app.util.initView(app.siteInfo.domain + '/app/index.php?c=wxapp&a=page&do=main&id=' + that.data.id+'&uniacid=' + app.siteInfo.uniacid, function(data) {  
      that.setData({ 
        items: data.result,
        pagetype: 1
      }) 
      for (var i in data.result){
         
          if (data.result[i].id == 'richtext') {
          
              WxParse.wxParse('content', 'html', data.result[i].params.content, that, 5);
          }
      }
      var title = that.data.items.title
    
      wx.setNavigationBarTitle({
            title: title,
      })
    })
  },

  parseModule: function (m) {

      if (!m) {
          return
      }
      const that = this

      for (var i in m) {

          if (m[i].id == 'merchgroup' && m[i].params.openlocation) {

              var item = m[i]
              var flag = i
              //取坐标
              var local = that.data.local
              if (local == null) {
                  wx.getLocation({
                      type: 'gcj02',
                      success: function (res) {

                          var latitude = res.latitude
                          var longitude = res.longitude
                          that.setData({
                              local: res
                          })

                      }
                  })
              }

              var data = {
                  lat: local.latitude,
                  lng: local.longitude,
                  item: item
              }
              app.util.request({
                  url: 'entry/ewei_shopv2/mobile&r=diypage.index.get_merch',
                  method: 'POST',
                  header: {
                      'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: JSON.stringify(data),
                  success: function (res) {

                      if (res.data.status == 1) {
                          var list = res.data.result.list
                          if (list && list.length > 0) {
                              var it = that.data.items;

                              it[flag].data = list
                              that.setData({
                                  items: it
                              })
                          }
                      }
                  },
                  fail: function (e) {
                      console.log(e)
                  }
              })


          }

          if (m[i].id == 'richtext') {
              WxParse.wxParse('content', 'html', m.params.content, that, 5);
          }
      }
  },

  // 提交搜索
  formSubmit: function (e) {
    const keywords = e.detail.value.keywords
    this.postSubmit(keywords)
  },

  /**
   * 搜索提交
   */
  searchSubmit: function (e) {
    const keywords = e.detail.value
    this.postSubmit(keywords)
  },

  /**
   * 提交搜索
   */
  postSubmit: function (keywords) {
    //if (keywords != '') {
      //跳转到列表页
      wx.navigateTo({
        url: '/pages/default/goods/list/list?r=goods.index.get_list&keywords=' + keywords,
      })
   // }
  },

  /**
   * 选择城市
   */
  selectCity: function () {
    wx.navigateTo({
      url: '/pages/custom/switchcity/switchcity'
    })
  },
  telPhone: function () {
      wx.makePhoneCall({
          phoneNumber: app.siteInfo.tel, //此号码并非真实电话号码，仅用于测试
          success: function () {
              console.log("拨打电话成功！")
          },
          fail: function () {
              console.log("拨打电话失败！")
          }
      })
  },
})