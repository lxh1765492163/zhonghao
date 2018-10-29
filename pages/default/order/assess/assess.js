// pages/form/assess/index.js
var app = getApp();
var siteInfo = require('../../../../config.js')
function stars(num) {
    var star = [];
    for (var i = 1; i <= 5; i++) {
        if (num - i >= 0) {
            star.push(1);
     
        } else if (num - i > -0.65 && num - i <= -0.35) {
            star.push(0.5);
     
        } else {
            star.push(-1);
        }
    }
    return star
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        stars: [-1, -1, -1, -1, -1],
        id: '',
        tempFilePaths: [],
        goods: [],
        orderid: '',
        goodsid: '',
        starnum: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        var id = options.id;
        this.setData({
            id: id
        });
        this.getassess();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    getStars: function (e) {
        console.log(e);
        var that = this;
        var num = parseFloat((e.detail.value) / 10);
        console.log(stars(num));
        that.setData({
            stars: stars(num),
            starnum: num
        })
    },
    bindButtonTap: function (e) {
        console.log(e);
    },
    /**
     * 获取商品信息
    */
    getassess: function () {
        var that = this;
        // app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=order.comment.get_main',
                method: 'GET',
                header: {

                },
                data: {
             
                    id: that.data.id,
                },
                success: function (res) {
                    console.log(res);
                    wx.hideLoading()
                    var goods = res.data.goods;
                    var orderid = res.data.order.id;

                    for (var i = 0; i < goods.length; i++) {
                        var goodsid = res.data.goods[i].goodsid;
                        console.log(goodsid);
                        that.setData({
                            goodsid: goodsid
                        })
                    }

                    that.setData({
                        goods: goods,
                        orderid: orderid,
                    })
                },
                fail: function () {
                    wx.hideLoading()
                }
            })
        // })
    },
    /**
     * 提交评价
    */

    bindFormSubmit: function (e) {
        var that = this;


        var value = e.detail.value.textarea;

        if(value == ''){
            wx.showModal({
                title: '提示',
                content: '请填写评价',
                showCancel: false
            })
            return
        }
        if (that.data.starnum == 0){
            wx.showModal({
                title: '提示',
                content: '请填写评分',
                showCancel: false
            })
            return
        }
        var data = {
            goodsid: that.data.goodsid,
            level: that.data.starnum,
            content: value,
            images: that.data.tempFilePaths,
      
            orderid: that.data.orderid,

        };

        // app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=order.comment.submit',
                method: 'GET',

                data: data,
                success: function (res) {
                    console.log(res);
                    wx.hideLoading()
                   
                    if(res.data.status == 1){
                        wx.showToast({
                            title: '评价完成',
                            icon: 'success',
                            duration: 2000
                        })
                      wx.redirectTo({
                          url: '/pages/default/order/index/index',
                      })
                    }
                },
                fail: function () {
                    wx.hideLoading()
                }
            })
        // })
    },
    /**
     * 打开相机
    */
    openimage: function () {
        var that = this;
        wx.chooseImage({
            count: 5, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera','album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片     
                console.log(res);
                var tempFilePaths = res.tempFilePaths
                that.setData({
                    tempFilePaths: tempFilePaths
                })
            }
        })
    },
    /**
     * 删除照片
    */
    delimage: function (e) {
        console.log(e);
        var id = e.target.dataset.id;

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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

})