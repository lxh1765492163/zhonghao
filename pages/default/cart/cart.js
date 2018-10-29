var app = getApp()
var siteInfo = require('../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editBtn: false,
    isEdit: !1, // 是否编辑
    btntext: '编辑',
    list: [],
    total: 0,
    totalprice: 0,
    isAll: true, // 全选
    isEditAll: false, // 编辑,
    editArray: [], // 全选
    data: [],
    tabid: 3,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    // app.util.getUserInfo(function () {
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=index.get_diyMenus',
      method: 'GET',
      data: {
        id: siteInfo.template_id
      },
      success: function (res) {
        console.log(res)
        var datas = res.data.data;
        var style = res.data.style;
        var data = res.data;
        // console.log(datas)
        that.setData({
          datas: datas,
          style: style,
          data: data,
        })
      }
    })
    // })
  },
  changetab: function (e) {
    console.log(e)
    var tabid = e.currentTarget.dataset.id;
    this.setData({
      tabid: tabid
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isEditAll: false
    })
    this.getCartList()
  },

  /**
   * 取用户购物车数据
   */
  getCartList() {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    app.util.getUserInfo(function () {
      app.util.getCartList(function (e) {
        var tpAll = true
        for (var i = 0; i < e.list.length; i++) {
          if (e.list[i].selected == 0 && tpAll == true) {
            tpAll = false
          }
        }
        that.setData({
          list: e.list,
          editBtn: e.total > 0,
          total: e.total,
          totalPrice: e.totalprice,
          isAll: tpAll
        })
        wx.hideLoading();
      })
    })
  },

  /**
   * 全选
   */
  selGoods: function (e) {
    const that = this

    wx.showLoading({
      title: '加载中...',

    })

    const id = e.currentTarget.dataset.id
    const value = e.currentTarget.dataset.value

    if (value == 0) {
      this.setData({
        isAll: false
      })
    }

    // app.util.getUserInfo(function () {
    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=member.cart.select',
      data: {
        id: id,
        select: value == 0 ? 1 : 0
      },
      success: function (res) {
        that.getCartList()
      }
      // })
    })
  },

  /**
   * 编辑
   */
  onTapEdit(e) {
    var isedit = this.data.isEdit
    this.setData({
      btntext: isedit ? '编辑' : '完成',
      isEdit: !isedit
    })
  },

  /**
   * 购买数量变更
   */
  changeCartNum: function (e) {
    console.log(e);
    const that = this
    // 商品id
    const id = e.currentTarget.dataset.id
    // 操作
    const ac = e.currentTarget.dataset.action
    const optionid = e.currentTarget.dataset.options
    // 数量
    var oldNum = parseInt(e.currentTarget.dataset.total)
    var num = parseInt(e.currentTarget.dataset.total)
    // 下标
    const index = e.currentTarget.dataset.index

    if (ac == 'minus' && num > 1) {
      num = num - 1
    } else if (ac == 'plus') {
      num = num + 1
    }

    if (oldNum != num) {
      const data = {
        id: id,
        total: num,
        optionid: optionid
      }
      this.updateCart(data)
    }
  },

  /**
   * 更换数量
   */
  bindKeyInput: function (e) {
    console.log(e);
    // id
    const id = e.currentTarget.dataset.id
    // 数量
    const oldNum = e.currentTarget.dataset.total
    const num = e.detail.value
    const optionid = e.currentTarget.dataset.options;

    if (oldNum != num) {
      const data = {
        id: id,
        total: num,
        optionid: optionid
      }
      this.updateCart(data)
    }
  },

  /**
   * 执行购物车数量更新
   */
  updateCart: function (data) {
    const that = this
    wx.showLoading({
      title: '加载中...',
    })

    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=member.cart.update',
        data: data,
        success: function (res) {
          wx.hideLoading()
          if (res.data.status == 1) {
            // 重新获取购物车数量
              that.getCartList()
          }else{
            wx.showToast({
              title: res.data.result.message,
              icon: 'none',
            })  
          }
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    })
  },

  // 编辑全选
  selEditAll: function (e) {
    const value = e.currentTarget.dataset.value
    var goods = this.data.list

    var isset = 0
    var temp = []
    if (value == 0) {
      for (var i = 0; i < goods.length; i++) {
        var id = goods[i].id
        temp.push(id)
      }
      isset = 1
    } else {
      //
    }

    var list = this.data.list
    for (var i in list) {
      list[i].isset = isset
    }

    this.setData({
      editArray: temp,
      isEditAll: value == 1 ? false : true,
      list: list
    })
  },

  selEditGoods: function (e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    const value = e.currentTarget.dataset.value
    var list = this.data.list
    list[index].isset = value == 1 ? 0 : 1

    // 添加到 editArray
    var editArray = this.data.editArray
    var flag = 0
    if (editArray.length > 0) {
      for (var i in editArray) {
        if (editArray[i] == id) {
          flag = 1
          break
        }
      }
    }
    var new_editArray = []
    if (flag == 0) {
      //添加
      new_editArray = editArray
      new_editArray.push(id)
    } else {
      //删除
      for (var i in editArray) {
        if (editArray[i] != id) {
          new_editArray.push(editArray[i])
        }
      }
    }
    this.setData({
      list: list,
      editArray: new_editArray,
      isEditAll: new_editArray.length == this.data.list.length ? true : false
    })
  },

  // 删除
  del: function () {
    var that = this
    const ids = this.data.editArray
    var str = ''

    var tmp = []
    for (var i = 0; i < this.data.editArray.length; i++) {
      tmp.push(this.data.editArray[i])
    }

    if (tmp != '') {
      wx.showLoading({
        title: '加载中...',
      })

      app.util.getUserInfo(function () {
        app.util.request({
          url: 'entry/ewei_shopv2/mobile&r=member.cart.remove',
          data: {
            ids: tmp
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideLoading()

            if (res.data.status == 1) {
              that.setData({
                editArray: []
              })
            }
            that.getCartList()
          },
          fail: function () {
            wx.hideLoading()
          }
        })
      })
    }
  },

  /**
   * 创建订单
   */
  toPayOrder() {
    const that = this

    wx.showLoading({
      title: '加载中...',
    })

    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=member.cart.submit',
        success: function (res) {
          wx.hideLoading()
          console.log(res);
          if (res.data.status == 1) {
            // 跳转到 order/create
            wx.navigateTo({
              url: "/pages/default/order/create/create?fromcart=1"
            })
          } else {
            const message = res.data.result.message;
            wx.showModal({
              title: '提示',
              content: message
            })
          }
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