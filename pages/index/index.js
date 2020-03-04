// pages/index/index.js
const app = getApp();
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
import tip from '../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading:true,
    swiperList: ['/images/head.png','/images/head.png']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    if (app.globalData.checkLogin) {
      console.log('------ home AAA')
      that.initHome();
    } else {
      app.checkLoginReadyCallback = () => {
        console.log('------ home  BBB')
        that.initHome();
      }
    }
  },
  initHome: function () {
    let that = this;
    wx.showTabBar()
    that.setData({
      showLoading: false
    })
  },

  toOtherTap:function(){
    console.log('-------- 跳转其他小程序')
    wx.navigateToMiniProgram({
      appId: 'wx2c314ac4404bb74f',
      path: 'pages/index/index',
      envVersion: 'trial',
      success(res) {
        // 打开成功
        console.log('------打开成功')
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