// pages/house/house-buy/index.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
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
    isLoading:true,
    loading:true,
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
    that.loadList();
  },

  loadList: function(loading=false) {
    if (this.data.tabCur == 0) {
      this.loadBuyList(loading);
    } else {
      this.loadHireList(loading);
    }
  },

  loadBuyList: function(loading=false) {
    let that = this; 
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'house/askBuyList',
      news: true,
      data:{
        listRows: 10,
        page: that.data.page
      },
      loading:loading,
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
        loading:false,
      })
      setTimeout(function () {
        tip.loaded();
        that.setData({
          isLoading: false,
        })
      }, 200)
    })
  },

  loadHireList: function() {
    let that = this;
    if(that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'house/askHireList',
      news: true,
      data: {
        listRows: 10,
        page: that.data.page
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
        loading: false,
      })
      setTimeout(function(){
        tip.loaded();
        that.setData({
          isLoading:false,
        })
      },200)
      console.log('----------', that.data.list.length, that.data.total)
    })
  },

  //类型选择
  tabSelect: function(evt) {
    let index = evt.currentTarget.dataset.id;
    let that = this;
    if(that.data.tabCur==index)
      return;
    that.setData({
      tabCur: index,
      page:1,
      bottoming:false,
      showBottomLoading:true,
      loading: true,
    })
    that.loadList(true);
  },

  //发布
  fabuTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    wx.navigateTo({
      url: '/pages/house/house-buy/house-buy-fabu/house-buy-fabu?type=' + this.data.tabCur,
    })
  },

  searchTap:function(evt){
    wx.navigateTo({
      url: '/pages/house/house-buy/house-buy-search/house-buy-search?tab=' + this.data.tabCur,
    })
  },

  telTap: function(evt) {
    let number = evt.currentTarget.dataset.number;
    console.log('---------', number)
    wx.makePhoneCall({
      phoneNumber: number,
    })
  },

  personalTap: function (evt) {
    let uid = evt.currentTarget.dataset.uid;
    util.personal(uid);
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
  onShareAppMessage: function() {

  }
})