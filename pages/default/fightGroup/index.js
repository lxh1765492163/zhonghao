// pages/default/group/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items : [], //栏目
    sort : [],  //产品
    tabArr : 0 //底部切换选项卡
  },


  /* 跳转详情 */
  navTo : function(e){
    var id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: 'details/detail?id='+id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=groups.index.get_index',
        data: {

        },
        success: function (res) {

          var items = res.data.channel;
          var sort = res.data.shop;
          var advs = res.data.advs;
 
          that.setData({
            items: items,
            sort: sort,
            advs : advs,
          })
          wx.hideLoading()


        },
        fail: function () {
          wx.hideLoading()
        }
      })
    // })
  },

    /*点击栏目*/
  click : function(e){
    //获取触发事件组件的dataset属性 
    var click = e.currentTarget.dataset.click;
   var id = e.currentTarget.dataset.id;

   var  tabArr = click;

 
    wx.redirectTo({
      url: '/pages/default/fightGroup/list/list?id='+id,
      succes: function () {
        wx.showLoading({
          title: '加载中',
        })

        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })
    this.setData({
      tabArr: tabArr
   });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile& r=groups.category.get_index',
       
        data: {
          category : ''
        },
        success: function (res) {
         var id = res.data
          that.setData({

          })
          wx.hideLoading()


        },
        fail: function () {
          wx.hideLoading()
        }
      })
    })
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