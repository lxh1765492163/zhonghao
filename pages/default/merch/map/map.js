// var bmap = require('../../../../utils/bmap-wx.min.js');
// var wxMarkerData = [];
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    id: 0,
    latitude: 0,//纬度 
    longitude: 0,//经度 
    speed: 0,//速度 
    accuracy: 16,//位置精准度 
    markers: [],
    covers: [],
    windowHeight : '',
  },
  /**
   * 获取屏幕高度
  */
  getUserWidth : function(){
      var that = this;
      wx.getSystemInfo({
          success: function (res) {
 
              console.log(res.windowHeight)
              that.setData({
                windowHeight: res.windowHeight
            })
          }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options);
    if (!options.id) {
      return
    }

    this.setData({
      id: options.id
    })
    this.getUserWidth();
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

  },

  initView: function () {
    const that = this
    if (!that.data.id) {
      return
    }

    /*
    var BMap = new bmap.BMapWX({
      ak: 'yT9O9wWw3HTTMXspB6d7Xm4Tp1T5uELX'
    });
    */

    wx.showLoading({
      title: '加载中...',
    })
    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=merch.map.get_main',
      data: {
        merchid: that.data.id
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.status == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.result.message,
            showCancel: false
          })
          return
        }

        /*BMap.regeocoding({
          location: res.data.result.store.lat + ',' + res.data.result.store.lng,
          iconPath: '/assets/images/marker_red.png',
          iconTapPath: '/assets/images/marker_red.png',
          success: function(data) {
            console.log(data)
            wxMarkerData = data.wxMarkerData;
            that.setData({
              markers: wxMarkerData,
              longitude: parseFloat(wxMarkerData[0].longitude),
              latitude: parseFloat(wxMarkerData[0].latitude)
            })
          },
          fail: function(data) {
            console.log(data)
          }
        })*/
        console.log(res);
        console.log(2222222222222222);
        var marker = {
          iconPath: "/assets/images/marker_red.png",
          id: 0,
          latitude: res.data.result.store.lat,
          longitude: res.data.result.store.lng,
          width: 26,
          height: 26
        }
        var markers = that.data.markers
        markers.push(marker)
        //初始化地图
        that.setData({
          items: res.data.result,
          markers: markers,
          longitude: res.data.result.store.lng,
          latitude: res.data.result.store.lat
        })

      },

      fail: function () {
        wx.hideLoading()
      }
    })
  },
  getlocation: function () {
    var that = this;
    var longitud = parseFloat(that.data.longitude);
    var latitud = parseFloat(that.data.latitude);
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res);
        console.log(33333333333333);
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy

        wx.openLocation({
          latitude: latitud,
          longitude: longitud,
          scale: 28
        })
      }
    })
  },
  telPhone: function (e) {
    const tel = e.currentTarget.dataset.tel
    if (!tel) {
      return
    }

    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})