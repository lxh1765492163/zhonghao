//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    var that = this;
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    }),
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=keyrYPFIH6nbVAKn32lAnDcdweWuhGnq&location=' + latitude + ',' + longitude + '&output=json',
          success: function (res) {
            var city = res.data.result.addressComponent.city;
            that.setData({ dress: city });
          },
          fail: function () {
            page.setData({ dress: "获取定位失败" });
          },
        })
      }
    })
  },
  call_phone:function(){
    wx.makePhoneCall({
      phoneNumber: '027-25412587'
    })
  },
  pay:function(){
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
      },
      'fail': function (res) {
      }
    })
  },
  tomap: function (e) {
    console.log(1111111111)
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
      success: function (e) {
        var latitude = e.latitude
        var longitude = e.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: '如家',
          address: '北京',
          scale: 28
        })
      }
    })

  }
});