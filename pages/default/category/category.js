var app = getApp()
var siteInfo = require('../../../config.js');
Page({
    data: {
        curNav: 1,
        curIndex: 0,
        leftCategory: [],
        rightCategory: [],
        category_set: [],
        category: [],
        sets: [],
        recommend: 0,
        nopic: app.siteInfo.domain + '/addons/ewei_shopv2/static/images/nopic100.jpg',
        data: [],
        screenHeight: 0,
        recommends : [],
        tabid:1
    },

    //获取屏幕高度
    screenHeight: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                var screenHeight = res.screenHeight - 113 + 'px'
                that.setData({
                    screenHeight: screenHeight
                })
            }
        });
    },
    changetab: function (e) {
        console.log(e)
        var tabid = e.currentTarget.dataset.id;
        this.setData({
            tabid: tabid
        })
    },
    onLoad: function () {
        wx.showLoading()
        var that = this
        this.screenHeight();

        wx.request({
            url: app.siteInfo.domain + '/bale/api.php?mod=category',
            method: 'GET',
            data: { uniacid: app.siteInfo.uniacid },
            header: {
                'Accept': 'application/json'
            },
            success: function (res) {
                let arr = res.data.children
                let recommend = res.data.recommend
                wx.hideLoading()
                that.setData({
                    leftCategory: res.data.parent,
                    rightCategory: res.data.children,
                    recommends : recommend
                })
            },
            fail: function () {
                wx.hideLoading()
            }
        })

        // app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=index.get_diyMenus',
            method: 'GET',
            data: {
                id: siteInfo.template_id
            },
            success: function (res) {

                var datas = res.data.data;
                var data = res.data;
                var style = res.data.style;

                that.setData({
                    datas: datas,
                    style: style,
                    data: data,
                })

            }
        })
        // })
    },

    //事件处理函数
    switchRightTab: function (e) {
        let id = e.target.dataset.id,
            index = parseInt(e.target.dataset.id);
        this.setData({
            curNav: id,
            curIndex: index
        })
    }

})