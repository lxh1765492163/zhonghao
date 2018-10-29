// pages/community/section/section.js\
var siteInfo = require('../../../../config.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

        category: [],
        imformation: [],
        icon: '../../../images/more.png',
        tabbar: [
            { pagePath: '/assets/images/tabBar/icon-home.png', text: '首页', id: 0, url: '/pages/default/community/index/index' },
            { pagePath: '/assets/images/tabBar/icon-list.png', text: '版块', id: 1, url: '/pages/default/community/section/section' },
            { pagePath: '/assets/images/tabBar/icon-person2.png', text: '我的', id: 2, url: '/pages/default/community/person/person' },
        ],
        id: 1,
        cid: '',
        api: 0,
        page: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        var typeid = options.type ? options.type  : '' ;
        var that = this;
        that.setData({
            cid: typeid,
        })
        var num = this.data.imformation.length;
        wx.getSystemInfo({
            success: function (res) {
                var windowHeight = res.windowHeight + 'px'
                that.setData({
                    windowHeight: windowHeight,
                    num: num
                })
            },
        })

        that.gettab();
        // app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=sns.board.get_boardlist',
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                    page: that.data.page,
                    cid: that.data.cid,
                },
                success: function (res) {

                    var imformation = res.data.result.list;
                    that.setData({
                        imformation: imformation
                    })

                }
            })
        // })
    },
    /**
     * 获取分类
    */
    gettab: function () {
        var that = this;
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=sns.board.get_lists_t',
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,

                },
                success: function (res) {
                    console.log(res);

                    that.setData({
                        category: res.data
                    })

                }
            })
        })
    },
    /**
     * 全部模板
    */
    allmodel: function (e) {
        console.log(e);
        var that = this;
        var id = e.currentTarget.dataset.cid;
        that.setData({
            cid: id
        })
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=sns.board.get_boardlist',
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                    page: that.data.page,
                    cid: that.data.cid,
                },
                success: function (res) {
                    console.log(res);
                    console.log("全部")
                    var imformation = res.data.result.list;
                    that.setData({
                        imformation: imformation
                    })

                }
            })
        })
    },
    /**
  * 搜索商品
  */
    putSearch: function (e) {
        console.log(e)
        const that = this
        const keyword = e.detail.value
        that.setData({
            keywords: keyword
        })
        if (keyword == '') return

        wx.showLoading({
            title: '加载中...',
        })

        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=sns.board.get_boardlist',
            method: 'GET',
            data: {
                keywords: keyword
            },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                wx.hideLoading()
                var imformation = res.data.result.list;
                that.setData({
                    imformation: imformation
                })
            },
            fail: function () {
                wx.hideLoading()
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