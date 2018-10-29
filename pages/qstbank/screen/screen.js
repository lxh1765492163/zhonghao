// pages/screen/screen.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: [],
    pagesize: 5, 
    num: [5, 10, 20, 30, 40, 120]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let id = options.id;
    let time = options.time ? options.time : '';
    // console.log(id);
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=question.answer.chapter_type',
      data: {
        chapter_id: id,
      },
      success: function(res) {
        // console.log(res.data)
        wx.hideLoading();
        if (res.data.status != 0) {
          let style = [];
          for (var i in res.data.answerType) {
            style.push(res.data.answerType[i]);
          }
          console.log(style)
          that.setData({
            style: style,
            id: id,
            total: res.data.total,
            time: time,
          })
        } else {
          wx.showModal({
            title: '抱歉！',
            content: res.data.name,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
        }
      }
    })
  },
  changeid: function(e) {
    // console.log(e)

    /**选择题目类型 */
    if (e.currentTarget.dataset.tid || e.currentTarget.dataset.tid == 0) {
      console.log(e.currentTarget.dataset.tid)
      let style = this.data.style;
      let tid = this.data.tid;
      if (e.currentTarget.dataset.tid == -1) {
        tid = [];
        for (let i = 0; i < style.length; i++) {
          style[i].sel = false;
        }
      }
      for (let i = 0; i < style.length; i++) {
        if (e.currentTarget.dataset.tid == style[i].type) {
          style[i].sel = !style[i].sel;
          if (style[i].sel == false) {
            tid.splice(tid.indexOf(e.currentTarget.dataset.tid), 1)
          } else {
            tid.push(e.currentTarget.dataset.tid);
          }
        }
      }
      // console.log(tid)
      this.setData({
        tid: tid,
        style: style
      })
    }

    /**选择题目数量 */
    if (e.currentTarget.dataset.pagesize) {
      this.setData({
        pagesize: e.currentTarget.dataset.pagesize,
      })
    }
  },
  gotest: function(e) {
    let mode = e.currentTarget.dataset.mode;
    // console.log(e.currentTarget.dataset.mode)
    let chapter_id = this.data.id;
    let types = this.data.tid;
    let pagesize = this.data.pagesize;
    let time = this.data.time;
    let info = JSON.stringify({
      mode: mode,
      chapter_id: chapter_id,
      types: types,
      pagesize: pagesize,
      time: time
    })
    wx.navigateTo({
      url: '/pages/qstbank/test/test?info=' + info,
    })
  },
  goindex: function () {
    wx.reLaunch({
      url: '/pages/default/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})