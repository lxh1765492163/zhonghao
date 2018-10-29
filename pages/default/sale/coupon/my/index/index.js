var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    t:0,
    currentTab:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initView()
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
  
  },

  initView: function () {
    const that = this
    wx.showLoading({
      title: '加载中...',
    })
    var cate="";
    if (that.data.currentTab==2){
      cate ="used";
    }
    if (that.data.currentTab == 3) {
      cate = "past";
    }
    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=sale.coupon.my.getlist',
      data: {
        cate: cate
      },
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
          that.setData({
            items: res.data.result.list,
            t: res.data.result.t,
          })
           
        }
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },
    swichNav: function (e) {
    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        page: 1,
        loadingType: '',
        moreEnd: false
      })

      this.initView()
    }
  },
    buy:function(){

      wx.navigateTo({
        url: '/pages/default/goods/list/list',
      })
    }
})