// pages/paper/index.js
const app = getApp();
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
import tip from '../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalName:null,
    msg:'',
    max:50,
    isLoading:true,
    info:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadPaperInfo();
  },

  loadPaperInfo:function(){
    let that = this;
    tip.loading();
    http.requestUrl({
      url: 'paper/detail',
      news: true,
      data:{
        uid:app.d.uid
      }
    }).then(res => {
      that.setData({
        info:res.data
      })
      setTimeout(function () {
        tip.loaded();
        that.setData({
          isLoading:false,
        })
      },400)
    })
  },

  nextTap:function(evt){
    this.loadPaperInfo();
  },

  submitTap:function(evt){
    let that = this;
    if(that.data.msg=='')
    {
      tip.error('请输入内容~~',1000);
      return;
    }
    if (that.data.modalName =='DialogModal')
      that.addTap();
    else
      that.replayTap();
    that.hideModal();
  },

  replayTap:function(evt){
    let that = this;
    that.hideModal();
    http.requestUrl({
      url: 'paper/reply',
      news: true,
      data: {
        uid: app.d.uid,
        content: that.data.msg,
        id: that.data.info.id,
      },
      method: 'post',
    }).then(res => {
      tip.success('回复成功', 1000)
    })
  },

  addTap:function(evt){
    let that = this;
    http.requestUrl({
      url: 'paper/add',
      news: true,
      data:{
        uid:app.d.uid,
        content:that.data.msg
      },
      method:'post',
    }).then(res => {
      tip.success('发布成功',1000)
    })
  },

  textareaInput:function(evt){
    let msg = evt.detail.value;
    // console.log(msg, msg.length);
    this.setData({
      msg:msg
    })
  },

  showModal(e) {
    this.setData({
      msg: '',
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null,
    })
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