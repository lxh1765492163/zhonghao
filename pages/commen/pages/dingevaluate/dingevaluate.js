// dingevaluate.js
var app = getApp()
var count = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 点击照片的数据
    avatarUrl1: null,
    avatarUrl2: null,
    avatarUrl3: null,
    avatarUrl4: null,
    pics: [],
    stars: [0, 1, 2, 3, 4],
    normalSrc: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/no-star.png',
    selectedSrc: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/full-star.png',
    halfSrc: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/half-star.png',
    key: 0,
    count: 0
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
    var user_info = wx.getStorageSync('user_info')
    console.log(options)
    that.setData({
      order_id: options.order_id,
      avatarUrl: user_info.avatarUrl,
      seller_id: options.seller_id
    })
    // 获取图片上传的url
    app.util.request({
      'url': 'entry/wxapp/url',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var url = res.data
        that.setData({
          url: res.data,
        })
      },
    })
  },
  choose: function (e) {
    var that = this
    var uniacid = wx.getStorageSync('uniacid')
    console.log(uniacid)
    var url = that.data.url
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: that.data.url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_hdjd',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              img1: res.data
            })
          },
          fail: function (res) {
            // console.log(res)
          },
        })
        that.setData({
          logo: tempFilePaths,
          log: true
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    // console.log(that.data.avatarUrl1)
    // 获取用户给酒店的评分
    var count = that.data.count
    // 获取用户评价的内容
    var text = e.detail.value.text
    var img = wx.getStorageSync('users').img
    // 用户的id
    var uesers = wx.getStorageSync('users')
    var uese_id = wx.getStorageSync('users').id
    console.log(uesers)
    // 获取订单id
    var order_id = that.data.order_id
    console.log(order_id)
    // 获取商家id
    var seller_id = that.data.seller_id
    console.log("用户给酒店的评分是" + count + "分")
    console.log("用户给酒店的评价是" + text)
    console.log("用户的id是" + uese_id)
    console.log("用户给订单id为" + order_id + "的评分")
    console.log("用户给商家id为" + seller_id + "的酒店评分")
    // console.log("用户评论的图片是："+avatarUrl1)
    // 保存评价
    if (count <= 0) {
      wx: wx.showToast({
        title: '给个评分吧',
        icon: '',
        image: '',
        duration: 1000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      if (text == '') {
        wx: wx.showToast({
          title: '没写评价哦',
          icon: '',
          image: '',
          duration: 1000,
          mask: true,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        app.util.request({
            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageSaveassess',
          'cachetime': '0',
          data: { user_id: uese_id, content: text, score: count, order_id: order_id, img: img, seller_id: seller_id},
          success: function (res) {
            console.log(res)
            wx: wx.reLaunch({
              url: '../shouye/shouye',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          },
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

  },
  //点击上传照片事件
  // getImg:function(e){
  //   var that = this;
  //   console.log('111111111')
  //   var url = wx.getStorageSync('url')
  //   console.log(url)
  //   wx.chooseImage({
  //     count: 4, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       var tempFilePaths = res.tempFilePaths;
  //       console.log(res)
  //       that.setData({ avatarUrl1: tempFilePaths[0] });
  //       that.setData({ avatarUrl2: tempFilePaths[1] });
  //       that.setData({ avatarUrl3: tempFilePaths[2] });
  //       wx:wx.uploadFile({
  //         url: url +'app/index.php?c=entry&a=wxapp&do=upload&m=zh_jd',
  //         filePath: 'tempFilePaths[0]',
  //         name: 'upfile',
  //         header: {},
  //         formData: {},
  //         success: function(res) {
  //           console.log(res)
  //         },
  //         fail: function(res) {},
  //         complete: function(res) {},
  //       })
  //       // app.util.request({
  //       //   'url': 'entry/wxapp/upload',
  //       //   'cachetime': '0',
  //       //   data: { upfile: tempFilePaths },
  //       //   success: function (res) {
  //       //     console.log(res)
  //       //   },
  //       // })
  //     },
  //     complete: function () {
  //       console.log("--成功--")
  //     }
  //   })
  // },
  //点击左边,半颗星
  selectLeft: function (e) {
    console.log('111111');
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    count = key
    this.setData({
      key: key,
      count: count
    })

  },
})