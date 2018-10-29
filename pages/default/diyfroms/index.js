var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        diyform: [],
        img: '',     //图片
        region: ['北京', '北京市', '朝阳区'], //城市
        casIndex: '',  //下拉框
        casArray: [],
        time: '',  //时间
        date: '', //日期

        change: '',
        remark: [],
        duoh: '',
        xiala: '',
        duoxuan: '',
        shenfen: '',
        nianyue: '',
        chengshi: '',
        shijian: '',
        tishi: '',
        imgs: [],
        array: [],
    },
    open: function () {
        var that = this;
        // wx.chooseImage({
        //   count: 9,
        //   sizeType: ['orignal', 'compressed'],

        //   sourceType: ['album', 'camera'],
        //   success: function (res) {
        //     console.log(res)
        //     var tempFilePaths = res.tempFilePaths
        //     console.log(tempFilePaths)
        //     that.setData({
        //       tempFilePaths: tempFilePaths
        //     })
        //   },

        //   fail: function () { },

        //   complete: function () { }


        // })

        wx.chooseImage({
            success: function (res) {

                var tempFilePaths = res.tempFilePaths
                var url = app.util.url('entry/ewei_shopv2/mobile&r=util.uploader.main')

                wx.uploadFile({
                    url: url,
                    filePath: tempFilePaths[0],
                    name: 'imgFile',
                    formData: {
                        "file": "imgFile"
                    },
                    success: function (res) {
                        var data = res.data
                        console.log(res);
                        var imgs = that.data.imgs
                        var image = data.substring(1, data.length - 1)
                        console.log(image)


                        that.setData({
                            imgs: image,

                        })

                    },

                })
            }
        })

    },
    //下拉框、
    bindPickerChange: function (e) {
        console.log(e);

        this.setData({
            casIndex: e.detail.value
        })
    },
    //多选框
    checkboxChange: function (e) {
        console.log(e.detail.value)
        this.setData({
            change: e.detail.value
        })
    },
    // 选择时间
    bindTimeChange: function (e) {

        this.setData({
            time: e.detail.value
        })
    },
    //城市
    bindRegionChange: function (e) {

        this.setData({
            region: e.detail.value
        })
    },

    // 日期
    bindDateChange: function (e) {

        this.setData({
            date: e.detail.value
        })
        console.log(JSON.stringify(e.detail.value));
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // app.util.getUserInfo(function () {
        var that = this;
        var optionsid = options.id;

        that.setData({
            id: optionsid
        })


        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=diyform.index.get_index',
            data: {
                id: optionsid
            },
            success: function (res) {
                console.log(res);

                var diyform = res.data.fields;
                for (var j in diyform) {

                    if (diyform[j].data_type == 0) {


                        that.data.array.push(j)

                    }
                    if (diyform[j].data_type == 2) {
                        that.setData({

                            casArray: diyform[j].tp_text
                        })

                    }
                }

                that.setData({
                    diyform: diyform
                })
            }

        })
        // })
    },
    formSubmit: function (e) {
        console.log(e);
        var that = this;
        var id = that.data.id

        console.log(that.data.array)
        var diyforms = that.data.diyform

        for (var i in diyforms) {

            if (diyforms[i].data_type == 0) {

                that.setData({
                    remark: i
                })

                if (diyforms[i].tp_must == 1 && e.detail.value.realname == '') {
                    wx.showToast({
                        title: '请填写' + diyforms[i].tp_name,
                    })
                    return
                }
            }
            if (diyforms[i].data_type == 1) {
                that.setData({
                    duoh: i
                })
                if (diyforms[i].tp_must == 1 && e.detail.value.remark2 == '') {
                    wx.showToast({
                        title: '请填写' + diyforms[i].tp_name,
                    })
                    return
                }
            }
            if (diyforms[i].data_type == 2) {
                that.setData({
                    xiala: i,

                })
                if (diyforms[i].tp_must == 1 && that.data.casIndex == '') {
                    wx.showToast({
                        title: '请填写' + diyforms[i].tp_name,
                    })
                    return
                }
            }
            if (diyforms[i].data_type == 3) {
                that.setData({
                    duoxuan: i
                })
                if (diyforms[i].tp_must == 1 && that.data.change == '') {
                    wx.showToast({
                        title: '请填写' + diyforms[i].tp_name,
                    })
                    return
                }
            }
            if (diyforms[i].data_type == 5) {
                that.setData({
                    tupian: i
                })
                if (diyforms[i].tp_must == 1 && that.data.img == '') {
                    wx.showToast({
                        title: '请填写' + diyforms[i].tp_name,
                    })
                    return
                }
            }
            if (diyforms[i].data_type == 6) {
                that.setData({
                    shenfen: i
                })
                if (diyforms[i].tp_must == 1 && e.detail.value.remark3 == '') {
                    wx.showToast({
                        title: '请填写' + diyforms[i].tp_name,
                    })
                    return
                }
            }
            if (diyforms[i].data_type == 7) {
                that.setData({
                    nianyue: i
                })
                if (diyforms[i].tp_must == 1 && that.data.date == '') {
                    wx.showToast({
                        title: '请填写' + diyforms[i].tp_name,
                    })
                    return
                }
            }
            if (diyforms[i].data_type == 9) {
                that.setData({
                    chengshi: i
                })
                if (diyforms[i].tp_must == 1 && that.data.region == '') {
                    wx.showToast({
                        title: '请填写' + diyforms[i].tp_name,
                    })
                    return
                }
            }
            if (diyforms[i].data_type == 11) {
                that.setData({
                    shijian: i
                })
                if (diyforms[i].tp_must == 1 && that.data.time == '') {
                    wx.showToast({
                        title: '请填写' + diyforms[i].tp_name,
                    })
                    return
                }
            }
            if (diyforms[i].data_type == 13) {
                that.setData({
                    tishi: i
                })
                if (diyforms[i].tp_must == 1 && e.detail.value.remark4 == '') {
                    wx.showToast({
                        title: '请填写' + diyforms[i].tp_name,
                    })
                    return
                }
            }


        }
     
        // app.util.getUserInfo(function () {
        // let remark = that.data.remark

        // var duoh = that.data.duoh
        // var xiala = that.data.xiala
        // console.log(xiala)
        // var duoxuan = that.data.duoxuan
        // var tupian = that.data.tupian
        // var shenfen = that.data.shenfen
        // var nianyue = that.data.nianyue
        // var chengshi = that.data.chengshi
        // var shijian = that.data.shijian
        // var tishi = that.data.tishi
        // var memberdata = {
        //     [remark]: e.detail.value.realname,
        //     [duoh]: e.detail.value.remark2,
        //     [shenfen]: e.detail.value.remark3,
        //     [shijian]: that.data.time,
        //     [tupian]: that.data.imgs,
        //     [nianyue]: that.data.date,
        //     [xiala]: that.data.casArray[e.detail.value.xiala],
        //     [chengshi]: that.data.region,
        //     [duoxuan]: that.data.change,
        //     [tishi]: e.detail.value.remark4
        // }
        // for (var key in memberdata){
        //   memberdata[diyxingming] = remark

        // }



        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=diyform.index.submit',
            data: {
                memberdata: e.detail.value,
                id: id,

            },
            method: 'POST',
            success: function (res) {
                console.log(res);
                if (res.data.status == 0) {
                    wx.showModal({
                        title: '提示',
                        content: res.data.result.message,
                        showCancel: false
                    })
                    return
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '已提交',
                        showCancel: false,
                        success: function (rs) {
                            if (rs.confirm) {
                                wx.navigateTo({
                                    url: '/pages/default/index/index',
                                })
                            }
                        }
                    })
                }

            }

        })
        // })

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