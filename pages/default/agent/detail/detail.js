// pages/default/agent/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let tid = options.tid ? options.tid : '';
    console.log(options.tid)
    that.setData({
      tid: tid,
      page: 1,
    })
    that.getlist();
  },

  changetid: function(e) {
    let tid = e.currentTarget.dataset.tid;
    this.setData({
      tid: tid,
      page: 1,
    })
    this.getlist();
  },

  getlist: function() {
    let that = this;
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=abonus.bonus.get_list&token=bf8d3dc65bc84f',
      method: 'GET',
      data: {
        page: that.data.page,
        status: that.data.tid,
      },
      success: function(res) {
        wx.hideLoading();
        // console.log(res)
        that.setData({
          detailed: res.data.data
        });
      }
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