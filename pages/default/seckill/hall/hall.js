// pages/default/seckill/hall/hall.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomid: '',
    timeid: '',
    taskid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getseckill();
  },

  getseckill: function () {
    const that = this
    var nowtime = Date.parse(new Date()) / 1000;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=seckill.get_main',
      data: {
        roomid: that.data.roomid,
        taskid: that.data.taskid,
        timeid: that.data.timeid,

      },
      success: function (res) {
        wx.hideLoading();
        // console.log(res.data.status)
        if (res.data.status == 0) {
          wx.showModal({
            title: '提示',
            content: res.data.result.message,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '/pages/default/index/index',
                })
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        that.setData({
          data: res.data.result,
          taskid: res.data.result.times != '' ? res.data.result.times[0].taskid : '',
          timeid: res.data.result.times != '' ? res.data.result.times[0].id : '',
          roomid: that.data.roomid != '' ? that.data.roomid : res.data.result.rooms[0].id != '' ? res.data.result.rooms[0].id : '',
          nowtime: nowtime,
        })
        that.getgoodslist();

      },
    })
  },

  getgoodslist: function () {
    const that = this
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    // console.log(that.data.taskid)
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=seckill.get_goods',
      data: {
        taskid: that.data.taskid,
        timeid: that.data.timeid,
        roomid: that.data.roomid,
      },
      success: function (res) {
        wx.hideLoading();
        that.setData({
          goodslist: res.data.result,
        })
        if (res.data.status == 0) {
          wx.showToast({
            title: res.data.result.message,
            icon: 'none',
            mask: true,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          var nowtime = Date.parse(new Date()) / 1000;
          var starttime = res.data.result.time.starttime
          var endtime = res.data.result.time.endtime
          var time, status;
          var timedata = '';
          if (nowtime < starttime) {
            time = starttime - nowtime
            status = '距活动开始还有: '
          } else if (nowtime < endtime) {
            time = endtime - nowtime
            status = '距活动结束还有: '
          } else { time = -1 }
          // console.log(time);
          that.setData({
            time: time,
            countdown: timedata
          })
          var timer = setInterval(function () {
            var time = that.data.time;
            // console.log(status);
            if (time < 0) {
              clearInterval(timer);
              if (status != undefined) {
                that.getgoodslist();
              } else {
                timedata = '秒杀活动已结束'
              }
            } else {
              time -= 1;
              // 小时位  
              var hr = Math.floor(time / 3600);
              var hrStr = hr.toString();
              if (hrStr.length == 1) hrStr = '0' + hrStr;

              // 分钟位  
              var min = Math.floor((time - hr * 3600) / 60);
              var minStr = min.toString();
              if (minStr.length == 1) minStr = '0' + minStr;

              // 秒位  
              var sec = time - hr * 3600 - min * 60;
              var secStr = sec.toString();
              if (secStr.length == 1) secStr = '0' + secStr;
              timedata = status + hrStr + '小时' + minStr + '分' + secStr + '秒'
            }
            that.setData({
              countdown: timedata,
              timer: timer,
              time: time
            })
            // console.log(timedata)
          }, 1000)
        }
      },
    })
  },
  changeroom: function (e) {
    clearInterval(this.data.timer);
    // console.log(e);
    this.setData({
      roomid: e.currentTarget.dataset.rid
    })
    this.getseckill();
  },
  changetime: function (e) {
    clearInterval(this.data.timer);
    // console.log(e);
    this.setData({
      taskid: e.currentTarget.dataset.kid,
      timeid: e.currentTarget.dataset.tid,
    })
    this.getgoodslist();
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