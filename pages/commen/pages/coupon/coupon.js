// zh_jd/pages/coupon/coupon.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected_effective: true,
    selected_already: false,
    selected_overdue: false,
  },
  selected_effective: function (e) {
    var that = this
    that.setData({
      selected_effective: true,
      selected_already: false,
      selected_overdue: false,
    })
  },
  selected_already: function (e) {
    var that = this
    that.setData({
      selected_effective: false,
      selected_already: true,
      selected_overdue: false,
    })
  },
  selected_overdue: function (e) {
    var that = this
    that.setData({
      selected_effective: false,
      selected_already: false,
      selected_overdue: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    var hotel_id = options.hotel_id
    that.setData({
      hotel_id: hotel_id,
      money: options.money
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    that.reload()
  },
  reload: function (e) {
    var that = this
    // 获取当前系统时间
    function getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var seperator2 = ":";
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
      return currentdate;
    }
    var time = getNowFormatDate()
    var current_time = time.slice(0, 10)//当前时间
    console.log(time)
    that.setData({
      selected_effective1: that.data.selected_effective1,
      selected_already1: that.data.selected_already1,
      selected_overdue1: that.data.selected_overdue1,
    })
    // 获取优惠券集合
    var user_id = wx.getStorageSync("users").id
    app.util.request({
        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageCoupons',
      'cachetime': '0',
      data: { user_id: user_id },
      success: function (res) {
     
        // 获取优惠券集合
        var coupons = res.data.all
        // 已过期
        var overdue = []
        // 未过期
        var not_used = []
        for (let index in res.data.all) {
          for (let i in res.data.ok) {
            if (res.data.all[index].id == res.data.ok[i].coupons_id) {
              res.data.all[index].state = res.data.ok[i].state
          
            }
          }
          if (current_time > res.data.all[index].end_time) {
            overdue.push(res.data.all[index])
          } else {
            not_used.push(coupons[index])
          }
        }
        that.setData({
          overdue: overdue
        })
        let idDataSet = that.getIdDataSet(res.data.ok);
        that.classify(not_used, idDataSet);
      }
    })
    that.setData({
      selected_effective1: that.data.selected_effective1,
      selected_already1: that.data.selected_already1,
      selected_overdue1: that.data.selected_overdue1,
    })
  },

  //领取优惠券                      构建ok对象的coupon_id属性集
  getIdDataSet: function (jsonArr) {
    let dataset = new Array();
    let len = jsonArr.length;
    for (let i = 0; i < len; i++) {
      dataset.push(jsonArr[i].coupons_id);
    }
    return dataset;
    
  },
  classify: function (origin, comp) {
    let received = new Array();
    let unreceive = new Array();
    let len = origin.length;

    for (let i = 0; i < len; i++) {
      if (comp.indexOf(origin[i].id) === -1) {
        unreceive.push(origin[i]);
      } else {
        received.push(origin[i]);
      }
    }
    var arr = []
    for (let i in received) {
      if (received[i].state == 1) {
        arr.push(received[i])
      }
    }
  
    this.setData({
      received: received,
      arr: arr,
      unreceive: unreceive,
      len: received.length + unreceive.length
    });
  },
  // 领取优惠券
  receive: function (e) {
   
    var that = this
    // 点击的优惠券下标
    // var coupons_id = e.currentTarget.id;
    var index = e.currentTarget.dataset.index;
    var coupons_id = e.currentTarget.id
    // 用户id
    var user_id = wx.getStorageSync("users").id
    // 订单id
    // let coupons_id = this.data.unreceive[index].id
    // 领取优惠券接口
    app.util.request({
        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageAddcoupons',
      'cachetime': '0',
      data: { user_id: user_id, coupons_id: coupons_id },
      success: function (res) {
     
        that.setData({
          overdue: res.data
        })
      },
    })
    let unreceive = that.data.unreceive;
    let received = that.data.received;
    unreceive.splice(index, 1);
 
    this.setData({
      received: received,
      unreceive: unreceive
    });
    this.reload()
  },
  // 使用优惠券
  coupon: function (e) {
    var that = this
   
    var moeny = Number(that.data.money)
    
    var received = that.data.received
    var hotel_id = that.data.hotel_id
    var id = e.currentTarget.dataset.id
    var seller_id = e.currentTarget.id
    if (seller_id == hotel_id) {
      for (let i in received) {
        if (received[i].id == id) {
          var preferential = Number(received[i].preferential)
          var conditions = Number(received[i].conditions)
          var coupons_id = received[i].id
          if (conditions > moeny) {
            wx: wx.showToast({
              title: '小于优惠金额',
              icon: '',
              image: '',
              duration: 2000,
              mask: true,
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else {
            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1];   //当前页面
            var prevPage = pages[pages.length - 2];  //上一个页面
            prevPage.setData({
              coupon: preferential,
              coupons_id: id
            })
            wx: wx.navigateBack({
              url: '../132/123',
            })
          }
        }
      }
    } else {
      wx: wx.showToast({
        title: '无法使用',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        coupon: 0,
        coupons_id: ''
      })
      setTimeout(function(){
        wx: wx.navigateBack({
          url: '../132/123',
        })
      },2000)
      
    }

  },
  // 不使用优惠券
  not_user:function(e){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      coupon: 0,
      coupons_id: ''
    })
    wx: wx.navigateBack({
      url: '../132/123',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.reload()
    wx.stopPullDownRefresh()
  }

 
})