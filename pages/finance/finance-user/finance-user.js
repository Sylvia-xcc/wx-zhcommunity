// pages/finance/finance-user/finance-user.js
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
    isLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!util.hasAuthorize())
      return;
    this.setData({
      page:1,
      bottoming: true,
      showBottomLoading: false,
    })
    this.loadList();
  },

  loadList:function(){
    let that = this;
    if(that.data.tabCur==0)
      that.loadCollectList();
    else 
      that.loadOwnList();
  },

  loadCollectList:function(){
    let that = this;
    if(that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'wxapp/FinanceIndex/collectList',
      data:{
        paging:1,
        page:that.data.page,
        count:10,
        user_id:app.d.uid,
      }
    }).then(res => {
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
      })
      setTimeout(function () {
        if (that.data.isLoading)
          tip.loaded();
        that.setData({
          isLoading: false
        })
      }, 400)
    })
  },

  loadOwnList: function () {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'wxapp/FinanceIndex/getList',
      data: {
        paging: 1,
        page: that.data.page,
        count: 10,
        user_id: app.d.uid,
        is_own:1,
      }
    }).then(res => {
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
      })
      setTimeout(function () {
        if (that.data.isLoading)
          tip.loaded();
        that.setData({
          isLoading: false
        })
      }, 400)
    })
  },

  tabSelect: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    if (that.data.tabCur == id)
      return;
    that.setData({
      tabCur: id,
      page:1,
      bottoming: false,
      showBottomLoading: true,
    })
    that.loadList();
  },

  detailTap: function (evt) {
    let id = evt.currentTarget.dataset.id;
    let that = this;
    if(that.data.tabCur==0){
      wx.navigateTo({
        url: '/pages/finance/finance-detail/finance-detail?id=' + id,
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/finance/finance-fabu/finance-fabu?id='+id,
      })
    }    
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