// pages/default/package/index.js

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    wx.showLoading({
      title: '',
      mask: true,
    })
    var that = this;
    var pid = options.pid;
    app.util.request({
      url: "entry&m=ewei_shopv2&do=mobile&r=goods.package.get_detail",
      method: 'GET',
      data: {
        pid: pid,
      },
      success: function (res) {
        console.log(res.data);
        var goods = [];
        var marketprice = 0; 
        var packageprice = 0;
        for (var i = 0; i < res.data.packgoods.length; i++) {
          var arr= {};
          marketprice = marketprice + parseFloat(res.data.packgoods[i].marketprice);
          packageprice = packageprice + parseFloat(res.data.packgoods[i].packageprice);
          arr.goodsid = res.data.packgoods[i].goodsid;
          arr.optionid = '';
          arr.total = 1; 
          goods.push(arr);
        }
        var discount = parseFloat(marketprice - packageprice).toFixed(2);
        wx.setNavigationBarTitle({
          title: res.data.package.title,
        })
        that.setData({
          list: res.data,
          goods: goods,
          marketprice: marketprice,
          packageprice: packageprice,
          discount: discount
        })
        wx.hideLoading();
      }
    })

  },
  buy:function(){
    var goods = JSON.stringify(this.data.goods)
    wx.navigateTo({
      url: '/pages/default/order/create/create?id=' + this.data.list.package.id + '&goods=' + goods +'&type=2',
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