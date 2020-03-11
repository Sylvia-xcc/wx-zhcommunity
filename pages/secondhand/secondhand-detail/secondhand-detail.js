// pages/secondhand/secondhand-detail/secondhand-detail.js
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: 0,
    product: null,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    let that = this;
    that.setData({
      pid: options.id || 0,
    })
    that.loadProductDetail();
  },

  loadProductDetail: function(p = true, add = false) {
    let that = this;
    if(that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'used/detail',
      news: true,
      data: {
        id: that.data.pid,
        listRows: 10,
        page: that.data.page,
        uid: app.d.uid,
      }
    }).then(res => {
      if(res.data){
        if (p) {
          let items = that.data.list;
          if (add) //新增-删除最后一页的数据
          {
            let end = (that.data.page - 1) * 10;
            items = items.slice(0, end);
            console.log('---------->>> add', items, items.length);
          }
          if (that.data.page == 1) {
            items = res.data.comment.data
          } else {
            items = items.concat(res.data.comment.data)
          }
          that.setData({
            product: res.data.detail,
            list: items,
            total: res.data.comment.total,
            bottoming: true,
            showBottomLoading: false,
          })
        } else {
          that.setData({
            product: res.data.detail,
          })
        }
      }
      setTimeout(function(){
        tip.loaded();
        that.setData({
          isLoading:false,
        })
      },400)
    })
  },

  //更新单条数据
  loadCommentDetail: function(gid = 0, cid = 0) {
    let that = this;
    http.requestUrl({
      url: 'used/comments',
      news: true,
      data: {
        id: gid,
        comment_id: cid,
        uid: app.d.uid
      }
    }).then(res => {
      let items = that.data.list;
      let data = res.data;
      for (var i = 0; i < items.length; i++) {
        if (items[i].id == data.id) {
          items[i] = data;
          break;
        }
      }
      that.setData({
        list: items
      })
    })
  },

  loadAddReplay: function (id, value) {
    if (!util.hasAuthorize())
      return;
    let that = this;
    http.requestUrl({
      url: 'used/addReply',
      news: true,
      data: {
        uid: app.d.uid,
        comment_id:id,
        fid: 0,
        content: value,
      },
      method: 'post',
    }).then(res => {
      tip.success('评论成功', 1000);
      that.loadCommentDetail(that.data.product.id, id);
    })
  },

  messageTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    let id = evt.currentTarget.dataset.id;
    console.log('--------- 留言', id)
    this.selectComponent('#my-textarea').toggleModal(id);
  },

  OnSubmit: function(evt) {
    console.log(evt)
    let content = evt.detail.value;
    let id = evt.detail.id;
    let that = this;
    if (id > 0) {
      that.loadAddReplay(id, content);
      return;
    }
    http.requestUrl({
      url: 'used/addComment',
      news: true,
      data: {
        uid: app.d.uid,
        goods_id: that.data.product.id,
        content: evt.detail.value,
      },
      method: 'post',
    }).then(res => {
      tip.success('评论成功', 1000);
      that.loadProductDetail(true, true);
    })
  },

  likeMessageTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    console.log('--------- 留言点赞', evt.currentTarget.dataset)
    let that = this;
    let id = evt.currentTarget.dataset.id;
    let like = evt.currentTarget.dataset.like;
    let model = evt.currentTarget.dataset.model || '';
    let gid = evt.currentTarget.dataset.gid;
    let cid = evt.currentTarget.dataset.cid;
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
      that.loadCommentDetail(gid, cid)
    })
  },

  likeTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    console.log('--------- 商品点赞');
    let that = this;
    let url = that.data.product.like > 0 ? 'used/removeGoodsLike' : 'used/addGoodsLike';
    let data = that.data.product.like > 0 ? {
      id: that.data.product.like
    } : {
      uid: app.d.uid,
      mid: that.data.product.id,
    }
    http.requestUrl({
      url: url,
      news: true,
      data: data,
      method: 'post',
    }).then(res => {
      let msg = that.data.product.like > 0 ? '取消点赞成功' : '点赞成功';
      tip.success(msg, 1000);
      that.loadProductDetail(false);
    })
  },

  collectTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    console.log('--------- 商品收藏')
    let that = this;
    let url = that.data.product.fav > 0 ? 'fav/remove' : 'fav/add';
    let data = that.data.product.fav > 0 ? {
      id: that.data.product.fav,
      uid: app.d.uid
    } : {
      uid: app.d.uid,
      model: 'used',
      mid: that.data.product.id,
    }
    http.requestUrl({
      url: url,
      news: true,
      data: data,
      method: 'post',
    }).then(res => {
      let msg = that.data.product.fav > 0 ? '取消收藏成功' : '收藏成功';
      tip.success(msg, 1000);
      that.loadProductDetail(false);
    })
  },

  chatTap: function(evt) {
    let uid = evt.currentTarget.dataset.uid;
    util.liveChatTap(uid);
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

  personalTap:function(evt){
    let uid = evt.currentTarget.dataset.uid;
    util.personal(uid);
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
        that.loadProductDetail();
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})