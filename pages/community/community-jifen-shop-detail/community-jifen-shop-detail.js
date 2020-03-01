// pages/community/community-jifen-shop-detail/community-jifen-shop-detail.js
const app = getApp();
const WxParse = require('../../../wxParse/wxParse.js');
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: 0,
    banner: ['/images/ershou1.png', '/images/ershou2.png'],
    videoUrl: 'https://www.fengzhankeji.com/qizhuhome/data/upload/2019-11-27/5dde39f275eea.mp4',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    let that = this;
    that.setData({
      id: options.id || 0
    })

    let content = '"<p><img src="https://www.fengzhankeji.com/qizhuhome/data/upload/ueditor/20191212/5df1b500baa3a.jpg" title="5623L-.jpg" alt="5623L-.jpg"/><img src="https://www.fengzhankeji.com/qizhuhome/data/upload/ueditor/20191212/5df1b500d826d.jpg" title="5623L.jpg" alt="5623L.jpg"/></p>"';
    WxParse.wxParse('content', 'html', content, that, 0);

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