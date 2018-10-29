var app = getApp()

Page({
  data: {
    mallName: wx.getStorageSync('mallName'),
    goodsList: [],
    isNeedLogistics: 1, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allPrice: 0,
    goodsJsonStr: "",
    goods_args: [],
    goodsJsonStr: "",
    aid: 0,  // 收货地址,
    cusId: 0, // 自选地址
    other: null,
    goods_list: null,
    address: null, // 收货地址
    items: null,
    showCoupon: false,
    useCoupon: false,
    useCoupon_backmoney: 0,
    couponname: "选择",
    couponid: 0,
    coupons: [],
    arr: [],
    diyfrom: [],
    img: '',     //图片
    region: ['北京', '北京市', '朝阳区'], //城市
    casIndex: '',  //下拉框
    time: '',  //时间
    date: '', //日期
    youhuis: {},
    packageid: 0,
    giftid: '',
    gifts: '',
    gift: false,
    animationData: {}
  },
  //选择头像
  open: function () {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['orignal', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var img = res.tempFilePaths;
        that.setData({
          img: img
        })
      },

      fail: function () { },

      complete: function () { }
    })
  },
  //下拉框、
  bindPickerChange: function (e) {


    this.setData({
      casIndex: e.detail.value
    })
  },
  // 选择时间
  bindTimeChange: function (e) {

    this.setData({
      time: e.detail.value
    })
  },
  //城市
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  // 日期
  bindDateChange: function (e) {

    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 取选中地址
   */
  initShippingAddress: function () {
    const that = this
    if (that.data.aid > 0) {
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=member.address.get_address&id=' + that.data.aid,
        success: function (res) {
          if (res.data.status == 1) {
            that.setData({
              address: res.data.result.address
            })
          }
        },
        fail: function () {
        }
      })
    })
    }
  },

  onShow: function () {
    var that = this;
    that.initShippingAddress();
    var keys = wx.getStorageSync('key');
    var id = keys.id;
    var optionid = keys.optionid;
    var total = keys.total;
    var types = keys.type;
    var fromcart = keys.fromcart
    if (keys) {

    }
  },

  onLoad: function (e) {
      console.log(e);
    var that = this;
    var keys = wx.getStorageSync('key');
    var userInfo = wx.getStorageSync("userInfo");
    var id = e.id ? e.id : keys.id;
    var optionid = e.optionid ? e.optionid : keys.optionid;
    var total = e.total ? e.total : keys.total;
    var types = e.type ? e.type : keys.types;
    var packgoods = e.goods ? JSON.parse(e.goods) : keys.packgoods;
    var giftid = e.giftid ? e.giftid : keys.giftid
    var fromcart = e.fromcart ? e.fromcart : keys.fromcart
    that.setData({
      id: id,
      optionid: optionid,
      total: total,
      types: types,
      packgoods: packgoods,
      giftid: giftid,
      fromcart: fromcart,
      openid: userInfo.openid,
    })
    if (types == 1) {
      that.getgoods()
    }
    else if (types == 2) {
        
      that.getpackgoods()
    }
    else if (types == 4) {
      that.getwholesale()
    }
    else {
      that.orderCreateMain()
    }
    // 收货地址
    if (e.aid && e.aid > 0) {
      that.setData({
        aid: e.aid,
        cusId: e.aid
      })
    }
    wx.clearStorageSync();
  },
  /**
   * 批发商品
  */
  getwholesale: function () {
    console.log('批发商品');
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    var that = this;
    var buyoptions = [{ optionid: that.data.optionid, total: that.data.total }];
    buyoptions = JSON.stringify(buyoptions);
    // app.util.getUserInfo(function (res) {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=order.create.get_main',
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          id: that.data.id,
          buyoptions: buyoptions,
          iswholesale: 1,
        },
        success: function (res) {
          const re = res.data.result;
          console.log(re);
          if (re.address && re.address != '' && that.data.cusId == 0) {
            that.setData({
              aid: re.address.id
            })
          }
          var shopList = re.list
          var tempArray = new Array()
          var goodsJsonStr = "["
          var arr = new Array();
          for (var i = 0; i < re.list.length; i++) {
            var goosarr = new Array()
            var carShopBean = shopList[i]

            var goodsJsonStrTmp = ""
            if (i > 0) {
              goodsJsonStrTmp = ","
            }
            goosarr[0] = carShopBean.goodsid;
            goosarr[1] = carShopBean.optionid;
            goosarr[2] = carShopBean.total;
            goodsJsonStrTmp += '{goodsid:' + carShopBean.goodsid + ',optionid:' + carShopBean.optionid + ',total:' + carShopBean.total + '}'
            goodsJsonStr += goodsJsonStrTmp
            arr[i] = goosarr;
          }
          goodsJsonStr += "]"
          that.setData({
            goodsList: re.list,
            allPrice: re.allprice,
            goods_args: re.goods_args,
            other: re.other,
            goods_list: re.goods_list,
            address: re.address,
            items: re,
            showCoupon: re.other.showCoupon,
            diyfrom: re.diyformdata.fieldsNum,
            // gifts: gifts,   
            goodsJsonStr: goodsJsonStr,
            arr: arr
          })
          wx.hideLoading();
        }
      })
    // })
  },
  getpackgoods: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    console.log('套餐');
    var that = this;
    var goods = that.data.packgoods;
    var arr = [];
    for (var i = 0; i < goods.length; i++) {
      var obj = [goods[i].goodsid, goods[i].optionid, goods[i].total];
      arr.push(obj)
    }
    // app.util.getUserInfo(function (res) {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=order.create.get_main',
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          packageid: that.data.id,
          goods: goods,
        },

        success: function (res) {
          if (res.data.result) {
            console.log(res);
            var discount = parseFloat(res.data.result.other.marketprice - res.data.result.other.goodsprice).toFixed(2)
            that.setData({
              arr: arr,
              other: res.data.result.other,
              items: res.data.result,
              address: res.data.result.address,
              packageid: that.data.id,
            })
            wx.hideLoading();
            if (res.data.result.address && res.data.result.address != '' && that.data.cusId == 0) {
              that.setData({
                aid: res.data.result.address.id,
                discount: discount
              })
            }
          }
          else {
            wx.showToast({
              title: res.data.message,
              mask: true,
              success: function () {
                setTimeout(
                  function () {
                    wx.navigateBack({
                      delta: 2,
                    })
                  }, 2000
                )
              }
            })
          }
        }
      })
    // })
  },

  getgoods: function () {
    console.log('立即购买');
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    var that = this;
    var giftid = that.data.giftid;
    // console.log(giftid)
    // app.util.getUserInfo(function (res) {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=order.create.get_main&id=' + that.data.id + '&optionid=' + that.data.optionid + '&total=' + that.data.total,
        data: {
          giftid: that.data.giftid,
          openid: that.data.openid,
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res);
          wx.hideLoading()
          const re = res.data.result;
          var gifts = '';
          if (giftid != undefined) {
            gifts = re.giftGood ? re.giftGood:'';
          }
          else {
            gifts = re.gifts ? re.gifts.gifts:''
          };
          console.log(gifts);
          if (res.data.status == 1) {
            that.setData({
              goodsList: re.list,
              allPrice: re.allprice,
              goods_args: re.goods_args,
              other: re.other,
              goods_list: re.goods_list,
              address: re.address,
              items: re,
              showCoupon: re.other.showCoupon,
              diyfrom: re.diyformdata.fieldsNum,
              gifts: gifts,
            })
            // 收货地址
            if (re.address && re.address != '' && that.data.cusId == 0) {
              that.setData({
                aid: re.address.id
              })
            }
            var shopList = re.list

            var tempArray = new Array()
            var goodsJsonStr = "["
            var arr = new Array();
            for (var i = 0; i < re.list.length; i++) {
              var goosarr = new Array()
              var carShopBean = shopList[i]

              var goodsJsonStrTmp = ""
              if (i > 0) {
                goodsJsonStrTmp = ","
              }
              goosarr[0] = carShopBean.goodsid;
              goosarr[1] = carShopBean.optionid;
              goosarr[2] = carShopBean.total;
              goodsJsonStrTmp += '{goodsid:' + carShopBean.goodsid + ',optionid:' + carShopBean.optionid + ',total:' + carShopBean.total + '}'
              goodsJsonStr += goodsJsonStrTmp
              arr[i] = goosarr;
            }
            goodsJsonStr += "]"

            that.setData({
              goodsJsonStr: goodsJsonStr,
              arr: arr
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
  /**
   * 取购物车产品
   */
  orderCreateMain: function () {
    var that = this
    console.log('购物车');
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    app.util.orderCreateMain(function (e) {
      console.log(e)
      if (e.status == 0) {
        wx.showModal({
          title: '提示',
          content: e.result.message,
          showCancel: false,
          success: function (res) {
            // 返回上页
            if (res.confirm) {
              wx.navigateBack()
            }
          }
        })
        return
      }
      const re = e.result
      that.setData({
        goodsList: re.list,
        allPrice: re.allprice,
        goods_args: re.goods_args,
        other: re.other,
        goods_list: re.goods_list,
        address: re.address,
        items: re,
        showCoupon: re.other.showCoupon,
        diyfrom: re.diyformdata.fieldsNum,
      })
      wx.hideLoading();
      // 收货地址
      if (re.address && re.address != '' && that.data.cusId == 0) {
        that.setData({
          aid: re.address.id
        })
      }

      var shopList = re.list

      var tempArray = new Array()
      var goodsJsonStr = "["
      var arr = new Array();
      for (var i = 0; i < re.list.length; i++) {
        var goosarr = new Array()
        var carShopBean = shopList[i]

        var goodsJsonStrTmp = ""
        if (i > 0) {
          goodsJsonStrTmp = ","
        }
        goosarr[0] = carShopBean.goodsid;
        goosarr[1] = carShopBean.optionid;
        goosarr[2] = carShopBean.total;
        goodsJsonStrTmp += '{goodsid:' + carShopBean.goodsid + ',optionid:' + carShopBean.optionid + ',total:' + carShopBean.total + '}'
        goodsJsonStr += goodsJsonStrTmp
        arr[i] = goosarr;
      }
      goodsJsonStr += "]"

      that.setData({
        goodsJsonStr: goodsJsonStr,
        arr: arr
      })
    })
  },


  showCoupon: function () {
    var show = this.data.showCoupon
    var coupons = this.data.coupons
    if (!show && coupons.length == 0) {
      this.getCoupons()
    }
    this.setData({
      showCoupon: show == true ? false : true
    })
  },

  getCoupons: function () {
    const that = this
    var goodsids = [];
    for (var i = 0; i < that.data.items.list.length; i++) {
      // var goodsid = that.data.items.list[i].goodsid
      goodsids.push(that.data.items.list[i].goodsid)

    }

    var merchs = {
      merchid: that.data.items.merchid,
      goods: goodsids,
      ggprice: that.data.items.allprice
    }
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=sale.coupon.util.query',
        method: 'POST',
        data: {
          money: 0,
          type: 0,
          merchs: merchs,
          goods: that.data.items.list
        },
        success: function (res) {
          if (res.data.result.coupons.length > 0) {
            that.setData({
              coupons: res.data.result.coupons
            })
          } else {
            that.showCoupon()
          }
        },
        fail: function () {
          //
        }
      })
    })
  },
  setCoupons: function (e) {
    wx.showLoading({
      title: '处理中...',
    })
    var couponid = e.currentTarget.dataset.id
    this.setData({
      couponid: couponid
    })
    var contype = 2 ? 2 : 1;
    var that = this;
    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&m=ewei_shopv2&do=mobile&r=order.create.getcouponprice',
        method: 'POST',
        data: {
          t: app.siteInfo.uniacid,
          goods: that.data.items.list,
          goodsprice: that.data.items.allprice,
          couponid: couponid,
          contype: contype,
          wxid: 0,
          wxcardid: 0,
          wxcode: 0,
          discountprice: 0,
          isdiscountprice: 0
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.status == 1) {
            that.setData({
              youhuis: res.data.result,

            })

          }
          // that.showCoupon()


        },
        fail: function () {
          //
        }
    //   })
    })


  },
  useCoupon: function (e) {

    const that = this;
    const id = e.currentTarget.dataset.id;
    const backmoney = e.currentTarget.dataset.money;
    const name = e.currentTarget.dataset.name;
    const money = that.data.other.realprice - backmoney;
    const other = that.data.other;
    other['realprice'] = money;
    var show = this.data.showCoupon
    that.setData({
      useCoupon: true,
      useCoupon_backmoney: backmoney,
      other: other,
      showCoupon: show == true ? false : true,
      couponname: "已选择" + name,
      couponid: id
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
   * 立即支付
   * 创建订单
   */
  createOrder: function (e) {
    wx.showLoading();
    if (this.data.giftid == undefined && this.data.gifts != '' && this.data.gifts != null) {
      wx.showToast({
        title: '未选择赠品',
      })
    } else {
      var that = this;
      var couponid = e.detail.target.dataset.id;
      console.log(this.data.arr);
      var params = {
        orderid: 0,
        id: 0,
        goods: this.data.arr,
        giftid: this.data.giftid,
        gdid: '',
        diydata: '',
        dispatchtype: 0,
        fromcart: this.data.fromcart,
        carrierid: 0,
        addressid: this.data.aid,
        carriers: '',
        remark: e.detail.value.remark,
        remark1: e.detail.value.remark1,
        remark2: e.detail.value.remark2,
        remark3: e.detail.value.remark3,
        time: that.data.time,
        img: that.data.img,
        date: that.data.date,
        casIndex: that.data.casIndex,
        region: that.data.region,
        deduct: 0,
        deduct2: 0,
        couponid: couponid,
        contype: 2,
        invoicename: '',
        submit: true,
        packageid: that.data.packageid,
        app: 1,
      }
      console.log(params);
      // 创建订单
      app.util.getUserInfo(function (res) {
        app.util.request({
          url: 'entry/ewei_shopv2/mobile&r=order.create.submit',
          method: 'POST',
          data: app.util.json2Form(params),
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (e) {
            wx.hideLoading()
            var d = e.data
            if (d.status == 0) {
              wx.showModal({
                title: '提示',
                content: d.result.message,
                showCancel: false
              })
              return
            } else {
              // 跳到支付页面
              wx.showToast({
                title: '订单创建成功',
                icon: 'success',
                duration: 2000
              })
              wx.redirectTo({
                url: '/pages/default/order/pay/pay?orderid=' + e.data.result.orderid,
              })
            }
          },
          fail: function () {
            wx.hideLoading()
            wx.showModal({
              title: '错误',
              content: '订单提交失败',
            })
          }
        })
      })
    }
  },

  // 添加地址
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/default/member/address/address?type=2"
    })
  },

  // 选择地址
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/default/member/select/select?type=2"
    })
    var datas = {
      id: this.data.id,
      optionid: this.data.optionid,
      total: this.data.total,
      types: this.data.types,
      packgoods: this.data.packgoods,
      giftid: this.data.giftid,
      fromcart: this.data.fromcart
    }
    wx.setStorageSync('key', datas)
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
console.log("asd ")
      var that = this
      that.initShippingAddress()
      
     setTimeout(function(){
         wx.stopPullDownRefresh();
     },100)
  },

})
