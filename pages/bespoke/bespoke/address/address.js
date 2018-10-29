var $citys = require('../../../../utils/city.js');
var siteInfo = require('../../../../config.js');
var cityData = $citys.data;
var app = getApp();

var provinces = [];
var citys = [];
var countys = [];

//城市
for (let i = 0; i < cityData.length; i++) {
  provinces.push(cityData[i].name);
}

for (let i = 0; i < cityData[0].sub.length; i++) {
  citys.push(cityData[0].sub[i].name)
}

for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
  countys.push(cityData[0].sub[0].sub[i].name)
}

var provinceName = '';
var cityName = '';
var countyName = '';
var address = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinces: provinces,
    citys: citys,
    countys: countys,
    cityValue: [0, 0, 0],
    address: [], //收货地址
    types: 0, // 页面类型 0:管理地址 1:添加地址 2:选择地址
    aid: 0, //编辑时id
    cityText: '请选择所在地区',
    isCity: true,
    checked: false,
    is_default: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var tp = options.type ? options.type : 0
    var aid = options.id ? options.id : 0
    this.setData({
      types: tp,
      aid: aid
    })
    var title = '收货地址'
    if (tp == 1) {
      if (options.id) {
        title = '编辑收货地址'
        this.setData({
          aid: options.id
        })
        this.getAddressById(options.id);
      } else {
        title = '添加收货地址'
      }
    } else if (tp == 2) {
      title = '选择地址'
    }
    wx.setNavigationBarTitle({
      title: title
    })
  },

  onShow: function () {
    const that = this
    const tp = that.data.types
    if (!(tp == 1 && that.data.aid > 0)) {
      this.getAddress()
      provinceName = ''
      cityName = ''
      countyName = ''
      that.setData({
        cityValue: [0, 0, 0]
      })
    }
  },

  /**
   * 编辑地址
  */
  getAddressById: function (id) {
    const that = this;

    var id = id;
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&do=myaddresspost&m=qwx_shangmen',
        method: 'GET',
        data:{
          i : siteInfo.uniacid,
          id : that.data.aid
        },
        success: function (res) {
       
          wx.hideLoading()

          if (res.data != '') {
            var p = 0
            for (let i = 0; i < cityData.length; i++) {
              if (cityData[i].name == res.data.address.province) {
                p = i
              }
            }
            var c = 0
            var citys = []
            for (let i = 0; i < cityData[p].sub.length; i++) {
              citys.push(cityData[p].sub[i].name)
              if (cityData[p].sub[i].name == res.data.address.city) {
                c = i
              }
            }
            var o = 0
            var countys = []
            for (let i = 0; i < cityData[p].sub[c].sub.length; i++) {
              countys.push(cityData[p].sub[c].sub[i].name)
              if (cityData[p].sub[c].sub[i].name == res.data.address.area) {
                o = i
              }
            }

            var h = {
              detail: {
                value: [p, c, o]
              }
            }
            that.cityChange(h)
            provinceName = res.data.province
            cityName = res.data.city
   
            countyName = res.data.district
            that.setData({
              address: res.data,
              cityText: res.data.province + ' ' + res.data.city + ' ' + res.data.district,
              citys: citys,
              countys: countys,
              cityValue: [p, c, o]
            })
            return
          } else {
            wx.showModal({
              title: '提示',
              content: '获取地址失败',
              showCancel: false,
              success: function () {
                wx.navigateBack()
              }
            })
          }
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    })
  },
  // 取地址
  getAddress: function () {
    var that = this

    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&source=order&do=myaddress&m=qwx_shangmen',
        method: 'GET',
        data: {
          i: siteInfo.uniacid,

        },
        success: function (res) {
 

          that.setData({
            address: res.data
          })
        }
      })
    })
  },

  /*提交地址*/
  formPost(e) {
    var d = e.detail.value

    if (d.realname == '') {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }

    if (d.mobile == '') {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }

    //判断地区
    if (this.data.cityText == '' || this.data.cityText == '请选择所在地区') {
      wx.showModal({
        title: '提示',
        content: '请选择所在地区',
        showCancel: false
      })
      return
    }

    var that = this;
    var i = siteInfo.uniacid;
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&source=order&do=myaddresspost&m=qwx_shangmen&i=' + i+'?id='+that.data.aid,
        method: 'POST',
        data: {
          address: d.address,
          areas: that.data.cityText,
          phone: d.phone,
          name: d.name,
          is_default: that.data.is_default,
          source: 'order',  
        },
        header: {
          // "Accept": "application/json"
        },
        success: function (res) {
          wx.hideLoading()

          if(res.data.position == 'order'){
            // 添加成功 返回
            wx.showToast({
              title: res.data.message,
              icon: 'success'
            })
            wx.redirectTo({
                url: '/pages/default/bespoke/order/index',
                // delta:1,
            })
          }
        }
      })
    })
  },
  /**
   * 设为默认
  */
  setDefault: function (e) {

    var that = this;
    var is_default;
    var checked;
    checked = !that.data.checked;
    is_default = checked == true ? '1' : '0';

    that.setData({
      checked: checked,
      is_default: is_default
    })


  },


  //调起选择器
  risePicker: function (e) {
    var that = this;
    var $mold = e.currentTarget.dataset.mold;
    if ($mold == 'city') {
      that.setData({
        isCity: false
      })
    }
  },

  //城市选择器
  cityChange: function (e) {
    var val = e.detail.value
    var t = this.data.cityValue;
    address = '';
    if (val[0] != t[0]) {
      citys = [];
      countys = [];
      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        citys: citys,
        countys: countys,
        cityValue: [val[0], 0, 0]
      })
      provinceName = cityData[val[0]].name;
      cityName = cityData[val[0]].sub[0].name;
      countyName = cityData[val[0]].sub[0].sub[0].name;
      address += cityData[val[0]].name + " " + cityData[val[0]].sub[0].name + " " + cityData[val[0]].sub[0].sub[0].name;
      return;
    }
    if (val[1] != t[1]) {
      countys = [];
      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }
      this.setData({
        countys: countys,
        cityValue: [val[0], val[1], 0]
      })
      cityName = cityData[val[0]].sub[val[1]].name;
      countyName = cityData[val[0]].sub[val[1]].sub[0].name;
      address += cityData[val[0]].name + " " + cityData[val[0]].sub[val[1]].name + " " + cityData[val[0]].sub[val[1]].sub[0].name;
      return;
    }
    if (val[2] != t[2]) {
      this.setData({
        county: this.data.countys[val[2]],
        cityValue: val
      })
      countyName = cityData[val[0]].sub[val[1]].sub[val[2]].name;
      address += cityData[val[0]].name + " " + cityData[val[0]].sub[val[1]].name + " " + cityData[val[0]].sub[val[1]].sub[val[2]].name;
      return;
    }
  },

  //确定选择
  ideChoice: function (e) {
    var that = this;
    var $act = e.currentTarget.dataset.act;
    var $mold = e.currentTarget.dataset.mold;

    //城市
    if ($act == 'confirm' && $mold == 'city') {
      if (provinceName == '') {
        provinceName = '北京,'
      }
      if (cityName == '') {
        cityName = '北京市,'
      }
      if (countyName == '') {
        countyName = '东城区'
      }
      var cText = provinceName + ' ' + cityName + ' ' + countyName
      if (cText.replace(/\s+/g, '') == '') {
        cText = '北京, 北京市, 东城区'
      }
      that.setData({
        cityText: cText,
      })
    }
    that.setData({
      isCity: true
    })
  },
  //删除
  del: function (e) {

    const that = this;
    const id = parseInt(e.currentTarget.dataset.id)
    wx.showModal({
      title: '提示',
      content: '您确定删除该地址吗',
      success: function (res) {
        if (res.confirm) {
         
          app.util.getUserInfo(function () {
            app.util.request({
              url: 'entry&do=myaddresspost&m=qwx_shangmen&op=delete',
              method: 'GET',
              data: {
                i: siteInfo.uniacid,
                id: id,
              },
              success: function (res) {
                wx.navigateBack()
              }
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

   

  },
  
})