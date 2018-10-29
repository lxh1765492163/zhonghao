var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        items: null,
        url: {
            logo: '',
            img: ''
        },
        params: {
            name: '',
            logo: '',
            img: '',
            desc: ''
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const that = this

        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=commission.myshop.set.get_main',
                success: function (res) {
                    if (res.status == 0) {
                        wx.showModal({
                            title: '提示',
                            content: '加载出错',
                        })
                        return
                    }
                    var shop = res.data.result.shop
                    var params = {
                        name: shop.name ? shop.name : '',
                        logo: shop.logo ? shop.logo : '',
                        img: shop.img ? shop.img : '',
                        desc: shop.desc ? shop.desc : ''
                    }
                    var url = {
                        logo: shop.logo ? shop.logo : '',
                        img: shop.img ? shop.img : '',
                    }
                    that.setData({
                        items: res.data.result,
                        params: params,
                        url: url
                    })
                },
                fail: function (res) {
                    console.log(res)
                }
            })
        })
    },

    fileUpload: function (e) {
        console.log(e);
        var that = this
        var name = e.currentTarget.dataset.name

        wx.chooseImage({
            success: function (res) {
                console.log(res);
                var tempFilePaths = res.tempFilePaths
                var url = app.util.url('entry/ewei_shopv2/mobile&r=util.uploader.main')
                console.log(url);
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
                        console.log(res);
                        var image = data.substring(1, data.length - 1)
                        console.log(image)
                        // if (data.status == 'success') {
                            var url = that.data.url
                            var params = that.data.params
                            console.log(url)
                            if (name == 'logo') {
                                url.logo = image
                                params.logo = image
                              
                            } else if (name == 'img') {
                                url.img = image
                                params.img = image
                            }
                            that.setData({
                                url: url,
                                params: params
                            })
                         
                        // }
                    },

                })
            }
        })
    },

    removeFile: function (e) {
        var that = this
        var name = e.currentTarget.dataset.name
        var file = e.currentTarget.dataset.file
        if (!file) {
            return
        }

        wx.showLoading({
            title: '正在处理...',
        })

        app.util.request({
            url: 'entry/ewei_shopv2/mobile&r=util.upload.remove',
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                filename: file
            },
            success: function (res) {
                wx.hideLoading()
                if (res.data.status == 'success') {
                    var url = that.data.url
                    var params = that.data.params
                    if (name == 'logo') {
                        url.logo = ''
                        params.logo = ''
                    } else if (name == 'img') {
                        url.img = ''
                        params.img = ''
                    }

                    that.setData({
                        url: url,
                        params: params
                    })
                }
            },
            fail: function () {
                wx.hideLoading()
            }
        })
    },

    formSubmit: function (e) {
        var that = this
        var val = e.detail.value
        var params = that.data.params
        console.log(params)
        if (val.name == '') {
            wx.showToast({
                title: '请填写名称',
                icon: 'loading'
            })
            return
        }

        if (params.logo == '') {
            wx.showToast({
                title: '请上传图标',
                icon: 'loading'
            })
            return
        }

        if (val.desc == '') {
            wx.showToast({
                title: '请填写小店介绍',
                icon: 'loading'
            })
            return
        }

        if (params.img == '') {
            wx.showToast({
                title: '请上传店招',
                icon: 'loading'
            })
            return
        }

        wx.showLoading({
            title: '正在处理...'
        })

        params.name = val.name
        params.desc = val.desc
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=commission.myshop.set.get_main',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: JSON.stringify(params),
                success: function (res) {
                    wx.hideLoading()
                    if (res.data.status == 0) {
                        wx.showModal({
                            title: '提示',
                            content: res.data.result.message,
                            showCancel: false
                        })
                        return
                    } else {
                        wx.navigateBack()
                    }
                },
                fail: function () {
                    wx.hideLoading()
                }
            })
        })

        that.setData({
            params: params
        })
    }

})