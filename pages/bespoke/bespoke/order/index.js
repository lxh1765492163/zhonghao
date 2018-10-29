// pages/default/bespoke/order/index.js
var siteInfo = require('../../../../config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items : [],
    address : '',
    allprice : 0,
    id : '',
    times: '请选择预约时间',
    dates : '请选择预约日期',
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // var newData = 
    this.setData({
      times: e.detail.value
    })
  },
  /**
   * 添加联系人
  */
  tabjump : function(e){
    wx.redirectTo({
          url: '/pages/default/bespoke/address/address?type=1',
    })
  },
 
  // 选择地址
  selectAddress: function () {
    wx.redirectTo({
      url: "/pages/default/bespoke/select/select?type=2"
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var id = options.select_address_id ? options.select_address_id : '';
    var staffid = options.staff_id ? options.staff_id :'';
    var selectid = options.select_address_id ? options.select_address_id : ''; 
    that.setData({
      id : id,
      staffid: staffid
    })
    var that = this;
    that.getgoods();

  },
  //获取信息
  getgoods : function(){
    var that = this;
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&do=order&m=qwx_shangmen',
        method: 'GET',
        data: {
          i: siteInfo.uniacid,
          select_address_id : that.data.id,
          select_staff_id: that.data.staffid,
        
        },
        success: function (res) {
          console.log(res)
          console.log(12312312313);
          var datas = res.data;
          var items = res.data.cart_goods;
          var address = res.data.address;
          var money = res.data.sum_money;
          var time = res.data.sum_time;
          that.setData({
            items: items,
            address: address,
            money: money,
            time: time,
            datas : datas,
          })
        }
      })
    })
  },

  /**
   * 立即下单
  */
  createOrder : function(){
    var that = this;
    console.log(that.data.datas.select_yuyue_time)
      app.util.getUserInfo(function () {
          app.util.request({
              url: 'entry&do=order&m=qwx_shangmen',
              method: 'GET',
              data: {
                  i: siteInfo.uniacid,
                  select_staff_id: that.data.staffid,
                  select_yuyue_time: that.data.datas.select_yuyue_time,
                  order : 1,
              },
              success: function (res) {
                  console.log(res.data)
                  if(res.data.code == 0){
                     wx.showModal({
                         title: '提示',
                         content: res.data.msg,
                         success: function (res) {
                             if (res.confirm) {
                                 console.log('用户点击确定')
                             } else if (res.cancel) {
                                 console.log('用户点击取消')
                             }
                         }
                     })
                }else{
                    wx.navigateTo({
                        url: '/pages/default/bespoke/order/detail/detail?orderid=' + res.data + '&uid=' + that.data.address.uid,
                    })
                }
              }
          })
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
    var that = this;
    // that.getgoods();
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