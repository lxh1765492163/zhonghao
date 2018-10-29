// zh_jd/pages/merchant/merchant.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scort: false,
        position: 1,
        score: 0,
        hotel: [],
        star5: [
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
        ],
        star4: [
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
        ],
        star3: [
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
        ],
        star1: [
            { num: 'https://xcx.xcwll.cn/addons/ewei_shopv2/plugin/zh_jd/images/xing.png' },
        ],
    },
    onLoad: function (options) {
        var that = this

        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: wx.getStorageSync('platform_color'),
            animation: {
                duration: 0,
                timingFunc: 'easeIn'
            }
        })
        var lat1 = options.lat
        var lng1 = options.lng
        that.setData({
            lat1: lat1,
            lng1: lng1,
            date: options.date,
            dd: options.dd,
            time: options.time,
            to: options.to,
            tomorrow: options.tomorrow
        })
        that.reload()
    },
    reload: function (e) {
        var that = this

        // 获取多商家集合
        app.util.request({
            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGethotel',

            'cachetime': '0',
            success: function (res) {

                var hotel = res.data
                for (let i = 0; i < hotel.length; i++) {
                    // 获取酒店的经纬度
                    var lat = hotel[i].coordinates
                    var ss = lat.split(",")
                    hotel[i].lat2 = ss[0]
                    hotel[i].lng2 = ss[1]
                    // 获取两者之间的距离
                    var lat1 = that.data.lat1
                    var lng1 = that.data.lng1
                    var lat2 = ss[0]
                    var lng2 = ss[1]
                    var radLat1 = lat1 * Math.PI / 180.0;
                    var radLat2 = lat2 * Math.PI / 180.0;
                    var a = radLat1 - radLat2;
                    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
                    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
                    s = s * 6378.137;
                    s = Math.round(s * 10000) / 10000;
                    var s = s.toFixed(2)
                    hotel[i].distance = s
                    // 获取最低价格
                    app.util.request({
                        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGetroom',
                        'cachetime': '0',
                        data: { seller_id: res.data[i].id },
                        success: function (res) {
                            // 改变数据结构
                            var list = []
                            res.data.map(function (item) {
                                var obj = {};
                                obj = item.online_price;
                                list.push(obj);
                            })
                            //数组进行排序，得到最小的数值
                            var compare = function (a, b) {
                                var a = a.price
                                var b = b.price
                                if (a < b) {
                                    return -1
                                } else if (a > b) {
                                    return 1
                                } else {
                                    return 0
                                }
                            }
                            var list = list.sort(compare)

                            if (list.length == null || list.length == 0) {
                                var price = 0
                            } else {
                                var price = list[0]
                            }
                            hotel[i].price = Number(price)
                            if (hotel[i].star == '暂无星级(经济型)') {
                                hotel[i].num = 1
                            } else if (hotel[i].star == '三星级') {
                                hotel[i].num = 3
                            } else if (hotel[i].star == '四星级') {
                                hotel[i].num = 4
                            } else if (hotel[i].star == '五星级') {
                                hotel[i].num = 5
                            }
                            // 获取评价数量
                            app.util.request({
                                'url': 'entry/wxapp/assesscount',
                                'cachetime': '0',
                                data: { seller_id: hotel[i].id },
                                success: function (res) {
                                    hotel[i].total = res.data.total
                                    hotel[i].ol = '你麻痹的'
                                    that.setData({
                                        hotel: hotel,
                                        hotel1: hotel
                                    })
                                },
                            })
                        }
                    })
                }

            }
        })
        app.util.request({
            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageAttachurl',
            'cachetime': '0',
            success: function (res) {

                that.setData({
                    url: res.data
                })
            }
        })
    },
    // 推荐排序
    recommend: function (e) {
        var that = this
        var hotel1 = that.data.hotel1
        that.setData({
            hotel: hotel1,
            scort: false,
            position: 1
        })
    },
    // 价格排序
    price: function (e) {
        var that = this
        that.setData({
            scort: true,
            position: 2
        })
    },
    // 评分排序
    score: function (e) {
        var that = this
        that.setData({
            scort: true,
            position: 3
        })
    },
    // 距离排序
    distance: function (e) {
        var that = this
        that.setData({
            scort: true,
            position: 4
        })
    },
    // 由高到低排序
    score_high: function (e) {
        var that = this

        var hotel = that.data.hotel
        var position = that.data.position
        var compare = function (a, b) {
            if (position == 2) {
                var a = Number(a.price);
                var b = Number(b.price);
            } else if (position == 3) {
                var a = Number(a.score);
                var b = Number(b.score);
            } else if (position == 4) {
                var a = Number(a.distance);
                var b = Number(b.distance);
            }

            if (a > b) {
                return -1
            } else if (a < b) {
                return 1
            } else {
                return 0
            }
        }
        var hotel = hotel.sort(compare)

        that.setData({
            sore: 1
        })
        setTimeout(function () {
            that.setData({
                scort: false,
                hotel: hotel,
                sore: 0
            })
        }, 500)
    },
    // 由低到高排序
    score_low: function (e) {
        var that = this
        var hotel = that.data.hotel
        var hotel1 = that.data.hotel1
        var position = that.data.position
        var compare = function (a, b) {
            if (position == 1) {
                var a = Number(a.id);
                var b = Number(b.id);
            } else if (position == 2) {
                var a = Number(a.price);
                var b = Number(b.price);
            } else if (position == 3) {
                var a = Number(a.score);
                var b = Number(b.score);
            } else if (position == 4) {
                var a = Number(a.distance);
                var b = Number(b.distance);
            }
            if (a < b) {
                return -1
            } else if (a > b) {
                return 1
            } else {
                return 0
            }
        }
        var hotel = hotel.sort(compare)

        that.setData({
            sore: 2
        })
        setTimeout(function () {
            that.setData({
                scort: false,
                hotel: hotel,
                sore: 0
            })
        }, 500)

    },
    hotel_info: function (e) {
        var that = this


        var hotel_id = e.currentTarget.id
        var name = e.currentTarget.dataset.name
        var hotel = that.data.hotel
        var seller = []
        for (var i = 0; i < hotel.length; i++) {
            if (hotel_id == hotel[i].id) {
                seller.push(hotel[i])
            }
        }
        wx.setStorageSync('hotel', seller[0].id)
        wx: wx.navigateTo({
            url: "../wode/index?time=" + that.data.time + '&to=' + that.data.to + '&dd=' + that.data.dd + '&date=' + that.data.date + '&tomorrow=' + that.data.tomorrow + '&hotel_id=' + hotel_id + '&name=' + name
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
        var that = this
        that.reload()
        wx.stopPullDownRefresh()
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