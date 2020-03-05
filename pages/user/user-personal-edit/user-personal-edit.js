// pages/user/user-personal-edit/user-personal-edit.js
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    job: '',
    birthday: '',
    address: [],
    sex: [{
      id: 1,
      name: '男'
    }, {
      id: 2,
      name: '女'
    }],
    sexIndex: -1,
    avatar: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadPersonalInfo();
  },

  loadPersonalInfo: function() {
    let that = this;
    http.requestUrl({
      url: 'account/info',
      news: true,
      data: {
        uid: app.d.uid,
      },
    }).then(res => {
      let sex = res.data.sex - 1;
      let address = []
      if (res.data.province != '')
        address = [res.data.province, res.data.city, res.data.area];
      let birthday = res.data.birthday;
      birthday = (birthday == '0000-00-00') ? '' : birthday;
      that.setData({
        avatar: res.data.avatar,
        birthday: birthday,
        job: res.data.job,
        nickname: res.data.nickname,
        sexIndex: sex,
        address: address,
      })
    })
  },

  submitTap: function() {
    let that = this;
    console.log('------------- 昵称：', that.data.nickname);
    console.log('------------- 性别：', that.data.sex[that.data.sexIndex].name);
    console.log('------------- 生日：', that.data.birthday);
    console.log('------------- 常驻：', that.data.address);
    console.log('------------- 行业：', that.data.job);


    http.uploadFile({
      tempFilePaths: that.data.avatar,
    }).then(res => {
      if (typeof res == 'string') {
        res = JSON.parse(res);
      }
      console.log('上传完路径', res)
      if (res.code == 1) {
        http.requestUrl({
          url: 'account/info',
          news: true,
          method: 'post',
          data: {
            uid: app.d.uid,
            avatar: res.data.url,
            nickname: that.data.nickname,
            sex: that.data.sexIndex + 1,
            birthday: that.data.birthday,
            job: that.data.job,
            province: that.data.address[0],
            city: that.data.address[1],
            area: that.data.address[2],
          },
        }).then(res => {
          tip.success('修改成功', 1000);
        })
      }
    })
  },

  sexChange: function(evt) {
    this.setData({
      sexIndex: evt.detail.value
    })
  },
  birthdayChange: function(evt) {
    this.setData({
      birthday: evt.detail.value
    })
  },
  addressChange: function(evt) {
    this.setData({
      address: evt.detail.value
    })
  },

  nameInput: function(evt) {
    this.setData({
      nickname: evt.detail.value
    })
  },

  jobInput: function(evt) {
    this.setData({
      job: evt.detail.value
    })
  },

  //选择图片
  chooseImage() {
    let that = this;
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res)
        this.setData({
          avatar: res.tempFilePaths[0]
        })
      }
    });
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