var app = getApp()
var url = ''
Page({
  data: {
    ejectshow: true,
    hidden: false,
    toastHidden: true,
    slide: {},//首页幻灯片
    url: '',//网址信息
    room: {},//房间信息
    assesslist: {},//住客评价
    selected: true,
    selected1: false,
    swiperCurrent: 0,
    swiperCurrent1: 0,
    showview: true,
    showView: true,
    index_info: [],
    score : '',
    info: [
      {
        payment: '到店付',
        img: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/.png',
        id: '1',
        state: '1',
        price: ''
      },
      {
        payment: '在线付',
        img: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/zaixianfu.png',
        id: '2',
        state: '2'
      }
    ],
    star5: [
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
    ],
    star4: [
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/star_none.png' },
    ],
    star3: [
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/star_none.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/star_none.png' },
    ],
    star2: [
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/star_none.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/star_none.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/star_none.png' },
    ],
    star1: [
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/xing.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/star_none.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/star_none.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/star_none.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/star_none.png' },
      { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/star_none.png' },
    ],
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  swiperChange1: function (e) {
    this.setData({
      swiperCurrent1: e.detail.current
    })
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true,
      hidden: false,
      toastHidden: true,
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true,
      hidden: true,
      toastHidden: false,
    })
  },
  eject: function () {
    this.setData({
      ejectshow: true,
    })
  },
  ejectimg: function () {
    this.setData({
      ejectshow: false,
    })
  },
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
    // 获取网址信息
    app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageAttachurl',
        'cachetime': '0',
        success: function (res) {

            that.setData({
                url: res.data
            })
        },
    })
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.setNavigationBarTitle({
      title: '酒店详情'
    })
    that.setData({
      index_info: options,
      hotel_name: options.name
    })
    showview: (options.showview == "true" ? true : false)
    showView: (options.showView == "true" ? true : false)
    var hotel_id = wx.getStorageSync('hotel')
   
    that.setData({
      hotel_id: hotel_id
    })
    that.gethome();
    that.getHotel();
    that.getbanner();
    that.getpl();
    that.getsd();
 
  
    
    //  获取酒店评分
    app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageJdscore',
      'cachetime': '0',
      data: { seller_id: hotel_id },
      success: function (res) {

        that.setData({
          score: res.data
        })
      },
    })
    
   
  },
  getsd : function(){
      //  获取评价数量
      var that = this;
      app.util.request({
          url: 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageAssesscount',
          'cachetime': '0',
          data: { seller_id: that.data.hotel_id },
          success: function (res) {

              that.setData({
                  total: res.data.total
              })
          },
      })
  },
  getpl : function(){
      var that = this;
      // 获取评价信息
      app.util.request({
          url: 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageAssessList',
          'cachetime': '0',
          data: { seller_id: that.data.hotel_id },
          success: function (res) {

              var len = res.data.length
              that.setData({
                  assesslist: res.data[0],
                  ass: res.data,
                  len: len
              })
          },
      })
  },
     // 获取房间信息
 gethome : function(){
    var that = this;
     app.util.request({
         url: 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGetroom',
         'cachetime': '0',
         data: { seller_id: that.data.hotel_id },
         success: function (res) {

             var newarr = res.data
             for (var i = 0; i < newarr.length; i++) {
                 newarr[i].img = newarr[i].img.split(",")
                 that.setData({
                     room: newarr
                 })
             }

         },
     })
 },
    // 获取首页幻灯片信息
  getbanner : function(){
      var that = this;
      app.util.request({
          url: 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageSlide',
          'cachetime': '0',
          data: { seller_id: that.data.hotel_id },
          success: function (res) {

              that.setData({
                  slide: res.data
              })
          },
      })
  },

 
  /**
   * 获取酒店信息
  */
  getHotel : function(){
      var that = this;
      // 获取酒店信息
      app.util.request({
          url: 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGethotel',
          'cachetime': '0',
          success: function (res) {

              for (var i = 0; i < res.data.length; i++) {
                  if (that.data.hotel_id == res.data[i].id) {

                      // 获取酒店的经纬度
                      var lat = res.data[i].coordinates
                      var ss = lat.split(",")

                      // 获取两者之间的距离
                      var lat1 = wx.getStorageSync("location").lat
                      var lng1 = wx.getStorageSync("location").lng
                      var lat2 = ss[0]
                      var lng2 = ss[1]
                      var radLat1 = lat1 * Math.PI / 180.0;
                      var radLat2 = lat2 * Math.PI / 180.0;
                      var a = radLat1 - radLat2;
                      var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
                      var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                      s = s * 6378.137;
                      s = Math.round(s * 10000) / 10000;
                      var s = s.toFixed(2)
                      that.setData({
                          seller: res.data[i],
                          s: s,
                          ss: ss,
                          name: res.data[i].name,
                          address: res.data[i].address
                      })
                      wx.setNavigationBarTitle({
                          title: res.data[i].name
                      })
                  }
              }
          },
      })
  },
  // 下拉刷新
  onPullDownRefresh() {
    var that = this
    // pageNum = 1;
    that.onLoad()
    wx.stopPullDownRefresh();
  },
  // tab切换
  state: function () {
    var that = this;
    that.setData({
      showview: (!that.data.showview)
    })
  },
  state: function (e) {
    var id = e.currentTarget.dataset.id
    var home = this.data.home
    for (var i = 0; i < home.length; i++) {
      if (home[i].id == id) {

      }
    }
    this.setData({
      'currentItem': id
    })
  },
  info:function(e){
    wx:wx.navigateTo({
      url:'../introduce/introduce?hotel_id'+this.data.hotel_id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  hotel_info: function (e) {
    wx: wx.navigateTo({
      url: '../introduce/introduce?hotel_id' + this.data.hotel_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  dizhi: function (e) {
    var that = this
    var lat2 =Number(that.data.ss[0])
    var lng2 = Number(that.data.ss[1])

    wx.openLocation({
      latitude: lat2,
      longitude: lng2,
      name: that.data.name,
      address: that.data.address
    })
  },
  phone:function(e){
    wx.makePhoneCall({
      phoneNumber: this.data.seller.link_tel
    })
  },
  // 手风琴效果
  kindToggle: function (e) {
    var id = e.currentTarget.id
    var room = this.data.room
    for (var i = 0, len = room.length; i < len; ++i) {
      if (room[i].id == id) {
        room[i].open = !room[i].open
      } else {
        room[i].open = false
      }
    }
    this.setData({
      room: room,
      id: e.currentTarget.id
    });
  },

  // 弹框显示
  kindToggle1: function (e) {
    var id = e.currentTarget.id
    var room = this.data.room
    for (var i = 0, len = room.length; i < len; ++i) {
      if (room[i].id == id) {
        room[i].openr = !room[i].openr
      } else {
        room[i].openr = false
      }
    }
    this.setData({
      room: room,
      id: e.currentTarget.id
    });
  },
  ejectblock: function (e) {
    var id = e.currentTarget.id
    var room = this.data.room
    for (var i = 0, len = room.length; i < len; ++i) {
      if (room[i].id == id) {
        room[i].openr = !room[i].openr
      } else {
        room[i].openr = false
      }
    }
    this.setData({
      room: room,
      id: e.currentTarget.id
    });
  },
  // 点击跳转订单
  book: function (e) {
    var id = this.data.id
    var oid = e.currentTarget.dataset.oid
    var room = this.data.room
    if (this.data.id == e.currentTarget.id) {
      for (var i = 0; i < room.length; i++) {
        if (room[i].id == id) {
          if (oid == 1) {
            wx.navigateTo({
              url: '../132/123?time=' + this.data.index_info.time + '&start_time=' + this.data.index_info.date + '&dd=' + this.data.index_info.dd + '&to=' + this.data.index_info.to + '&end_time=' + this.data.index_info.tomorrow + '&price=' + this.data.room[i].shop_price + '&name=' + this.data.room[i].name + '&num=' + this.data.room[i].total_num + '&oid=' + 1 + '&id=' + this.data.room[i].id + '&hotel_name=' + this.data.hotel_name + '&hotel_id=' + this.data.hotel_id
            })
          } else {
            wx.navigateTo({
              url: '../132/123?time=' + this.data.index_info.time + '&dd=' + this.data.index_info.dd + '&to=' + this.data.index_info.to + '&start_time=' + this.data.index_info.date + '&end_time=' + this.data.index_info.tomorrow + '&price=' + this.data.room[i].online_price + '&name=' + this.data.room[i].name + '&num=' + this.data.room[i].total_num + '&oid=' + 2 + '&id=' + this.data.room[i].id + '&hotel_name=' + this.data.hotel_name + '&hotel_id=' + this.data.hotel_id
            })
          }
        }
      }

    }



  },
  // 拨打电话
  call_phone: function () {
    wx.makePhoneCall({
      phoneNumber: '027-25412587'
    })
  }

})