
var time = require('../../../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: null,
    nowTime: Date.now, // 当前时间
    cancelText: ['不取消了', '我不想买了', '信息填写错误, 重新拍', '同城见面交易', '其他原因'], // 取消原因
    id: 0, // 订单id
    time: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.id) {
      return
    } else {
      this.setData({
        id: options.id
      })
    }

    // 取订单信息
    this.getOrder()
  },
  /**
     * 取消申请
     */
  removefefund: function (e) {
    var that = this;
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=index.refun_remove',
      data: {
        id: that.data.id
      },
      success: function (res) {
        console.log(res);

        if (res.data.msg == 'ok') {
          wx.showLoading({
            title: '正在加载',
          })
          that.getOrder()
        } else {
          wx.showLoading({
            title: res.data.msg,
          })
        }

      }
    })
  },
  /**
   * 取订单数据
   */
  getOrder: function () {
    const that = this

    wx.showLoading({
      title: '加载中...',
    })

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=order.index.get_detail',
      method: 'GET',
      data: {
        id: that.data.id
      },
      success: function (res) {
        wx.hideLoading()
        // console.log(res);
        var times = res.data.result.order.createtime;
        var paytime = res.data.result.order.paytime;
        var sendtime = res.data.result.order.sendtime;
        console.log(time);
        if (res.data.status == 1) {

          that.setData({
            items: res.data.result,
            time: time.formatTime(times, 'Y/M/D h:m:s'),
            paytime: time.formatTime(paytime, 'Y/M/D h:m:s'),
            sendtime: time.formatTime(sendtime, 'Y/M/D h:m:s'),
          })
        } else {
          // 没有订单
          wx.showModal({
            title: '提示',
            content: '订单出现问题',
            showCancel: false,
            success: function (e) {
              if (e.confirm) {
                wx.navigateBack()
              }
            }
          })
        }
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },

  /**
   * 确认收货
   */
  finish: function (e) {
    const that = this
    const orderid = parseInt(e.currentTarget.dataset.orderid)
    if (!orderid) {
      return
    }

    wx.showModal({
      title: '提示',
      content: '确认已收到货了吗?',
      success: function (e) {
        if (e.confirm) {
          wx.showLoading({
            title: '确认中...',
          })

          app.util.finishGoods(orderid, function (res) {
            wx.hideLoading()

            that.getOrder()
          })
        }
      }
    })
  },

  /**
   * 删除订单
   */
  delOrder: function (e) {
    // 订单id
    const orderid = parseInt(e.currentTarget.dataset.orderid)
    const tp = parseInt(e.currentTarget.dataset.type)
    if (!orderid) {
      return
    }

    const that = this
    var tip = ''
    if (tp == 0) {
      tip = '恢复';
    } else if (tp == 1) {
      tip = '删除'
    } else if (tp == 2) {
      tip = '彻底删除'
    }

    wx.showModal({
      title: '提示',
      content: '确认要' + tip + '该订单吗?',
      success: function (re) {
        if (re.confirm) {
          wx.showLoading({
            title: '删除中...',
          })

          // 提交删除
          app.util.deleteOrder({ id: orderid, userdeleted: tp }, function (res) {
            wx.hideLoading()

            if (res.status == 1) {
              that.getOrder()
              return
            } else {
              wx.showModal({
                title: '提示',
                content: res.data.result,
                showCancel: false
              })
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getOrder()
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

  /**
   * 拨打电话
   */
  telPhone: function (e) {
    const tel = e.currentTarget.dataset.tel
    if (!tel) {
      return
    }

    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})