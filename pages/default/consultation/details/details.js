// pages/default/consultation/details/details.js
var wxParse = require('../../../../vendor/wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items : [],
    content : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var id = option.id;
    console.log(id)
    var that = this
    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=article.index.get_article',
        method: 'GET',
        data: {
          aid: id
        },
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          console.log(11111)
          console.log(res);

          var item = res.data.result;
          var content = res.data.result.article.article_content_txt;
         
          that.setData({
              items : item,
              content: content
          })
          wx.hideLoading()
        },
      })
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
    console.log(this.data.content);
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