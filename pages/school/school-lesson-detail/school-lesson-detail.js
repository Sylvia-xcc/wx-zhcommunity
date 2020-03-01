// pages/school/school-lesson-detail/school-lesson-detail.js
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 3,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    isLoading: true,
    showBottomLoading: false,
    msg: '',
    detail: null,
    index: 0,
    id: 0,
    pptlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      id: options.id || 0,
      index: options.index || 0,
    })
    that.loadCourseDetail();
    that.loadLessonList();
    that.loadCommentList();
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

  loadLessonList: function() {
    let that = this;
    http.requestUrl({
      url: 'teacher/pptList',
      news: true,
      data: {
        id: that.data.id,
      }
    }).then(res => {
      that.setData({
        pptlist: res.data
      })
    })
  },

  loadCommentList:function(add=false){
    let that = this;
    http.requestUrl({
      url: 'teacher/commentList',
      news: true,
      data: {
        id: that.data.id,
        uid:app.d.uid,
        listRows: 10,
        page: that.data.page
      }
    }).then(res => {
      let items = that.data.list;
      if (add) //新增-删除最后一页的数据
      {
        let end = (that.data.page - 1) * 10;
        items = items.slice(0, end);
        console.log('---------->>> add', items, items.length);
      }
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
      })
    })
  },

  guanzhuTap: function(evt) {
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
      tip.success('报名成功', 1000);
      that.loadCourseDetail();
    })
  },

  detailTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    let index = evt.currentTarget.dataset.index;
    wx.redirectTo({
      url: '/pages/school/school-lesson-detail/school-lesson-detail?id=' + id + '&index=' + index,
    })
  },

  tabSelect: function(evt) {
    let id = evt.currentTarget.dataset.id;
    let that = this;
    if (that.data.tabCur == id)
      return;
    that.setData({
      tabCur: id,
    })
  },
  textInput: function(evt) {
    this.setData({
      msg: evt.detail.value,
    })
  },

  messageTap: function(evt) {
    let that = this;
    console.log('--------- 发生聊天：', that.data.msg)
    if (that.data.msg == '') {
      tip.error('内容不能为空', 1000);
      return;
    }
    http.requestUrl({
      url: 'teacher/addComment',
      news: true,
      method: 'post',
      data: {
        uid:app.d.uid,
        content:that.data.msg,
        product_id:that.data.id
      }
    }).then(res => {
      tip.success('评论成功',1000);
      that.setData({
        msg:''
      })
      that.loadCommentList(true);
    })
  },

  downloadfileTap: function(evt) {
    console.log('----------->>> download', evt)
    var url = evt.currentTarget.dataset.url;
    //下载文件，生成临时地址
    wx.downloadFile({
      url: url,
      success(res) {
        console.log(res)
        //保存到本地
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function(res) {
            const savedFilePath = res.savedFilePath;
            // 打开文件
            wx.openDocument({
              filePath: savedFilePath,
              success: function(res) {
                console.log('打开文档成功')
              },
            });
          },
          fail: function(err) {
            console.log('保存失败：', err)
          }
        });
      }
    })
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
    let that = this;
    if (that.data.tabCur==0 && that.data.list.length < that.data.total && that.data.bottoming) { //有更多时加载
      that.setData({
        showBottomLoading: true,
        bottoming: false,
      })
      setTimeout(function () {
        that.setData({
          page: that.data.page + 1,
        })
        that.loadCommentList();
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})