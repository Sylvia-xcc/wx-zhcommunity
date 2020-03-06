// pages/community/community-jifen-index/community-jifen-index.js
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    jifenCur: 0,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    loading: true,
    info:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadJifenList();
    this.loadUserInfo();
    this.loadBanner();
  },

  loadUserInfo: function () {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'account/info',
      data: {
        uid: app.d.uid
      },
      news: true,
    }).then(res => {
      that.setData({
        info: res.data
      })
      setTimeout(function(){
        tip.loaded();
        that.setData({
          isLoading:false,
        })
      },600)
    })
  },

  loadBanner: function () {
    let that = this;
    http.requestUrl({
      url: 'banner/index',
      news: true,
      data: {
        type: 'score_shop'
      },
    }).then(res => {
      that.setData({
        banner: res.data,
      })
    })
  },

  loadJifenList: function () {
    let that = this;
    let url = that.data.jifenCur == 0 ? 'source/today' : that.data.jifenCur == 1 ? 'source/signTop10' : 'source/index';
    http.requestUrl({
      url: url,
      news: true,
    }).then(res => {
      that.setData({
        list: res.data
      })
    })
  },

  swiperTap: function (evt) {
    let mid = evt.currentTarget.dataset.mid;
    let model = evt.currentTarget.dataset.model;
    util.detailTap(model, mid);
  },

  tabJFSelect: function (evt) {
    let id = evt.currentTarget.dataset.id;
    let that = this;
    if (that.data.jifenCur == id)
      return;
    that.setData({
      jifenCur: id
    })
    that.loadJifenList();
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