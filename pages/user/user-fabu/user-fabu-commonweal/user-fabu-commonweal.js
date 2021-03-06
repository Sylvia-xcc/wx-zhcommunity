// pages/user/user-fabu/user-fabu-commonweal/user-fabu-commonweal.js
const app = getApp();
const util = require('../../../../utils/util.js');
const http = require('../../../../utils/http.js');
import tip from '../../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: 0,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    loading: true,
    isOwn: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:', options);
    this.setData({
      uid: options.uid || app.d.uid,
    })
    this.setData({
      isOwn: this.data.uid == app.d.uid ? true : false
    })
    this.loadList();
  },

  loadList: function (p = true) {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    if (p) {
      that.setData({
        bottoming: false,
        showBottomLoading: true,
        loading: true,
      })
    }
    setTimeout(function () {
      that.loadAddList();
    }, 400)

  },

  //聊天列表
  loadAddList: function () {
    let that = this;
    http.requestUrl({
      url: 'account/index',
      news: true,
      data: {
        listRows: 10,
        page: that.data.page,
        uid: that.data.uid,
        model: 'service',
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
      setTimeout(function () {
        tip.loaded();
        that.setData({
          isLoading: false
        })
      }, 400)
    })
  },

  // detailChatTap: function (evt) {
  //   let id = evt.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: '/pages/community/community-chat-detail/community-chat-detail?id=' + id,
  //   })
  // },

  deleteTap: function (evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    tip.confirm('是否确定删除发布?').then(res => {
      http.requestUrl({
        url: 'account/clearPost',
        news: true,
        method: 'post',
        data: {
          id: id,
          model: 'service',
          uid: app.d.uid
        }
      }).then(res => {
        tip.success('删除成功', 1000);
        let items = that.data.list;
        let tmp = [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].id != id)
            tmp.push(items[i]);
        }
        that.setData({
          list: tmp
        })
      })
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
        that.loadList(false);
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})