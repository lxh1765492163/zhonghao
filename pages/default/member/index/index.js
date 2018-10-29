var js = require('../../../../vendor/app.js')
var siteInfo = require('../../../../config.js');
var app = getApp()

Page({

      /**
       * 页面的初始数据
       */
      data: {
            pagetype: 3, // 页面类型
            page: {}, // 页面信息
            modules: [], // 模块
            items: {}, // 数据
            userInfo: {}, // 用户信息
            data: [],
            tabid : 4,
      },

      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
            const that = this
            // 读取模块信息
            this.getModule()

            // 取用户信息
            app.getUserInfo(function (userInfo) {
                  //更新数据 
                  that.setData({
                        userInfo: userInfo
                  })
            })

            // app.util.getUserInfo(function () {
            app.util.request({
                  url: 'entry&m=ewei_shopv2&do=mobile&r=index.get_diyMenus',
                  method: 'GET',
                  data: {
                        id: siteInfo.template_id
                  },
                  success: function (res) {
                        var datas = res.data.data;
                        var data = res.data;
                        var style = res.data.style;
                        that.setData({
                              data: data,
                              datas: datas,
                              style: style,
                        })
                  }
            })
            //背景动画
            var animation = wx.createAnimation({
                  duration: 4000,
                  timingFunction: 'linear',
          
            })
            // setTimeout(function () {
            //       animation.translateY(-90).step().translateY(0).step()
            //       that.setData({
            //             animationData: animation.export()
            //       })
            // }, 1000)
            setInterval(function () {
                  animation.translateY(-70).step().translateY(0).step()
                  that.setData({
                        animationData: animation.export()
                  })
            }.bind(that), 4000);
            // })
      },

      /**
       * 生命周期函数--监听页面显示
       */
      onShow: function () {
            // 取会员信息
            // this.getMemberInfo();
        
      },
      changetab: function (e) {
          console.log(e)
          var tabid = e.currentTarget.dataset.id;
          this.setData({
              tabid: tabid
          })
      },
      /**
       * 取模块数据
       */
      getModule: function () {
            const that = this

            js.getModules(that.data.pagetype, function (res) {
                  that.setData({
                        modules: res.data.module,
                        page: res.data.page
                  })

                  that.parseModules()
            })
      },

      /**
       * 解析模块
       */
      parseModules: function () {
            const that = this
            var modules = that.data.modules
            app.util.parseModules(modules, function (res) {
                  that.setData({
                        modules: res
                  })
            })
      },

      /**
       * 取会员信息
       */
      getMemberInfo: function () {
            wx.showLoading({
                  title: '加载中...',
            })

            const that = this

            app.util.getUserInfo(function () {

                  app.util.request({
                        //url: app.siteInfo.domain + '/app/index.php?c=wxapp&a=member&do=main&uniacid=' + app.siteInfo.uniacid + '&type=' + types,
                        url: 'entry/ewei_shopv2/mobile&r=member.index.get_main',
                        success: function (res) {

                              wx.hideLoading()

                              const d = res.data.result
                              that.setData({
                                    items: d
                              })
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
      recharge: function () {
            wx.navigateTo({
                  url: '/pages/default/member/recharge/recharge'
            });

      },

      info: function () {

            wx.navigateTo({
                  url: '/pages/default/member/info/info'
            });
      }
})