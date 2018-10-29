// pages/default/message/message.js
var app = getApp()
var time = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageswipe: 1,
    inputvalue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '...',
    })
    that.getmessage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getmessage: function () {
    var that = this
    app.util.request({
      url: "entry&m=ewei_shopv2&do=mobile&r=index.message",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        page: 10,
      },
      success: function (res) {
        wx.hideLoading();
        var list = res.data.result;
        for (var i = 0; i < list.length; i++) {
          var mestime = list[i].data.mestime
          list[i].data.mestime = time.formatTime(mestime, 'Y/M/D h:m:s')
          if (list[i].reply != '' && list[i].reply!=null){
            for (var j = 0; j < list[i].reply.length; j++) {
              var retime = list[i].reply[j].retime
              list[i].reply[j].retime = time.formatTime(retime, 'Y/M/D h:m:s')
            }
          }
        }
        console.log(list);
        that.setData({
          messageswipe: res.data.messageswipe,
          list: list,
        })
        console.log();
      }
    })
  },
  setmessage: function (e) {
    var content = e.detail.value.content
    var that = this;
    if (content != '') {
      app.util.request({
        url: "entry&m=ewei_shopv2&do=mobile&r=index.mesupload",
        header: {
          'content-type': 'application/json' // 默认值
        },
        method: 'POST',
        data: {
          content: content,
        },
        success: function (res) {
          console.log(res);
          if (res.data.msg == 'ok') {
            wx.showToast({
              title: '留言成功',
            })
            setTimeout(function () {
              that.setData({
                inputvalue: ''
              })
              that.getmessage()
            }, 2000)
          }
          else {
            wx.showToast({
              title: '留言失败',
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '留言不能为空',
      })
    }
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