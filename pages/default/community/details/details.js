// pages/community/details/details.js
var siteInfo = require('../../../../config.js');
var WxParse = require('../../../../vendor/wxParse/wxParse.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banner: {},
        datas: {},
        nav: [],
        topTheme: [],
        imgs: [],
        rightUrl: '../../../images/more.png',
        theme: [],
        content: [],
        icon: '/assets/images/pl.png',
        icon2: '/assets/images/dian.png',
        page: 1,
        id: '',
        images: [],
        member : '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var id = options.id;
        var that = this;
        that.setData({
            id: id,
        })
        wx.setNavigationBarTitle({
            title: that.data.banner.section,
        })
        that.getmodel();
        that.getTopics();
    },

    /**
     * 获取话题
    */
    getTopics: function () {
        var that = this;
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=sns.board.getlist',
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                    bid: that.data.id,
                },
                success: function (res) {
                
                    var theme = res.data.result.list;
                    var imgs = res.data.result.list.images

                    var member = res.data.result.member
                    console.log(member);
                    console.log("memeber")
                    that.setData({
                        theme: theme,
                        member: member,
                        imgs: imgs
                    })
                }
            })
        })
    },
    openimage: function (e) {
        var that = this;
        var current = e.target.dataset.src;
        var currentimg = current.split()
        that.data.images.push(current);
        for (var i in that.data.theme) {
            wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: currentimg// 需要预览的图片http链接列表
            })
            return
        }
    },
    /**
     * 跳转发布话题
    */
    jumptopic: function () {
        wx.navigateTo({
            url: '/pages/default/community/newBuild/newBuild?id=' + this.data.id,
        })
    },
    /**
     * 版块详情
    */
    getmodel: function () {
        var that = this;
        // app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=sns.board.get_index',
            method: 'GET',
            data: {
                i: siteInfo.uniacid,
                id: that.data.id,
            },
            success: function (res) {
                var banner = res.data.board;
                var topTheme = res.data.tops;
                var datas = res.data;
                that.setData({
                    banner: banner,
                    topTheme: topTheme,
                    datas: datas,
                })

            }
        })
        // })
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
        var that = this;
        that.getmodel();
     
    },
    //点赞
    praise: function (e) {
 
        var pid = e.currentTarget.dataset.cid
        var that = this;
        wx.showLoading({
            title: 'loading',
        })
        // app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.like',
            method: 'GET',
            data: {
                i: siteInfo.uniacid,
                bid: that.data.id,
                pid: pid,
            },
            success: function (res) {

                wx.hideLoading();
                if (res.data.status == 1) {
                    that.getTopics();

                }
            }
        })
        // })
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
        this.getTopics();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        var that = this;
  
        var page = that.data.page++;
        if (page > 1) {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=sns.board.getlist',
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                    bid: that.data.id,
                    page: page
                },
                success: function (res) {
                  
                    var reslist = res.data.result.list;

                    var member = res.data.result.member

                    for (var i in reslist) {
                        that.data.theme.push(reslist[i])
                    }
                    that.setData({
                        theme: that.data.theme,

                    })
                    if (reslist == '') {
                        wx.showToast({
                            title: '没有数据了',
                            icon: 'loading'
                        })
                    }
                }
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})