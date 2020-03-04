// pages/user/user-fans/index.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:0,
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
  onLoad: function (options) {
    console.log('options:',options);
    let that = this;
    that.setData({
      uid:options.uid||app.d.uid,
    })
    that.loadFansList();
  },

  loadFansList: function () {
    let that = this;
    tip.loading();
    http.requestUrl({
      url: 'account/fansList',
      news: true,
      data:{
        uid:that.data.uid||app.d.uid
      }
    }).then(res => {
      let items = that.data.list;
      if (that.data.page == 10) {
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
      setTimeout(function () {
        tip.loaded();
        that.setData({
          isLoading: false,
        })
      }, 400)
    })
  },

  guanzhuTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    let that = this;
    let isfollow = evt.currentTarget.dataset.follows;
    let id = evt.currentTarget.dataset.uid;
    let url = isfollow == 0 ? 'account/addFollow' : 'account/removeFollow';
    http.requestUrl({
      url: url,
      news: true,
      data: {
        id: id,
        uid: app.d.uid
      },
      method: 'post',
    }).then(res => {
      let msg = isfollow == 0 ? '互关成功' : '取消关注成功';
      let items = that.data.list;
      for(var i=0; i<items.length; i++){
        if(items[i].uid == id)
          items[i].each_other = isfollow==0?1:0;
      }
      that.setData({
        list:items
      })
      tip.success(msg, 1000);
    })
  },

  personalTap: function (evt) {
    let uid = evt.currentTarget.dataset.uid;
    util.personal(uid);
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
        that.loadFansList(false);
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})