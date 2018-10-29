//logs.js
var app = getApp();
Page({
    data: {
        userInfo: {},
        getmsg: "获取验证码",
        interval: 'interval2',
        proving: 2,
        tel:'',
    },
    onLoad: function () {
        var that = this
        var user_info = wx.getStorageSync('user_info')
        var platform = wx.getStorageSync('platform')
        var store = wx.getStorageSync('store')
        var url = wx.getStorageSync('url')
        var level_name = wx.getStorageSync('users').level_name
        wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: wx.getStorageSync('platform_color'),
            animation: {
                duration: 0,
                timingFunc: 'easeIn'
            }
        })
        console.log(wx.getStorageSync("openid"))
        console.log(platform)
        that.setData({
            store: store,
            level_name: level_name,
            url: url,
            platform: platform
        })
        that.setData({
            avatarUrl: user_info.avatarUrl,
            nickName: user_info.nickName
        })
        wx.setNavigationBarTitle({
            title: '个人中心'
        })
        wx.showShareMenu({
            withShareTicket: true
        })
        that.reload()
        that.Member();
    },
    reload: function (e) {
        var that = this
        var type = wx.getStorageSync("users").type
        that.setData({
            type: type
        })
        var user_id = wx.getStorageSync("users").id
        console.log('用户的id为' + ' ' + user_id)
        // 获取优惠券集合
        app.util.request({
            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageCoupons',
            'cachetime': '0',
            data: { user_id: user_id },
            success: function (res) {
                console.log(res)
                var coupon = []
                for (let index in res.data.ok) {
                    if (res.data.ok[index].store_id != null) {
                        if (res.data.ok[index].state == 2) {
                            coupon.push(res.data.ok[index])
                        }

                    }
                }
                console.log(coupon)
                that.setData({
                    coupon_len: coupon.length
                })

            }
        })
        console.log(user_id)
        // 获取用户会员等级
        app.util.request({
            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageMemberlevel',
            'cachetime': '0',
            data: { user_id: user_id },
            success: function (res) {
                console.log(res);
                console.log("等级")
                console.log(res)
                // that.setData({
                //   coupon_len: res.data.ok.length
                // })

            }
        })
        // 积分总额
        app.util.request({
            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGetscore',
            'cachetime': '0',
            data: { user_id: user_id },
            success: function (res) {
                console.log(res)
                that.setData({
                    score: res.data.score,
                })
            },
        })
        // 平台信息
        app.util.request({
            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageSeller',
            'cachetime': '0',
            success: function (res) {
                console.log(res)
                that.setData({
                    seller: res.data,
                })
            },
        })
    },
    // 点击跳转到我的会员卡
    Member: function (e) {
        var that = this
        var type = that.data.type
        console.log(type)
        console.log(22222222222222222)

        if (type == 1) {
            that.setData({
                proving: 1
            })
        } else {
            that.setData({
                proving: 2
            })
            wx: wx.navigateTo({
                url: 'insider/insider',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        }

    },
    dizhi: function (e) {
        var that = this
        console.log(that.data)
        wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度  
            success: function (e) {
                console.log(that.data)
                var latitude = e.latitude
                var longitude = e.longitude
                wx.openLocation({
                    latitude: latitude,
                    longitude: longitude,
                    name: that.data.seller.name,
                    address: that.data.seller.address,
                    scale: 28
                })
            }
        })

    },
    huiyuan: function (e) {
        console.log(e)
        var code = wx.getStorageSync('code')
        wx: wx.navigateTo({
            url: '../coupon/coupon',
        })

    },
    content: function (e) {
        wx: wx.navigateTo({
            url: 'content/content',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    jump: function (e) {
        wx.navigateToMiniProgram({
            appId: this.data.platform.tz_appid,
            path: '',
            extraData: {
                foo: 'bar'
            },
            envVersion: 'develop',
            success(res) {
                // 打开成功
                console.log('跳转成功')
                console.log(res)
            }
        })
    },
    // 点击获取手机号
    getPhoneNumber: function (e) {
        var that = this
        var sessionKey = wx.getStorageSync('key')
        var iv = e.detail.iv
        var data = e.detail.encryptedData
        app.util.request({
            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPagePhone',
            'cachetime': '0',
            data: { sessionKey: sessionKey, iv: iv, data: data },
            success: function (res) {
                console.log(res)
                // console.log(res.data.slice(19,30))
                // var num = res.data.slice(19, 31)
                // if(num.slice(0,1)!=1){
                //   var num = res.data.slice(20, 31)
                // }else{
                //   var num = res.data.slice(19, 30)
                // }
                // console.log(res)
                that.setData({
                    phone: res.data.phoneNumber
                })
            },
        })
    },
    // 拨打电话
    call_phone: function () {
        var that = this
        console.log('e')
        wx.makePhoneCall({
            phoneNumber: that.data.seller.tel
        })
    },
    my_list: function () {
        wx.navigateTo({
            url: '../mylist/mylist',
        })
    },
    user_name: function (e) {
        var that = this
        console.log(e)
        var name = e.detail.value
        that.setData({
            name: name
        })
    },
    user_tel: function (e) {
        var that = this
        console.log(e)
        var tel = e.detail.value
        that.setData({
            tel: tel
        })
    },
    // 点击跳转商家入驻
    business: function (e) {
        wx: wx.navigateTo({
            url: '../check/check',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },
    // 点击获取验证码
    sendmessg: function (e) {
        console.log(e);
        // 获取6位数的随机数
        console.log(this.data)
        var that = this
        if (that.data.name == '' || that.data.name == null) {
            wx: wx.showToast({
                title: '输入姓名',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        } else if (that.data.tel == '' ) {
            wx: wx.showToast({
                title: '输入手机号',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        } else if (that.data.tel != '' || that.data.tel != null) {
            var Num = "";
            for (var i = 0; i < 6; i++) {
                Num += Math.floor(Math.random() * 10);
            }
            console.log(Num)
            // 随机数传给后台
            app.util.request({
                'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageSms2',
                'cachetime': '0',
                data: { code: Num, tel: that.data.tel },
                success: function (res) {
                    console.log(res)
                },
            })
            that.setData({
                num: Num
            })
            var time = 60
            // 60秒倒计时
            var inter = setInterval(function () {
                that.setData({
                    getmsg: time + "s后重新发送",
                    send: true
                })
                time--
                if (time <= 0) {
                    // 停止倒计时
                    clearInterval(inter)
                    that.setData({
                        getmsg: "获取验证码",
                        send: false,
                        num: 'dhawiphioahoighiwoahgioaw'
                    })
                }
            }, 1000)
        }

    },
    back: function (e) {
        var that = this
        that.setData({
            proving: 2
        })
    },
    // 点击提交
    formSubmit: function (e) {
        console.log(e)
        var that = this
        // 获取用户输入的姓名
        var name = e.detail.value.name
        // 获取用户输入的手机号
        var phone = e.detail.value.phone
        // 获取用户输入的验证码
        var code = e.detail.value.code
        // 获取随机数
        var num = that.data.num
        var time = 60
        if (name == '' || name == null) {
            wx: wx.showToast({
                title: '请输入名字',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        } else if (phone == '' || phone == null) {
            wx: wx.showToast({
                title: '请输入手机号',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        } else if (code == '' || code == null) {
            wx: wx.showToast({
                title: '请输入验证码',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        } else if (code != num) {
            wx: wx.showToast({
                title: '验证码错误',
                icon: '',
                image: '',
                duration: 2000,
                mask: true,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
            })
        } else {
            var user_id = wx.getStorageSync("users").id
            // 姓名 手机号 传给后台
            app.util.request({
                'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageBinding',
                'cachetime': '0',
                data: { tel: phone, zs_name: name, user_id: user_id },
                success: function (res) {
                    console.log(res)
                    var openid = wx.getStorageSync("users").openid
                    var img = wx.getStorageSync("users").img
                    var name = wx.getStorageSync("users").name
                    if (res.data == 1) {
                        app.util.request({
                            'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doLogin',
                            'cachetime': '0',

                            data: { openid: openid, img: img, name: name },
                            success: function (res) {
                                console.log(res)
                                wx.setStorageSync('users', res.data)
                                that.setData({
                                    type: res.data.type,
                                    level_name: res.data.level_name
                                })
                            },
                        })
                    }
                },
            })
            that.setData({
                proving: 2
            })
        }
    },
    onPullDownRefresh: function () {
        var that = this
        that.reload()
        wx.stopPullDownRefresh()
    },
})
