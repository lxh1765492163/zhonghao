// pages/testpaper/testpaper.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    ismodle: false,
    sid: 0,
    menu: [{
      text: '全部',
      id: '0'
    }, {
      text: '模拟真题',
      id: '1'
    }, {
      text: '历年真题',
      id: '2'
    }, {
      text: '每天一练',
      id: '3'
    }, ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    let chapter;
    let data = JSON.parse(options.data);
    wx.setNavigationBarTitle({
      title: that.data.name,
    })
    this.setData({
      data: data,
    })
    this.getchapter();
  },


  getchapter: function() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=question.chapter_type',
      data: this.data.data,
      success: function(res) {
        wx.hideLoading();
        if (res.data.status != 0) {
          that.setData({
            chapter: res.data.chapter,
          })
        } else {
          wx.showModal({
            title: res.data.name,
            content: '暂无内容',
            showCancel: false,
            success: function(res) {
              wx.navigateBack({
                delta: 1,
              })
            },
          })
        }
      }
    })
  },

  getmodle: function(e) {
    let ismodle = this.data.ismodle;
    this.setData({
      ismodle: !ismodle,
    })
  },

  changesid: function(e) {
    let sid = e.currentTarget.dataset.sid;
    this.setData({
      sid: sid,
    })
  },

  gettest: function(e) {
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let pay = e.currentTarget.dataset.pay;
    wx.navigateTo({
      url: '/pages/qstbank/testpaper/detail/detail?id=' + id + '&title=' + title + '&pay=' + pay,
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