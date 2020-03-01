// pages/homepage/index.js
const app = getApp();
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
const Const = require('../../utils/const.js');
import tip from '../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur:1,
    uid:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:',options);
    this.setData({
      uid:options.uid||app.d.uid
    })
  },

  tabSelect:function(evt){
    this.setData({
      tabCur:evt.currentTarget.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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