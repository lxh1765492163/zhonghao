var app = getApp()
var siteInfo = require('../../../../config.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        items: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        const that = this

        // 判断身份
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=commission.withdraw.get_main&i=' + siteInfo.uniacid,
                success: function (res) {
                    console.log(res);
                    var data = res.data

                    that.setData({
                        items: data.result
                    })
                },
                fail: function (res) {
                    console.log(res)
                }
            })
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
    jump: function () {
        var that = this;
        var yuan = that.data.items.thisset.withdraw;
        console.log(yuan)


        var jin = that.data.items.member.commission_ok;
        console.log(jin)
        if (jin>yuan && jin != 0) {
            wx.navigateTo({
                url: '/pages/default/commission/apply/apply',
            })
        } else{
            wx.showLoading({
                title: '未达到提现要求',
            })

            setTimeout(function () {
                wx.hideLoading()
            }, 2000)
        }
      
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