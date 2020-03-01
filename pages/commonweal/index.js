// pages/commonweal/index.js
const app = getApp();
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
const dateTimePicker = require('../../utils/dateTimePicker.js');
import tip from '../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    modalName: null,
    address: null,
    upload_pic: [],
    upload_max: 9, //上传图片最大数量
    video: '',
    optype: 0, //0：图片 1：视频
    people: -1,
    peoples: [],
    dateStartTimeArray: null,
    dateEndTimeArray: null,
    startTime: null,
    endTime: null,
    startBool: false,
    endBool: false,
    msg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let tmp = [];
    for (var i = 1; i <= 20; i++) {
      tmp.push(i + ' 人');
    }
    that.setData({
      peoples: tmp
    });

    let obj = dateTimePicker.dateTimePicker(2020, 2060);
    // 精确到分的处理，将数组的秒去掉
    let lastArray = obj.dateTimeArray.pop();
    let lastTime = obj.dateTime.pop();
    that.setData({
      startTime: obj.dateTime,
      endTime: obj.dateTime,
      dateStartTimeArray: obj.dateTimeArray,
      dateEndTimeArray: obj.dateTimeArray,
    });

    that.loadList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    let address = app.globalData.select_address;
    if (address != null) {
      that.setData({
        address: address
      })
    }
  },

  loadList: function() {
    let that = this;
    if(that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'activities/index',
      news: true,
      data: {
        page: that.data.page,
        count: 10,
        uid: app.d.uid,
      }
    }).then(res => {
      let items = that.data.list;
      if (that.data.page == 1) {
        items = res.data.data
      } else {
        items = items.concat(res.data.data)
      }
      that.setData({
        list: items,
        total: res.data.total,
        bottoming: true,
        showBottomLoading: false,
        loading: false,
      })
      setTimeout(function(){
        tip.loaded();
        that.setData({
          isLoading:false,
        })
      },400)
    })
  },

  fabuTap: function(evt) {
    let that = this;
    if (that.data.startBool == false) {
      tip.error('请选择开始时间', 1000);
      return;
    }
    if (that.data.endBool == false) {
      tip.error('请选择结束时间', 1000);
      return;
    }
    if (that.data.address == null) {
      tip.error('请选择地址', 1000);
      return;
    }
    if (that.data.people < 0) {
      tip.error('请选择人数', 1000);
      return;
    }
    if (that.data.msg == '') {
      tip.error('请输入活动内容', 1000);
      return;
    }
    let start = that.data.dateStartTimeArray[0][that.data.startTime[0]] + '-' + that.data.dateStartTimeArray[1][that.data.startTime[1]] + '-' + that.data.dateStartTimeArray[2][that.data.startTime[2]] + ' ' + that.data.dateStartTimeArray[3][that.data.startTime[3]] + ':' + that.data.dateStartTimeArray[4][that.data.startTime[4]] + ':00';
    let end = that.data.dateEndTimeArray[0][that.data.endTime[0]] + '-' + that.data.dateEndTimeArray[1][that.data.endTime[1]] + '-' + that.data.dateEndTimeArray[2][that.data.endTime[2]] + ' ' + that.data.dateEndTimeArray[3][that.data.endTime[3]] + ':' + that.data.dateEndTimeArray[4][that.data.endTime[4]] + ':00';

    console.log('----------- 开始时间：', that.data.startTime, start, util.formatTime5(start))
    console.log('----------- 结束时间：', that.data.endTime, end, util.formatTime5(end))
    console.log('----------- 地址：', that.data.address.address)
    console.log('----------- 人数：', that.data.peoples[that.data.people])
    console.log('----------- 内容：', that.data.msg)
    // return;

    let {
      upload_pic
    } = that.data;
    let temp = [];
    let files = [];
    tip.loading('发布中...');
    for (var i = 0; i < upload_pic.length; i++) {
      temp.push(
        http.uploadFile({
          tempFilePaths: upload_pic[i]
        }).then(res => {
          if (typeof res == 'string') {
            res = JSON.parse(res);
          }
          console.log('上传完路径', res)
          if (res.code == 1)
            files.push(res.data.url);
        })
      );
    }

    Promise.all(temp).then(res => {
      console.log('-------上传完成', files, that.data.optype)
      let content = JSON.stringify(files);
      http.requestUrl({
        url: 'activities/add',
        news: true,
        method: 'post',
        data: {
          people_num: that.data.peoples[that.data.people],
          address: that.data.address.address,
          deadline: util.formatTime5(end),
          date: util.formatTime5(start),
          user_id: app.d.uid,
          content: that.data.msg,
          img_list: content,
        }
      }).then(res => {
        tip.loaded();
        tip.success('发布成功', 1000);
        that.hideModal();
      })
    })

  },

  msgInput: function(evt) {
    this.setData({
      msg: evt.detail.value,
    })
  },


  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  changeStartDateTime(e) {
    this.setData({
      startTime: e.detail.value,
      startBool: true,
    });
  },

  changeEndDateTime(e) {
    this.setData({
      endTime: e.detail.value,
      endBool: true,
    });
  },

  changeStartDateTimeColumn(e) {
    var arr = this.data.startTime,
      dateArr = this.data.dateStartTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateStartTimeArray: dateArr,
      startTime: arr
    });
  },

  changeStartDateTimeColumn(e) {
    var arr = this.data.endTime,
      dateArr = this.data.dateEndTimeArray;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateEndTimeArray: dateArr,
      endTime: arr
    });
  },

  peopleChange: function(evt) {
    console.log('-----------', evt.detail)
    this.setData({
      people: evt.detail.value
    })
  },

  //地址选择
  addressTap: function (evt) {
    console.log('==============')
    wx.getSetting({
      success: function (res) {
        console.log(res);
        let a = res.authSetting['scope.userLocation']
        if (a == true || a == undefined) {
          wx.navigateTo({
            url: "/pages/position/position"
          });
        } else {
          wx.showModal({
            content: '检测到您没打开地址权限，是否去设置打开？',
            confirmText: "确认",
            cancelText: "取消",
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => { } //打开设置面板
                })
              } else {
                console.log('用户点击取消')
              }
            }
          });
        }
      }
    })
  },

  //选择图片
  chooseImage() {
    let that = this;
    let len = that.data.upload_max - that.data.upload_pic.length;
    len = len <= 0 ? 0 : len;
    wx.chooseImage({
      count: len, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.upload_pic.length != 0) {
          this.setData({
            upload_pic: this.data.upload_pic.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            upload_pic: res.tempFilePaths
          })
        }
      }
    });
  },
  //选择视频
  chooseVideo() {
    wx.chooseVideo({
      success: (res) => {
        console.log(res.tempFilePath)
        this.setData({
          video: res.tempFilePath,
          optype: 1,
          upload_pic: [res.tempFilePath]
        })
      }
    })
  },

  //预览图片
  previewImg(e) {
    wx.previewImage({
      urls: this.data.upload_pic,
      current: e.currentTarget.dataset.url
    });
  },
  //删除图片
  delTap(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          let that = this;
          that.data.upload_pic.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            upload_pic: that.data.upload_pic,
            video: '',
            optype: 0,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    app.globalData.select_address = null;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('--------- 下拉刷新')
    let that = this;
    wx.showNavigationBarLoading();
    setTimeout(function () {
      that.setData({
        showBottomLoading: true,
        bottoming: false,
        page: 1,
      })
      that.loadList();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 600)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    if (that.data.list.length < that.data.total && that.data.bottoming) { //有更多时加载
      that.setData({
        showBottomLoading: true,
        bottoming: false,
      })
      setTimeout(function () {
        that.setData({
          page: that.data.page + 1,
        })
        that.loadList();
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})