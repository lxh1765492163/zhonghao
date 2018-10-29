var $citys = require('../../../../utils/city.js');
var cityData = $citys.data;
var siteInfo = require('../../../../config.js');
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
    provincesday: 0,
    citysday: 0,
    countysday: 0,
    cityValue: [0, 0, 0],
    address: [], //收货地址
    types: 0, // 页面类型 0:管理地址 1:添加地址 2:选择地址
    aid: 0, //编辑时id
    cityText: '请选择所在地区',
    isCity: true, 
    items: null  
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
    app.util.request({
      url: 'entry/ewei_shopv2/mobile&r=member.info.get_main', 
      success: function (res) {
        console.log(res);
        wx.hideLoading() 
          that.setData({
            items: res.data.result,
            cityText: res.data.result.member.province + " " + res.data.result.member.city + " " + res.data.result.member.area
          }) 
      },
      fail: function () {
        wx.hideLoading()
      }
    })
  },


  //调起选择器
  risePicker: function (e) {
    var that = this;
    console.log(e);
    var $mold = e.currentTarget.dataset.mold;
    if ($mold == 'city') {
      that.setData({
        isCity: false
      })
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
        provinceName = '北京'
      }
      if (cityName == '') {
        cityName = '北京市'
      }
      if (countyName == '') {
        countyName = '东城区'
      }
      var cText = provinceName + ' ' + cityName + ' ' + countyName
      if (cText.replace(/\s+/g, '') == '') {
        cText = '北京 北京市 东城区'
      }
      that.setData({
        cityText: cText,
      })
    }
    that.setData({
      isCity: true
    })
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
 
    var data = { 
      birthday: d.birthday,
      areas: this.data.cityText,
      mobile: d.mobile,
      realname: d.realname,
      weixin: d.weixin
    }

    // 提交
    app.util.formInfo(data, function (e) {
      if (e.status == 1) {
        // 添加成功 返回
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
        wx.navigateBack()
      } else {
        wx.showModal({
          title: '提示',
          content: '添加失败',
        })
        return
      }
    })
  }





})