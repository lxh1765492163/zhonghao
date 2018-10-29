// pages/default/fightGroup/offered/groupsdetail/index.js

function countdown(that) {
      var time = setTimeout(function () {
        for (var i = 0; i < that.data.teams.length; i++) {
          that.data.teams[i].second-=1;
          that.setData({
            teams: that.data.teams
          });
          if (that.data.teams[i].second <= 0 && that.data.teams[i].minite >= 0){
            that.data.teams[i].second =59;
            that.data.teams[i].minite -=1;
              that.data.teams[i].second-=1;
              that.setData({
                teams: that.data.teams
              });
          } else if (that.data.teams[i].minite <= 0 && that.data.teams[i].hour>=1){
              that.data.teams[i].minite = 59;
              that.data.teams[i].minite -= 1;
              that.data.teams[i].hour = 0;
              that.setData({
                teams: that.data.teams
              });
          } else if (that.data.teams[i].minite <= 0 && that.data.teams[i].second <= 0 && that.data.teams[i].hour <= 0){
            that.setData({
              teams: that.data.teams
            });
            return
          }
          }
        countdown(that);
      } , 1000)
  }




var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods : [],
    teams : [],
    second: 0,
    clock: 1000,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    var that = this;
    var id = options.id;
   
    // app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=groups.goods.get_fightGroups',
        method: 'GET',
        data: {
          id : id,
          heads: 1
        },
        success: function (res) {
          console.log(res) 
          var goods = res.data.goods;
          var teams = res.data.teams;
      
          wx.hideLoading()
          if (res.data.teams!=''){
            that.setData({
              goods: goods,
              teams: teams,
            })
          }else{
            that.setData({
              goods: goods,
            })
          }
         
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    // }) 
 
  },
  /*创建订单*/
  toPayOrder(e) {
    console.log(e);
    const that = this
    var id = e.currentTarget.dataset.id;
    console.log(id)
    var teamid = that.data.teams[0].teamid;
    console.log(teamid);
    // wx.showLoading({
    //   title: '加载中...',
    // })
    app.util.getUserInfo(function () {
      app.util.request({
        url: 'entry/ewei_shopv2/mobile&r=groups.orders.get_confirms',
        data: {
          id: id,
          type: 'groups',
          heads: 1
        },
        success: function (res) {
          console.log(res);
          console.log(888888888);
          wx.hideLoading()
          // 跳转到 order/create

          if (res.data.status == 0) {
            wx.showModal({
              title: '提示',
              content: res.data.result.message
            })
          } else {
            wx.navigateTo({
                url: "/pages/default/fightGroup/order/creat/creat?type=" + 'groups' + "&id=" + id + '&teamid=' + teamid + '&heads=0'
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that= this;
    countdown(that);
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