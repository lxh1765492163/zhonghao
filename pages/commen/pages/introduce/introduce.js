// introduce.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fuwu:[
      {
        img:'/assets/images/naozhong@2x.png',
        text:'叫醒服务'
      },
      {
        img: '/assets/images/yinlian@2x.png',
        text: '支持银联'
      },
      {
        img: '/assets/images/naozhong@2x.png',
        text: '叫醒服务'
      },
      {
        img: '/assets/images/yinlian@2x.png',
        text: '支持银联'
      },
      {
        img: '/assets/images/naozhong@2x.png',
        text: '叫醒服务'
      },
      {
        img: '/assets/images/yinlian@2x.png',
        text: '支持银联'
      },
      {
        img: '/assets/images/naozhong@2x.png',
        text: '叫醒服务'
      },
      {
        img: '/assets/images/yinlian@2x.png',
        text: '支持银联'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    console.log(options)
    var hotel_id = wx.getStorageSync('hotel')
    // 获取酒店信息
    app.util.request({
        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGethotel',
      'cachetime': '0',
      success: function (res) {
         console.log(res)
         for(var i = 0;i<res.data.length;i++){
           if(hotel_id==res.data[i].id){
             that.setData({
               seller: res.data[i]
             })
           }
         }
       
        
      },
    })
    var seller = wx.getStorageSync('hotel')
    that.setData({
      seller: seller
    })
  },
tel:function(e){
var that = this
console.log(that.data)
wx.makePhoneCall({
  phoneNumber: that.data.seller.tel
})
},
address:function(e){
  var that = this
  console.log(that.data.seller.address)
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        name:that.data.seller.name,
        address:that.data.adderss,
        scale: 28
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