// pages/default/fightGroup/list/list.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        keywords: '',
        items: [],  //产品列表\
        id : '',
    },




    /* 跳转详情 */
    navTo: function (e) {
        var id = e.currentTarget.dataset.id;

        wx.navigateTo({
            url: '../details/detail?id=' + id,
        })
    },

    // 提交搜索
    formSubmit: function (e) {
      const keywords = e.detail.value.keywords
        this.postSubmit()
    },

    /**
     * 搜索提交
     */
    searchSubmit: function (e) {

        const keywords = e.detail.value
      
        this.setData({
            keywords: keywords
        })
        this.postSubmit();
    },

    /**
     * 提交搜索
     */
    postSubmit: function () {
        var that = this;
        if (that.data.keywords != '') {
            // 跳转到列表页
            // wx.navigateTo({
            //     url: '/pages/default/fightGroup/list/list?r=groups.category.get_list&keywords=' + that.data.keywords,
            // })
            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=groups.category.get_list',
                data: {
                  
                    keywords: that.data.keywords
                },
                success: function (res) {

                    var item = res.data.result.list;
                    that.setData({
                        items: item
                    })
                    wx.hideLoading()


                },
                fail: function () {
                    wx.hideLoading()
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var that = this;
        var id = options.id;
        that.setData({
            id :id,
        })
        // app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=groups.category.get_list',
                data: {
                    category: id
                },
                success: function (res) {

                    var item = res.data.result.list;
                    that.setData({
                        items: item
                    })
                    wx.hideLoading()


                },
                fail: function () {
                    wx.hideLoading()
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