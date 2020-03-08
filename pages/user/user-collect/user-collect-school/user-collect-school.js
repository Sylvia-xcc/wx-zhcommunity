// pages/user/user-collect/user-school/user-school.js
const app = getApp();
const util = require('../../../../utils/util.js');
const http = require('../../../../utils/http.js');
import tip from '../../../../utils/tip.js';
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
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: options.uid || app.d.uid
    })
    this.loadList();
  },

  loadList: function (p = true) {
    let that = this;
    that.loadNewsList();
  },

  //新闻列表
  loadNewsList: function () {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'teacher/index',
      news: true,
      data: {
        listRows: 10,
        page: that.data.page,
        // uid: that.data.uid,
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
      })
      setTimeout(function () {
        tip.loaded();
        that.setData({
          isLoading: false
        })
      }, 400)
    })
  },

  detailNewsTap: function (evt) {
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/community/community-news-detail/community-news-detail?id=' + id,
    })
  },

  //预览
  previewImgTap: function (evt) {
    let id = evt.currentTarget.dataset.id;
    let dataimg = evt.currentTarget.dataset.dataimg;
    wx.previewImage({
      current: dataimg[id],
      urls: dataimg
    });
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
        that.loadList(false);
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})