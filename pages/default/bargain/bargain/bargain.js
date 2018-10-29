// pages/default/bargain/bargain/bargain.js
var app = getApp();
var WxParse = require('../../../../vendor/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var id = options.id
    this.setData({
      id: id
    })
    this.getbargain();
  },

  getbargain: function () {
    var that = this
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=bargain.get_bargain&id=' + that.data.id,
      success: function (res) {
        console.log(res.data.result);
        var nowtime = Date.parse(new Date()) / 1000;
        var time = res.data.result.res2.end_time - nowtime;
        that.setData({
          data: res.data.result,
          time: time,
        })
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
          }
          that.setData({
            downtime: timedata,
            time: time,
          })
        }, 1000)
        WxParse.wxParse('article', 'html', res.data.result.res2.content, that, 5);
        WxParse.wxParse('rule', 'html', res.data.result.res2.rule == '' ? res.data.result.rule.rule : res.data.result.res2.rule, that, 5);

      },
    })
  },
  bargain: function () {
    var that = this
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=bargain.get_bargain&id=' + that.data.id,
      data: {
        types: 1,
      },
      success: function (res) {
        // if (res.data.status == 1) {
        if (res.data.result.status && res.data.result.status == 2) {
          wx.showModal({
            title: '温馨提示',
            showCancel: false,
            content: res.data.result.message,
            success: function (res) {
              if (res.confirm) {
                that.getbargain();
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          console.log(1111);
          wx.showToast({
            title: res.data.result.message,
            icon: 'none',
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        // }
      },
    })
  },



  buy: function () {
    console.log(this.data.data.res.id)
    wx.navigateTo({
      url: '/pages/default/order/create/create?type=1&bargainid=' + this.data.data.res.id,
    })
  },
  changetab: function (e) {
    // console.log(e)
    var cid = e.target.dataset.cid
    this.setData({
      cid: cid,
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