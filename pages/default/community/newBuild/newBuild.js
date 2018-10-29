// pages/community/newBuild/newBuild.js
var app = getApp();
var siteInfo = require('../../../../config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // imgUrl: '../../../images/section.png',
        // addImage: false,
        images: ['../../../images/section.png'],
        id: '',
        tempFilePaths: {},
        image: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var id = options.id;
        this.setData({
            id: id,
        })

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
    fromtopic: function (e) {
        console.log(e)
        var val = e.detail.value.val;
        var rmek = e.detail.value.rmek;
        var that = this;
        var images = (that.data.image).join(",")
        console.log(images);

        app.util.getUserInfo(function () {

            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.submit',
                method: 'GET',
                data: {
                    bid: that.data.id,
                    title: val,
                    content: rmek,
                    images: images
                },
                success: function (res) {
                    wx.hideLoading();
                    if (res.data.status == 1) {

                        wx.navigateBack({
                            delta: 1,
                        })
                    } else {
                        wx.showToast({
                            title: res.data.result.message,
                            icon: 'success',
                            duration: 2000
                        })
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
    // addImage: function () {
    //   var addImage = !this.data.addImage;
    //   var imgUrl = this.data.imgUrl;
    //   if (addImage == true) {
    //     imgUrl = '../../../images/section_1.png'
    //   } else {
    //     imgUrl = '../../../images/section.png'
    //   }
    //   this.setData({
    //     addImage: addImage,
    //     imgUrl: imgUrl,
    //   })
    // },
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