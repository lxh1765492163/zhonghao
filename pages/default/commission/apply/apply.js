var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['支付宝', '微信'],
    withdrawType: 0, // 提现方式
    selectBank: 0, // 选择银行
    items: null,
    type_array: [], // 提现列表
    bankList: [], // 银行列表
  },

  getMain: function() {
    const that = this

    app.util.getUserInfo(function() {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=commission.apply.get_main',
        success: function(res) {
          const data = res.data
          console.log(data)
        //   if (data.status == 0) {
            if (data.type == 1) {
              // 完善资料
              wx.navigateTo({
                url: '/pages/default/member/info/info',
              })
              return
            }
       
        //   }

          // 可提现列表
          var new_array = []
          if (data.type_array) {
              for (var i = 0; i < data.type_array.length;i++) {
            //   new_array.push(data.rtype_array[i].title)
                  console.log(data.type_array[i].title)
                  new_array.push(data.type_array[i].title)
            }
          }

          // 银行列表
          var banklist = []
          if (data.banklist) {
            for (var i in data.banklist) {
              banklist.push(data.banklist[i].bankname)
            }
          }

          that.setData({
            items: res.data,
            type_array: new_array,
            bankList: banklist
          })
        },
        fail: function(res) {
          wx.showToast({
            title: '加载出错...',
            icon: 'loading'
          })
          console.log(res)
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMain()
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

  bindPickerChange: function() {
    //
  },

  /**
   * 提现方式
   */
  selectWithdraw: function(e) {
    const idx = parseInt(e.detail.value)
    this.setData({
      withdrawType: idx
    })
  },

  selectBank: function(e) {
    const idx = parseInt(e.detail.value)
    this.setData({
      selectBank: idx
    })
  },

  /**
   * 表单提交
   */
  formSubmit: function(e) {
    const that = this
    const val = e.detail.value
    const data = that.data
    const items = data.items
    const applytype = data.withdrawType
    var html = ''
    var realname = ''
    var alipay = ''
    var alipay1 = ''
    var bankname = ''
    var bankcard = ''
    var bankcard1 = ''

    if (items.commission_ok < items.withdraw) {
      wx.showModal({
        title: '提示',
        content: '满 ' + items.withdraw + ' 元才能提现!',
        showCancel: false
      })
      return
    }

    if (applytype == 0) {
      html = data.type_array[0]
    } else if (applytype == 1) {
      html = data.type_array[1]
    } else if (applytype == 2) {
      if (val.realname == '') {
        wx.showModal({
          title: '提示',
          content: '请填写姓名!',
          showCancel: false
        })
        return
      }
      if (val.alipay == '') {
        wx.showModal({
          title: '提示',
          content: '请填写支付宝账号!',
          showCancel: false
        })
        return
      }
      if (val.alipay1 == '') {
        wx.showModal({
          title: '提示',
          content: '请填写确认账号!',
          showCancel: false
        })
        return
      }
      if (val.alipay != val.alipay1) {
        wx.showModal({
          title: '提示',
          content: '支付宝帐号与确认帐号不一致!',
          showCancel: false
        })
        return
      }
      realname = val.realname
      alipay = val.alipay
      alipay1 = val.alipay1
      html = data.type_array[2] + '? 姓名:' + realname + ' 支付宝账号:' + alipay
    } else if (applytype == 3) {
      if (val.realname == '') {
        wx.showModal({
          title: '提示',
          content: '请填写姓名!',
          showCancel: false
        })
        return
      }

      if (val.bankcard == '') {
        wx.showModal({
          title: '提示',
          content: '请填写银行卡号!',
          showCancel: false
        })
        return
      }

      if (val.bankcard1 == '') {
        wx.showModal({
          title: '提示',
          content: '请填写确认卡号!',
          showCancel: false
        })
        return
      }

      if (val.bankcard != val.bankcard1) {
        wx.showModal({
          title: '提示',
          content: '银行卡号与确认卡号不一致!',
          showCancel: false
        })
        return
      }

      realname = val.realname
      bankcard = val.bankcard
      bankcard1 = val.bankcard1
      bankname = data.bankList[data.selectBank]
      html = data.type_array[3] + '? 姓名:' + realname + ' ' + bankname + ' 卡号:' + bankcard
    }

    var confirm = ''
    if (applytype < 2) {
      confirm = '确认要' + html + '?'
    } else {
      confirm = '确认要' + html
    }

    wx.showModal({
      title: '提示',
      content: confirm,
      success: function(re) {
        if (re.confirm) {
          wx.showLoading({
            title: '正在处理...',
          })

          app.util.getUserInfo(function() {
            app.util.request({
              url: 'entry/ewei_shopv2/mobile&r=commission.apply.get_main',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                type: applytype,
                realname: realname,
                alipay: alipay,
                alipay1: alipay1,
                bankname: bankname,
                bankcard: bankcard,
                bankcard1: bankcard1
              },
              success: function(res) {
                wx.hideLoading()

                if (res.data.status == 0) {
                  wx.showModal({
                    title: '提示',
                    content: res.data.result.message,
                    showCancel: false
                  })
                  return
                }

                wx.showModal({
                  title: '提示',
                  content: '申请已经提交，请等待审核!',
                  showCancel: false,
                  success: function(s) {
                    if (s.confirm) {
                      wx.redirectTo({
                        url: '/pages/default/commission/withdraw/withdraw',
                      })
                    }
                  }
                })
              },
              fail: function() {
                wx.hideLoading()
              }
            })
          })
        }
      }
    })
  }
})