// pages/default/fightGroup/order/creat/creat.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods: [],//商品详情
        address: {}, //地址
        is_team: '',
        typead: '',
        total: '',
        id: '',
        teamid: '',
        heads: '',
    },

    // 添加地址
    addAddress: function () {
        wx.navigateTo({
            url: "/pages/default/fightGroup/address/address?type=2"
        })
    },

    // 选择地址
    selectAddress: function () {
        wx.navigateTo({
            url: "/pages/default/fightGroup/select/select?type=2"
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var typead = options.type;
        var teamid = options.teamid ? options.teamid : '';
        var heads = options.heads ? options.heads : '1';
        var id = options.id;
        var that = this;
        that.setData({
            typead: typead,
            id: id,
            teamid: teamid,
            heads: heads
        })
        that.getcreate();
        wx.clearStorageSync()
        that.setData({
            typead: options.type
        })
    },

    /**
     * 页面初始加载
    */
    getcreate: function () {
        var that = this;
        // app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry/ewei_shopv2/mobile&r=groups.orders.get_confirms',
            method: 'GET',
            data: {
                id: that.data.id,
                type: that.data.typead
            },
            success: function (res) {

                var address = res.data.address;
                var goods = res.data.goods;
                var is_team = res.data.is_team;
                var price = parseFloat(res.data.price);
                var fightnum = parseFloat(res.data.goods.freight);

                var total = price + fightnum;

                that.setData({
                    goods: goods,
                    address: address,
                    is_team: is_team,
                    total: total
                })


            },

            fail: function () {
                wx.hideLoading()
            }
        })
        // })
    },
    /**
    * 立即支付
    * 创建订单
    */
    createOrder: function (e) {

        wx.showLoading();
        var that = this;


        var params = {
            aid: that.data.address.id,
            id: that.data.goods.goodsid,
            type: that.data.typead,
            realname: that.data.address.realname,
            mobile: that.data.address,
            heads: that.data.heads,
            teamid: that.data.teamid,
        }

        console.log(params)

        //创建订单
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=groups.orders.get_confirms',
                method: 'POST',

                data: params,

                success: function (res) {

                    wx.hideLoading()
                    var d = res.data
                    if (d.status == 0) {
                        wx.showModal({
                            title: '提示',
                            content: d.result.message,
                            showCancel: false
                        })
                        return
                    }
                    // 跳到支付页面
                    wx.showToast({
                        title: '订单创建成功',
                        icon: 'success',
                        duration: 2000
                    })
                    wx.navigateTo({
                        url: '/pages/default/fightGroup/order/puy/puy?teamid=' + res.data.order.teamid + '&orderid=' + res.data.order.id,
                    })
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
        var that = this;

        var address = wx.getStorageSync('address');
        if (address) {
            that.setData({
                address: address
            })
        }

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