var app = getApp()
var siteInfo = require('../../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    scrolltop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.showLoading({
      title: '',
    })
    // 判断身份
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.register.get_main&i=' + siteInfo.uniacid,
        success: function (res) {
          // console.log(res);
          wx.hideLoading();
          var data = res.data
          if (data.status == 1 && data.result.register == 1) {
            //返回
            // console.log("fanhui");
            //wx.navigateBack()
            wx.redirectTo({
              url: '/pages/default/commission/index/index',
            })
            // return
          }
          that.setData({
            items: data.result
          })
        },
        fail: function (res) {
          wx.hideLoading();
          console.log(res)
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

   onPageScroll:function (e){
        var that = this;
        that.setData({
            scrolltop: e.scrollTop
        })
    },

    totop: function (e){
        wx.pageScrollTo({
          scrollTop: 0
        })
        return false
    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // const that = this;
    // wx.setStorageSync('mark','mark');
    // wx.showLoading({
    //   title: '',
    // })
   
  },

  /**
   * 申请成为分销商
   */
  formSubmit: function(e) {
    const val = e.detail.value
    console.log(e);
    // 判断姓名
    if (val.realname == '') {
      wx.showToast({
        title: '请填写姓名',
      })
      return
    }


    // 判断手机
    if (val.mobile == '') {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'loading'
      })
      return
    } else if (val.mobile.length != 11) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'loading'
      })
      return
    } else {
      // 格式
      var reg = /^((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8}$/
      if (!reg.test(val.mobile)) {
        wx.showToast({
          title: '填写的手机号有误',
          icon: 'loading'
        })
        return
      }
    }

    wx.showLoading({
      title: '加载中...',
    })

    const that = this

    // 提交审核
    app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.register.get_main',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          agentid: that.data.items.mid,
          realname: val.realname,
          mobile: val.mobile,
          weixin: val.weixin,
          mid : val.yqm
        },
        success: function(res) {
          wx.hideLoading()
          var data = res.data

          if (data.status == 0) {
            wx.showToast({
              title: data.result.message,
              icon: 'loading'
            })
            return
          }

          var result = data.result
          if (result.check == 1) {
            wx.showModal({
              title: '提示',
              content: '恭喜您审核通过!',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  wx.navigateBack()
                }
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '您的申请已经提交，请等待审核!',
              showCancel: false,
              success: function(res) {
                  console.log(res);
                if (res.confirm == true) {
                  wx.reLaunch({
                    url: '/pages/default/index/index',
                  })
                }
              }
            })
          }

          return
        },
        fail: function(res) {
          wx.hideLoading()
          console.log(res)
        }
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})