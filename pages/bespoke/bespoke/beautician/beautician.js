// pages/default/bespoke/beautician/beautician.js
var app = getApp();
var siteInfo = require('../../../../config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item :[],
    data : [],
    times: '请选择预约时间',
    dates: '请选择预约日期',
    sid : '',
    memberid : '',
    id : '',
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dates: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // var newData = 
    this.setData({
      times: e.detail.value
    })
  },
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  /**
   * 选择美容师
  */
  choice : function(e){
    console.log(e);
    var that = this;
    var sid = that.data.sid;
    console.log(sid);
    var memberid = that.data.memberid;
    var dates = that.data.dates;
    var times = that.data.times;
    var nowtime = " " + times;

    var nowdata = dates + nowtime;
    console.log(nowdata)
    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&source=order&do=staff&m=qwx_shangmen',
        method: 'GET',
        data: {
          op: 'select_staff',
          yuyue_time : nowdata,
          staff_id: sid,
          select_address_id: that.data.id,
          
        },
        success: function (res) {
          console.log(res)
          if(res.data.code!=0){
            wx.redirectTo({
              url: '/pages/default/bespoke/order/index?staff_id=' + res.data.select_staff_id + '&select_address_id=' + res.data.select_address_id,
            })
           
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        }
      })
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var id = options.id ? options.id : '';
    that.setData({
      id : id,
    }) 
    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&source=order&do=staff&m=qwx_shangmen',
        method: 'GET',
        data: {
          i: siteInfo.uniacid,
          is_ajax : 1,
        },
        success: function (res) {
          console.log(res);
        console.log("美容师")
          var data = res.data;
          for(var i in data){
              var memberid = data[i].item.member_id;
            var sid = data[i].item.id;
            that.setData({
              sid : sid,
              memberid: memberid,
      
            })
          }
          that.setData({
     
            data : data,
          })
        }
      })
    // })

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