// pages/default/bespoke/index/index.js
var siteInfo = require('../../../../config.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabArr: 0,
        goods: [],  //商品
        banner: [], //轮播图
        cate: [],  //选项卡
        cityname: '',
        fid: 0,
        page_title: '',
    },
    /**
     *  选项卡
     */
    tabFun: function (e) {
        var index = e.currentTarget.dataset.index;
        this.setData({
            tabArr: index
        })
        var that = this;
        app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&do=index&m=qwx_shangmen',
            method: 'GET',
            data: {
                i: siteInfo.uniacid,
                cate_id: index
            },
            header: {
                // "Accept": "application/json"
            },
            success: function (res) {


                var msg = res.data;
                that.setData({
                    banner: msg.banner,
                    goods: msg.goods,
                    cate: msg.cates,
                    cityname: msg.curr_slt_city_name
                })

            }
        })
        })
    },
    /**
     * 底部菜单
    */
    tabbar: function (e) {
        console.log(e);
        var fid = e.currentTarget.dataset.fid;
        this.setData({
            fid: fid,
        })
    },
    /**
     * 跳转详情
    */
    navbar: function (e) {
        var id = e.currentTarget.dataset.id;

        wx.navigateTo({
            url: '/pages/default/bespoke/details/details?id=' + id
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&do=index&m=qwx_shangmen',
            method: 'GET',
            data: {
                i: siteInfo.uniacid
            },
            header: {
                // "Accept": "application/json"
            },
            success: function (res) {

                wx.hideLoading();
                var msg = res.data;
                that.setData({
                    banner: msg.banner,
                    goods: msg.goods,
                    cate: msg.cates,
                    cityname: msg.curr_slt_city_name,
                    page_title: msg.page_title
                })

                wx.setNavigationBarTitle({
                    title: msg.page_title,
                })
            }
        })
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

        var key = wx.getStorageSync('key');
        console.log(key)
        var that = this;
        app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&do=index&m=qwx_shangmen',
            method: 'GET',
            data: {
                i: siteInfo.uniacid,
                shcity: key
            },
            header: {
                // "Accept": "application/json"
            },
            success: function (res) {

                var msg = res.data;
                that.setData({
                    banner: msg.banner,
                    goods: msg.goods,
                    cate: msg.cates,
                    cityname: msg.curr_slt_city_name
                })

            }
        })
        })

        wx.clearStorageSync();
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