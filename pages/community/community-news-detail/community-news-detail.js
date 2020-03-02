// pages/community/community-news-detail/community-news-detail.js
const app = getApp()
const WxParse = require('../../../wxParse/wxParse.js');
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
    that.loadNewsDetail();
    that.loadCommentList();
  },

  //详情
  loadNewsDetail: function() {
    let that = this;
    http.requestUrl({
      url: 'wxapp/service/newsDetails',
      data: {
        id: that.data.id,
        user_id:app.d.uid,
      }
    }).then(res => {
      let content = res.data.content;
      WxParse.wxParse('content', 'html', content, that, 0);
      that.setData({
        detail: res.data
      })
    })
  },

  loadCommentList: function() {
    let that = this;
    http.requestUrl({
      url: 'wxapp/service/newsDisList',
      data: {
        id: that.data.id,
        page: that.data.page,
        count: 10,
        user_id:app.d.uid,
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
      })
    })
  },

  //收藏
  collectTap: function () {
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
      method:'post',
    }).then(res => {
      let msg = that.data.detail.is_collect > 0 ? '取消收藏成功' : '收藏成功';
      tip.success(msg, 1000);
      that.loadNewsDetail();
    })
  },

  likeMessageTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    console.log(evt)
    let mid = evt.currentTarget.dataset.id;
    let pid = evt.currentTarget.dataset.gid;
    let like = evt.currentTarget.dataset.like;
    let that = this;
    http.requestUrl({
      url: 'wxapp/service/newsCommonsLike',
      data: {
        uid: app.d.uid,
        mid:mid
      },
      method: 'post',
    }).then(res => {
      tip.success(like<=0?'点赞成功':'取消点赞成功',1000);
      that.loadCommnetInfo(pid);
    })
  },

  messageTap: function (evt) {
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
    let data = {
      uid: app.d.uid,
      nid: that.data.id,
      content: content
    }
    if (id > 0)
      data.parent_id = id
    http.requestUrl({
      url: 'wxapp/service/newsAddDis',
      data: data,
      method: 'post',
    }).then(res => {
      if (res.status == 1) {
        tip.success('评论成功');
        if (id > 0) {
          that.loadCommnetInfo(id);
        } else {
          that.setData({
            page: 1,
            bottoming: false,
            showBottomLoading: true,
          })
          wx.pageScrollTo({
            scrollTop: 0,
          })
          that.loadCommentList();
        }

      }
    })
  },

  loadCommnetInfo: function(id) {
    let that = this;
    http.requestUrl({
      url: 'wxapp/service/getNewsCommonsById',
      data: {
        id: id,
        user_id: app.d.uid,
      }
    }).then(res => {
      let items = that.data.list;
      for(var i=0; i<items.length;i++){
        if(items[i].id==id)
          items[i] = res.data[0];
      }
      that.setData({
        list:items
      })
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