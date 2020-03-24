// pages/video/index.js
const app = getApp();
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
import tip from '../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    classify: [],
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
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadVideoTab();
  },
  //
  loadVideoTab: function () {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'wxapp/ServiceNewsVideoClass/lists',
      data: {
        page: that.data.page,
        count: 10,
      }
    }).then(res => {
      that.setData({
        classify:res.data.list
      })
      that.loadVideoList();
    })
  },


  //视频列表
  loadVideoList: function() {
    let that = this;
    let id = that.data.classify[that.data.tabCur].id;
    http.requestUrl({
      url: 'wxapp/service/getNewsList',
      data: {
        page: that.data.page,
        count: 10,
        type: 2,
        video_class_id:id
      }
    }).then(res => {
      let items = that.data.list;
      if (that.data.page == 1) {
        items = res.data.list
      } else {
        items = items.concat(res.data.list)
      }
      that.setData({
        list: items,
        total: res.data.total,
        bottoming: true,
        showBottomLoading: false,
        loading: false,
      })
      setTimeout(function() {
        tip.loaded();
        that.setData({
          isLoading: false,
        })
      }, 400)
    })
  },

  tabSelect: function(evt) {
    let index = evt.currentTarget.dataset.index;
    let that = this;
    if (that.data.tabCur == index)
      return;
    that.setData({
      tabCur: index,
      page:1,
      list:[],
      bottoming: false,
      showBottomLoading: true,
      loading: true,
    })
    setTimeout(function(){
      that.loadVideoList();
    },400)
    
  },

  detailTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/community/community-news-detail/community-news-detail?id=' + id,
    })
    // wx.navigateTo({
    //   url: '/pages/video/video-detail/video-detail?id=' + id,
    // })
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
    let that = this;
    if (that.data.list.length < that.data.total && that.data.bottoming) { //有更多时加载
      that.setData({
        showBottomLoading: true,
        bottoming: false,
      })
      setTimeout(function() {
        that.setData({
          page: that.data.page + 1,
        })
        that.loadVideoList(false);
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})