// pages/default/bargain/detail/detail.js
var app = getApp();
var WxParse = require('../../../../vendor/wxParse/wxParse.js');
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
    var that = this;
    var id = options.id;
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.windowWidth)
        that.setData({
          windowWidth: res.windowWidth,
        })
      },
    })
    // app.util.getUserInfo(function () {
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=bargain.get_detail&id=' + id,
      success: function (res) {
        // console.log(res);
        // if (res.status == 1) {
        var nowtime = Date.parse(new Date()) / 1000;
        var time = res.data.result.list.end_time - nowtime;
        that.setData({
          data: res.data.result,
          time: time,
          nowtime: nowtime,
        })
        if (res.data.result.list.start_time > nowtime) {
          that.setData({
            downtime: '砍价活动未开始'
          })
        }
        var timer = setInterval(function () {
          var time = that.data.time;
          if (time < 0) {
            clearInterval(timer);
            timedata = '砍价活动已結束'
          } else {
            time -= 1;
            // 天数位  
            var day = Math.floor(time / 3600 / 24);
            var dayStr = day.toString();
            if (dayStr.length == 1) dayStr = '0' + dayStr;

            // 小时位  
            var hr = Math.floor((time - day * 3600 * 24) / 3600);
            var hrStr = hr.toString();
            if (hrStr.length == 1) hrStr = '0' + hrStr;

            // 分钟位  
            var min = Math.floor((time - day * 3600 * 24 - hr * 3600) / 60);
            var minStr = min.toString();
            if (minStr.length == 1) minStr = '0' + minStr;

            // 秒位  
            var sec = time - day * 3600 * 24 - hr * 3600 - min * 60;
            var secStr = sec.toString();
            if (secStr.length == 1) secStr = '0' + secStr;

            var timedata = dayStr + '天' + hrStr + '小时' + minStr + '分' + secStr + '秒'

            that.setData({
              downtime: timedata,
              time: time,
            })
          }
        }, 1000)
        if (res.data.result.list.content != '') {
          WxParse.wxParse('article', 'html', res.data.result.list.content, that, 5);
        }
        // }
      },
    })
    // })
  },

  bargain: function () {
    var that = this;
    if(that.data.data.act==null){
      app.util.request({
        url: 'entry&m=ewei_shopv2&do=mobile&r=bargain.join&goods=' + that.data.data.list.id,
        success: function (res) {
          console.log(res);
          if (res.data.status == 1) {
            app.util.request({
              url: 'entry&m=ewei_shopv2&do=mobile&r=bargain.get_detail&id=' + that.data.data.list.id,
              success: function (res) {
                wx.navigateTo({
                  url: '/pages/default/bargain/bargain/bargain?id=' + res.data.result.act.id
                })
              },
            })
          }
          else {
            wx.showToast({
              title: res.data.result.messageI,
              icon: 'none',
              mask: true,
            })
          }
        },
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/default/bargain/bargain/bargain?id=' + that.data.data.act.id
      })
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

  }
})