// pages/community/complaint/complaint.js
var app = getApp();
var siteInfo = require('../../../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: [
      { name: '违法', already: false,cid: 0 },
      { name: '恶意', already: false,cid: 1 },
      { name: '不健康', already: false,cid: 2 },
      { name: '其他', already: false, cid: 3}
      ],
    already: true,
    complaint: {
      author: '小王',
      id: '评论'
    },
    cid : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    var id = options.id;
    this.setData({
        id : id,
    })


    app.util.request({
        url: 'entry&m=ewei_shopv2&do=mobile&r=sns.board.get_index',
        method: 'GET',
        data: {
            i: siteInfo.uniacid,
            id: id,
        },
        success: function (res) {
            var catelist = res.data.catelist
            that.setData({
              catelist : catelist
            })

        }
    })
  },
getuertinfo : function(){
    // 取用户信息
    var that = this;
    app.getUserInfo(function (userInfo) {
        console.log(userInfo)
        //更新数据 
        that.setData({
            userInfo: userInfo
        })
    })
},
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.getuertinfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  /**
   * 提交投诉
  */
  formcomplaint : function(e){
      var content = e.detail.value.content;
      var that = this;
    //   app.util.getUserInfo(function () {
          app.util.request({
              url: 'entry&m=ewei_shopv2&do=mobile&r=sns.post.complain',
              method: 'GET',
              data: {
                  i: siteInfo.uniacid,
                  id: that.data.id,
                  type: that.data.cid,
                  content: content , 
              },
              success: function (res) {
            
                  if (res.data.status == 1) {
                      wx.navigateBack({
                          delta: 1,
                      })
                      wx.showLoading({
                          title: '投诉成功',
                      })
                      setTimeout(function () {
                          wx.hideLoading()
                      }, 1000)
                  } else {
                      wx.showLoading({
                          title: res.data.result.message,
                      })
                      setTimeout(function () {
                          wx.hideLoading()
                      }, 1000)
                  }
              }
          })
    //   })
  },
  selected: function (e) {
    console.log(e)
    var cid = e.currentTarget.dataset.cid;
    this.setData({
        cid: cid,
    })
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