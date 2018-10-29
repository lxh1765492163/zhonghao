var js = require('../../../../vendor/app.js')
var WxParse = require('../../../../vendor/wxParse/wxParse.js');
var siteInfo = require('../../../../config.js');
var app = getApp();
var selected = []

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0, // 商品id
    pagetype: 5, // 页面类型
    page: {}, // 页面信息
    modules: [], // 模块
    goods: '', // 商品信息
    nowTime: Date.now, // 当前时间
    curNav: 0, // 0详情 1参数 2评价
    picker: false, // 规格弹出
    gift: false,//弹出赠品
    cartNum: 1, // 默认购买数量
    cartCount: 0, // 购物车数量
    isFavorite: false, // 是否收藏
    isBuy: false, // 是否立刻购买
    specs: [], // 规格
    options: [], // 规格列表
    product: false,
    optionid: 0, // 已选规格id
    stock: '0', // 库存
    price: 0, // 价格
    confirmbtn: true, //默认禁用提交
    tabArr: 0,
    params: [],
    countDownDay: 0,
    countDownHour: 0,
    countDownMinute: 0,
    countDownSecond: 0,
    src: '',
    goodsid: '',
    list: [],   //评价列表
    count: {},
    diypage: '',
    mid: 0,
    giftid: '',
    status: '',
    animationData: {},
    level: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    // 取用户信息
    // console.log(status)
    const id = options.id && parseInt(options.id) ? parseInt(options.id) : false
    const mid = options.mid ? options.mid : ''
    if (!id) {
      wx.showToast({
        title: '加载出错...',
        icon: 'loading',
        duration: 2000
      })
      wx.navigateBack()
      return
    }

    that.setData({
      id: id,
      mid: mid,
    })

    // app.util.getUserInfo(function () {
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=goods.detail.get_comments',
      method: 'GET',
      data: {
        id: that.data.id,
        i: siteInfo.uniacid,
        mid: mid,
      },
      success: function (res) {
        // console.log(res);
        var list = res.data.result.list;
        var count = res.data.result.count;
        that.setData({
          count: count,
          list: list,
        })
      },
      fail: function () {
        wx.hideLoading()
      }
    })

    // })
    that.getModule();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 取商品信息
    this.getGoodsDetail()
    this.goodsparams();
    this.setData({
      isBuy: false,
      optionid: 0
    })
  },

  /**
   * 取模块数据
   */
  getModule: function () {
    const that = this
    js.getModules(that.data.pagetype, function (res) {
      console.log(res);
      that.setData({
        modules: res.data.module,
        page: res.data.page,

      })
      // that.parseModules()
    })
  },

  /**
   * 解析模块
   */
  parseModules: function () {
    const that = this
    var modules = that.data.modules
    // app.util.parseModules(modules, function (res) {
    //   that.setData({
    //     modules: res
    //   })
    // })
  },

  /**
   * 取商品数据
   */
  getGoodsDetail: function () {
    const that = this
    const id = that.data.id
    const mid = that.data.mid

    app.util.getGoodsDetail(id, function (res) {
      var goodsid = res.goods.id;

      // console.log(res)
      that.setData({
        goods: res,
        isFavorite: res.goods_other.isFavorite,
        stock: res.goods.total,
        goodsid: goodsid,
        status: res.goods.status,
      })
      //限时购开始时间
      var starttime = res.goods.timestart;
      //当前时间
      var newData = Date.parse(new Date()) / 1000;
      that.setData({
        nowTime: newData
      })
      if (newData >= starttime) {
        //限时购结束时间
        if (res.goods.isdiscount == 0) {
          var timeend = res.goods.timeend;


          var totalSecond = timeend - Date.parse(new Date()) / 1000;
        } else if (res.goods.isdiscount == 1) {
          var isdiscount_time = res.goods.isdiscount_time;


          var totalSecond = isdiscount_time - Date.parse(new Date()) / 1000;
        }


        var interval = setInterval(function () {
          // 秒数  
          var second = totalSecond;

          // 天数位  
          var day = Math.floor(second / 3600 / 24);
          var dayStr = day.toString();
          if (dayStr.length == 1) dayStr = '0' + dayStr;

          // 小时位  
          var hr = Math.floor((second - day * 3600 * 24) / 3600);
          var hrStr = hr.toString();
          if (hrStr.length == 1) hrStr = '0' + hrStr;

          // 分钟位  
          var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
          var minStr = min.toString();
          if (minStr.length == 1) minStr = '0' + minStr;

          // 秒位  
          var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
          var secStr = sec.toString();
          if (secStr.length == 1) secStr = '0' + secStr;

          that.setData({
            countDownDay: dayStr,
            countDownHour: hrStr,
            countDownMinute: minStr,
            countDownSecond: secStr,
          });
          totalSecond--;
          if (totalSecond < 0) {
            clearInterval(interval);
            // wx.showToast({
            //   // title: '活动已结束',
            // });
            that.setData({
              countDownDay: '00',
              countDownHour: '00',
              countDownMinute: '00',
              countDownSecond: '00',
            });
          }
        }.bind(this), 1000);
      }
      //限时购开始时间
      // 标题
      wx.setNavigationBarTitle({
        title: res.goods.title

      })

      // 内容
      WxParse.wxParse('article', 'html', res.goods.content, that, 5);
    })

    // 取产品规格
    that.getPicker()
    // 取购物车数量
    that.getCartList()
  },

  //取商品参数
  goodsparams: function () {
    var that = this;
    const id = that.data.id
    var mid = that.data.mid
    // console.log(that.data.mid)
    // console.log("取商品参数")
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=goods.detailapp.get_detailapp',
        method: 'GET',
        header: {
          'Accept': 'application/json'
        },
        data: {
          id: id,
          mid: mid,
        },
        success: function (res) {
          wx.hideLoading()
          var params = res.data.params;
          var diypage = res.data.diypage;
          var store = res.data.store;
          var gifts = res.data.gifts_all.gifts
          var videos = res.data.result.goods.content_videos
          var content_text = res.data.result.goods.content_text
          that.setData({
            params: params,
            diypage: diypage,
            store: store,
            gifts: gifts,
            packages: res.data.packages,
            videos: videos,
            content_text: content_text,
          })
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    })
  },

  /**
 * 商品评价切换
*/
  assessTab: function (e) {
    var that = this;
    const click = parseInt(e.currentTarget.dataset.click)
    const level = e.currentTarget.dataset.level
    wx.showLoading({
      title: '加载中...',
    })
    // app.util.getUserInfo(function () {
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=goods.detail.get_comment_list',
      method: 'GET',
      data: {
        id: that.data.goodsid,
        i: siteInfo.uniacid,
        level: level,
      },
      success: function (res) {
        wx.hideLoading();
        var list = res.data.result.list;
        var count = res.data.result.count;
        that.setData({
          list: list,
          tabArr: click
        })
      },
      fail: function () {
        wx.hideLoading()
      }
    })
    // })
  },
  /**
   * 产品规格
   */
  getPicker: function () {
    const that = this
    const id = that.data.id
    const mid = that.data.mid
    var userInfo = wx.getStorageSync("userInfo")
    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=goods.detailapp.picker',
      data: {
        id: id,
        openid: userInfo.openid,
      },
      cachetime: 30,
      success: function (res) {
        var specs = []
        var options = []
        var seckillinfo = res.data.result.seckillinfo
        if (res.data.status == 1 && res.data.result.specs.length > 0) {
          specs = res.data.result.specs
          options = res.data.result.options
        }
        /**
         * 秒杀计时
         */
        if (seckillinfo != false) {
          var seckilltime;
          if (that.data.nowTime < seckillinfo.starttime) {
            seckilltime = seckillinfo.starttime - that.data.nowTime
          } else if (that.data.nowTime <= seckillinfo.endtime) {
            seckilltime = seckillinfo.endtime - that.data.nowTime
          } else {
            seckilltime = -1
          }
          that.setData({
            time: seckilltime,
          })
          var timer = setInterval(function () {
            var time = that.data.time;
            if (time == -1) {
              clearInterval(timer);
              that.getPicker();
            } else {
              time -= 1;
              // 小时位
              var hr = Math.floor(time / 3600);
              var hrStr = hr.toString();
              if (hrStr.length == 1) hrStr = '0' + hrStr;

              // 分钟位  
              var min = Math.floor((time - hr * 3600) / 60);
              var minStr = min.toString();
              if (minStr.length == 1) minStr = '0' + minStr;

              // 秒位  
              var sec = time - hr * 3600 - min * 60;
              var secStr = sec.toString();
              if (secStr.length == 1) secStr = '0' + secStr;

              var timedata ={
                hr: hrStr,
                min: minStr,
                sec: secStr,
              }
              that.setData({
                seckilltime: timedata,
                time: time,
              })
            }

          }, 1000)
        }
        that.setData({
          specs: specs,
          options: options,
          seckillinfo: seckillinfo,
          src: res.data.result.goods.thumb,
          stock: res.data.result.goods.total,
          confirmbtn: specs.length > 0
        })
      }
    })
  },

  /**
   * 更换选项卡
   */
  changeNav: function (e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({
      curNav: index
    })
  },
  /**
    * 剪切淘宝券链接
    */
  clip: function (res) {
    var goodlink = this.data.goods.goods.goodlink;
    console.log(goodlink);
    wx.setClipboardData({
      data: goodlink,
      success: function (res) {
        wx.showToast({
          title: '领取成功',
        })
      }
    })
  },

  /**
  * 选择赠品
  */
  changegifts: function (e) {
    console.log(e);
    var gifts = this.data.gifts;
    console.log(gifts);
    for (var i = 0; i < gifts.length; i++) {
      if (e.detail.value == gifts[i].id) {
        gifts[i].ischoice = true;
        var giftid = gifts[i].id
        var gifttitle = gifts[i].title
      } else {
        gifts[i].ischoice = false;
      }
    }
    console.log(giftid)
    console.log(gifttitle)
    this.setData({
      gifts: gifts,
      giftid: giftid,
      gifttitle: gifttitle,
    })
  },
  getgift: function (e) {
    // console.log(111)
    var gifts = this.data.gifts;
    for (var i = 0; i < gifts.length; i++) {
      if (!gifts[i].ischoice) {
        gifts[i].ischoice = false;
      }
    }
    console.log(gifts);
    this.setData({
      gifts: gifts,
      gift: true,
    })
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.translateY(-300).step()
    this.setData({
      animationData: animation.export()
    })
  },
  hidemodle: function (res) {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      gift: false,
    })
  },
  /**
   * 选择规格
   */
  setPicker: function (e) {
    const that = this
    const idx = parseInt(e.currentTarget.dataset.index)
    const id = parseInt(e.currentTarget.dataset.id)
    const src = e.currentTarget.dataset.src;

    var specs = that.data.specs
    specs[idx].selected = id
    that.setData({
      specs: specs,
      src: src
    })

    //判断是否选择
    selected[idx] = id
    var itemids = []
    if (selected.length == that.data.specs.length) {
      for (var i in selected) {
        itemids.push(selected[i])
      }

      var options = that.data.options
      console.log(options)
      for (var i in options) {
        var specs = options[i].specs.split('_').sort().join('_')
        if (specs == itemids.sort().join('_')) {
          var stock = options[i].stock == '-1' ? '无限' : options[i].stock
          that.setData({
            stock: stock
          })
          if (options[i].stock != '-1' && options[i].stock <= 0) {
            wx.showModal({
              title: '提示',
              content: '库存不足',
              showCancel: false
            })
            return
          } else {
            that.setData({
              confirmbtn: false
            })
          }
          var timestamp = Date.parse(new Date()) / 1000
          if (that.data.goods.goods.ispresell > 0 && (that.data.goods.goods.preselltimeend == 0 || that.data.goods.goods.preselltimeend > timestamp)) {
            that.setData({
              price: options[i].presellprice
            })
          } else {
            that.setData({
              price: options[i].marketprice
            })
          }
          that.setData({
            option: options[i],
            optionid: options[i].id
          })
          console.log(options[i].id)
        }
      }
    }
  },

  /**
   * 关闭规格
   */
  closePicker: function () {
    this.setData({
      picker: false
    })
  },

  /**
   * 添加到购物车
   */
  addCart: function () {
    const that = this
    that.setData({
      picker: true,
      isBuy: false,
    })
  },

  /**
   * 立刻购买
   */
  addBuy: function () {
    const that = this

    that.setData({
      isBuy: true,
      picker: true
    })

  },

  /**
   * 手动变更购买数量
   */
  bindKeyInput: function (e) {
    const num = Math.abs(e.detail.value)
    console.log(num)
    if (num < 0) return
    this.setData({
      cartNum: num
    })
  },

  /**
   * 购买数量变更
   */
  changeCartNum: function (e) {
    const ac = e.currentTarget.dataset.action
    const that = this
    const num = that.data.cartNum

    if (ac == 'minus' && num > 1) {
      that.setData({
        cartNum: num - 1
      })
    } else if (ac == 'plus') {
      that.setData({
        cartNum: num + 1
      })
    }
  },

  /**
   * 更新购物车数量
   */
  updateCart: function () {
    wx.showLoading({
      title: '加载中...'
    })
    const that = this
    const id = that.data.goods.goods.id
    const num = that.data.cartNum
    const optionid = that.data.optionid
    const giftid = that.data.giftid
    // console.log(optionid);
    const gifts = that.data.gifts
    console.log(that.data.goods.goods.type)
    if (that.data.isBuy == true) {
      if (that.data.goods.goods.type == 4) {
        if (num < parseInt(that.data.goods.goods.intervalprice[0].intervalnum)) {
          wx.hideLoading();
          wx.showToast({
            title: '批发数量不足！！',
          })
        } else {
          wx.navigateTo({
            url: '/pages/default/order/create/create?id=' + id + '&optionid=' + optionid + '&total=' + num + '&type=' + that.data.goods.goods.type + '&giftid=' + giftid,
          })
          that.setData({
            picker: false // 关闭规格
          })
        }
      } else if (giftid != "" || gifts == '') {
        wx.navigateTo({
          url: '/pages/default/order/create/create?id=' + id + '&optionid=' + optionid + '&total=' + num + '&type=1' + '&giftid=' + giftid,
        })
        that.setData({
          picker: false // 关闭规格
        })
      } else {
        wx.showToast({
          title: '未选择赠品',
        })
      }
    } else {
      // app.util.getUserInfo(function () {
      if (that.data.goods.goods.type == 4 && num < parseInt(that.data.goods.goods.intervalprice[0].intervalnum)) {
        wx.hideLoading();
        wx.showToast({
          title: '批发数量不足！！',
        })
      } else {
        app.util.request({
          url: 'entry/ewei_shopv2/mobile&r=member.cart.add',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            id: id,
            optionid: optionid,
            total: num,
          },
          success: function (res) {
            wx.hideLoading()
            if (res.data.result.cartcount) {
              that.setData({
                cartCount: res.data.result.cartcount,
                picker: false // 关闭规格
              })
              wx.showToast({
                title: "已加入",
                duration: 2000
              })
            } else {
              wx.showToast({
                title: res.data.result,
                duration: 2000
              })
            }
          },
          fail: function () {
            wx.hideLoading()
          }
        })
      }

      // })
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

    // app.util.getUserInfo(function () {
    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=member.cart.submit',
      success: function (res) {

        wx.hideLoading()
        if (res.data.status == 1) {

          // 跳转到 order/create
          wx.navigateTo({
            url: "/pages/default/order/create/create"
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
    // })
  },
  // 取购物车数据
  getCartList() {
    var that = this
    // app.util.getUserInfo(function () {
    app.util.getCartList(function (e) {

      that.setData({
        cartCount: e.total
      })
    })
    // })
  },

  /**
   * navTab 点击操作
   */
  goAction: function (e) {
    const that = this
    const ac = e.currentTarget.dataset.action

    if (ac == 'like') {
      // 是否关注
      var isFavorite = that.data.isFavorite

      wx.showLoading({
        title: '加载中...',
      })

      // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=member.favorite.toggle',
        data: {
          id: that.data.id,
          isfavorite: isFavorite ? 0 : 1
        },
        success: function (res) {
          wx.hideLoading()
          var d = res.data.result
          that.setData({
            isFavorite: d.isfavorite
          })
        },
        fail: function () {
          wx.hideLoading()
        }
      })
      // })
    } else if (ac == 'shop') {
      wx.navigateTo({
        url: '/pages/default/index/index',
      })
    } else if (ac == 'cart') {


      wx.navigateTo({
        url: '/pages/default/cart/cart',
      })

    }
  },

  diyAction: function (e) {
    var linkurl = e.currentTarget.dataset.linkurl
    wx.navigateTo({
      url: linkurl,
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
  showShareMenu() {
    wx.showShareMenu();
    console.log("显示了当前页面的转发按钮");
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

    var mid = wx.getStorageSync("mid")
    console.log(mid)

    const goods = this.data.goods.goods

    const url = '/pages/default/goods/detail/detail?id=' + this.data.goods.goods.id + '&mid=' + mid;
    console.log(url)

    return {
      title: goods.title,
      path: url,
      success: function (res) {
        // 转发成功
        console.log(res);
      },
      fail: function () {
        //
      }
    }
  }
})