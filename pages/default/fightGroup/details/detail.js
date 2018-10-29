// pages/default/fightGroup/details/detail.js
var wxParse = require('../../../../vendor/wxParse/wxParse.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items : [],   //商品详情
    content : '', //文章内容
    images:[],  //详情图片

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var id = options.id;
      var that = this;
    //   app.util.getUserInfo(function () {
        app.util.request({
          url: 'entry/ewei_shopv2/mobile&r=groups.goods.get_index',
          data: {
            id : id
          },
          success: function (res) {
            var item = res.data;
            var content = res.data.content;
       
            var images = res.data.thumb_url;
            that.setData({
              items : item,
              content : wxParse.wxParse('article', 'html', content, that, 5),
              images: images,

            })
         
            wx.hideLoading()
          },
         
          fail: function () {
            wx.hideLoading()
          }
        })
    //   })
  },

  /*创建订单*/
  toPayOrder(e) {
    console.log(e);
    const that = this
    var id =e.currentTarget.dataset.id;
    
    // wx.showLoading({
    //   title: '加载中...',
    // })
    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=groups.orders.get_confirms',
        data : {
          id : id,
          type: 'single'
        },
        success: function (res) {
        console.log(res);
        console.log(66666666)
          wx.hideLoading()
            // 跳转到 order/create
          
            if (res.data.status == 0) {
              wx.showModal({
                title: '提示',
                content: res.data.result.message
              })
            }else{
              wx.navigateTo({
                url: "/pages/default/fightGroup/order/creat/creat?type=" +'single'+"&id="+id
              })
            }
          },
       
        fail: function () {
          wx.hideLoading()
        }
      })
    // })

  },

  /*创建团购*/
  groupOrder(e) {
    console.log(e);
    const that = this
    var id =e.currentTarget.dataset.id;
    console.log(id)
    // wx.showLoading({
    //   title: '加载中...',
    // })
    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=groups.orders.get_confirms',
        data : {
          id : id,
          type: 'groups'
        },
        success: function (res) {
     
          wx.hideLoading()
            // 跳转到 order/create
          
          if (res.data.is_team == 0) {
              wx.showModal({
                title: '提示',
                content: '商品活动已过期'
              })
            }else{
              wx.navigateTo({
                url: "/pages/default/fightGroup/offered/index?id="+id
              })
            }
          },
       
        fail: function () {
          wx.hideLoading()
        }
      })
    // })

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