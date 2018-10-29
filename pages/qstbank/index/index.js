//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    animationData: {},
    level: 0,
  },

  onLoad: function () {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        })
      },
    })
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=question.channel',
      data: {

      },
      success: function (res) {
        wx.hideLoading();
        // console.log(res)
        that.setData({
          list: res.data.channel,
        })
      }
    })
  },
  getchild: function (e) {
    const that = this;
    let superior_name = e.currentTarget.dataset.superior_name;
    let id = e.currentTarget.dataset.id;
    let level = that.data.level + 1;
    // console.log(level);
    if (level < 3) {
      app.util.request({
        url: 'entry&m=ewei_shopv2&do=mobile&r=question.channel',
        data: {
          ['level_' + level]: id,
        },
        success: function (res) {
          // console.log(res.data.channel)
          if (res.data.channel != 'false') {
            wx.setStorageSync('keys' + level, { child_list: res.data.channel, superior_name: superior_name })
            that.setData({
              child_list: res.data.channel,
              superior_name: superior_name,
              level: level,
            })
            let animation = wx.createAnimation({
              duration: 500,
              timingFunction: "ease",
              delay: 0,
            })
            that.animation = animation;
            animation.width(that.data.windowWidth).step()
            that.setData({
              animationData: animation.export()
            })
          } else {
            wx.navigateTo({
              url: '/pages/qstbank/detail/detail?id=' + id + '&title=' + superior_name + '&level=' + level
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/qstbank/detail/detail?id=' + id + '&title=' + superior_name + '&level=' + level
      })
    }
  },

  goback: function () {
    const that = this;
    let level = that.data.level;
    if (level == 1) {
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
        delay: 0,
      })
      that.animation = animation;
      animation.width(0).step()
      that.setData({
        animationData: animation.export(),
        level: level - 1,
      })
    } else {
      level -= 1;
      let keys = wx.getStorageSync('keys' + level)
      // console.log(keys);
      let child_list = keys.child_list;
      let superior_name = keys.superior_name;
      that.setData({
        level: level,
        child_list: child_list,
        superior_name: superior_name
      })
    }
  },
})
