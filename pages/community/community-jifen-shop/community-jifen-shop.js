// pages/community/community-jifen-shop/community-jifen-shop.js
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
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
    isLoading: true,
    jifen:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadProductList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadUserInfo();
  },

  loadUserInfo:function(){
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'account/info',
      data: {
        uid:app.d.uid
      },
      news:true,
    }).then(res => {
      that.setData({
        jifen:res.data.jifen
      })
      app.globalData.userInfo = res.data;
    })
  },

  loadProductList: function() {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'wxapp/product/scoreList',
      data: {
        page: that.data.page,
        count: 10,
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
        total: res.data.pageInfo.total,
        bottoming: true,
        showBottomLoading: false,
        loading: false,
      })
      setTimeout(function() {
        tip.loaded();
        that.setData({
          isLoading: false,
        })
      }, 600)
    })
  },

  detailTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/community/community-jifen-shop-detail/community-jifen-shop-detail?id=' + id,
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})