// pages/commonweal/commonweal-fabu/commonweal-fabu.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    people: -1,
    msg: '',
    upload_pic: [],
    upload_max: 9, //上传图片最大数量
    video: '',
    optype: 0, //0：图片 1：视频
    address: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let tmp = [];
    for(var i=1; i<=20; i++){
      tmp.push(i);
    }
    tmp.unshift('不限');
    that.setData({
      list:tmp
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let address = app.globalData.select_address;
    if (address != null) {
      that.setData({
        address: address
      })
    }
  },

  //地址选择
  addressTap: function (evt) {
    wx.getSetting({
      success: function (res) {
        console.log(res);
        let a = res.authSetting['scope.userLocation']
        if (a = true) {
          wx.navigateTo({
            url: "/pages/position/position"
          });

        } else {
          wx.showToast({
            title: '需要授权，地理位置',
            icon: 'success',
            duration: 2000
          })
        }
      }
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