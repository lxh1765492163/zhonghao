var $citys = require('../../../../utils/city.js');
var cityData = $citys.data;
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
        cityValue: [0, 0, 0],
        address: [], //收货地址
        types: 0, // 页面类型 0:管理地址 1:添加地址 2:选择地址
        aid: 0, //编辑时id
        cityText: '请选择所在地区',
        isCity: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var tp = options.type ? options.type : 0
        var aid = options.id ? options.id : 0
        console.log(options)
        this.setData({
            types: tp,
            aid: aid
        })
        var title = '收货地址'
        if (tp == 1) {
            if (options.id) {
                title = '编辑收货地址'
                this.setData({
                    aid: options.id
                })
                this.getAddressById(options.id)
            } else {
                title = '添加收货地址'
            }
        } else if (tp == 2) {
            title = '选择地址'
        }
        wx.setNavigationBarTitle({
            title: title
        })
    },

    onShow: function () {
        const that = this
        const tp = that.data.types
        if (!(tp == 1 && that.data.aid > 0)) {
            this.getAddress()
            provinceName = ''
            cityName = ''
            countyName = ''
            that.setData({
                cityValue: [0, 0, 0]
            })
        }
    },

    // 取地址
    getAddress: function () {
        var that = this
        app.util.getAddress(function (e) {
            that.setData({
                address: e.list
            })
        })
    },

    // 选中地址
    radioChange: function (e) {
        const aid = e.detail.value
        // 跳回页面
        // wx.navigateTo({
        //     url: '/pages/default/goods/detail/detail' ,
        // })
        wx.navigateBack({
            delta: 2
        })
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

        // 判断手机
        if (d.mobile == '') {
            wx.showToast({
                title: '请填写手机号码',
                icon: 'loading'
            })
            return
        } else if (d.mobile.length != 11) {
            wx.showToast({
                title: '请填写正确手机号',
                icon: 'loading'
            })
            return
        } else {
            // 格式
            var reg = /^((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8}$/
            if (!reg.test(d.mobile)) {
                wx.showToast({
                    title: '填写的手机号有误',
                    icon: 'loading'
                })
                return
            }
        }

        //判断地区
        if (this.data.cityText == '' || this.data.cityText == '请选择所在地区') {
            wx.showModal({
                title: '提示',
                content: '请选择所在地区',
                showCancel: false
            })
            return
        }

        var data = {
            id: this.data.aid,
            address: d.address,
            areas: this.data.cityText,
            mobile: d.mobile,
            realname: d.realname
        }

        // 提交
        app.util.getUserInfo(function () {
            app.util.formAddress(data, function (e) {
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
        })
    },

    /**
     * 设置默认地址
     */
    setDefault: function (e) {
        const that = this
        const id = parseInt(e.currentTarget.dataset.id)

        wx.showLoading({
            title: '正在处理...',
        })

        app.util.getUserInfo(function () {
            app.util.request({
                url: 'entry/ewei_shopv2/mobile&r=member.address.setdefault',
                method: 'POST',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    id: id
                },
                success: function (res) {
                    wx.hideLoading()
                    if (res.data.status == 1) {
                        that.getAddress()
                        return
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: res.data.result.message,
                            showCancel: false
                        })
                    }
                },
                fail: function () {
                    wx.hideLoading()
                }
            })
        })
    },

    getAddressById: function (id) {
        const that = this
        app.util.request({
            url: 'entry/ewei_shopv2/mobile&r=member.address.get_address&id=' + that.data.aid,
            method: 'GET',
            success: function (res) {
                wx.hideLoading()
                if (res.data.status == 1) {
                    var p = 0
                    for (let i = 0; i < cityData.length; i++) {
                        if (cityData[i].name == res.data.result.address.province) {
                            p = i
                        }
                    }
                    var c = 0
                    var citys = []
                    for (let i = 0; i < cityData[p].sub.length; i++) {
                        citys.push(cityData[p].sub[i].name)
                        if (cityData[p].sub[i].name == res.data.result.address.city) {
                            c = i
                        }
                    }
                    var o = 0
                    var countys = []
                    for (let i = 0; i < cityData[p].sub[c].sub.length; i++) {
                        countys.push(cityData[p].sub[c].sub[i].name)
                        if (cityData[p].sub[c].sub[i].name == res.data.result.address.area) {
                            o = i
                        }
                    }

                    var h = {
                        detail: {
                            value: [p, c, o]
                        }
                    }
                    that.cityChange(h)
                    provinceName = res.data.result.address.province
                    cityName = res.data.result.address.city
                    countyName = res.data.result.address.area
                    that.setData({
                        address: res.data.result.address,
                        cityText: res.data.result.address.province + ' ' + res.data.result.address.city + ' ' + res.data.result.address.area,
                        citys: citys,
                        countys: countys,
                        cityValue: [p, c, o]
                    })
                    return
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '获取地址失败',
                        showCancel: false,
                        success: function () {
                            wx.navigateBack()
                        }
                    })
                }
            },
            fail: function () {
                wx.hideLoading()
            }
        })
    },

    //调起选择器
    risePicker: function (e) {
        var that = this;
        var $mold = e.currentTarget.dataset.mold;
        if ($mold == 'city') {
            that.setData({
                isCity: false
            })
        }
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

    del: function (e) {
        const that = this
        const id = parseInt(e.currentTarget.dataset.id)
        if (!id) {
            return
        }
        wx.showModal({
            title: '提示',
            content: '删除后无法恢复, 确认要删除吗?',
            success: function (re) {
                if (re.confirm) {
                    wx.showLoading({
                        title: '正在处理...',
                    })

                    app.util.getUserInfo(function () {
                        app.util.request({
                            url: 'entry/ewei_shopv2/mobile&r=member.address.delete',
                            method: 'POST',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            data: {
                                id: id
                            },
                            success: function (res) {
                                wx.hideLoading()
                                if (res.data.status == 0) {
                                    wx.showModal({
                                        title: '提示',
                                        content: res.data.result.message,
                                        showCancel: false
                                    })
                                    return
                                } else {
                                    that.getAddress()
                                }
                            },
                            fail: function () {
                                wx.hideLoading()
                            }
                        })
                    })
                }
            }
        })
    }
})