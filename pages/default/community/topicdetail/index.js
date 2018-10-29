// pages/community/community.js
var siteInfo = require('../../../../config.js');
var time = require('../../../../utils/util.js');
var WxParse = require('../../../../vendor/wxParse/wxParse.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info: {},
        post: {},
        board: {},
        img: [],
        id: '',  //话题id
        pid: '', //模板id
        list: [],
        page: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        var id = options.id;
        var pid = options.pid;
        var that = this;
        that.setData({
            id: id,
            pid: pid
        })

        that.gettopic();
        that.getask();
    },
    /**
     * 话题信息
    */
    gettopic: function () {
        var that = this;
        // app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.get_index',
            method: 'GET',
            data: {
                i: siteInfo.uniacid,
                id: that.data.id,
            },
            success: function (res) {
                console.log(res);
                var info = res.data.post;
                var content = res.data.post.content;
                var board = res.data.board;
                var post = res.data.post;
                var img = res.data.images;
                var times = res.data.post.createtime;
                var level = res.data.level;
                var isManager = res.data.isManager;
                var memberid = res.data.member;
                that.setData({
                    info: info,
                    isManager: isManager,
                    post: post,
                    img: img,
                    memberid: memberid,
                    board: board,
                    level: level,
                    time: time.formatTime(times, 'Y/M/D h:m:s'),
                    content: WxParse.wxParse('article', 'html', content, that, 5)
                })

            }
        })
        // })
    },
    /**
     * 取评论
    */
    getask: function () {
        var that = this;
        // app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.getlist&bid=' + that.data.pid + '&pid=' + that.data.id,
            method: 'GET',
            data: {
                i: siteInfo.uniacid,
            },
            success: function (res) {
                console.log(res);
                console.log("pinglun")
                var list = res.data.result.list;
                var datas = res.data.result;
                that.setData({
                    list: list,
                    datas: datas,
                })
            }
        })
        // })
    },
    /**
     * 预览图片
    */
    openimage: function () {
        var that = this;
        console.log()
        for (var i in that.data.list) {
            console.log(that.data.list[i].images)
            wx.previewImage({
                current: that.data.list[i].images, // 当前显示图片的http链接
                urls: that.data.list[i].images// 需要预览的图片http链接列表
            })
            return
        }

    },
    /**
     * 审核
    */
    examine: function () {
        var that = this;
        // app.util.getUserInfo(function () {
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.check&bid=' + that.data.pid + '&pid=' + that.data.id,
            method: 'GET',
            data: {
                i: siteInfo.uniacid,
            },
            success: function (res) {
                if (res.data.status == 1) {
                    wx.showToast({
                        title: '审核通过',
                        icon: 'success',
                        duration: 2000
                    })
                    that.gettopic();
                }
            }
        })
        // })
    },
    /**
     * 设置精华
    */
    creamtopic: function (e) {
        console.log(e)
        var that = this;
        var dataType = e.currentTarget.dataset.type;
        if (dataType == 1) {
            wx.showModal({
                title: '提示',
                content: '确定取消精华吗？',
                success: function (res) {
                    if (res.confirm) {

                        app.util.request({
                            url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.best&bid=' + that.data.pid + '&pid=' + that.data.id,
                            method: 'GET',
                            data: {
                                i: siteInfo.uniacid,
                            },
                            success: function (res) {

                                if (res.data.status == 1) {
                                    wx.showToast({
                                        title: '设置成功',
                                        icon: 'success',
                                        duration: 2000
                                    })
                                    that.gettopic();
                                }
                            }
                        })

                    } else if (res.cancel) {

                    }
                }
            })
        } else {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.best&bid=' + that.data.pid + '&pid=' + that.data.id,
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                },
                success: function (res) {


                    if (res.data.status == 1) {
                        wx.showToast({
                            title: '设置成功',
                            icon: 'success',
                            duration: 2000
                        })
                        that.gettopic();
                    }
                }
            })
        }

    },
    /**
    * 设置置顶
   */
    toptopic: function (e) {
        var that = this;
        // app.util.getUserInfo(function () {

        var dataType = e.currentTarget.dataset.type;
        if (dataType == 1) {
            wx.showModal({
                title: '提示',
                content: '确定取消置顶吗?',
                success: function (res) {
                    if (res.confirm) {
                        app.util.request({
                            url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.top&bid=' + that.data.pid + '&pid=' + that.data.id,
                            method: 'GET',
                            data: {
                                i: siteInfo.uniacid,
                            },
                            success: function (res) {

                                if (res.data.status == 1) {
                                    wx.showToast({
                                        title: '设置成功',
                                        icon: 'success',
                                        duration: 2000
                                    })
                                    that.gettopic();
                                }
                            }
                        })
                    }
                }
            })
        } else {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.top&bid=' + that.data.pid + '&pid=' + that.data.id,
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                },
                success: function (res) {

                    if (res.data.status == 1) {
                        wx.showToast({
                            title: '设置成功',
                            icon: 'success',
                            duration: 2000
                        })
                        that.gettopic();
                    }
                }
            })
        }

        // })
    },
    /**
     * 删除话题
    */
    deltopic: function () {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确定删除吗',
            success: function (res) {
                if (res.confirm) {
                    // app.util.getUserInfo(function () {
                    app.util.request({
                        url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.delete&bid=' + that.data.pid + '&pid=' + that.data.id,
                        method: 'GET',
                        data: {
                            i: siteInfo.uniacid,
                        },
                        success: function (res) {

                            console.log(res);
                            console.log("删除")
                            if (res.data.status == 1) {
                                wx.navigateBack({
                                    delta: 1,
                                })
                            }
                        }
                    })
                    // })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }

            }
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
        this.getask();
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

        wx.stopPullDownRefresh();
        this.getask();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log("daodi ")
        var that = this;
        var page = that.data.page++;
        if (page > 1) {
            // app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.getlist&bid=' + that.data.pid + '&pid=' + that.data.id,
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                    page: page
                },
                success: function (res) {
                    console.log(res);
                    console.log("pinglun")
                    var reslist = res.data.result.list;


                    for (var i in reslist) {
                        that.data.list.push(reslist[i])
                    }
                    that.setData({
                        list: that.data.list
                    })
                    if (reslist == '') {
                        wx.showToast({
                            title: '没有数据了',
                            icon: 'loading'
                        })
                    }
                }
            })
            // })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})