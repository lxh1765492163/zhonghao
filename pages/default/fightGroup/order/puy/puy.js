// pages/default/fightGroup/order/puy/puy.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderid: 0,
        order: {},
        userInfo: {},
        openid: 0,
        total: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        var that = this;
        var id = options.orderid;
        console.log(id);
        var teamid = options.teamid;
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=groups.pay.get_indexs',
                method: 'GET',
                data: {
                    orderid: id,
                    teamid: teamid,
                    heads: 1
                },

                success: function (res) {
                    console.log(res);

                    wx.hideLoading()
                    var r = res.data;
                    var price = parseFloat(r.order.price); 
                    var freight = parseFloat(r.order.freight);

                    var total = price + freight;

                    if (res.data.status == 0) {
                        wx.showModal({
                            title: '提示',
                            content: r.message,

                        })
                    } else {
                        that.setData({
                            order: r.order,
                            openid: r.order.openid,
                            total: total
                        })
                    }


                },
                fail: function () {
                    wx.hideLoading()
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
    // 支付
    orderPay: function (e) {
        var that = this
        const orderid = that.data.order.id
        console.log(e);
        // 统一下单
        wx.request({
            url: app.siteInfo.domain + '/bale/pay.php?do=okpay&uniacid=' + app.siteInfo.acid + '&t=' + app.siteInfo.uniacid,
            data: {
                openid: that.data.order.openid,
                body: '订单' + that.data.order.orderno,
                tradeNo: that.data.order.orderno + app.util.random(123),
                totalFee: parseFloat(that.data.total) * 100
                // uniacid: app.siteInfo.uniacid
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res);
                // 发起支付
                if (res.data.appId != undefined) {
                    wx.requestPayment({
                        timeStamp: res.data.timeStamp,
                        nonceStr: res.data.nonceStr,
                        package: res.data.package,
                        signType: 'MD5',
                        paySign: res.data.paySign,
                        'success': function (e) {
                            wx.showToast({
                                title: '支付成功',
                            })

                            // 清除购物车
                            wx.request({
                                url: app.siteInfo.domain + '/bale/pay.php?do=groups_status',
                                data: {
                                    openid: that.data.order.openid,
                                    uniacid: app.siteInfo.uniacid,
                                    orderid: orderid,
                                },
                                method: 'POST',
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                success: function () {
                                    console.log('清除购物车完成')
                                }
                            })

                            // 更新订单
                            app.util.request({
                                url: 'entry/ewei_shopv2/mobile&r=order.pay.paysuess',
                                data: {
                                    id: orderid,
                                    type: 'wechat',
                                    ordersn: that.data.order.ordersn,
                                    deduct: 0
                                },
                                method: 'POST',
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded'
                                },
                                success: function (res) {
                                    console.log('更新订单完成')
                                }
                            })

                            // 跳转到首页
                            wx.redirectTo({
                                url: '/pages/default/fightGroup/index',
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: '支付失败',
                        icon: 'loading'
                    })
                }
            }

        })
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