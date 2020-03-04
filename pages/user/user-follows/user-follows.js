// pages/user/user-follows/user-follows.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: 0,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:', options);
    let that = this;
    that.setData({
      uid: options.uid || app.d.uid,
    })
    that.loadFollowsList();
  },

  loadFollowsList: function () {
    let that = this;
    tip.loading();
    http.requestUrl({
      url: 'account/followList',
      news: true,
      data: {
        uid: that.data.uid || app.d.uid
      }
    }).then(res => {
      let items = that.data.list;
      if (that.data.page == 10) {
        items = res.data.data
      } else {
        items = items.concat(res.data.data)
      }
      that.setData({
        list: items,
        total: res.data.total,
        bottoming: true,
        showBottomLoading: false,
      })
      setTimeout(function () {
        tip.loaded();
        that.setData({
          isLoading: false,
        })
      }, 400)
    })
  },

  guanzhuTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    let that = this;
    let id = evt.currentTarget.dataset.id;
    http.requestUrl({
      url: 'account/removeFollow',
      news: true,
      data: {
        id: id,
        uid: app.d.uid
      },
      method: 'post',
    }).then(res => {
      tip.success('取消关注成功', 1000);
      let items = that.data.list;
      let tmp = [];
      for(var i=0; i<items.length; i++){
        if(items[i].fans!=id)
          tmp.push(items[i]);
      }
      that.setData({
        list:tmp
      })
    })
  },

  personalTap: function (evt) {
    let uid = evt.currentTarget.dataset.uid;
    util.personal(uid);
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
        that.loadFollowsList(false);
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})