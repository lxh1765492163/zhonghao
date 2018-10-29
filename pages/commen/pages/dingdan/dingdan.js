// pages/dingdan/dingdan.js
var app = getApp()
var util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['1间', '2间', '3间', '4间', '5间', '6间', '7间', '8间', '9间', '10间', '11间', '12间'],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用函数时，传入new Date()参数，返回值是日期和时间 
    conosle.log(options);
    console.log(2222222222222) 
    var time = util.formatTime(new Date());
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    
    // console.log(options)
    this.setData({
      price: options.price,
      stime: options.start_time,
      etime: options.end_time,
      day: options.time,
      dd: options.dd,
      to: options.to,
      room_id: options.id,
      room_name: options.name,
      name: options.name,
      hotel_name: options.hotel_name,
      hotel_id: options.hotel_id,
      // 判断用户选择的是到店付款还是在线付款
      oid: options.oid
    })
  },
  bindPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var num = Number(e.detail.value)
    var nn = num + 1
    // console.log(nn)
    this.setData({
      index: e.detail.value,
      nn: nn
    })
  },
  // 提交订单
  formSubmit: function (e) {
    var that = this
    // console.log(that.data)
    // console.log(e)
    // 判断用户输入的名字以及手机号
    var user_tel = e.detail.value.user_tel
    var user_name = e.detail.value.user_name
    // console.log(user_name.length)
    if (user_name.length == 0) {
      wx: wx.showToast({
        title: '请输入名字',
        icon: '',
        image: '',
        duration: 1500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (user_name.length > 4) {
      wx.showToast({
        title: '名字太长啦',
        icon: 'success',
        duration: 1500
      })
    } else if (user_name.length <= 4) {
      if (user_tel.length > 0) {
        // 判断用户输入的手机号是否正确
        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (user_tel.length == 0) {
          wx.showToast({
            title: '手机号不能为空',
            icon: 'success',
            duration: 1500
          })
          return false;
        } else if (user_tel.length < 11) {
          wx.showToast({
            title: '手机号长度有误！',
            icon: 'success',
            duration: 1500
          })
          return false;
        } else if (!myreg.test(user_tel)) {
          wx.showToast({
            title: '手机号格式错误！',
            icon: 'success',
            duration: 1500
          })
          return false;
        } else {
          wx.showToast({
            title: '手机号填写正确',
            icon: 'success',
            duration: 1500
          })
          // 用户的openid
          var openid = wx.getStorageSync('users').openid
          // 用户的id
          var uese_id = wx.getStorageSync('users').id

          // 得到该订单的金额以及用户下单的房间数
          if (that.data.nn == null) {
            var money = that.data.price
            var room_num = 1
          } else {
            var money = that.data.price * that.data.nn
            var room_num = that.data.nn
          }
          // var money = 0.01
          // 得到用户入住酒店的时间起止
          var start_time = that.data.dd
          console.log(start_time)
          var end_time = that.data.to
          // 得到用户入住的时间
          var days = that.data.day

          // 获取商家的id以及名字
          var hotel_id = that.data.hotel_id
          var hotel_name = that.data.hotel_name

          // 获取房间的id级房间型号
          var room_id = that.data.room_id
          var room_name = that.data.room_name

          // 用户输入的名字以及手机号
          var user_tel = e.detail.value.user_tel
          var user_name = e.detail.value.user_name

          // 判断用户选择的是到店付还是在线付
          var oid = that.data.oid
          // 判断保留的日期
          if (oid == 1) {
            var cerated_time = that.data.dd
          } else {
            var cerated_time = that.data.to
          }
          // console.log('该用户选择的是' + oid)
          // console.log('该用户的名字' + user_name)
          // console.log('该用户的手机号' + user_tel)
          // console.log('该用户的openid为' + openid)
          // console.log('该用户的user_id为' + uese_id)
          // console.log('用户入住的起止时间从' + start_time + '开始，到' + end_time + '结束')
          // console.log("本订单的金额" + money)
          // console.log("该用户一共住" + days + '天')
          // console.log("商家的id" + hotel_id)
          // console.log("商家的名字" + hotel_name)
          // console.log("房间的id" + room_id)
          // console.log("房间的名字" + room_name)
          // console.log(uese_id)
          // console.log(money)
          // console.log(hotel_id)
          // console.log(hotel_name)
          // console.log(start_time)
          // console.log(end_time)
          // console.log(user_tel)
          // console.log(days)
          // console.log(user_name)
          // console.log(room_name)
          // console.log(room_num)
          // console.log(oid)
          // console.log(cerated_time)
          // console.log(room_id)
          if (oid == 1) {
            console.log('用户选择到店付')
            console.log(oid)
            //  提交订单
            app.util.request({
              'url': 'entry/wxapp/addorder',
              'cachetime': '0',
              data: { 
                  user_id: uese_id,
                  online_price: money,
                  seller_id: hotel_id, 
                  seller_name: hotel_name, 
                  arrival_time: start_time,
                  departure_time: end_time,
                  tel: user_tel,
                  days: days,
                  name: user_name,
                  room_type: room_name,
                  room_num: room_num,
                  type: oid, 
                  persist: cerated_time, 
                  goods_id: room_id},
              success: function (res) {
                 console.log(res)
                 var order_id = res.data
                 if(res.data!="error"){
                   // 改变订单状态
                   app.util.request({
                     'url': 'entry/wxapp/completeorder',
                     'cachetime': '0',
                     data: { order_id: order_id },
                     success: function (res) {
                       console.log(res)
                       wx.reLaunch({
                         url: '../yuding/yuding?start_time=' + that.data.dd + '&end_time=' + that.data.to + '&day=' + that.data.day + '&money=' + money + '&room_name=' + room_name + '&hotel_name=' + hotel_name
                       })
                     },
                   })
                  
                 }else{
                   wx:wx.showToast({
                     title: '订单生成失败',
                     icon: '',
                     image: '',
                     duration: 1000,
                     mask: true,
                     success: function(res) {},
                     fail: function(res) {},
                     complete: function(res) {},
                   })
                 }
              },
            })
          } else {
            console.log('用户选择在线付')
            //  提交订单
            app.util.request({
              'url': 'entry/wxapp/addorder',
              'cachetime': '0',
              data: {
                user_id: uese_id,
                online_price: money,
                seller_id: hotel_id,
                seller_name: hotel_name,
                arrival_time: start_time,
                departure_time: end_time,
                tel: user_tel,
                days: days,
                name: user_name,
                room_type: room_name,
                room_num: room_num,
                type: oid,
                persist: cerated_time,
                goods_id: room_id
              },
              success: function (res) {
                console.log(res)
                var order_id = res.data
                if (res.data != "error") {
                  //  去支付
                  console.log(openid)
                  console.log(money)
                  app.util.request({
                    'url': 'entry/wxapp/pay',
                    'cachetime': '0',
                    data: { openid: openid, money: money },
                    success: function (res) {
                      console.log(res)
                      wx.requestPayment({
                        'timeStamp': res.data.timeStamp,
                        'nonceStr': res.data.nonceStr,
                        'package': res.data.package,
                        'signType': res.data.signType,
                        'paySign': res.data.paySign,
                        'success': function (res) {
                          console.log(res.data)
                          console.log(res)
                          wx.showToast({
                            title: '支付成功',
                            duration: 1000
                          })
                          console.log(order_id)
                          // 改变订单状态
                          app.util.request({
                            'url': 'entry/wxapp/completeorder',
                            'cachetime': '0',
                            data:{order_id:order_id},
                            success: function (res) {
                              console.log(res)
                              wx:wx.reLaunch({
                                url: '../shouye/shouye',
                                success: function(res) {},
                                fail: function(res) {},
                                complete: function(res) {},
                              })
                            },
                          })
                        },

                        'fail': function (res) {
                          console.log(res);
                          wx.showToast({
                            title: '支付失败',
                            duration: 1000
                          })
                        },
                      })
                    },
                  })
                } else {
                  wx: wx.showToast({
                    title: '订单生成失败',
                    icon: '',
                    image: '',
                    duration: 1000,
                    mask: true,
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }
              },
            })
          }


        }
      } else {
        wx.showToast({
          title: '请输入手机号',
          icon: 'success',
          duration: 1500
        })
      }
    }
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