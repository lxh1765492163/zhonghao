// zh_jd/pages/check/check.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrays: ['暂无星级(经济型)', '三星级', '四星级', '五星级'],
    index: 0,
    inde: 0,
    prompt: false,
    items: [
      { name: '停车', value: '停车' },
      { name: 'wifi', value: 'wifi' },
      { name: '早餐', value: '早餐' },
      { name: '叫醒', value: '叫醒' },
      { name: '健身房', value: '健身房' },
      { name: '银联', value: '银联' },
      { name: '24小时热水', value: '24小时热水' },
      { name: '会议室', value: '会议室' }
    ],
    choice: true,
    getmsg: "获取验证码",
    interval: 'interval2'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: wx.getStorageSync('platform_color'),
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    // 获取用户openid
    var openid = wx.getStorageSync("openid")
    // 获取用户id
    var user_id = wx.getStorageSync("users").id
    console.log('用户的openid为' + ' ' + openid + ' ' + '用户的user_id为' + ' ' + user_id)
    that.setData({
      user_id:user_id
    })
    // 判断用户是否已经入驻
    app.util.request({
        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageCheckinfo',
      'cachetime': '0',
      data:{user_id:user_id},
      success: function (res) {
        console.log(res)
        if(res.data!=false){
          wx:wx.showModal({
            title: '入驻提示',
            content: '您已经入驻过了',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx:wx.reLaunch({
                  url: '../logs/logs',
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx: wx.reLaunch({
                  url: '../logs/logs',
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
     
      }
    })
    // 获取上传图片所需的链接
    app.util.request({
        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageUrl',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        that.setData({
          url: res.data
        })
      }
    })
    // 获取平台指定的地点
    app.util.request({
        'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageGetcity',
      'cachetime': '0',
      success: function (res) {
        console.log(res)
        var city = res.data.map(function (item) {
          return item.city
        })
        console.log(city)
        that.setData({
          city: city,
          citys:res.data
        })
      }
    })
  },
  // 选择酒店星级
  bindPickerChanges: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 选择酒店地区
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      inde: e.detail.value
    })
  },
  // 选择酒店成立时间
  startDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  // 选择酒店设施
  choice: function (e) {
    this.setData({
      choice: true
    })
  },
  // 关闭酒店设施
  complete: function (e) {
    var that = this
    that.setData({
      choice: false
    })
  },
  // 上传图片
  choose: function (e) {
    var that = this
    var url = that.data.url
    var uniacid = wx.getStorageSync("users").uniacid
    console.log(url)
    console.log(uniacid)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
            url: url + 'app/index.php?i=' + uniacid + '&c=entry&m=ewei_shopv2&do=mobile&r=zh_jd.wxapp.doPageUpload',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              uplogo1: res.data
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
        that.setData({
          logo: tempFilePaths
        })
      }
    })
  },
  // 上传图片
  choose1: function (e) {
    var that = this
    var url = that.data.url
    var uniacid = wx.getStorageSync("users").uniacid
    // console.log(uniacid)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
            url: url + 'app/index.php?i=' + uniacid + '&c=entry&m=ewei_shopv2&do=mobile&r=zh_jd.wxapp.doPageUpload',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              uplogo2: res.data
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
        that.setData({
          logo1: tempFilePaths
        })
      }
    })
  },
  // 上传图片
  choose2: function (e) {
    var that = this
    var url = that.data.url
    var uniacid = wx.getStorageSync("users").uniacid
    // console.log(uniacid)
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0]
        wx.uploadFile({
          url: url + 'app/index.php?i=' + uniacid + '&c=entry&a=wxapp&do=upload&m=zh_jd',
          filePath: tempFilePaths,
          name: 'upfile',
          formData: {},
          success: function (res) {
            console.log(res)
            that.setData({
              uplogo3: res.data
            })
          },
          fail: function (res) {
            console.log(res)
          },
        })
        that.setData({
          logo2: tempFilePaths
        })
      }
    })
  },
  // 多选框
  checkboxChange: function (e) {
    var that = this
    console.log(e)
    var facilities = e.detail.value
    that.setData({
      facilities: facilities
    })
  },
  // 获取用户输入的手机号
  user_name: function (e) {
    var that = this
    console.log(e)
    var name = e.detail.value
    that.setData({
      name: name
    })
  },
  // 验证码
  sendmessg: function (e) {
    var that = this
    console.log(that.data)
    var name = that.data.name
    if (name == '' || name == null) {
      wx: wx.showToast({
        title: '请输入手机号',
        icon: '',
        image: '',
        duration: 2000,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      // 获取6位数的随机数
      var Num = "";
      for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
      }
      console.log(Num)
      // 随机数传给后台
      app.util.request({
          'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageSms2',
        'cachetime': '0',
        data: { code: Num, tel: name},
        success: function (res) {
          console.log(res)
        },
      })
      that.setData({
        num: Num
      })
      var time = 60
      // 60秒倒计时
      var inter = setInterval(function () {
        that.setData({
          getmsg: time + "s后重新发送",
          send: true
        })
        time--
        if (time <= 0) {
          // 停止倒计时
          clearInterval(inter)
          that.setData({
            getmsg: "获取验证码",
            send: false,
            num: 0
          })
        }
      }, 1000)
    }

  },
  formSubmit: function (e) {
    var that = this
    console.log(e)
    console.log(that.data)
    // 联系人姓名
    var hotel_contacts = e.detail.value.hotel_contacts
    // 具体地址
    var hotel_address = e.detail.value.hotel_address
    // 酒店名称
    var hotel_name = e.detail.value.hotel_name
    // 酒店电话
    var hotel_tel = e.detail.value.hotel_tel
    // 酒店邮箱
    var hotel_mail = e.detail.value.hotel_mail
    // 验证码
    var yz_code = e.detail.value.yz_code
    // 输入的手机号
    var yz_tel = e.detail.value.yz_tel
    // 酒店地区
    var address = that.data.citys[that.data.inde].id
    // 酒店星级
    var star = that.data.arrays[that.data.index]
    //酒店成立时间
    var dates = that.data.dates
    // 酒店的设施
    var facilities = that.data.facilities
    // 酒店图片
    // var tempFilePaths1 = that.data.tempFilePaths1
    // 证件-------------------------营业执照
    var logo = that.data.uplogo1
    // 证件-------------------------身份证正面
    var logo1 = that.data.uplogo2
    // 证件-------------------------身份证反面
    var logo2 = that.data.uplogo3
    // 随机6位数
    var num = that.data.num
    // 补充说明
    var textarea = e.detail.value.textarea
    if (textarea == '' || textarea==null){
      textarea=''
    }
    console.log('酒店的名称为' + ' ' + hotel_name + ' ' + '酒店星级为' + ' ' + star + ' ' + '酒店地区为' + ' ' + address + ' ' + '酒店具体地址为' + ' ' + hotel_address + ' ' + '酒店联系人姓名为' + ' ' + hotel_contacts + ' ' + '酒店电话为' + ' ' + hotel_tel + ' ' + '酒店的成立时间为' + ' ' + dates)
    console.log(logo+' '+logo1+' '+' '+logo2)
    
    var title = ''
    if (hotel_name == '') {
      title = '请输入酒店名称'
    } else if (star == '') {
      title = '请输入酒店星级'
    }else if (hotel_address == '') {
      title = '请输入酒店具体地址'
    } else if (hotel_contacts == '') {
      title = '请输入酒店联系人姓名'
    } else if (hotel_tel == '') {
      title = '请输入酒店电话'
    } else if (hotel_mail == '') {
      title = '请输入酒店邮箱'
    } else if (dates == '' || dates == null) {
      title = '请输入酒店成立时间'
    } else if (facilities == '' || facilities == null) {
      title = '请输入酒店设施'
    } else if (yz_tel == '') {
      title = '请输入验证的手机号'
    } else if (yz_code == '') {
      title = '请输入验证码'
    } else if (yz_code != num) {
      title = '输入验证码错误'
    } else if (logo == '' || logo == null) {
      title = '请上传营业执照'
    } else if (logo1 == '' || logo1 == null) {
      title = '请上传身份证正面'
    } else if (logo2 == '' || logo2 == null) {
      title = '请上传身份证反面'
    }
    if (title != '') {
      wx: wx.showModal({
        title: '提示',
        content: title,
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确定',
        confirmColor: '',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      // 酒店设施
      var wake = 0
      var wifi = 0
      var pake = 0
      var breakfast = 0
      var unionPay = 0
      var gym = 0
      var boardroom = 0
      var water = 0
      for (var i = 0; i < facilities.length; i++) {
        if (facilities[i] == '叫醒') {
          var wake = 1
        } else if (facilities[i] == 'wifi') {
          var wifi = 1
        } else if (facilities[i] == '停车') {
          var pake = 1
        } else if (facilities[i] == '早餐') {
          var breakfast = 1
        } else if (facilities[i] == '银联') {
          var unionPay = 1
        } else if (facilities[i] == '健身房') {
          var gym = 1
        } else if (facilities[i] == '会议室') {
          var boardroom = 1
        } else if (facilities[i] == '24小时热水') {
          var water = 1
        }
      }
      console.log(wake)
      console.log(wifi)
      console.log(pake)
      console.log(breakfast)
      console.log(unionPay)
      console.log(gym)
      console.log(boardroom)
      console.log(water)
      app.util.request({
          'url': 'entry/ewei_shopv2/mobile&r=zh_jd.wxapp.doPageSavecheck',
        'cachetime': '0',
        data: {
          user_id:that.data.user_id,
          name: hotel_name,
          star: star,
          city: address,
          address: hotel_address,
          jd_tel: hotel_tel,
          cl_clate: dates,
          img: logo,
          link_name: hotel_contacts,
          link_tel: yz_tel,
          content: textarea,
          card_img1: logo1,
          card_img2: logo2,
          wake: wake,
          wifi: wifi,
          pake: pake,
          breakfast: breakfast,
          unionPay: unionPay,
          gym: gym,
          boardroom: boardroom,
          water: water,
        },
        success: function (res) {
          console.log(res)
          wx:wx.reLaunch({
            url: '../logs/logs',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      })
    }
    
   
  }
})