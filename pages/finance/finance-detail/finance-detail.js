// pages/finance/finance-detail/finance-detail.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    detail:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:',options);
    let that = this;
    that.setData({
      id:options.id||0
    })
    that.loadDetail();
  },

  loadDetail:function(){
    let that = this;
    http.requestUrl({
      url: 'wxapp/FinanceIndex/getDetail',
      data:{
        id:that.data.id,
        user_id:app.d.uid
      }
    }).then(res => {
      that.setData({
        detail:res.data
      })
    })
  },

  collectTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    let that = this;
    http.requestUrl({
      url: 'wxapp/FinanceIndex/collect',
      method: 'post',
      data: {
        uid:app.d.uid,
        mid:that.data.id
      }
    }).then(res => {
      let msg = that.data.detail.is_collect == 0 ? '收藏成功' :'取消收藏成功';
      tip.success(msg,1000);
      that.loadDetail();
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

  phoneTap:function(evt){
    wx.makePhoneCall({
      phoneNumber: this.data.detail.mobile,
    })
  },

  personalTap: function (evt) {
    let uid = evt.currentTarget.dataset.uid;
    util.personal(uid);
  },

  chatTap: function (evt) {
    let uid = evt.currentTarget.dataset.uid;
    util.liveChatTap(uid);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})