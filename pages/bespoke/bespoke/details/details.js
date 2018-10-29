// pages/default/bespoke/details/details.js
var siteInfo = require('../../../../config.js');
var wxParse = require('../../../../vendor/wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabArr : 1, //选项阿卡
    item : {},
    msg : '',
    title : [],
    group_desc : [],
    id : '',
    list : [],
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
   * 选项卡
   */
   
  tabFun : function(e){

    var index = e.currentTarget.dataset.index;
    this.setData({
      tabArr : index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var id = options.id;
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    that.setData({
      id : id,
    })
    app.util.getUserInfo(function(){
      app.util.request({
        url: 'entry&do=index&do=goods&m=qwx_shangmen',
        method : 'GET',
        data : {
          i: siteInfo.uniacid,
          id : id,
        },
        success : function(msg){
          wx.hideLoading();

          var item = msg.data.goods;
          var title = msg.data.show_item_result;
          var gdesc = title.gongxiao.desc;
          var gtitle = title.gongxiao.title;
          var rdesc = title.renqun.desc;
          var ldesc = title.liucheng.desc;
          var jdesc = title.jifa.desc;
          var odesc = title.other.desc;
          
          var msg = msg.data;
          that.setData({
            item : item,
            title : title,
            msg : msg,
            gdesc: wxParse.wxParse('article', 'html', gdesc, that, 5),
            gtitle: gtitle,
            rtitle : title.renqun.title,
            rdesc: wxParse.wxParse('content', 'html', rdesc, that, 5),
            xtitledesc: title.titledesc,
            ltitle: title.liucheng.title,
            ldesc: wxParse.wxParse('contents', 'html', ldesc, that, 5),
            jtitle : title.jifa.title,
            jdesc: wxParse.wxParse('titles', 'html', jdesc, that, 5),
            otitle : title.other.title,
            jdesc: wxParse.wxParse('otitle', 'html', odesc, that, 5),
          })
        }
      })
    })
    this.getcomment();
  },
  /*取评价*/
  getcomment : function(){

    var that = this;
    var id = that.data.id
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&do=getcomment&m=qwx_shangmen',
        method: 'GET',
        data: {
          i: siteInfo.uniacid,
          pid: id,
          page : 1
        },
        success: function (res) {
          
          var list = res.data.data.list;
          that.setData({
            list : list
          })

         
        }
      })
    })
  },

  /*提交评价*/
  bindFormSubmit: function (e) {
    var that = this;
    var id = that.data.id

    var val = e.detail.value.textarea;
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&do=setcomment&m=qwx_shangmen',
        method: 'GET',
        data: {
          i: siteInfo.uniacid,
          goods_id : id,
          comment: val
        },
        success: function (res) {
     

          wx.hideLoading()
          if (res.data.status==1){
        
            wx.showModal({
              title: '提示',
              content: '评论成功，等待审核',
            })
          }else{

              wx.showModal({
                  title: '提示',
                  content: res.data.msg,
              })
          }

        }
      })
    })
  },
  /**
   * 加入购物车
  */
  torder : function(e){
    var that = this;
    var price = e.currentTarget.dataset.price;
    var svs = e.currentTarget.dataset.svs;
    var id = that.data.id;
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry&is_ajax=1&op=add_cart&do=cart&m=qwx_shangmen',
        method: 'POST',
        data: {
          i: siteInfo.uniacid,
          goods_id: id,
          price : price,
          daojia: that.data.tabArr,
          is_vip: 0
        },
        success: function (res) {
     
          if(res.data.code ==1 ){
            wx.navigateTo({
              url: "/pages/default/bespoke/choice/choice"
            })
          }
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