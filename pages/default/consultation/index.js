// pages/default/consultation/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    topList: "",      //分类
    index : '',
    imgs: [],
    id : '',
  },
  /*选项卡*/
  tabFun: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    this.setData({
        id: id
    });
    console.log(that.data.index)
    this.getList();
  },

  getList :function(){
      var that = this;
      // 请求列表
    //   app.util.getUserInfo(function () {
          app.util.request({
              url: 'entry/ewei_shopv2/mobile&r=article.list.get_list',
              method: 'GET',
              data: {
                  id: that.data.id
              },
              header: {
                  'Accept': 'application/json'
              },
              success: function (res) {

                  var items = res.data;
                  console.log(items);
                  that.setData({
                      items: items,
                  })

                  wx.hideLoading()

              },

          });
    //   })
  },
  /*页面跳转*/
  navTo: function (e) {
    var id = e.currentTarget.dataset.click;
    wx.navigateTo({
      url: 'details/details?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option)
    var that = this;
    var id = option.cateid ? option.cateid : '';
    that.setData({
        id: id,
    })
    that.getList();
    //请求  分类
    // app.util.getUserInfo(function(){
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=article.list.get_category',
        method: 'GET',
        data: {
        
        },
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          console.log(11111);
          console.log(res);
          var topList = res.data;
          that.setData({
            topList: topList
          })
          wx.hideLoading()
        },
      });
    // })
   
    wx.setNavigationBarColor({

        frontColor: '#ffffff',

        backgroundColor: '#ff0000'

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

  },


  /**
  * 返回上一页
  */
  backTo: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },


})