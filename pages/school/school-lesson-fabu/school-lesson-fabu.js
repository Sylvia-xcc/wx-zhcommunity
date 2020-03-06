// pages/school/school-lesson-fabu/school-lesson-fabu.js
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid:0,
    lid:0,
    name: '',
    intro: '',
    video: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:',options);
    let that = this;
    that.setData({
      cid:options.id||0,
      lid:options.lid||0
    })
    console.log('------- ', that.data.cid, that.data.lid)
    let height = wx.getSystemInfoSync().windowWidth;
    height = Math.floor((height - 20) / 3) - 10;
    let px = (300 - height) / 2;
    this.setData({
      height: height,
      px: px,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  submitTap: function() {
    let that = this;
    if (that.data.name == '') {
      tip.error('请填写课时标题', 1000);
      return;
    }
    if (that.data.intro == '') {
      tip.error('请填写课时详情', 1000);
      return;
    }

    if (that.data.video == '') {
      tip.error('请上传课时视频', 1000);
      return;
    }


    console.log('------- 课时标题：', that.data.name);
    console.log('------- 课时详情：', that.data.intro);
    console.log('------- 课时视频：', that.data.video);

    tip.loading('发布中...');

    http.uploadFile({
      tempFilePaths: uploadPic[i]
    }).then(res => {
      if (typeof res == 'string') {
        res = JSON.parse(res);
      }
      console.log('上传完路径', res)
      if (res.code == 1) {
        files.push(res.data.url);
        let content = JSON.stringify(files);
        console.log('-------上传完成', files, content);
        http.requestUrl({
          url: 'teacher/add',
          news: true,
          method: 'post',
          data: {
            uid: app.d.uid,
          }
        }).then(res => {
          tip.loaded();
          tip.success('发布成功', 1000);
          wx.navigateBack();
        })
      }
    })
  },

  nameInput: function(evt) {
    this.setData({
      name: evt.detail.value
    })
  },
  introInput: function(evt) {
    this.setData({
      intro: evt.detail.value
    })
  },

  //选择视频
  chooseVideo(evt) {
    wx.chooseVideo({
      success: (res) => {
        console.log(res.tempFilePath)
        this.setData({
          video: res.tempFilePath,
        })
      }
    })
  },

  delVideoTap(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.setData({
            video: '',
          })
        }
      }
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