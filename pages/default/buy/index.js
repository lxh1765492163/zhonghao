// pages/default/buy/index.js

var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: '',
        sort: [],
        cartShow: false,
        totalPrice: 0,  //总价
        carts: [],
        catalogSelect: 0,
        items: [],//商品列表
        option: false,
        num: 0,
        optionid: 0,
        editArray: [],
        desc: '',
        details: [],
        allTotal: 0
    },
    /*选项卡 */
    tabFun: function (e) {

        var that = this;
        var dataset = e.target.dataset.index;
        var obj = {};

        that.setData({
            tabArr: obj,
            catalogSelect: dataset
        })
        app.util.getUserInfo(function () {

            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=quick.index.get_index',
                data: {

                },
                success: function (res) {

                    var imgs = res.data.advs;
                    var sort = res.data.datas;
                    var datatype = res.data.datas[dataset].datatype;
                    var goodsids = res.data.datas[dataset].goodsids;
                    var goodssort = res.data.datas[dataset].goodssort;
                    var page = res.data.datas[dataset].page;
                    var desc = res.data.datas[dataset].desc;


                    that.setData({
                        imgUrls: imgs,
                        sort: sort,
                        desc: desc,

                    })
                    wx.hideLoading()
                    app.util.getUserInfo(function () {
                        app.util.request({
                            url: 'entry/ewei_shopv2/mobile&r=quick.index.get_list',
                            data: {
                                datatype: datatype,
                                goodsids: goodsids,
                                goodssort: goodssort,
                                page: page,
                                merchid: '',
                                cateid: '',
                            },
                            success: function (res) {

                                for (var i = 0; i < res.data.result.list.length; i++) {
                                    res.data.result.list[i].nums = 0
                                }
                                var pro = res.data.result.list;
                                that.setData({
                                    items: pro
                                })
                            }
                        })

                    })
                },
            });
        })
    },


    /*加*/
    changeCartNum: function (e) {
        var that = this;

        // 操作
        const ac = e.currentTarget.dataset.action;
        //下标
        var index = e.currentTarget.dataset.index;
        //id
        var id = e.currentTarget.dataset.id
        var optionid = that.data.optionid
        var datas = this.data.items
        var num = this.data.items[index].nums;
        if (ac == 'minus' && num >= 1) {
            datas[index].nums = num - 1;
            num = datas[index].nums
            this.setData({
                items: datas
            })
            app.util.getUserInfo(function () {
                app.util.request({
                    url: 'entry/ewei_shopv2/mobile&r=quick.index.update',
                    data: {
                        goodsid: id,
                        total: num,
                        // uid: app.siteInfo.uniacid,
                    },

                    success: function (res) {
                        app.util.getUserInfo(function () {
                            app.util.request({
                                url: 'entry/ewei_shopv2/mobile&r=quick.index.getCart',
                                data: {
                                    quickid: 0
                                },
                                success: function (res) {

                                    var total = res.data.result.totalprice;
                                    var list = res.data.result.list;
                                    var allTotal = res.data.result.total;


                                    that.setData({
                                        totalPrice: total.toFixed(2),
                                        details: list,
                                        allTotal: allTotal
                                    })
                                    wx.hideLoading()
                                },
                                fail: function () {
                                    wx.hideLoading()
                                }
                            })
                        })
                        wx.hideLoading()
                        if (res.status == 1) {
                            this.updateCart(data)
                            this.getTotalprice();
                        }
                    },
                    fail: function () {
                        wx.hideLoading()
                    }
                })
            })
        } else if (ac == 'plus') {
            datas[index].nums = num + 1
            num = this.data.items[index].nums

            this.setData({
                items: datas
            })

            app.util.getUserInfo(function () {
                app.util.request({
                    url: 'entry/ewei_shopv2/mobile&r=quick.index.update',
                    data: {
                        goodsid: id,
                        total: num,
                        // optionid: optionid
                    },
                    success: function (res) {

                        app.util.getUserInfo(function () {
                            app.util.request({
                                url: 'entry/ewei_shopv2/mobile&r=quick.index.getCart',
                                data: {
                                    quickid: 0
                                },
                                success: function (res) {

                                    // 价格
                                    var total = res.data.result.totalprice;
                                    var list = res.data.result.list;

                                    var allTotal = res.data.result.total;
                                    that.setData({
                                        totalPrice: total.toFixed(2),
                                        details: list,
                                        allTotal: allTotal
                                    })
                                    wx.hideLoading()
                                },
                                fail: function () {
                                    wx.hideLoading()
                                }
                            })
                        })


                        wx.hideLoading()
                    },
                    fail: function () {
                        wx.hideLoading()
                    }
                })
            })
        }


        this.updateCart()
    },
    /**
    * 执行购物车数量更新
    */
    updateCart: function (data) {
        const that = this
        wx.showLoading({
            title: '加载中...',
        })

        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=member.cart.update',
                data: data,
                success: function (res) {
                    wx.hideLoading()

                    if (res.data.status == 1) {
                        // 重新获取购物车数量
                        that.getCartList()
                    }
                },
                fail: function () {
                    wx.hideLoading()
                }
            })
        })
    },

    /*减*/
    // minusCount : function(e){

    //   const ac = e.currentTarget.dataset.action;
    //   //下标
    //   var index = e.currentTarget.dataset.index;
    //   //id
    //   var id = e.currentTarget.dataset.id
    //   var optionid = that.data.optionid
    //   var datas = this.data.items
    //   var num = this.data.items[index].nums;
    //   var that = this;
    //   if(num<0){
    //     return false;
    //   }

    //   this.getTotalprice();
    //     this.updateCart(data)

    // },

    /*计算总价*/
    getTotalprice: function () {

        var that = this;

    },

    /*页面跳转*/
    navTo: function (e) {
        var id = e.currentTarget.dataset.click;
        wx: wx.navigateTo({
            url: '../goods/detail/detail?id=' + id,
        })
    },

    /** 跳转购物车 */

    jump: function (e) {

        wx.navigateTo({
            url: '/pages/default/cart/cart',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.screenHeight();
    },
    //获取屏幕高度
    screenHeight: function () {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                var screenHeight = res.screenHeight - 120 + 'px'
                var screenHeight1 = res.screenHeight - 250 + 'px'
                that.setData({
                    screenHeight: screenHeight,
                    screenHeight1: screenHeight1
                })
            }
        });
    },
    /*创建订单*/
    toPayOrder() {
        const that = this

        wx.showLoading({
            title: '加载中...',
        })

        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=member.cart.submit',
                success: function (res) {


                    wx.hideLoading()

                    if (res.data.status == 1) {
                        // 跳转到 order/create
                        wx.navigateTo({
                            url: "/pages/default/order/create/create"
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '结算出错，请联系客服'
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

        var that = this;

        app.util.getUserInfo(function () {

            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=quick.index.get_index',

                data: {

                },

                success: function (res) {

                    var imgs = res.data.advs;
                    var sort = res.data.datas;


                    var datatype = res.data.datas[0].datatype;
                    var goodsids = res.data.datas[0].goodsids;
                    var goodssort = res.data.datas[0].goodssort;
                    var page = res.data.datas[0].page;



                    var desc = res.data.datas[0].desc;
                    var style = res.data.style
                    that.setData({
                        imgUrls: imgs,
                        sort: sort,
                        desc: desc,
                        style: style
                    })
                    wx.hideLoading()
                    app.util.getUserInfo(function () {

                        app.util.request({
                            url: 'entry/ewei_shopv2/mobile&r=quick.index.get_list',
                            data: {
                                datatype: datatype,
                                goodsids: goodsids,
                                goodssort: goodssort,
                                page: page,
                                merchid: '',
                                cateid: '',
                            },
                            success: function (res) {

                                for (var i = 0; i < res.data.result.list.length; i++) {
                                    res.data.result.list[i].nums = 0
                                }
                                var pro = res.data.result.list;
                                that.setData({
                                    items: pro
                                })
                            }
                        })

                    })
                },
            });
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {


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

    },
    /**
  * 返回上一页
  */
    backTo: function (e) {
        wx.navigateBack({
            delta: 1
        })
    },
})