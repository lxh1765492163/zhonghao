var js = require('../../../vendor/app.js')
var WxParse = require('../../../vendor/wxParse/wxParse.js');
var siteInfo = require('../../../config.js');

var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        items: null,
        pagetype: 0, // 页面类型 0:默认 1:自定义
        location: ['北京市'], // 用户位置
        local: null,
        tel: app.siteInfo.tel,
        telname: app.siteInfo.telname,
        data: [],
        title: '', //标题
        typeLoding: false,
        loading: true,
        hasMore: false,
        pagetype: 5, // 页面类型
        page: {}, // 页面信息
        modules: [], // 模块
        times: 2000,
        order_member: '',
        alldanmu: {},
        styles: {},
        arrData: [],
        tabid: 0,
        messageswipe: 0,
        display:false,
        params : ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this
        //  app.globalData.address.set_city = '上海市'
        // 读取模块信息
        // this.getModule()
        clearInterval()
        wx.getSystemInfo({
            success: function (res) {
                // console.log(res);
                that.setData({
                    width: res.windowWidth,
                    height: res.windowHeight
                });
            }
        });
        // app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=index.get_diyMenus',
            method: 'GET',
            data: {
                id: siteInfo.template_id
            },
            success: function (res) {
                var datas = res.data.data;
                var data = res.data;
                var style = res.data.style;
                that.setData({
                    datas: datas,
                    style: style,
                    data: data,
                })
            }
        })
        // })

        // 位置
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                var latitude = res.latitude
                var longitude = res.longitude
                that.setData({
                    local: res
                })
                wx.request({
                    url: app.siteInfo.domain + '/bale/pay.php?do=getLocation',
                    data: {
                        lat: latitude,
                        lng: longitude = res.longitude
                    },
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                        var r = res.data.result

                        if (!r.ad_info) {
                            return
                        }

                        app.globalData.address = r.ad_info;
                        let location = r.ad_info.set_city
                        //  app.globalData.address.set_city  ='上海市'


                        // 用户位置
                        that.setData({
                            location: location
                        })
                    },
                    fail: function () {
                        console.log('获取位置失败')
                    }
                })
            },
        })
        that.initView();
        that.authorize();
    },
    getUserInfo: function (res) {
        console.log(res);
        console.log("授权成功")
        if (res.detail.userInfo) {
            wx.showToast({
                title: '授权成功',
            })
            // setTimeout(function () {

            // }, 1000);
            app.util.getUserInfo();
        }
    },
    /**
      *关闭广告
      */
    closeadv: function () {
        var that = this;
        if (that.data.adv.data.params.showtype == 1) {
            wx.setStorageSync('advshow', 'true');
        }
        var advanimationData = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
        })
        that.animation = advanimationData;
        advanimationData.height(0).width(0).step();
        that.setData({
            advanimationData: advanimationData.export(),
            closeadv: true,
        })
        if (that.data.adv.data.params.showtype == 1) {
            that.countdownopen();
        }
    },
    /**
     *定时推送广告
     */
    countdownopen: function () {
        var that = this;
        var nowtime = 0;
        var time = that.data.adv.data.params.showtime * 60 * 1000;
        var height = that.data.height;
        var width = that.data.width;
        // console.log(time);
        var timer;
        timer = setInterval(function () {
            nowtime += 1;
            // console.log(nowtime);
            var advanimationData = wx.createAnimation({
                duration: 1000,
                timingFunction: 'ease',
            })
            that.animation = advanimationData;
            advanimationData.height(height).width(width).step();
            that.setData({
                advanimationData: advanimationData.export(),
            })
            if (that.data.adv.data.params.autoclose != 0 && that.data.adv.data.params.style == 'default') {
                that.countdownclose();
            }
            if (nowtime > 0) {
                clearInterval(timer);
            }
        }, time)
    },
    //广告定时关闭
    countdownclose: function () {
        var that = this;
        // if (that.data.adv.data.params.autoclose != 0 && that.data.adv.data.params.style == 'default') {
        var timer;
        var countdown = parseInt(that.data.adv.data.params.autoclose) + 1;
        timer = setInterval(function () {
            // console.log(countdown);
            if (that.data.closeadv == true) {
                clearInterval(timer);
                that.setData({
                    closeadv: false,
                })
            } else {
                if (countdown > 0) {
                    countdown -= 1;
                    that.setData({
                        countdown: countdown,
                    })

                } else {
                    var advanimationData = wx.createAnimation({
                        duration: 1000,
                        timingFunction: 'ease',
                    })
                    that.animation = advanimationData;
                    advanimationData.height(0).width(0).step();
                    that.setData({
                        advanimationData: advanimationData.export(),
                    });
                    if (that.data.adv.data.params.showtype == 1) {
                        that.countdownopen();
                    }
                    clearInterval(timer);
                }
            }
        }, 1000)
        // }
    },

    /**
    * 判断是否授权
    */
    authorize: function () {
        var that = this;
        wx.getSetting({
            success: function (e) {
                // console.log(e);
                if (e.authSetting['scope.userInfo']) {
                    that.setData({
                        display:true
                    })
                } else {
                    that.toauthorize();
                    
                }
            }
        })
    },

    /**
    * 去授权
    */
    toauthorize: function () {
        var that = this;
        var height = that.data.height;
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease',
        })
        that.animation = animation;

        animation.height(height).step().opacity(1).step();
       
        that.setData({
            animationData: animation.export(),
         
        })
    },
    hidmark: function () {
        var height = this.data.height;
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease',
        })
        this.animation = animation
        animation.opacity(0).step().height(0).width(0).step();
  


        this.setData({
            animationData: animation.export(),
            display:true
        })
    },

    /**
     * 提交留言
     */
    setmessage: function (e) {
        var content = e.detail.value.content
        var that = this;
        if (content != '') {
            app.util.request({
                url: "entry&m=ewei_shopv2&do=mobile&r=index.mesupload",
                header: {
                    'content-type': 'application/json' // 默认值
                },
                method: 'POST',
                data: {
                    content: content,
                },
                success: function (res) {
                    console.log(res);
                    if (res.data.msg == 'ok') {
                        wx.showToast({
                            title: '留言成功',
                        })
                        setTimeout(function () {
                            that.setData({
                                inputvalue: ''
                            })
                        }, 2000)
                    }
                    else {
                        wx.showToast({
                            title: '留言失败',
                        })
                    }
                }
            })
        } else {
            wx.showToast({
                title: '留言不能为空',
            })
        }
    },

    /**
     * 获取留言
     */
    getmeassage: function () {
        var that = this;
        app.util.request({
            url: "entry&m=ewei_shopv2&do=mobile&r=index.message",
            header: {
                'content-type': 'application/json' // 默认值
            },
            data: {
                page: 1,
            },
            success: function (res) {
                // console.log(res.data.messageswipe)
                that.setData({
                    messageswipe: res.data.messageswipe,
                })
            }
        })
    },
    /**
          * 取模块数据
          */
    getModule: function () {
        const that = this
        var i = 0;
        js.getModules(that.data.pagetype, function (res) {

            var Arr = res.data.order_member
            var isopen = res.data.set.diypage.danmu.params;

            var datas = res.data.set.diypage.danmu.data;
            var color = res.data.set.diypage.danmu.style;
            if (Arr) {
                var n = Math.floor(Math.random() * Arr.length + 1) - 1;


                that.setData({
                    order_member: Arr[n]
                })
                setInterval(function () {
                    var n = Math.floor(Math.random() * Arr.length + 1) - 1;
                    that.setData({
                        order_member: Arr[n]
                    })
                }, 9000)

            } else if (datas) {
                var m = Math.floor(Math.random() * datas.length);

                that.setData({
                    alldanmu: datas[m]
                })
            }
            that.setData({
                modules: res.data.set,
                page: res.data.page,
                color: color,
                isopen: isopen
            })

            that.parseModules()
        })
    },

    /**
     * 解析模块
     */
    parseModules: function () {
        const that = this
        var modules = that.data.modules
        app.util.parseModules(modules, function (res) {

            that.setData({
                modules: res
            })
        })
    },

    bindRegionChange: function (e) {
        var that = this;
        //  var arr = e.detail.value.shift();
        //  var a = arr.join('');

        var location = e.detail.value[1];
        that.setData({
            location: location
        });

    },


    changetab: function (e) {
        var tabid = e.currentTarget.dataset.id;
        this.setData({
            tabid: tabid
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        var that = this;
        // 实例化一个动画
        var that = this;
        var i = 0
        var ii = 0

        var animationCloudData = wx.createAnimation({
            duration: 1000, // 默认为400     动画持续时间，单位ms
            timingFunction: 'ease',
            //transformOrigin: '4px 91px'
        });


        // //动画的脚本定义必须每次都重新生成，不能放在循环外
        // animationCloudData.translateX(-330).step({ duration: 1000 })
        animationCloudData.translateX(-330).step({ duration: 3000 }).translateX(0).step({ duration: 5000 });

        // // 更新数据
        that.setData({
            // 导出动画示例

            animationCloudData: animationCloudData.export(),
        })

        setInterval(function () {
            //动画的脚本定义必须每次都重新生成，不能放在循环外
            animationCloudData.translateX(-330).step({ duration: 3000 }).translateX(0).step({ duration: 3000 });

            // 更新数据
            that.setData({
                // 导出动画示例
                //animationData: animationData.export(),
                animationCloudData: animationCloudData.export(),
            })
            ++ii;


        }.bind(that), 10000);//3000这里的设置如果小于动画step的持续时间的话会导致执行一半后出错



    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;

        if (!app.globalData.userInfo) {
            return
        }

        this.setData({
            location: that.data.location
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
        // wx.clearStorageSync();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

        wx.stopPullDownRefresh();
        this.initView();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        //
    },
    onReachBottom: function () {
        // Do something when page reach bottom.
    },

    /**
     * 初始化视图
     */
    initView: function () {
        const that = this

        app.util.initView(app.siteInfo.domain + '/app/index.php?c=wxapp&a=module&do=main&id=' + app.siteInfo.template_id + '&uniacid=' + app.siteInfo.uniacid, function (data) {
            var title = data.result.page.name;
            that.getmeassage();
            that.setData({
                items: data.result,
                pagetype: 1,
                title: title,
                adv: data.diyadv,
            })
            //广告缓存
            if (!wx.getStorageSync('advshow') && data.diyadv != undefined) {
                var advanimationData = wx.createAnimation({
                    duration: 1000,
                    timingFunction: 'ease',
                })
                that.animation = advanimationData;
                advanimationData.height(that.data.height).width(that.data.width).step();
                that.setData({
                    advanimationData: advanimationData.export(),
                });

                //广告定时关闭
                if (data.diyadv && data.diyadv.data.params.autoclose != 0 && data.diyadv.data.params.style == 'default') {
                    that.setData({
                        countdown: parseInt(data.diyadv.data.params.autoclose) + 1
                    })
                    var timer;
                    timer = setInterval(function () {
                        var countdown = that.data.countdown;
                        // console.log(countdown);
                        if (that.data.closeadv == true) {
                            clearInterval(timer);
                            that.setData({
                                closeadv: false,
                            })
                        } else {
                            if (countdown > 0) {
                                countdown -= 1;
                                that.setData({
                                    countdown: countdown,
                                })
                            } else {
                                var advanimationData = wx.createAnimation({
                                    duration: 1000,
                                    timingFunction: 'ease',
                                })
                                that.animation = advanimationData;
                                advanimationData.height(0).width(0).step();
                                that.setData({
                                    advanimationData: advanimationData.export(),
                                });
                                if (data.diyadv.data.params.showtype == 1) {
                                    that.countdownopen();
                                    wx.setStorageSync('advshow', 'true');
                                }
                                clearInterval(timer);
                            }
                        }
                    }, 1000)
                }
            } else if (data.diyadv != undefined) { that.countdownopen() }
            var arrData = [];
            for (var i in data.result) {
                var truedata = {}


                if (data.result[i].id == 'menu') {


                    for (var l in data.result[i].data) {

                        for (var k in data.result[i].data[l].page_data) {

                            arrData.push(data.result[i].data[l].page_data[k])

                        }
                    }
                }

            }
            that.setData({
                arrData: arrData
            })

            that.parseModule(that.data.items);
            wx.setNavigationBarTitle({
                title: that.data.title,
            })

        })


    },

    parseModule: function (m) {

        if (!m) {
            return
        }
        const that = this

        for (var i in m) {

            if (m[i].id == 'merchgroup' && m[i].params.openlocation) {

                var item = m[i]
                var flag = i
                //取坐标
                var local = that.data.local
                if (local == null) {
                    wx.getLocation({
                        type: 'gcj02',
                        success: function (res) {

                            var latitude = res.latitude
                            var longitude = res.longitude
                            that.setData({
                                local: res
                            })

                        }
                    })
                }

                var data = {
                    lat: local.latitude,
                    lng: local.longitude,
                    item: item
                }
                app.util.request({
                    url: 'entry/ewei_shopv2/mobile&r=diypage.index.get_merch',
                    method: 'POST',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: JSON.stringify(data),
                    success: function (res) {

                        if (res.data.status == 1) {
                            var list = res.data.result.list
                            if (list && list.length > 0) {
                                var it = that.data.items;

                                it[flag].data = list
                                that.setData({
                                    items: it
                                })
                            }
                        }
                    },
                    fail: function (e) {
                        console.log(e)
                    }
                })


            }

            if (m[i].id == 'richtext') {
         
                var params = m[i].params;
                console.log(params.content)
                that.setData({
                    params: params
                })
            }
        }
    },
    telPhone: function (e) {
        const tel = e.currentTarget.dataset.tel
        if (!tel) {
            return
        }

        wx.makePhoneCall({
            phoneNumber: tel
        })
    },
    // 提交搜索
    formSubmit: function (e) {
        const keywords = e.detail.value.keywords
        this.postSubmit(keywords)
    },

    /**
     * 搜索提交
     */
    searchSubmit: function (e) {
        const keywords = e.detail.value
        this.postSubmit(keywords)
    },

    /**
     * 提交搜索
     */
    postSubmit: function (keywords) {
        //if (keywords != '') {
        //跳转到列表页
        wx.navigateTo({
            url: '/pages/default/goods/list/list?r=goods.index.get_list&keywords=' + keywords,
        })
        // }
    },

    /**
     * 选择城市
     */
    selectCity: function () {
        wx.navigateTo({
            url: '/pages/custom/switchcity/switchcity'
        })
    },

    calling: function () {
        wx.makePhoneCall({
            phoneNumber: app.siteInfo.tel, //此号码并非真实电话号码，仅用于测试
            success: function () {
                console.log("拨打电话成功！")
            },
            fail: function () {
                console.log("拨打电话失败！")
            }
        })
    },
    onHide: function () {

    },
    onunload: function () {

    }
})