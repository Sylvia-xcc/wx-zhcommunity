// pages/matchmaker/matchmaker-personal/matchmaker-personal.js
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    banner: ['/images/ershou1.png','/images/ershou2.png'],
    detail:null,
    isLoading:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:',options);
    let that = this;
    that.setData({
      id:options.id||0,
    })
    that.loadPersonalInfo();
  },

  loadPersonalInfo: function () {
    let that = this;
    if(that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'matchmaker/detail',
      news: true,
      data: {
        id: that.data.id,
      }
    }).then(res => {
      that.setData({
        detail:res.data
      })
      setTimeout(function(){
        tip.loaded();
        that.setData({
          isLoading:false,
        })
      },400)
    })

  },

  copyTap:function(evt){
    let txt = evt.currentTarget.dataset.text;
    console.log('---------------', evt)
    wx.setClipboardData({
      data: txt,
      success:function(res){
        wx.getClipboardData({
          success:function(res){
            tip.success('复制成功',1000);
          }
        })
      }
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