
//获取应用实例
var app = getApp();
var Data = require("../../../../utils/data.js");

Page({
    data: {
        tips: '选择日期',
        date: '',
        tomorrow: '',
        userInfo: {},
        name: '',
        urls: '',
    },

    // ——————————日历点击事件————————
    //事件处理函数
    bindViewTap: function () {
        var that = this;
        var startDate = that.data.date;
        var endDate = that.data.tomorrow;

        wx.navigateTo({
            url: '../calendar/calendar?startDate=' + startDate + "&endDate=" + endDate
        })
    },
    canvasIdErrorCallback: function (e) {
        wx.canvasToTempFilePath({
            x: 100,
            y: 200,
            width: 50,
            height: 50,
            destWidth: 100,
            destHeight: 100,
            canvasId: 'myCanvas',
            success: function (res) {

            }
        })
    },
    //事件处理函数
    onLoad: function () {
        var that = this

        var context = wx.createCanvasContext('firstCanvas')


        wx.canvasToTempFilePath({
            x: 100,
            y: 200,
            width: 50,
            height: 50,
            destWidth: 100,
            destHeight: 100,
            canvasId: 'myCanvas',
            success: function (res) {

            }
        })
        wx.showShareMenu({
            withShareTicket: true
        })
    

        wx.login({
            success: function (res) {
                var code = res.code
                wx.setStorageSync("code", res.code)
                wx.getUserInfo({
                    success: function (res) {
                        console.log(res);
                        wx.setStorageSync("user_info", res.userInfo)

                        that.setData({
                            avatarUrl: res.userInfo.avatarUrl,
                            nickName: res.userInfo.nickName
                        })
                        app.util.request({
                            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageOpenid',
                            'cachetime': '0',
                            data: { code: code },
                            success: function (res) {
                                //  console.log(res);
                                wx.setStorageSync("key", res.data.session_key)
                                var img = that.data.avatarUrl
                                var name = that.data.nickName
                                // 异步保存用户openid
                                wx.setStorageSync("openid", res.data.openid)
                                var openid = res.data.openid

                                // 获取用户登录信息
                                app.util.request({
                                    'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageLogin',
                                    'cachetime': '0',

                                    data: { openid: openid, img: img, name: name },
                                    success: function (res) {

                                        // console.log(res);

                                        // 异步保存用户登录信息
                                        wx.setStorageSync('users', res.data)
                                    },
                                })
                            },
                        })
                    }
                })
            }
        })
        


        app.util.request({
            url: 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGetplatform',
            success: function (res) {
                wx.setStorageSync('platform', res.data)
                wx.setStorageSync('platform_type', res.data.type)
                if (res.data.db_color == '') {
                    wx.setStorageSync('platform_color', '#F9882B')
                } else {
                    wx.setStorageSync('platform_color', res.data.db_color)
                }

                wx.setNavigationBarTitle({
                    title: res.data.name
                })


                wx.setNavigationBarColor({
                    frontColor: '#ffffff',
                    backgroundColor: wx.getStorageSync('platform_color'),
                    animation: {
                        duration: 0,
                        timingFunc: 'easeIn'
                    }
                })
                if (res.data.type == 1) {
                    wx: wx.setStorageSync('hotel', res.data.seller_id)
                }
                that.setData({
                    platform: res.data,
                    types: res.data.type
                })
            },
        })
      
        //  获取标题信息
        app.util.request({
            url: 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageIndex',


            success: function (res) {

                that.setData({
                    title: res.data
                })
            },
        })
        // 获取网址信息
        app.util.request({
            url: 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageAttachurl',
            'cachetime': '0',

            success: function (res) {
                wx.setStorageSync("url", res.data)
                that.setData({
                    //  slide: res.data,
                    urls: res.data
                })
            },
        })
        // 获取当前地理位置的经纬度
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy
            },
        })

        //地理位置
        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                let latitude = res.latitude
                let longitude = res.longitude
                let op = latitude + ',' + longitude;
                app.util.request({
                    url: 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageMap',

                    data: { op: op },
                    success: res => {

                        wx.setStorageSync("location", res.data.result.location)
                        that.setData({
                            city: res.data.result.ad_info.city,
                            location: res.data.result.location
                        })

                    }
                })
            }
        })
    },
    bindGetUserInfo: function (e) {
        console.log(e.detail.userInfo)
    },

    // 下拉刷新
    onPullDownRefresh() {
        var that = this
        that.onLoad()
        wx.stopPullDownRefresh();
    },
    onShow: function () {
        var startDate = this.data.startDate;
        var endDate = this.data.endDate;
        // 默认显示入住时间为当天
        var date = Data.formatDate(new Date(), "yyyy-MM-dd");
        var tomorrow1 = new Date();
        // 默认显示离店日期为第二天
        tomorrow1.setDate((new Date()).getDate() + 1);
        var tomorrow = Data.formatDate(new Date(tomorrow1), "yyyy-MM-dd");

        if (startDate == null) {
            var s1 = new Date(date.replace(/-/g, "/"));
            var s2 = new Date(tomorrow.replace(/-/g, "/"));
            var days = s2.getTime() - s1.getTime();
            var time = parseInt(days / (1000 * 60 * 60 * 24));
            if (new Date(date).getDay() == 0) {
                starttime = date.slice(5, 10) + '周日';
            } else if (new Date(date).getDay() == 1) {
                starttime = date.slice(5, 10) + '周一';
            } else if (new Date(date).getDay() == 2) {
                starttime = date.slice(5, 10) + '周二';
            } else if (new Date(date).getDay() == 3) {
                starttime = date.slice(5, 10) + '周三';
            } else if (new Date(date).getDay() == 4) {
                starttime = date.slice(5, 10) + '周四';
            } else if (new Date(date).getDay() == 5) {
                starttime = date.slice(5, 10) + '周五';
            } else if (new Date(date).getDay() == 6) {
                starttime = date.slice(5, 10) + '周六';
            }
            if (new Date(tomorrow).getDay() == 0) {
                endtime = tomorrow.slice(5, 10) + '周日'
            } else if (new Date(tomorrow).getDay() == 1) {
                endtime = tomorrow.slice(5, 10) + '周一';
            } else if (new Date(tomorrow).getDay() == 2) {
                endtime = tomorrow.slice(5, 10) + '周二';
            } else if (new Date(tomorrow).getDay() == 3) {
                endtime = tomorrow.slice(5, 10) + '周三';
            } else if (new Date(tomorrow).getDay() == 4) {
                endtime = tomorrow.slice(5, 10) + '周四';
            } else if (new Date(tomorrow).getDay() == 5) {
                endtime = tomorrow.slice(5, 10) + '周五';
            } else if (new Date(tomorrow).getDay() == 6) {
                endtime = tomorrow.slice(5, 10) + '周六';
            }


        } else {
            var s1 = new Date(startDate.replace(/-/g, "/"));
            var s2 = new Date(endDate.replace(/-/g, "/"));
            var days = s2.getTime() - s1.getTime();
            var time = parseInt(days / (1000 * 60 * 60 * 24));
            // 截取日期只显示月和日
            var seatr_time_one = startDate.slice(5, 10)
            var end_time_one = endDate.slice(5, 10)
            // 入住日期
            if (new Date(startDate).getDay() == 0) {
                var starttime = seatr_time_one + '周日'
            } else if (new Date(startDate).getDay() == 1) {
                var starttime = seatr_time_one + '周一'
            } else if (new Date(startDate).getDay() == 2) {
                var starttime = seatr_time_one + '周二'
            } else if (new Date(startDate).getDay() == 3) {
                var starttime = seatr_time_one + '周三'
            } else if (new Date(startDate).getDay() == 4) {
                var starttime = seatr_time_one + '周四'
            } else if (new Date(startDate).getDay() == 5) {
                var starttime = seatr_time_one + '周五'
            } else if (new Date(startDate).getDay() == 6) {
                var starttime = seatr_time_one + '周六'
            }

            // 离店日期
            if (new Date(endDate).getDay() == 0) {
                var endtime = end_time_one + '周日'
            } else if (new Date(endDate).getDay() == 1) {
                var endtime = end_time_one + '周一'
            } else if (new Date(endDate).getDay() == 2) {
                var endtime = end_time_one + '周二'
            } else if (new Date(endDate).getDay() == 3) {
                var endtime = end_time_one + '周三'
            } else if (new Date(endDate).getDay() == 4) {
                var endtime = end_time_one + '周四'
            } else if (new Date(endDate).getDay() == 5) {
                var endtime = end_time_one + '周五'
            } else if (new Date(endDate).getDay() == 6) {
                var endtime = end_time_one + '周六'
            }
        }


        this.setData({
            dd: date,
            to: tomorrow,
            date: starttime,
            tomorrow: endtime,
            time: time
        });
    },
    // 订酒店
    hotel: function (e) {
        var that = this
        console.log(e);
        // wx: wx.navigateTo({
        //   url: '../merchant/merchant?lat=' + this.data.location.lat + '&lng=' + this.data.location.lng + '&time' + this.data.date + '&tomorrow=' + this.data.tomorrow + '&dd=' + this.data.dd + '&to=' + this.data.to,
        //   success: function (res) { },
        //   fail: function (res) { },
        //   complete: function (res) { },
        // })

        if (this.data.city == null) {
            wx: wx.showToast({
                title: '定位失败',
                icon: '',
                image: '',
                duration: 1500,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        } else {
            if (that.data.types == 2) {
                if (this.data.endDate == null) {
                    wx: wx.navigateTo({
                        url: "/pages/commen/pages/merchant/merchant?time=" + this.data.time + '&date=' + this.data.date + '&tomorrow=' + this.data.tomorrow + '&dd=' + this.data.dd + '&to=' + this.data.to + '&lat=' + this.data.location.lat + '&lng=' + this.data.location.lng,
                    })
                } else {

                    wx: wx.navigateTo({
                        url: "/pages/commen/pages/merchant/merchant?time=" + this.data.time + '&to=' + this.data.endDate + '&dd=' + this.data.startDate + '&date=' + this.data.date + '&tomorrow=' + this.data.tomorrow + '&lat=' + this.data.location.lat + '&lng=' + this.data.location.lng,
                    })
                }
            } else if (that.data.types == 1) {
                if (this.data.endDate == null) {
                    wx: wx.navigateTo({
                        url: "../wode/index?time=" + this.data.time + '&date=' + this.data.date + '&tomorrow=' + this.data.tomorrow + '&dd=' + this.data.dd + '&to=' + this.data.to + '&lat=' + this.data.location.lat + '&lng=' + this.data.location.lng,
                    })
                } else {

                    wx: wx.navigateTo({
                        url: "../wode/index?time=" + this.data.time + '&to=' + this.data.endDate + '&dd=' + this.data.startDate + '&date=' + this.data.date + '&tomorrow=' + this.data.tomorrow + '&lat=' + this.data.location.lat + '&lng=' + this.data.location.lng,
                    })
                }
            }

        }


    },
    onReady: function () {
        var that = this


    },
    in_calendar: function () {
        wx.navigateTo({
            url: '../calendar/calendar',
        })
    },
    tomap: function (e) {

        var that = this

        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
            success: function (e) {
                var latitude = e.latitude
                var longitude = e.longitude
                wx.openLocation({
                    latitude: latitude,
                    longitude: longitude,
                    name: that.data.store.name,
                    address: that.data.store.address,
                    scale: 28
                })
            }
        })

    },
})
