// pages/community/person/person.js
var app = getApp();
var siteInfo = require('../../../../config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        background: '../../../images/banner_1.jpg',
        tabbar: [
            { pagePath: '/assets/images/tabBar/icon-home.png', text: '首页', id: 0, url: '/pages/default/community/index/index' },
            { pagePath: '/assets/images/tabBar/icon-list.png', text: '版块', id: 1, url: '/pages/default/community/section/section' },
            { pagePath: '/assets/images/tabBar/icon-person2.png', text: '我的', id: 2, url: '/pages/default/community/person/person' },
        ],
        id: 2,

        topicNum: 125,
        followNum: 251,
        points: 211,
        autograph: '这家伙什么也没留下~~',
        theme: [],
        rightUrl: '../../../images/more.png',
        editUrl: '/assets/images/pl.png',
        member : {},
        tid : '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
     
        var tid = options.id ? options.id : '';
        this.setData({
            tid : tid,
        })
      this.mydetail()
    },
    /**
     * 
    */
    mydetail :function(){
      var that = this;
    //   app.util.getUserInfo(function () {
        app.util.request({
          url: 'entry&m=ewei_shopv2&do=mobile&r=sns.user.get_index',
          method: 'GET',
          data: {
            i: siteInfo.uniacid,
            id : that.data.tid,
          },
          success: function (res) {
           
            var member = res.data.member;
            var level = res.data.level;
            var theme = res.data.posts;
            var replys = res.data.replys;
            var datas = res.data;
            that.setData({
              member: member,
              replys: replys,
              datas: datas,
              level: level,
              theme: theme,
            })
          }
        })
    //   })
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
        this.mydetail()
    },
    //tabbar点击效果
    tabbar: function (e) {
     
        var id = e.currentTarget.dataset.id;
        var url = this.data.tabbar[id].url;
        wx.reLaunch({
            url: url,
        })
    },
    edit: function (res) {
        wx.navigateTo({
            url: 'autograph/autograph?autograph=' + this.data.autograph,
        })
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
     
      this.mydetail()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})