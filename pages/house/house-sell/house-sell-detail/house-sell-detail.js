// pages/house/house-sell/house-sell-detail/house-sell-detail.js
const app = getApp()
const util = require('../../../../utils/util.js');
const http = require('../../../../utils/http.js');
import tip from '../../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    type: 0,//1，租，0：售
    detail: null,
    banner: [],
    videoUrl: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    let that = this;
    that.setData({
      id: options.id || 0,
      // type:options.type || 0,
    })
    that.loadHouseDetail();
  },

  loadHouseDetail: function() {
    let that = this;
    http.requestUrl({
      url: 'house/detail',
      news: true,
      data: {
        id: that.data.id,
        uid:app.d.uid
      }
    }).then(res => {
      that.setData({
        detail: res.data,
        videoUrl: res.data.photo.video[0]||'',
        type:res.data.level==1?0:1,//相反
      })
    })
  },

  collectTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    console.log('--------- 商品收藏')
    let that = this;
    let url = that.data.detail.fav > 0 ? 'fav/remove' : 'fav/add';
    let model = that.data.type == 0 ? 'house_sell' :'house_hire';
    let data = that.data.detail.fav > 0 ? {
      id: that.data.detail.fav,
      uid: app.d.uid
    } : {
        uid: app.d.uid,
        model: model,
        mid: that.data.detail.id,
      }
    http.requestUrl({
      url: url,
      news: true,
      data: data,
      method: 'post',
    }).then(res => {
      let msg = that.data.detail.fav > 0 ? '取消收藏成功' : '收藏成功';
      tip.success(msg, 1000);
      that.loadHouseDetail();
    })
  },

  phoneTap: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.u_mobile,
    })
  },

  personalTap: function (evt) {
    let uid = evt.currentTarget.dataset.uid;
    util.personal(uid);
  },

  chatTap: function (evt) {
    util.liveChatTap();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})