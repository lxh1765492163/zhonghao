// pages/ruzhu/ruzhu.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    mop: [
      {
        url: '湖北省武汉市蔡甸大街208号',
        phone: '027-25412587'
      }
    ]
  },
  
  // 点击取消订单
  click2: function (e) {
    var that = this
    var order_id = e.currentTarget.dataset.oid
    console.log(order_id)
    app.util.request({
        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageCancelorder',
      'cachetime': '0',
      data: { order_id: order_id },
      success: function (res) {
        console.log(res)
        wx:wx.reLaunch({
          url: '../mylist/mylist',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var order_id = options.order_id
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    // 获取订单详情
    app.util.request({
        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageOrderdetails',
      'cachetime': '0',
      data: { order_id: order_id },
      success: function (res) {
        console.log(res)
        // var arrival_time = getel(arrival_time)
        var order = res.data
        order.arrival_time = order.arrival_time.slice(0,10)
        order.departure_time = order.departure_time.slice(0, 10)
        that.setData({
          order:res.data,
          // arrival_time: arrival_time
        })
        app.util.request({
            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGethotel',
          'cachetime': '0',
          success: function (res) {
            console.log(res)
            var seller = []
            for(let index in res.data){
              if (order.seller_id == res.data[index].id){
                  seller.push(res.data[index])
              }
            }
            console.log(seller)
            that.setData({
              seller: seller[0]
            })
          },
        })
      },
    })
  },
  dizhi: function (e) {
    var that = this
    console.log(that.data)
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
      success: function (e) {
        console.log(that.data)
        var latitude = e.latitude
        var longitude = e.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: that.data.seller.name,
          address: that.data.seller.address,
          scale: 28
        })
      }
    })

  },
  // 拨打电话
  call_phone: function () {
    var that = this
    console.log('e')
    wx.makePhoneCall({
      phoneNumber: that.data.seller.link_tel
    })
  },
  pay:function(e){
    var that = this
    console.log(that.data)
    // 订单id
    var order_id = that.data.order.id
    // 订单金额
    var money = that.data.order.dis_cost
    // 获取用户openid
    var openid = wx.getStorageSync('users').openid
    app.util.request({
        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPagePay',
      'cachetime': '0',
      data: { openid: openid, money: money },
      success: function (res) {
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function (res) {
            wx.showToast({
              title: '支付成功',
              duration: 1000
            })
            console.log(order_id)
            // 改变订单状态
            app.util.request({
                'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageCompleteorder',
              'cachetime': '0',
              data: { order_id: order_id },
              success: function (res) {
                console.log(res)
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../shouye/shouye',
                  })
                }, 1000)

              },
            })
          },

          'fail': function (res) {
            console.log(res);
            wx.showToast({
              title: '支付失败',
              duration: 1000
            })
            console.log(form_id)
            setTimeout(function () {
              wx.reLaunch({
                url: '../shouye/shouye',
              })
            },
            )

          },
        })
      },
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