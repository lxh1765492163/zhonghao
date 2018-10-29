// pages/dailypra/dailypra.js
var app = getApp();
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
  onLoad: function(options) {
    let id = options.id;
    let data = JSON.parse(options.data);
    // console.log(data)
    this.setData({
      data: data,
      id: id,
    })
  },

  changetab: function(e) {
    let that = this;
    let id = this.data.id;
    let data = this.data.data;
    let cid = e.currentTarget.dataset.cid;
    let chapter;
    if (cid == 1) {
      app.util.request({
        url: 'entry&m=ewei_shopv2&do=mobile&r=question.chapter',
        data: data,
        success: function (res) {
          if (res.data.status != 0) {
            chapter = res.data.chapter
            let answerChapterCount = res.data.answerChapterCount
            for (let i = 0; i < chapter.length; i++) {
              for (let j = 0; j < answerChapterCount.length; j++) {
                if (chapter[i].id == answerChapterCount[j].chapter_id) {
                  chapter[i].answer_submit = answerChapterCount[j].answer_submit;
                  chapter[i].answer_total = answerChapterCount[j].answer_total;
                }
              }
            }
          } else {
            chapter = '';
          }
          that.setData({
            id: id,
            chapter: chapter,
          })
        }
      })
    }
    this.setData({
      cid: cid,
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