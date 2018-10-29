// pages/default/fightGroup/offered/index.js


var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods : [] ,//商品信息
    teams : [], //更多好团信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var id = options.id;
    var that = this;
    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=groups.goods.get_openGroups',
        method : 'GET',
        data: {
          id: id,
        },
        success: function (res) {
          console.log(res);
          console.log(11111111);
          var goods = res.data.goods;
          var teams = res.data.teams;
       
          that.setData({
            goods : goods,
            teams : teams
          })
        },

        fail: function () {
          wx.hideLoading()
        }
      })
    // })
  },
  /*创建订单*/
  toPayOrder(e) {
    console.log(e);
    const that = this
    var id = e.currentTarget.dataset.id;
    console.log(id)
    // wx.showLoading({
    //   title: '加载中...',
    // })
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=groups.orders.get_confirms',
        data: {
          id: id,
          type: 'groups',
          heads : 1
        },
        success: function (res) {
          console.log(res);
          console.log(888888888);
          wx.hideLoading()
          // 跳转到 order/create

          if (res.data.status == 0) {
            wx.showModal({
              title: '提示',
              content: res.data.result.message
            })
          } else {
            wx.navigateTo({
              url: "/pages/default/fightGroup/order/creat/creat?type=" + 'groups' + "&id=" + id
            })
          }
        },

        fail: function () {
          wx.hideLoading()
        }
      })
    })

  },
  /*我要参团*/

  myoffered : function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/default/fightGroup/offered/groupsdetail/index?id='+id,
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