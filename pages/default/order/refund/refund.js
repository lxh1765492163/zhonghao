// refund.js
var app = getApp();
var time = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        conduct: ["", "退货退款", "换货", "退款（仅退款不退货）"],
        refund: ["不想要了", "卖家缺货", "拍错了/订单信息错误", "其他"],
        optionid: '',
        imgs: [],
        index: '',
        rindex: '',
        optionid: '',
        typeid : '',
        list : {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        var optionid = options.id;
        var price = parseFloat(options.price)
        var typeid = options.type;
        var that = this;
        this.setData({
            optionid: optionid,
            price: price,
            typeid: typeid
        })



    
        if (typeid == 2) {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=index.refun_detail',
                data: {
                    id : optionid
                },

                success: function (res) {
                    console.log(res);
                    var list = res.data;
                    var times = res.data.createtime
                    console.log()
                    that.setData({
                        list : list,
                        time　: time.formatTime(times, 'Y/M/D h:m:s')
                    })
                }
            })
        }

    },
    removefefund: function (e) {
        var that = this;
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=index.refun_remove',
            data: {
                id: that.data.optionid
            },
            success: function (res) {
                console.log(res);

                if (res.data.msg == 'ok') {
                    wx.showLoading({
                        title: '正在加载',
                    })
                   wx.redirectTo({
                       url: '/pages/default/order/index/index',
                   })
                } else {
                    wx.showLoading({
                        title: res.data.msg,
                    })
                }

            }
        })
    },
    open: function () {
        var that = this;
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
            index: parseInt(e.detail.value)
        })
        console.log(parseInt(e.detail.value))
    },
    bindrefund: function (e) {
        console.log(e);

        this.setData({
            rindex: e.detail.value
        })
    },

    formSubmit: function (e) {
        console.log(e);
        var that = this;
        if (that.data.index == '') {
            wx.showLoading({
                title: '请选择处理方式',
            })
            setTimeout(function(){
              wx.hideLoading();
            })
            return
        }
        if (that.data.rindex == '') {
            wx.showLoading({
                title: '请选择退款原因',
            })
            setTimeout(function () {
              wx.hideLoading();
            })
            return
        }
        if (e.detail.value.price == ''){
            wx.showLoading({
                title: '请输入金额',
            })
            setTimeout(function () {
              wx.hideLoading();
            })
            return
        }
       
        var datas = {
            id: that.data.optionid,
            rtype: that.data.index,
            reason: that.data.refund[that.data.rindex],
            content: e.detail.value.realname,
            price: e.detail.value.price,
            imgs: that.data.imgs,
        }
        app.util.request({
            url: 'entry&m=ewei_shopv2&do=mobile&r=index.submit',
            data: datas,
            method: 'POST',
            success: function (res) {
                console.log(res);
                if (res.data.msg == 'ok') {
                    wx.redirectTo({

                        url: '/pages/default/order/detail/detail?id=' + that.data.optionid,
                    })
                } else {
                    wx.showLoading({
                        title: res.data.msg,
                    })
                }
            },
            fail: function () {
              wx.hideLoading()
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