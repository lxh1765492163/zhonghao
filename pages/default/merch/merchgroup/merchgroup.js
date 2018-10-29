// pages/merchgroup/merchgroup.js
var siteInfo = require('../../../../config.js');
var app = getApp();
var page = 1;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgs: [],
        drop: '',
        data: [],
        list : [],
        open: false,
        height: 0,
        title: '全部',
        empty: false,
        location: '正在为获取您位置...',
        showloading: false,
        loading: true,
        scrolltop: 0,
        loadingSuccess: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.showToast({
          title: '正在加载...',
          icon: 'loading',
          duration: 10000
        })
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
                    let location = r.ad_info.set_city;
                  
                    that.setData({
                      location: location
                    })
               },
               fail: function () {
                    that.setData({
                        location: '获取位置失败'
                    })
               }
            })
          },
        })
        that.getbanner();
        that.getassess();
        that.classify();
    },

    onPageScroll:function (e){
        var that = this;
        that.setData({
            scrolltop: e.scrollTop
        })
    },


    bindRegionChange: function (e){
      var that = this;
      var location = e.detail.value[1];
      that.setData({
        location: location  
      });
      
  },
 
    /**
     * 取轮播图
    */
    getbanner : function(){
        var that = this;
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=merch.list.get_category_swipe',
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                },
                success: function (res) {
                    wx.hideToast()
                    var imgs = res.data
         
                    that.setData({
                        imgs: imgs,
                    })

                },
                fail: function () {
                    wx.hideLoading()
                }
            })
        })
    },


    totop: function (e){
        wx.pageScrollTo({
          scrollTop: 0
        })
        return false
    },


    /**
     * 
     */
    openList: function (e) {
        var that = this;
        var drop = e.currentTarget.dataset.drop;
        that.setData({
            drop: drop
        })
  
    },
    open: function () {
        var that = this
        if (that.data.open == false) {
            setTimeout(function () {
                var height = that.data.height + 30
                if (height <= 180) {
                    that.setData({
                        height: height,
                    })
                    that.open();
                } else {
                    that.setData({
                        open: true,
                    })
                }
            }, 10)
        } else {
            that.setData({
                height: 0,
                open: false,
            })
        }
    },
    /**
     * 分类
    */
    classify : function(){
        var that = this;
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=merch.list.get_category',
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                },
                success: function (res) {
                    wx.hideToast()
                    console.log(res);
                    var data = res.data
                    console.log(data)
                    that.setData({
                        data: data,
                        loadingSuccess: true
                    })

                },
                fail: function () {
                    wx.hideLoading()
                }
            })
        })
    },
    /**
     * 分类连接
    */
    openjump : function(e){
        var that = this;
        var cateid = e.currentTarget.dataset.cateid;
        var title = e.currentTarget.dataset.title;
        that.setData({
            title: title,
            cateid: cateid
        })
        that.getassess(cateid)
    },
    /**
     * 获取商户
    */
    getassess : function(cateid, page){
        var that = this;
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry&m=ewei_shopv2&do=mobile&r=merch.list.ajaxmerchuser',
                method: 'GET',
                data: {
                    i: siteInfo.uniacid,
                    cateid : cateid ? cateid : '',
                    page: page
                },
                success: function (res) {
                    wx.hideToast()
                    var list = res.data.result.list;
                    var length = res.data.result.list.length;
                    if (page > 1) {
                        if(length < 30){
                            that.setData({
                                list: that.data.list.concat(list),
                                empty: false,
                                drop: '',
                                showloading: true,
                                loading: false
                            })
                        }else{
                            that.setData({
                                list: that.data.list.concat(list),
                                empty: false,
                                drop: '',
                                showloading: true,
                                loading: true
                            })
                        }
                    }else{
                        if(length == 0){
                            that.setData({
                                list: list,
                                empty: true,
                                drop: '',
                                showloading: false,
                            })
                        }else if(length < 30){
                            that.setData({
                                list: list,
                                empty: false,
                                drop: '',
                                showloading: true,
                                loading: false
                            })
                        }else{
                            that.setData({
                                list: list,
                                empty: false,
                                drop: '',
                                showloading: true,
                                loading: true
                            })
                        }
                        
                    }
                },
                fail: function () {
                    wx.hideLoading()
                }
            })
        })
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
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        that.setData({
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
        var that = this;
        var cateid = that.data.cateid;
        page++;
        that.getassess(cateid, page);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})