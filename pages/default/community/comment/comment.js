// pages/community/comment/comment.js
var siteInfo = require('../../../../config.js');
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        rpid: '',
        pid: '',
        title: '评论话题',
        image: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var id = options.id;
        var typet = options.type;
        var pid = options.pid;
        var rpid = options.rpid ? options.rpid : '';
        this.setData({
            id: id,
            pid: pid,
            rpid: rpid,
        })
        if (typet == 1) {
            wx.setNavigationBarTitle({
                title: this.data.title,
            })
        }

    },
    /**
     * 打开相机
    */
    openimage: function () {
        var that = this;

        wx.chooseImage({
            success: function (res) {
                console.log(res);
                var tempFilePaths = res.tempFilePaths
                var url = siteInfo.siteroot + "?t=" + siteInfo.uniacid + "&from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=util.uploader.main"
                wx.uploadFile({
                    url: url,
                    filePath: tempFilePaths[0],
                    name: 'imgFile',
                    formData: {
                        "file": "imgFile"
                    },
                    success: function (res) {
                        console.log(res);
                        var data = res.data
                        var image = data.substring(1, data.length - 1)
                        if (that.data.image.length == 3) {
                            return;
                        } else {
                            that.data.image.push(image);
                            that.setData({
                                image: that.data.image,
                            })
                            console.log(that.data.image)
                        }

                    }
                })
            }
        })

    },
    subcomment: function (e) {
        console.log(e.detail.value.val.length);
        var val = e.detail.value.val;
        var that = this;
        var images = (that.data.image).join(",")
        if (e.detail.value.val.length <=10){
            wx.showToast({
                title: '字数不能小于10个',
                icon: 'loading',
                duration: 2000
            })
            return
        }
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.reply',
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                    bid: that.data.pid,
                    rpid: that.data.rpid,
                    pid: that.data.id,
                    content: val,
                    images: images
                },
                success: function (res) {

                    if (res.data.status == 1) {
                        wx.navigateBack({
                            delta: 1,
                        })
                    } else {
                        wx.showLoading({
                            title: res.data.result.message,
                        })
                        setTimeout(function () {
                            wx.hideLoading()
                        }, 1000)
                    }
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