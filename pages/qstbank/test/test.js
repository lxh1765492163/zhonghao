// pages/test/test.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    option: {},
    count: [], //题目id
    count_false: [], //错题id
    rightnum: 0 //对题数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    const that = this;

    /**错题记录 */
    if (options.data) {
      let data = [];
      data.push(JSON.parse(options.data));
      // console.log(data)
      that.setData({
        test: data,
        id: data[0].id,
        title: data[0].title,
        type: data[0].type,
        mode: 0,
        chapter_id: data[0].chapter_id,
      })
    }
    /**练习模式 考試模式 */
    if (options.info) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
      let info = JSON.parse(options.info);
      // console.log(info);
      app.util.request({
        url: 'entry&m=ewei_shopv2&do=mobile&r=question.answer',
        data: {
          chapter_id: info.chapter_id,
          type: info.types.join(','),
          psize: info.pagesize,
        },
        success: function(res) {
          // console.log(res.data)
          wx.hideLoading();
          that.setData({
            test: res.data,
            id: res.data[0].id,
            title: res.data[0].title,
            type: res.data[0].type,
            mode: info.mode,
            chapter_id: info.chapter_id,
          })
        }
      })

      if (info.time != '' && info.time != '0') {
        let time = parseInt(info.time) * 1000 * 60;
        // console.log(time)
        let timer = setTimeout(function() {
          wx.showModal({
            title: '时间到',
            content: '测试完成',
            showCancel: false,
            success: function(res) {
              if (info.mode == 1) {
                that.handover();
              }
            }
          })
          clearTimeout(timer);
        }, time);
        that.setData({
          timer: timer,
        })
      }
    }


    /**获取系统信息 */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowHeigh: res.windowHeight - 50,
          windowWidth: res.windowWidth,
        })
      },
    })
  },


  /**
   *    确认提交 
   */
  // onclick: function(e) {
  //   this.submit();
  // },

  submit: function() {
    const that = this;
    let index = this.data.index;
    let test = this.data.test;
    // console.log(test)
    let option = this.data.option;
    test[index].disabled = 'false';
    test[index].sel = option.checkbox || option.content || option.answer || [];
    wx.showLoading({
      title: '',
      mask: true,
    })
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=question.answer.submit',
      data: {
        option: option,
        chapter_id: that.data.chapter_id,
        answer_id: option.id
      },
      success: function(res) {
        wx.hideLoading();
        // console.log(res.data);
        if (res.data.type && res.data.type == 5) {
          //配伍题
          for (let i = 0; i < res.data.answer.length; i++) {
            if (res.data.answer[i].status == 2) {
              test[index].info.parsing[i].isright = true;
            }
            if (res.data.answer[i].status == 1) {
              test[index].info.parsing[i].isright = false;
            }
          }
          // console.log(test);
        } else {
          //普通题 （单选，多选，判断，问答）
          if (res.data.status == 2) {
            test[index].isright = true;
          }
          if (res.data.status == 1) {
            test[index].isright = false;
          }
        }
        that.setData({
          test: test,
        })
        if (that.data.mode == 1) {
          let id = option.id; //当前题目id
          let count = that.data.count; //题目id集
          let count_false = that.data.count_false; //错题id集
          let rightnum = that.data.rightnum; //对题数
          count.push(id);

          if (res.data.type && res.data.type == 5) {
            //配伍题对错
            if (res.data.vote == 1) {
              count_false.push(id);
            }
            for (let i = 0; i < res.data.answer.length; i++) {
              if (res.data.answer[i].status == 2) {
                rightnum += 1;
              }
            }
          } else {
            //普通题对错
            if (res.data.status == 1) {
              count_false.push(id);
            }
            if (res.data.status == 2) {
              rightnum += 1;
            }
          }
          // console.log(rightnum);
          // console.log(count);
          // console.log(count_false);
          // console.log(score);
          that.setData({
            test: test,
            count: count,
            rightnum: rightnum,
            count_false: count_false,
            option: {},
          })
        }
      }
    })
  },

  /**
   * 交卷
   */
  handover: function(e) {
    const that = this;
    let rightnum = this.data.rightnum; //对题数 
    let total = that.data.test.length; //总大题数
    for (let i = 0; i < that.data.test.length; i++) {
      if (that.data.test[i].type == 5) {
        let length = that.data.test[i].info.title.length //配伍题小题数
        total = total + that.data.test[i].info.title.length - 1; //总题数
      }
    }
    let score = rightnum / total * 100;
    // console.log(rightnum);
    // console.log(total);
    // console.log(score);
    app.util.request({
      url: 'entry&m=ewei_shopv2&do=mobile&r=question.answer.submit_paper_count',
      data: {
        count: this.data.count.join(','), //题目id集
        chapter_id: this.data.chapter_id, //章节id
        total: this.data.test.length, //总题数
        count_false: this.data.count_false.join(','), //错题id集
        score: score.toFixed(1), //当前分数
      },
      success: function(res) {
        // console.log(res);
        clearTimeout(that.data.timer)//停止自动交卷
        if (res.data.status == 1) {
          wx.showModal({
            title: '交卷成功',
            content: '恭喜您本次考试得分：' + score.toFixed(1) + '分',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                that.setData({
                  handover: true,
                  index: 0,
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   *    多选题 
   */
  checkboxChange: function(e) {
    let index = this.data.index
    let answer = this.data.test[index].info.checkbox;
    let idx = e.detail.value;
    // console.log(e.detail.value)
    let checkbox = [];
    for (let i = 0; i < answer.length; i++) {
      checkbox.push([answer[i][0], answer[i][1], 0])
    }
    for (let i = 0; i < idx.length; i++) {
      let j = idx[i]
      checkbox[j][2] = 1;
    }
    // console.log(checkbox)
    let id = this.data.id;
    let title = this.data.title;
    let type = this.data.type;
    let option = {
      id,
      title,
      checkbox,
      type
    }
    this.setData({
      option: option,
    })
  },

  /**
   *    单选题 判断题
   */
  radioChange: function(e) {
    let index = this.data.index
    let answer = this.data.test[index].info.checkbox;
    let checkbox = [];
    for (let i = 0; i < answer.length; i++) {
      checkbox.push([answer[i][0], answer[i][1], 0])
    }
    let idx = e.detail.value;
    // console.log(e.detail.value)
    for (let i = 0; i < checkbox.length; i++) {
      checkbox[i][2] = 0;
    }
    checkbox[idx][2] = 1;
    // console.log(checkbox)
    let id = this.data.id;
    let title = this.data.title;
    let type = this.data.type;
    let option = {
      id,
      title,
      checkbox,
      type
    }
    // console.log(this.data.test[index].answer)
    this.setData({
      option: option,
    })
    this.submit();
  },

  /**
   *    问答题
   */
  intext: function(e) {
    let content = e.detail.value
    // console.log(content);
    let id = this.data.id;
    let title = this.data.title;
    let type = this.data.type;
    let option = {
      id,
      title,
      content,
      type
    }
    this.setData({
      option: option,
    })
  },

  /**
   *    配伍题
   */
  change: function(e) {
    let index = this.data.index;
    let id = this.data.id;
    let cid = e.currentTarget.dataset.index;
    let type = this.data.type;
    let answer = this.data.answer ? this.data.answer : [];
    let idx = [];
    //多选
    if (typeof(e.detail.value) == 'object') {
      for (let i = 0; i < e.detail.value.length; i++) {
        idx[e.detail.value[i]] = (parseInt(e.detail.value[i]) + 1);
      }
    }
    //单选
    if (typeof(e.detail.value) == 'string') {
      idx.push(parseInt(e.detail.value) + 1);
    }
    answer[cid] = idx;
    let option = {
      id: id,
      answer: answer,
      type: type,
    }
    console.log(option);
    this.setData({
      option: option,
      answer: answer,
    })
  },

  /**
   *    切换试题
   */

  bindchange: function(e) {
    // console.log(e.detail.current)
    let idx = this.data.index;
    let index = e.detail.current;
    let options = wx.getStorageSync('options') ? wx.getStorageSync('options') : [];
    // console.log(options);
    let option = options[index] ? options[index] : {};
    options[idx] = this.data.option;
    // console.log(option);
    wx.setStorageSync('options', options);
    let test = this.data.test;
    if (index < test.length) {
      let id = test[index].id;
      let title = test[index].title;
      let type = test[index].type;
      this.setData({
        index: index,
        id: id,
        title: title,
        type: type,
        option: option,
      })
    }
  },

  /**
   * 预览图片
   */

  preview: function(e) {
    console.log(e);
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.removeStorageSync('options');
    clearTimeout(this.data.timer);//停止自动交卷
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})