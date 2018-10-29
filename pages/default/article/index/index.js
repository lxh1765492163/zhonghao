var WxParse = require('../../../../vendor/wxParse/wxParse.js');
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aid: 0, //文章id
    open: false,
    height: 0,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.aid || options.aid == 0) {
      wx.showModal({
        title: '提示',
        content: '文章不存在或已被删除',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.navigateBack()
          }
        }
      })
      return
    }

    const that = this
    that.setData({
      aid: options.aid
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
    const that = this

    that.getArticle()
  },

  /**
   * 取文章数据
   */
  getArticle: function() {
    const that = this

    wx.showLoading({
      title: '加载中...',
    })

    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=article.index.get_article&aid=' + that.data.aid,
        method: 'GET',
        success: function (res) {
          wx.hideLoading()

          const data = res.data
          if (data.status == 0) {
            wx.showModal({
              title: '提示',
              content: '文章不存在或被删除',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack()
                }
              }
            })
          }

          that.setData({
            article: data.result.article
          })

          // 设置标题
          wx.setNavigationBarTitle({
            title: data.result.article.article_title
          })

        
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    // })
  },

  /**
   * 点赞
   */
  putLike: function() {
    const that = this
    const aid = that.data.aid

    wx.showLoading({
      title: '加载中...',
    })

    // app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=article.index.like&aid=' + aid,
        success: function(res) {
          wx.hideLoading()

          console.log(res)
        },
        fail: function() {
          wx.hideLoading()
        }
      })
    // })

    that.getArticle()
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
    const that = this
    const article = that.data.article

    return {
      title: article.article_title,
      path: '/pages/default/article/index/index?aid=' + article.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }


})