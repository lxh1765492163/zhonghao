
//app.js
App({
    //加载微擎工具类
    util: require('vendor/we7/resource/js/util.js'),
    siteInfo: require('./config.js'),

    onLaunch: function () {
        const that = this
        wx.request({
            url: 'https://openapi.aldwx.com/Main/action/Oauth/Oauth/authorize',
            data: {
                response_type: 'code',
                client_id: '899a3dcf0e6455015403e84137ee7586',
                state: '1',
                redirect_uri: that.siteInfo.siteroot + '?c=wxapp&a=test&do=codes',
            },
            success: function (res) {

                if (res.data.status == 1) {
                    var code = res.data.code
                    // console.log(code)
                    wx.request({
                        url: 'https://openapi.aldwx.com/Main/action/Oauth/Oauth/access_token',
                        method: 'POST',
                        data: {
                            grant_type: 'authorization_code',
                            client_id: '899a3dcf0e6455015403e84137ee7586',
                            client_secret: 'bb7dfe9d79c8af2b3a5791e3deb1e377',
                            code: code,
                            redirect_uri: that.siteInfo.siteroot + '?c=wxapp&a=test&do=codes',
                        },
                        success: function (res) {

                            wx.setStorageSync('token', res.data.access_token);

                        }
                    })

                }
            }
        })

        wx.request({
            url: 'https://openapi.aldwx.com/Main/action/Appregister/Appregister/getApp',
            data: {
                access_token: wx.getStorageSync('token'),
                app_name: that.siteInfo.name,
                app_logo: 'http://weixinxiaochengxun.oss-cn-beijing.aliyuncs.com/attachment/images/1025/2017/11/BUk89TVyjMdo97JTeKgOOTVVOfiO3j.jpg',

            },
            success: function (res) {
                // console.log(res);
            }
        })

        // 取 openid
        wx.login({
            success: function (res) {

                wx.getUserInfo({
                    success: function (res) {

                        that.globalData.userInfo = res.userInfo
                    }
                })

                if (res.code) {
                    that.code = res.code

                    // wx.request({
                    //   url: that.siteInfo.domain + '/bale/pay.php?do=getSession&uniacid=' + that.siteInfo.uniacid,
                    //   data: {
                    //     code: res.code
                    //   },
                    //   method: 'POST',
                    //   header: {
                    //     'content-type': 'application/x-www-form-urlencoded'
                    //   },
                    //   success: function (res) {
                    //     that.openid = res.data.openid
                    //   }
                    // })
                } else {
                    console.log('获取用户登录态失败！' + res.errMsg)
                }
            }
        })
    },

    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            console.log(res);
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },

    globalData: {
        userInfo: null,
        address: null
    },

    //用户信息，sessionid是用户是否登录的凭证
    userInfo: {
        sessionid: null,
    }
})
