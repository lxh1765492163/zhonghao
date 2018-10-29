// pages/community/community.js
var siteInfo = require('../../../../config.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banner: [],
        nav: [],
        recommend: [],
        icon: '../../../images/more.png',
        tabbar: [
            { pagePath: '/assets/images/tabBar/icon-home.png', text: '首页', id: 0, url: '/pages/default/community/index/index' },
            { pagePath: '/assets/images/tabBar/icon-list.png', text: '版块', id: 1, url: '/pages/default/community/section/section' },
            { pagePath: '/assets/images/tabBar/icon-person2.png', text: '我的', id: 2, url: '/pages/default/community/person/person' },
        ],
        id: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        // app.util.getUserInfo(function () {
          
        // })
        that.getdetail()
    },
    getdetail : function(){
        var that = this;
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=sns.get_sns',
            method: 'GET',
            data: {
                i: siteInfo.uniacid
            },
            success: function (res) {


                var banner = res.data.advs;

                var nav = res.data.category;
                var recommend = res.data.recommands;
                that.setData({
                    banner: banner,
                    nav: nav,
                    recommend: recommend,
                })

            }
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

    //tabbar点击效果
    tabbar: function (res) {
        var id = res.currentTarget.dataset.id;
        var url = this.data.tabbar[id].url;
        wx.reLaunch({
            url: url,
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
        wx.stopPullDownRefresh();
        this.getdetail()
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