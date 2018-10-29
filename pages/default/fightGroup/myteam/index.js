var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    order: [],
    items: null,
    page: 1, // 当前页
    cancelText: ['不取消了', '我不想买了', '信息填写错误, 重新拍', '同城见面交易', '其他原因'], // 取消原因
    loadingType: '', //加载类型 onRefresh:刷新 onMore:加载更多
    moreEnd: false, //下拉没有数据了
    total : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const status = options.status

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      },
    })

    if (status) {
      that.setData({
        currentTab: status
      })
    }

    that.getOrderList()
  },

  /**
   * 选项卡
   */
  swichNav: function (e) {
    var that = this;
    console.log(e);
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        page: 1,
        loadingType: '',
        moreEnd: false
      })

      this.getOrderList()
    }
  },

  // 取订单列表
  getOrderList: function () {
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

    const status = that.data.currentTab

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=groups.team.get_list',
      method: 'GET',
      data: {
        page: that.data.page,
        success: that.data.currentTab
      },
      success: function (res) {
  
        wx.hideLoading()
        var rst = res.data.result
        for (var i in rst.list) {
          if (rst.list[i].is_team == '0') {
              var price = parseFloat(rst.list[i].singleprice);
            var freight = parseFloat(rst.list[i].freight);

            rst.list[i]['totalprice'] = price + freight
          } else {
              var price = parseFloat(rst.list[i].groupsprice);
              var freight = parseFloat(rst.list[i].freight);

            rst.list[i]['totalprice'] = price + freight
          }
        }
      
    
        if (res.data.status == 1) {
          if (that.data.loadingType == 'onMore') {
            if (rst.list.length == 0) {
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

            var order = that.data.order
            for (var i in rst.list) {
              order.push(rst.list[i])
            }
            that.setData({
              order: order,
              items: rst
            })

          } else {
            that.setData({
              order: rst.list,
              items: rst,
           
            })
          }

        } else {
          // 没有订单
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
    var that = this

    that.setData({
      loadingType: 'onRefresh'
    })

    // 取所有明细
    that.getOrderList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this

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
    that.getOrderList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})