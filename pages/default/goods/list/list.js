var app = getApp()
var loading = false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    list: [],
    r: 'goods.index.get_list',
    ishot: 0,
    ishotclass: 'btn-default-o',
    isnew: 0,
    isnewclass: 'btn-default-o',
    isdiscount: 0,
    isdiscountclass: 'btn-default-o',
    istime: 0,
    istimeclass: 'btn-default-o',
    isrecommand: 0,
    isrecommandclass: 'btn-default-o',
    issendfree: 0,
    issendfreeclass: 'btn-default-o',
    pagesize: 10,
    mid: 0, //商户id
    frommyshop: 0,
    page: 1,
    cate: 0,
    order: '',
    by: '',
    keywords: '', // 搜索关键字
    // 点击筛选
    onfilter: false,
    filterin: '',
    sort: false,
    sortclass: 'block',
    catlevel: 0,
    allcategory: {},
    opencategory: false,
    currentCategory: 0,
    inSearch: false, // 搜索获取焦点
    loadingType: '', //加载类型 onRefresh:刷新 onMore:加载更多
    moreEnd: false, //下拉没有数据了
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

    var that = this
    // this.getList()
    that.setData({
      r: options.r !== undefined ? (options.r == 'goods' ? options.r + '.get_list' : options.r) : this.data.r,
      ishot: options.ishot !== undefined ? options.ishot : this.data.ishot,
      isnew: options.isnew !== undefined ? options.isnew : this.data.isnew,
      isdiscount: options.isdiscount !== undefined ? options.isdiscount : this.data.isdiscount,
      istime: options.istime !== undefined ? options.istime : this.data.istime,
      isrecommand: options.isrecommand !== undefined ? options.isrecommand : this.data.isrecommand,
      issendfree: options.issendfree !== undefined ? options.issendfree : this.data.issendfree,
      pagesize: options.pagesize !== undefined ? options.pagesize : this.data.pagesize,

      cate: options.cate !== undefined ? options.cate : this.data.cate,
      order: options.order !== undefined ? options.order : this.data.order,
      mid: options.mid !== undefined ? options.mid : this.data.mid,
      frommyshop: options.frommyshop !== undefined ? options.frommyshop : this.data.frommyshop,
      by: options.by !== undefined ? options.by : this.data.by,
      keywords: options.keywords !== undefined ? options.keywords : this.data.keywords
    })
    this.initData()
    if (this.data.r != '' || this.data.keywords != '') {
      // 读取列表数据
      this.getList()
    }

    if (that.data.r == 'goods' || that.data.r == 'goods.get_list') {
      this.getCategory()
    }
  },

  getList: function () {
    var that = this
    loading = true;


    wx.showLoading({
      title: '加载中...',
    })

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=goods.index.get_list',
      method: 'GET',
      data: {
        ishot: that.data.ishot,
        isnew: that.data.isnew,
        isdiscount: that.data.isdiscount,
        istime: that.data.istime,
        isrecommand: that.data.isrecommand,
        issendfree: that.data.issendfree,
        pagesize: that.data.pagesize,
        page: that.data.page,
        cate: that.data.cate,
        order: that.data.order,
        by: that.data.by,
        mid: that.data.mid,
        frommyshop: that.data.frommyshop,
        keywords: that.data.keywords
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (e) {

        wx.hideLoading()
        var list = [];
        var d = e.data.result
        if (e.data.status == 0) {
          wx.showModal({
            title: '提示',
            content: '列表读取失败',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack()
              }
            }
          })
          return
        } else {
          if (that.data.loadingType == 'onMore') {
            if (d.list.length == 0) {
              //没有数据了
              that.setData({
                moreEnd: true
              })

              wx.showToast({
                title: '没有数据了',
                icon: 'loading'
              })
              return
            } else {
              list = that.data.list
              var resList = d.list
              for (var i in resList) {
                list.push(resList[i])
              }
            }
          } else {
            list = d.list
          }
          that.setData({
            list: list
          })
        }
      },
      fail: function () {
        wx.hideLoading()
      }
    })

    this.cannelFilter()
  },

  getMore: function () {
  

    var that = this
    var page = parseInt(that.data.page)
    that.setData({
      page: page + 1,
      loadingType: 'onMore'
    })

    that.getList()
  },

  getCategory: function () {
    var that = this

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=goods',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (e) {

        var d = e.data.result
        that.setData({
          allcategory: d.allcategory,
          catlevel: d.catlevel,
          opencategory: d.opencategory
        })
      },
      fail: function () {
        //
      }
    })
  },

  initData: function () {
    this.setData({
      ishotclass: this.data.ishot == 1 ? 'btn-danger-o' : 'btn-default-o',
      isnewclass: this.data.isnew == 1 ? 'btn-danger-o' : 'btn-default-o',
      isdiscountclass: this.data.isdiscount == 1 ? 'btn-danger-o' : 'btn-default-o',
      istimeclass: this.data.istime == 1 ? 'btn-danger-o' : 'btn-default-o',
      isrecommandclass: this.data.isrecommand == 1 ? 'btn-danger-o' : 'btn-default-o',
      issendfreeclass: this.data.issendfree == 1 ? 'btn-danger-o' : 'btn-default-o'
    })
  },

  onFilter: function () {
    var that = this;
    that.setData({
      onfilter: !that.data.onfilter
    })
  },

  cannelFilter: function () {
    this.setData({
      onfilter: false,
    })
  },

  setFilter: function (e) {

    const t = e.target.dataset.type
    /*
      ishot: 0,
      isnew: 0,
      isdiscount: 0,
      istime: 0,
      isrecommand: 0,
      issendfree: 0,
    */
    if (t == 'ishot') {
      const h = this.data.ishot
      this.setData({
        ishot: h == 0 ? 1 : 0,
        ishotclass: h == 0 ? 'btn-danger-o' : 'btn-default-o'
      })
    } else if (t == 'isnew') {
      const h = this.data.isnew
      this.setData({
        isnew: h == 0 ? 1 : 0,
        isnewclass: h == 0 ? 'btn-danger-o' : 'btn-default-o'
      })
    } else if (t == 'isdiscount') {
      const h = this.data.isdiscount
      this.setData({
        isdiscount: h == 0 ? 1 : 0,
        isdiscountclass: h == 0 ? 'btn-danger-o' : 'btn-default-o'
      })
    } else if (t == 'istime') {
      var h = this.data.istime
      this.setData({
        istime: this.data.istime == 0 ? 1 : 0,
        istimeclass: h == 0 ? 'btn-danger-o' : 'btn-default-o'
      })
    } else if (t == 'isrecommand') {
      const h = this.data.isrecommand
      this.setData({
        isrecommand: h == 0 ? 1 : 0,
        isrecommandclass: h == 0 ? 'btn-danger-o' : 'btn-default-o'
      })
    } else if (t == 'issendfree') {
      const h = this.data.issendfree
      this.setData({
        issendfree: h == 0 ? 1 : 0,
        issendfreeclass: h == 0 ? 'btn-danger-o' : 'btn-default-o'
      })
    }
  },

  onSort: function () {
    
    this.setData({
      sort: !this.data.sort
    })

    this.getList()
  },

  onOrder: function (e) {
    const o = e.currentTarget.dataset.order

    if (o == 'all') {
      this.setData({
        order: '',
        by: ''
      })
    } else {
      this.setData({
        order: o,
        by: this.data.by == '' || this.data.by == 'asc' ? 'desc' : 'asc'
      })
    }

    this.getList()
  },

  selectNav: function (e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      currentCategory: id
    })
  },

  onGetListByCate: function (e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      cate: id
    })
  },

  // 添加到购物车
  addCart: function (e) {

    const id = e.currentTarget.dataset.id

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=member.cart.add&id=' + id + '&total=1&optionid=0',
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (e) {
        wx.showToast({
          title: '已添加',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  /**
   * 搜索框获取焦点
   */
  searchFocus: function (e) {
    const that = this

    that.setData({
      inSearch: true
    })
  },

  /**
   * 搜索框失去焦点
   */
  unSearchFocus: function (e) {
    const that = this

    that.setData({
      inSearch: false
    })
  },

  /**
   * 搜索商品
   */
  putSearch: function (e) {
    const that = this
    const keyword = e.detail.value

    that.setData({
      inSearch: false,
      keywords: keyword
    })

    if (keyword == '') return

    wx.showLoading({
      title: '加载中...',
    })

    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=' + that.data.r,
      method: 'GET',
      data: {
        keywords: keyword
      },
      header: {
        'Accept': 'application/json'
      },
      success: function (e) {
        wx.hideLoading()
        var d = e.data.result

        that.setData({
          list: d.list,
          total: d.total
        })
      },
      fail: function () {
        wx.hideLoading()
      }
    })
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
    that.getList()
  },

})