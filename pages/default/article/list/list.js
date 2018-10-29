var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    articles: [], //文章列表
    article_sys: 0, //文章列表模板
    categorys: [], //分类列表
    page: 1, //当前页
    cateid: 0, //分类id,
    loadingType: '', //加载类型 onRefresh:刷新 onMore:加载更多
    moreEnd: false, //下拉没有数据了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.cateid && parseInt(options.cateid) > 0) {
      // 设置分类id
      this.setData({
        cateid: parseInt(options.cateid)
      })
    }

    // 取文章列表
    this.getArticles()
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
   * 更改分类
   */
  changeList: function(e) {
    const id = parseInt(e.currentTarget.dataset.id)
    this.setData({
      cateid: id,
      page: 1,
      loadingType: '',
      moreEnd: false
    })

    this.getArticles()
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
    const that = this

    that.setData({
      loadingType: 'onRefresh'
    })

    // 下拉刷新
    this.getArticles(function(res) {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this

    if (that.data.moreEnd == true) {
      wx.showToast({
        title: '没有数据了',
        icon: 'loading'
      })

      return
    }

    that.setData({
      loadingType: 'onMore'
    })

    this.getArticles()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 取文章列表
   */
  getArticles: function (cb) {
    const that = this

    // 是否下拉刷新
    if (that.data.loadingType == 'onRefresh' || that.data.loadingType == '') {
      that.setData({
        page: 1,
        loadingType: ''
      })
    } else if (that.data.loadingType == 'onMore') {
      that.setData({
        page: that.data.page + 1
      })
    }

    wx.showLoading({
      title: '加载中...',
    })

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=article.list.get_list',
      method: 'GET',
      data: {
        page: that.data.page,
        cateid: that.data.cateid
      },
      success: function (res) {
        wx.hideLoading()

        const data = res.data

        if (data.status == 0) {
          wx.showModal({
            title: '提示',
            content: '文章列表读取失败',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
          return
        }

        if (data != '') {
          if (that.data.loadingType == 'onMore') {
            if (data.result.articles.length == 0) {
              //没有数据了
              that.setData({
                moreEnd: true
              })

              wx.showToast({
                title: '没有数据了',
                icon: 'loading'
              })
              return
            }

            var newArticle = []
            newArticle.push(that.data.articles)
            newArticle.push(data.result.articles)
            that.setData({
              articles: newArticle
            })

          } else {
            that.setData({
              articles: data.result.articles,
              article_sys: data.result.article_sys,
              categorys: data.result.categorys
            })
          }
        }

        typeof cb == 'function' && cb(data)

      },
      fail: function () {
        wx.hideLoading()
      }
    })
  }
})