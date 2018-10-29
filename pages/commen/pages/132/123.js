// pages/dingdan/dingdan.js
var app = getApp()
var util = require('../../../../utils/util1.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        array: ['1间', '2间', '3间', '4间', '5间', '6间', '7间', '8间', '9间', '10间', '11间', '12间'],
        index: 0,
        coupon: 0,
        coupons_id: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        var that = this
        // 查看会员的折扣
        var discount = wx.getStorageSync('users').discount
        var types = wx.getStorageSync('users').type
        if (types == 1) {
            var discounts = 1
            var dis = 0
            that.setData({
                discount: 1,
                dis: 0
            })
        } else {
            if (discount == '' || discount == null) {
                var discounts = 1
                var dis = 0
                that.setData({
                    discount: 1,
                    dis: 0
                })
            } else {
                var discounts = Number(wx.getStorageSync('users').discount) / 10
                var dis = 1 - discounts

                console.log(discounts)
                that.setData({
                    discount: discounts,
                    dis: dis,
                })
            }
        }
        // 调用函数时，传入new Date()参数，返回值是日期和时间  
        var time = util.formatTime(new Date());
        // 再通过setData更改Page()里面的data，动态更新页面的数据 
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: wx.getStorageSync('platform_color'),
            animation: {
                duration: 0,
                timingFunc: 'easeIn'
            }
        })
        var hotel_id = wx.getStorageSync('hotel')
        // 住的天数
        var day = options.time
        // 计算定的价格
        var price = options.price
        // 计算折扣的价格
        var money = options.price * day
        money = money * dis
        money = money.toFixed(2)
        money = Number(money)
        // 计算总价格
        var shoping = price * day
        shoping = shoping * discounts
        shoping = shoping.toFixed(2)
        this.setData({
            price: price,
            shoping: shoping,
            stime: options.start_time,
            etime: options.end_time,
            day: options.time,
            dd: options.dd,
            money: money,
            to: options.to,
            total_num: options.num,
            room_id: options.id,
            room_name: options.name,
            name: options.name,
            hotel_name: options.hotel_name,
            hotel_id: hotel_id,
            // 判断用户选择的是到店付款还是在线付款
            oid: options.oid
        })
        var that = this
        app.util.request({
            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGethotel',
            'cachetime': '0',
            success: function (res) {
                console.log(res)
                for (var i = 0; i < res.data.length; i++) {
                    if (hotel_id == res.data[i].id) {
                        that.setData({
                            room: res.data[i]
                        })
                        wx.setNavigationBarTitle({
                            title: res.data[i].name
                        })
                    }
                }
            },
        })
        // 获取房间信息
    },
    // 使用优惠券
    coupon: function (e) {
        wx: wx.navigateTo({
            url: '../coupon/coupon?hotel_id=' + this.data.hotel_id + '&money=' + this.data.shoping,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    bindPickerChange: function (e) {
        console.log(this.data)
        // console.log('picker发送选择改变，携带值为', e.detail.value)
        var num = Number(e.detail.value)
        var nn = num + 1
        // 住的天数
        var day = this.data.day
        // 计算房间的原本价格
        var price = Number(this.data.price)
        // 计算折扣的价格
        var money = price * day * nn
        money = money * this.data.dis
        money = money.toFixed(2)
        // 计算总价格
        var shoping = price * day * nn
        shoping = shoping * this.data.discount
        // shoping = shoping.toFixed(2)
        console.log(shoping)
        this.setData({
            index: e.detail.value,
            shoping: shoping,
            nn: nn,
            money: money
        })
    },
    // 提交订单
    formSubmit: function (e) {
        var that = this
        console.log(e)
        console.log(that.data)
        // 优惠券id
        var coupons_id = that.data.coupons_id
        // 优惠券抵扣的金额
        var yhq_cost = that.data.coupon
        console.log('优惠券id为' + ' ' + coupons_id)
        console.log('优惠券抵扣的金额为' + ' ' + yhq_cost)
        // 折扣的金额
        var zk_cost = that.data.money
        console.log('折扣的金额为' + ' ' + zk_cost)
        // 折扣
        var discount = that.data.discount
        // 折扣价
        var shoping = that.data.shoping - that.data.coupon
        if (shoping <= 0) {
            shoping = 0.01
        }
        console.log(shoping)
        // 获取提交的form_id
        var form_id = e.detail.formId
        console.log('用户的form——id是' + form_id)
        // 判断用户输入的名字以及手机号
        var user_tel = e.detail.value.user_tel
        var user_name = e.detail.value.user_name
        // console.log(user_name.length)
        if (user_name.length == 0) {
            wx: wx.showToast({
                title: '请输入名字',
                icon: '',
                image: '',
                duration: 1500,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        } else if (user_name.length > 4) {
            wx.showToast({
                title: '名字太长啦',
                icon: 'success',
                duration: 1500
            })
        } else if (user_name.length <= 4) {
            if (user_tel.length > 0) {
                // 判断用户输入的手机号是否正确
                var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
                if (user_tel.length == 0) {
                    wx.showToast({
                        title: '手机号不能为空',
                        icon: 'success',
                        duration: 1500
                    })
                    return false;
                } else if (user_tel.length < 11) {
                    wx.showToast({
                        title: '手机号长度有误！',
                        icon: 'success',
                        duration: 1500
                    })
                    return false;
                } else if (!myreg.test(user_tel)) {
                    wx.showToast({
                        title: '手机号格式错误！',
                        icon: 'success',
                        duration: 1500
                    })
                    return false;
                } else {
                    // 用户的openid
                    var openid = wx.getStorageSync('openid')
                    // 用户的id
                    var uese_id = wx.getStorageSync('users').id
                    // 得到用户入住的时间
                    var days = that.data.day
                    // 得到该房型的剩余数量
                    var total_num = that.data.total_num
                    // 得到该订单的金额以及用户下单的房间数
                    if (that.data.nn == null) {
                        var money = that.data.price * that.data.day
                        var room_num = 1
                    } else {
                        var money = that.data.price * that.data.nn * that.data.day
                        var room_num = that.data.nn
                    }
                    // 得到用户入住酒店的时间起止
                    var start_time = that.data.dd
                    var end_time = that.data.to

                    // 获取商家的id以及名字
                    var hotel_id = that.data.hotel_id
                    var hotel_name = that.data.room.name

                    // 获取房间的id级房间型号
                    var room_id = that.data.room_id
                    var room_name = that.data.room_name

                    // 用户输入的名字以及手机号
                    var user_tel = e.detail.value.user_tel
                    var user_name = e.detail.value.user_name

                    // 判断用户选择的是到店付还是在线付
                    var oid = that.data.oid
                    // 判断保留的日期
                    if (oid == 1) {
                        var cerated_time = that.data.dd
                    } else {
                        var cerated_time = that.data.to
                    }
                    if (total_num < room_num) {
                        wx: wx.showToast({
                            title: '该房型剩余' + total_num + '间',
                            icon: '',
                            image: '',
                            duration: 1000,
                            mask: true,
                            success: function (res) { },
                            fail: function (res) { },
                            complete: function (res) { },
                        })
                    } else {
                        if (form_id == '') {
                            wx: wx.showToast({
                                title: '网络有波动',
                                icon: '',
                                image: '',
                                duration: 1000,
                                mask: true,
                                success: function (res) { },
                                fail: function (res) { },
                                complete: function (res) { },
                            })
                        } else {
                            if (oid == 1) {
                                var user_id = wx.getStorageSync('users').id

                                console.log(oid)
                                //  提交订单
                                app.util.request({
                                    'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageAddorder',
                                    'cachetime': '0',
                                    data: {
                                        user_id: uese_id,
                                        online_price: money,
                                        seller_id: hotel_id,
                                        seller_name: hotel_name,
                                        arrival_time: start_time,
                                        departure_time: end_time,
                                        tel: user_tel,
                                        days: days,
                                        name: user_name,
                                        room_type: room_name,
                                        room_num: room_num,
                                        type: oid,
                                        persist: cerated_time,
                                        goods_id: room_id,
                                        dis_cost: shoping,
                                        coupons_id: coupons_id,
                                        zk_cost: zk_cost,
                                        yhq_cost: yhq_cost
                                    },
                                    success: function (res) {
                                        console.log(res)
                                        // // 会员等级
                                        // app.util.request({
                                        //   'url': 'entry/wxapp/coupons',
                                        //   'cachetime': '0',
                                        //   data: { user_id: user_id },
                                        //   success: function (res) {
                                        //     console.log(res)
                                        //     that.setData({
                                        //       coupon_len: res.data.ok.length
                                        //     })

                                        //   }
                                        // })
                                        var order_id = res.data
                                        if (res.data != "error") {
                                            app.util.request({
                                                'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageMessage',
                                                'cachetime': '0',
                                                data: { form_id: form_id, id: order_id, openid: openid },
                                                success: function (res) {
                                                    console.log(res)
                                                    app.util.request({
                                                        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageSms',
                                                        'cachetime': '0',
                                                        data: { seller_id: hotel_id },
                                                        success: function (res) {
                                                            setTimeout(function () {
                                                                console.log('这是发送短信')
                                                                console.log(res)
                                                                console.log('这是商家id' + hotel_id)
                                                                wx.reLaunch({
                                                                    url: '../yuding/yuding?start_time=' + that.data.dd + '&end_time=' + that.data.to + '&day=' + that.data.day + '&money=' + shoping + '&room_name=' + room_name + '&hotel_name=' + hotel_name
                                                                })
                                                            }, 1000)
                                                        },
                                                    })
                                                },
                                            })

                                        } else {
                                            // 
                                            app.util.request({
                                                'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageMessage',
                                                'cachetime': '0',
                                                data: { form_id: form_id, id: order_id, openid: openid },
                                                success: function (res) {
                                                    console.log(res)
                                                },
                                            })
                                            wx: wx.showToast({
                                                title: '订单生成失败',
                                                icon: '',
                                                image: '',
                                                duration: 1000,
                                                mask: true,
                                                success: function (res) { },
                                                fail: function (res) { },
                                                complete: function (res) { },
                                            })
                                        }
                                    },
                                })
                            } else {

                                var user_id = wx.getStorageSync('users').id
                                //  提交订单
                                app.util.request({
                                    'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageAddorder',
                                    'cachetime': '0',
                                    data: {
                                        user_id: uese_id,
                                        online_price: money,
                                        seller_id: hotel_id,
                                        seller_name: hotel_name,
                                        arrival_time: start_time,
                                        departure_time: end_time,
                                        tel: user_tel,
                                        days: days,
                                        name: user_name,
                                        room_type: room_name,
                                        room_num: room_num,
                                        type: oid,
                                        persist: cerated_time,
                                        goods_id: room_id,
                                        dis_cost: shoping,
                                        coupons_id: coupons_id,
                                        zk_cost: zk_cost,
                                        yhq_cost: yhq_cost
                                    },
                                    success: function (res) {
                                        var order_id = res.data
                                        if (res.data != "error") {
                                            //  去支付

                                            app.util.request({
                                                'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPagePay',
                                                'cachetime': '0',
                                                data: { openid: openid, money: shoping },
                                                success: function (res) {
                                                    wx.requestPayment({
                                                        'timeStamp': res.data.timeStamp,
                                                        'nonceStr': res.data.nonceStr,
                                                        'package': res.data.package,
                                                        'signType': res.data.signType,
                                                        'paySign': res.data.paySign,
                                                        'success': function (res) {

                                                            // 检查该商家打印机是否开启

                                                            app.util.request({
                                                                'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageCheckprint',
                                                                'cachetime': '0',
                                                                data: { seller_id: hotel_id },
                                                                success: function (res) {

                                                                    if (res.data == 2) {
                                                                        // 支付成功打印机打印票据
                                                                        app.util.request({
                                                                            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPagePrint',
                                                                            'cachetime': '0',
                                                                            data: { order_id: order_id },
                                                                            success: function (res) {
                                                                                console.log('这里是打印机打印成功')
                                                                                console.log(res)
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                            // 会员等级
                                                            app.util.request({
                                                                'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageMemberlevel',
                                                                'cachetime': '0',
                                                                data: { user_id: user_id },
                                                                success: function (res) {
                                                                    console.log(res)
                                                                }
                                                            })
                                                            // 改变订单状态
                                                            app.util.request({
                                                                'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageCompleteorder',
                                                                'cachetime': '0',
                                                                data: { order_id: order_id },
                                                                success: function (res) {
                                                                    console.log(form_id)
                                                                    app.util.request({
                                                                        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageMessage',
                                                                        'cachetime': '0',
                                                                        data: { form_id: form_id, id: order_id, openid: openid },
                                                                        success: function (res) {
                                                                            console.log('模板消息')
                                                                            console.log(res)
                                                                            setTimeout(function () {
                                                                                wx.reLaunch({
                                                                                    url: '/pages/default/hotel/shouye/shouye',
                                                                                })
                                                                            }, 1000)
                                                                            wx.showToast({
                                                                                title: '支付成功',
                                                                                duration: 1000
                                                                            })
                                                                        }
                                                                    })
                                                                    app.util.request({
                                                                        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageSms',
                                                                        'cachetime': '0',
                                                                        data: { seller_id: hotel_id },
                                                                        success: function (res) {
                                                                            setTimeout(function () {
                                                                                console.log('这是发送短信')
                                                                                console.log(res)
                                                                                console.log('这是商家id' + hotel_id)
                                                                                wx.reLaunch({
                                                                                    url: '/pages/default/hotel/shouye/shouye',
                                                                                })
                                                                            }, 1000)
                                                                        },
                                                                    })
                                                                    app.util.request({
                                                                        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageSendmail',
                                                                        'cachetime': '0',
                                                                        data: { seller_id: hotel_id },
                                                                        success: function (res) {
                                                                            setTimeout(function () {
                                                                                console.log('这是发送邮件')
                                                                                console.log(res)
                                                                                console.log('这是商家id' + hotel_id)
                                                                           
                                                                            }, 1000)
                                                                        },
                                                                    })
                                                                },
                                                            })
                                                        },

                                                        'fail': function (res) {
                                                            console.log(res);
                                                            wx.showToast({
                                                                title: '支付失败',
                                                                duration: 1000
                                                            })
                                                            console.log(form_id)

                                                        },
                                                    })
                                                },
                                            })
                                        } else {
                                            wx: wx.showToast({
                                                title: '订单生成失败',
                                                icon: '',
                                                image: '',
                                                duration: 1000,
                                                mask: true,
                                                success: function (res) { },
                                                fail: function (res) { },
                                                complete: function (res) { },
                                            })
                                        }
                                    },
                                })
                            }
                        }
                    }




                }
            } else {
                wx.showToast({
                    title: '请输入手机号',
                    icon: 'success',
                    duration: 1500
                })
            }
        }
    }
})