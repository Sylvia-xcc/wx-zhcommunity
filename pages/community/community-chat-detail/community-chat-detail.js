// pages/community/community-chat-detail/community-chat-detail.js
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    detail: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    let that = this;
    that.setData({
      id: options.id || 0,
    })
    that.loadChatDetail();
    that.loadCommentList();
  },

  //详情
  loadChatDetail: function() {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'chat/detail',
      news: true,
      data: {
        id: that.data.id,
        // uid: app.d.uid,
      }
    }).then(res => {
      that.setData({
        detail: res.data
      })
      setTimeout(function() {
        tip.loaded();
        that.setData({
          isLoading: false,
        })
      }, 600)
    })
  },

  loadCommentList: function(add = false) {
    let that = this;
    http.requestUrl({
      url: 'chat/commentList',
      news: true,
      data: {
        id: that.data.id,
        page: that.data.page,
        count: 10,
        uid: app.d.uid,
      }
    }).then(res => {
      let items = that.data.list;
      if (add) {
        let end = (that.data.page - 1) * 10;
        items = items.slice(0, end);
      }
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
    })
  },

  loadCommentDetail: function(id) {
    let that = this;
    http.requestUrl({
      url: 'chat/commentDetail',
      news: true,
      data: {
        id: id,
        uid: app.d.uid,
      }
    }).then(res => {
      let items = that.data.list;
      for (var i = 0; i < items.length; i++) {
        if (items[i].id == res.data.id)
          items[i] = res.data
      }
      that.setData({
        list: items,
      })
    })
  },

  //收藏
  collectTap: function() {
    if (!util.hasAuthorize())
      return;
    let that = this;
    let url = that.data.detail.is_collect > 0 ? 'fav/remove' : 'fav/add';
    let data = that.data.detail.is_collect > 0 ? {
      id: that.data.detail.is_collect,
      uid: app.d.uid
    } : {
      uid: app.d.uid,
      model: 'news',
      mid: that.data.detail.id,
    }
    http.requestUrl({
      url: url,
      news: true,
      data: data,
      method: 'post',
    }).then(res => {
      let msg = that.data.detail.is_collect > 0 ? '取消收藏成功' : '收藏成功';
      tip.success(msg, 1000);
      that.loadChatDetail();
    })
  },

  likeMessageTap: function(evt) {
    console.log('--------- 留言点赞', evt.currentTarget.dataset)
    if (!util.hasAuthorize())
      return;
    let that = this;
    let id = evt.currentTarget.dataset.id;
    let like = evt.currentTarget.dataset.like;
    let model = evt.currentTarget.dataset.model || '';
    let url = like > 0 ? 'used/removelike' : 'used/addCommentLike';
    let data = like > 0 ? {
      uid: app.d.uid,
      id: like
    } : {
      uid: app.d.uid,
      mid: id,
    }
    data.model = model;
    http.requestUrl({
      url: url,
      news: true,
      data: data,
      method: 'post',
    }).then(res => {
      let msg = like > 0 ? '取消点赞成功' : '点赞成功';
      tip.success(msg, 1000);
      if (model == 'chat_like')
        that.loadChatDetail();
      else
        that.loadCommentDetail(id);
    })
  },

  messageTap: function(evt) {
    if (!util.hasAuthorize())
      return;
    let id = evt.currentTarget.dataset.id;
    console.log('------------ 评论id', id)
    this.selectComponent('#my-textarea').toggleModal(id);
  },

  OnSubmit: function(evt) {
    console.log(evt)
    let content = evt.detail.value;
    let id = evt.detail.id
    let that = this;
    http.requestUrl({
      url: 'chat/addComment',
      news: true,
      data: {
        uid: app.d.uid,
        id: that.data.id,
        content: content
      },
      method: 'post',
    }).then(res => {
      tip.success('评论成功');
      that.loadCommentList(true);
    })
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
        that.loadCommentList();
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})