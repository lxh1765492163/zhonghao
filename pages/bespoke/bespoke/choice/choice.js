// pages/default/bespoke/choice/choice.js
var siteInfo = require('../../../../config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods : [], //商品
  },
  /**
   * 立即预约
  */
  createOrder : function(){
    if(this.data.goods==''){
      wx.showModal({
        title: '提示',
        content: '请先添加商品',
      })
      
    }else{
      wx.navigateTo({
        url: '/pages/default/bespoke/order/index',
      })
    }
   
  },
  /**
   *  商品数量加减操作
  */
  changeCartNum : function(e){
    // console.log(e);
    var that = this;
    // 操作
    const ac = e.currentTarget.dataset.action;
    //下标
    var index = e.currentTarget.dataset.index;
    //id
    var id = e.currentTarget.dataset.id;
    var datas = this.data.goods
    //商品数量
    var num = parseInt(this.data.goods[index].buy_num);
    //商品价格
    var price = this.data.goods[index].buy_price;
    var daojia = this.data.goods[index].daojia;
    if (ac == 'plus'){
      datas[index].buy_num = num + 1 ;
      num = this.data.goods[index].buy_num;
      this.setData({
        goods : datas
      })
      app.util.getUserInfo(function () {
        app.util.request({
          url: 'entry&is_ajax=1&op=add_cart&do=cart&m=qwx_shangmen',
          method: 'POST',
          data: {
            i: siteInfo.uniacid,
            goods_id: id,
            price : price,
            buy_num : num,
            html : 1,
          },
          success: function (res) {
          //  console.log(res);
          //  console.log(111111111);
           that.takeOrder();
          }
        })
      })
    } else if (ac == 'minus' && num >= 0){
      datas[index].buy_num = num - 1;
      num = this.data.goods[index].buy_num;
      this.setData({
        goods: datas
      })
      app.util.getUserInfo(function () {
        app.util.request({
          url: 'entry&is_ajax=1&op=add_cart&do=cart&m=qwx_shangmen',
          method: 'POST',
          data: {
            i: siteInfo.uniacid,
            goods_id: id,
            price: price,
            buy_num: num,
            html: 1,
          },
          success: function (res) {
            // console.log(res);
            // console.log(111111111);
            that.takeOrder();
          }
        })
      })
    }
   
  },
 /**
  *取购物车数据 
  */ 
  takeOrder : function(){
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&do=cart&m=qwx_shangmen',
        method: 'POST',
        data: {
          i: siteInfo.uniacid,
        },
        header: {
          // "Accept": "application/json"
        },
        success: function (res) {
          wx.hideLoading()
          console.log(res);
          console.log(2333333333333);
          var goods = res.data.cart_goods;
          var sum_time = res.data.sum_time;
          var sum_num = res.data.sum_num;
          var sum_money = res.data.sum_money;

          that.setData({
            goods: goods,
            sum_time: sum_time,
            sum_num: sum_num,
            sum_money: sum_money,
          })
        }
      })
    })
  },
 /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.takeOrder()
    // this.changeCartNum();
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