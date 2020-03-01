// pages/finance/index.js
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
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    loading: true,
    classify: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.loadClassifyList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  loadClassifyList: function() {
    let that = this;
    http.requestUrl({
      url: 'wxapp/FinanceClass/lists',
    }).then(res => {
      that.setData({
        classify: res.data.list
      })
      that.loadList();
    })
  },

  loadList: function() {
    let that = this;
    that.setData({
      loading: true,
      bottoming: false,
      showBottomLoading: true,
    })
    let id = that.data.classify[that.data.tabCur].id;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'wxapp/FinanceIndex/getList',
      data: {
        paging: 1,
        page: that.data.page,
        count: 10,
        user_id: app.d.uid,
        class_id: id,
      }
    }).then(res => {
      console.log('----------->>>', res.data.list.length)
      let items = that.data.list;
      if (that.data.page == 1) {
        items = res.data.list;
      } else {
        items = items.concat(res.data.list)
      }
      that.setData({
        list: items,
        total: res.data.page.total,
        bottoming: true,
        showBottomLoading: false,
        loading: false,
      })
      setTimeout(function() {
        if (that.data.isLoading)
          tip.loaded();
        that.setData({
          isLoading: false
        })
      }, 200)
    })
  },



  tabSelect: function(evt) {
    let id = evt.currentTarget.dataset.id;
    let index = evt.currentTarget.dataset.index;
    let that = this;
    if (that.data.tabCur == index)
      return;
    that.setData({
      tabCur: index
    })
    that.loadList();
  },

  detailTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/finance/finance-detail/finance-detail?id=' + id,
    })
  },

  fabuTap: function() {
    wx.navigateTo({
      url: '/pages/finance/finance-fabu/finance-fabu',
    })
  },

  //预览
  previewImgTap: function(evt) {
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
    console.log('--------- 下拉刷新')
    let that = this;
    wx.showNavigationBarLoading();
    setTimeout(function () {
      that.setData({
        showBottomLoading: true,
        bottoming: false,
        page: 1,
      })
      that.loadList();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 600)
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
        that.loadList();
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})