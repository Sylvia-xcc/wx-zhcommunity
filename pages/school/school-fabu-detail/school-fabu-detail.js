// pages/school/school-fabu-detail/school-fabu-detail.js
const app = getApp()
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
    pptlist: [],
    detail: null,
    isLoading: true,
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadCourseDetail();
  },

  loadCourseDetail: function() {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: '/teacher/detail',
      news: true,
      data: {
        uid: app.d.uid,
        id: that.data.id,
      }
    }).then(res => {
      that.setData({
        detail: res.data,
        list: res.data.lessons,
        pptlist: res.data.ppt,
      })
      setTimeout(function() {
        tip.loaded();
        that.setData({
          isLoading: false
        })
      }, 600)
    })
  },

  delTap: function(evt) {
    let index = evt.currentTarget.dataset.id;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除这份文件吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          that.data.pptlist.splice(index, 1);
          that.setData({
            pptlist: that.data.pptlist
          })
        }
      }
    })
  },

  addFileTap: function(evt) {
    let that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        // if (that.data.pptlist.length != 0) {
        //   that.setData({
        //     pptlist: that.data.pptlist.concat(res.tempFiles)
        //   })
        // } else {
        //   that.setData({
        //     pptlist: res.tempFiles
        //   })
        // }
        // console.log('------', that.data.pptlist)
        var tempFiles = res.tempFiles[0];
        http.uploadFile({
          tempFilePaths: tempFiles.path
        }).then(res => {
          if (typeof res == 'string') {
            res = JSON.parse(res);
          }
          console.log('上传完路径', res)
          if (res.code == 1) {
            let path = res.data.url
            http.requestUrl({
              url: 'teacher/addPpt',
              news: true,
              method: 'post',
              data: {
                pid: that.data.detail.id,
                name: tempFiles.name,
                filename: path,
              }
            }).then(res => {
              tip.loaded();
              tip.success('上传成功', 1000);
              that.loadCourseDetail();
            })
          }
        })

      }
    })
  },

  editCourseTap: function(evt) {
    wx.navigateTo({
      url: '/pages/school/school-course-fabu/school-course-fabu?id=' + this.data.id,
    })
  },

  editLessonTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    id = id == undefined ? 0 : id;
    wx.navigateTo({
      url: '/pages/school/school-lesson-fabu/school-lesson-fabu?id=' + this.data.id + '&lid=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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