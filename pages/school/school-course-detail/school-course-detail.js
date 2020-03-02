// pages/school/school-course-detail/school-course-detail.js
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
const poster = require('../../../components/poster/poster.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    banner: [],
    videoUrl: '', //'https://www.fengzhankeji.com/qizhuhome/data/upload/2019-11-27/5dde39f275eea.mp4',
    detail: null,
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
    that.loadCourseDetail();
  },

  loadCourseDetail: function() {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'teacher/detail',
      news: true,
      data: {
        id: that.data.id,
        uid: app.d.uid,
      }
    }).then(res => {
      that.setData({
        banner: res.data.banner,
        detail: res.data,
      })
      setTimeout(function() {
        if (that.data.isLoading)
          tip.loaded();
        that.setData({
          isLoading: false
        })
      }, 200)
    })
  },

  joinTap: function (evt) {
    let that = this;
    if (that.data.detail.join > 0) {
      wx.navigateTo({
        url: '/pages/school/school-lesson-detail/school-lesson-detail?id=' + that.data.detail.id + '&index=0',
      })
      return;
    }
    if (!util.hasAuthorize())
      return;
    http.requestUrl({
      url: 'teacher/addJoin',
      news: true,
      method: 'post',
      data: {
        pid: that.data.detail.id,
        uid: app.d.uid,
      }
    }).then(res => {
      tip.success('报名成功', 1000);
      that.loadCourseDetail();
    })
  },

  guanzhuTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    let that = this;
    let url = (that.data.detail.like == 0) ? 'teacher/addTeacherLike' : 'teacher/removeTeacherLike';
    let data = {
      uid: app.d.uid
    }
    if (that.data.detail.like == 0)
      data.tid = that.data.detail.teacher_id;
    else
      data.id = that.data.detail.like;
    http.requestUrl({
      url: url,
      news: true,
      method: 'post',
      data: data
    }).then(res => {
      let msg = (that.data.detail.like == 0)?'关注成功':'取消关注成功';
      tip.success(msg, 1000);
      that.loadCourseDetail();
    })
  },

  detailTap: function(evt) {
    let that = this;
    if (that.data.detail.join <= 0) {
      tip.text('请先报名加入', 1000);
      return;
    }
    let id = evt.currentTarget.dataset.id;
    let index = evt.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/school/school-lesson-detail/school-lesson-detail?id=' + id + '&index=' + index,
    })
  },

  //收藏
  collectTap: function () {
    if (!util.hasAuthorize())
      return;
    let that = this;
    let url = that.data.detail.fav > 0 ? 'fav/remove' : 'fav/add';
    let data = that.data.detail.fav > 0 ? {
      id: that.data.detail.fav,
      uid: app.d.uid
    } : {
      uid: app.d.uid,
      model: 'teacher',
      mid: that.data.detail.id,
    }
    http.requestUrl({
      url: url,
      news: true,
      method: 'post',
      data: data,
    }).then(res => {
      let msg = that.data.detail.fav > 0 ? '取消收藏成功' : '收藏成功';
      tip.success(msg, 1000);
      that.loadCourseDetail();
    })
  },

  //生成海报
  posterTap: function (evt) {
    let that = this;
    let data = poster.getDrawCanvasData({
      name: that.data.detail.name,
      desc: that.data.detail.intro,
      photo: that.data.detail.thumb,
      price: that.data.detail.username,
      code: '',
    });
    that.selectComponent('#poster').generatePaper(data)
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