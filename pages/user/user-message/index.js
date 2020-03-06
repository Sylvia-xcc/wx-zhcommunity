// pages/user/user-message/index.js
const app = getApp()
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
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadList();
  },

  loadList: function() {
    let that = this;
    if (that.data.tabCur == 2)
      that.loadPaperList();
    else 
      that.loadCommentList();
  },

  loadCommentList: function() {
    let that = this;
    if(that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'comments/getList',
      news: true,
      data: {
        uid: app.d.uid,
        listRows: 10,
        page: that.data.page,
        type: that.data.tabCur+1,
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
      }, 600)
    })
  },

  loadPaperList: function() {
    let that = this;
    http.requestUrl({
      url: 'paper/index',
      news: true,
      data: {
        uid: app.d.uid,
        listRows: 10,
        page: that.data.page,
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
        loading:false,
      })
    })
  },

  tabSelect: function(evt) {
    let that = this;
    let index = evt.currentTarget.dataset.index;
    if (that.data.tabCur == index)
      return;
    that.setData({
      tabCur: index,
      page:1,
      list:[],
      loading: true, 
      bottoming: false,
      showBottomLoading: true,
    })
    setTimeout(function(){
      that.loadList();
    },400);    
  },

  detailTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    let model = evt.currentTarget.dataset.model;
    util.detailTap(model,id);
    // let url = '';
    // if (model == 'used')
    //   url = '/pages/secondhand/secondhand-detail/secondhand-detail?id=';
    // else if(model == 'chat')
    //   url = '/pages/community/community-chat-detail/community-chat-detail?id=';

    // if (url == '')
    //   return;
    // wx.navigateTo({
    //   url: url + id,
    // })
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
        that.loadList(false);
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})