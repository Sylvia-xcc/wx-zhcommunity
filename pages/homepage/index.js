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
    tabCur: 1,
    uid: 0,
    user: null,
    isLoading: true,
    isOwn: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    let that = this;
    that.setData({
      uid: options.uid || app.d.uid
    })
    let isOwn = (app.d.uid == undefined ||that.data.uid == app.d.uid) ? true : false;
    that.setData({
      isOwn:isOwn
    })
      that.loadPersonInfo();
  },

  loadPersonInfo: function() {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'common/info',
      news: true,
      data: {
        aid: that.data.uid,
        uid: app.d.uid
      },
    }).then(res => {
      that.setData({
        user: res.data
      })
      setTimeout(function() {
        tip.loaded();
        that.setData({
          isLoading: false,
        })
      }, 400)
    })
  },

  guanzhuTap: function(evt) {
    if (!util.hasAuthorize())
      return;
    let that = this;
    let url = that.data.user.isfollow == 0 ? 'account/addFollow' : 'account/removeFollow';
    http.requestUrl({
      url: url,
      news: true,
      data: {
        id: that.data.uid,
        uid: app.d.uid
      },
      method: 'post',
    }).then(res => {
      let msg = that.data.user.isfollow == 0 ? '关注成功' : '取消关注成功';
      tip.success(msg, 1000);
      that.loadPersonInfo();
    })
  },

  tabSelect: function(evt) {
    this.setData({
      tabCur: evt.currentTarget.dataset.id
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