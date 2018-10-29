var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAddress()
        var types = options.type
        this.setData({
          types: types,
        })
    },
    onShow: function () {
        this.getAddress()
    },
    // 取地址
    getAddress: function () {
        var that = this
        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=member.address.indexapp',
                method: 'GET',
                header: {
                    'Accept': 'application/json'
                },
                success: function (e) {
                    wx.hideLoading()
                    var d = e.data.result

                    that.setData({
                        address: d.list
                    })
                },
                fial: function () {
                    wx.hideLoading()
                }
            })

        })
    },

    // 选中地址
    radioChange: function (e) {
        const aid = parseInt(e.currentTarget.dataset.id)
      
          wx.redirectTo({
            url: '/pages/default/order/create/create?aid=' + aid,
          })
       
    },
    // 选中地址
    editaddress: function (e) {
        const aid = parseInt(e.currentTarget.dataset.id)
        wx.navigateTo({
            url: '/pages/default/member/address/address?type=1&id='+aid
        })
    }

})