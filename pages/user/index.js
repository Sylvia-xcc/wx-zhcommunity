// pages/user/index.js
const app = getApp();
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
import tip from '../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:null,
    info:null,
    isLoading:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.setData({
      user: app.globalData.userInfo || null
    })
    console.log('----user:', app.globalData.userInfo)
    that.loadUserInfo();
    if(that.data.user)
      that.loadPersonInfo();
  },

  loadUserInfo: function () {
    let that = this;
    http.requestUrl({
      url: 'wxapp/user/userinfo',
      data: {
        uid: app.d.uid
      }
    }).then(res => {
      that.setData({
        user: res.userinfo
      })
      app.globalData.userInfo = res.userinfo;
    })
  },

  loadPersonInfo: function () {
    let that = this;
    http.requestUrl({
      url: 'common/info',
      news: true,
      data: {
        aid: app.d.uid,
      },
    }).then(res => {
      that.setData({
        info: res.data
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

  }
})