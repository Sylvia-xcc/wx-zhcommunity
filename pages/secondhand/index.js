// pages/secondhand/index.js
const app = getApp();
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
import tip from '../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading:true,
    isCard:true,
    categoryList:[],
    slide:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCategoryList();
    this.loadList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.loadCategoryList();
    // this.loadList();
  },

  loadCategoryList:function(){
    let that = this;
    http.requestUrl({
      url: 'used/category',
      news: true,
    }).then(res => {
      that.setData({
        categoryList:res.data
      })
    })
  },

  loadList:function(){
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'used/index',
      news: true,
      data:{
        listRows: 10,
        page: that.data.page
      }
    }).then(res => {
      let items = that.data.list;
      if (that.data.page == 1) {
        items = res.data.list.data
      } else {
        items = items.concat(res.data.list.data)
      }
      that.setData({
        list: items,
        total: res.data.list.total,
        bottoming: true,
        showBottomLoading: false,
      })
      setTimeout(function () {
        if (that.data.isLoading)
          tip.loaded();
        that.setData({
          isLoading: false
        })
      }, 200)
    })
  },

  classityTap:function(evt){
    let id = evt.currentTarget.dataset.id;
    let name = evt.currentTarget.dataset.name;
    wx.navigateTo({
      url: '/pages/secondhand/secondhand-list/secondhand-list?id='+id+'&name='+name,
    })
  },

  detailTap:function(evt){
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/secondhand/secondhand-detail/secondhand-detail?id='+id,
    })
  },

  fabuTap: function (evt) {
    wx.navigateTo({
      url: '/pages/secondhand/secondhand-fabu/secondhand-fabu',
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
    console.log('--------- 下拉刷新')
    let that = this;
    wx.showNavigationBarLoading();
    setTimeout(function () {
      that.setData({
        showBottomLoading: true,
        bottoming: false,
        page: 1,
      })
      that.onLoad();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 600)
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
        that.loadList();
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})