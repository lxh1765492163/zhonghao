var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    express: [],
    id: 0,
    teamid : 0,
    items: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id ? options.id : 0
    const teamid = options.teamid ? options.teamid : 0
  console.log(options);
  var that = this;
    if (!id) {
      return
    }

    this.setData({
      id: id,
     
      teamid : teamid
    })

    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=groups.orders.get_express',
        method: 'GET',
        data: {
          id: id,
        },
        success: function (res) {
          wx.hideLoading()
        console.log(res);
        console.log(11111111);
        var items = res.data;
        // console.log(items.expresslist.length)
         
          if(res.data.status==0){
            wx.showModal({
              title: '提示',
              content: res.data.result.message,
              showCancel: false,
              success: function (re) {
                if (re.confirm) {
                  wx.navigateBack()
                }
              }
            })
          }else{
            that.setData({
              express: items
            })
          }
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    })
    // 取物流信息
    this.getExpress()
  },

  getExpress: function () {
    const that = this

    wx.showLoading({
      title: '加载中...',
    })

    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=groups.orders.get_details',
        method: 'GET',
        data: {
          orderid: that.data.id,
         teamid : that.data.teamid
        },
        success: function (res) {
          wx.hideLoading()
          console.log(res);
          console.log(1111111111111)
          // if (res.data.status == 1) {
            that.setData({
              items: res.data
            })
          //   return
          // } else {
            // wx.showModal({
            //   title: '提示',
            //   content: '获取物流失败',
            //   showCancel: false,
            //   success: function (re) {
            //     if (re.confirm) {
            //       wx.navigateBack()
            //     }
            //   }
            // })
          // }
        },
        fail: function () {
          wx.hideLoading()
        }
      })
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