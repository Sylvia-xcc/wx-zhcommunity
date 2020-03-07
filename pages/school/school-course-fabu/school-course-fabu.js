// pages/school/school-course-fabu/school-course-fabu.js
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
    imgList: [],
    name: '',
    intro: '',
    teacher_name: '',
    teacher_info: '',
    teacher_thumb: '',
    imgList: [],
    thumb: '', //背景
    max: 8,
    picker: [],
    pickerIndex: -1,
    isLoading: true,
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
    that.loadClassType();
  },

  loadClassType: function () {
    let that = this;
    http.requestUrl({
      url: 'teacher/classType',
      news: true,
    }).then(res => {
      that.setData({
        picker: res.data
      })
      if (that.data.id > 0) {
        that.loadCourseDetail();
      } else {
        that.setData({
          isLoading: false
        })
      }
    })
  },

  loadCourseDetail: function() {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: '/teacher/edit',
      news: true,
      data: {
        uid: app.d.uid,
        id: that.data.id,
      }
    }).then(res => {
      let items = that.data.picker;
      let id = -1;
      for(var i=0; i<items.length; i++){
        if (items[i].name == res.data.content_id_name)
          id = i;
      }
      that.setData({
        name:res.data.name,
        intro:res.data.intro,
        teacher_name: res.data.username,
        teacher_thumb: res.data.avatar,
        teacher_info: res.data.lecture_teacher.intro,
        imgList:res.data.banner||[],
        thumb:res.data.thumb,
        pickerIndex:id,
      })
      setTimeout(function() {
        tip.loaded();
        that.setData({
          isLoading: false
        })
      }, 600)
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
      tip.error('请填写课程标题', 1000);
      return;
    }
    if (that.data.intro == '') {
      tip.error('请填写课程详情', 1000);
      return;
    }
    if (that.data.pickerIndex < 0) {
      tip.error('请选择课程分类', 1000);
      return;
    }
    if (that.data.teacher_name == '') {
      tip.error('请填写老师名字', 1000);
      return;
    }
    if (that.data.teacher_thumb == '') {
      tip.error('请上传老师头像', 1000);
      return;
    }
    if (that.data.teacher_info == '') {
      tip.error('请填写老师简介', 1000);
      return;
    }
    if (that.data.imgList <= 0) {
      tip.error('请上传轮播图', 1000);
      return;
    }
    if (that.data.thumb == '') {
      tip.error('请上传背景图', 1000);
      return;
    }

    console.log('------- 课程标题：', that.data.name);
    console.log('------- 课程详情：', that.data.intro);
    console.log('------- 课程分类：', that.data.picker[that.data.pickerIndex].name);
    console.log('------- 授课老师：', that.data.teacher_name);
    console.log('------- 老师头像：', that.data.teacher_thumb);
    console.log('------- 老师简介：', that.data.teacher_info);
    console.log('------- 轮播图：', that.data.imgList);
    console.log('------- 背景图：', that.data.thumb);


    let uploadPic = util.copyObj(that.data.imgList);
    uploadPic.unshift(that.data.thumb);
    uploadPic.unshift(that.data.teacher_thumb);
    let temp = [];
    let files = [];
    tip.loading('发布中...');
    for (var i = 0; i < uploadPic.length; i++) {
      temp.push(
        http.uploadFile({
          tempFilePaths: uploadPic[i]
        }).then(res => {
          if (typeof res == 'string') {
            res = JSON.parse(res);
          }
          console.log('上传完路径', res)
          if (res.code == 1)
            files.push(res.data.url);
        })
      );
    }

    Promise.all(temp).then(res => {
      // let content = JSON.stringify(files);
      let teacher_thumb = files.slice(0, 1);
      let thumb = files.slice(1, 2);
      let banner = files.slice(2);
      console.log('-------上传完成', files, teacher_thumb, thumb, banner);

      let url = that.data.id > 0 ? 'teacher/edit' : 'teacher/add';
      let data={
        uid: app.d.uid,
        name: that.data.name,
        intro: that.data.intro,
        teacher_name: that.data.teacher_name,
        teacher_intro: that.data.teacher_info,
        teacher_thumb: teacher_thumb[0],
        content_id: that.data.picker[that.data.pickerIndex].id,
        banner: JSON.stringify(banner),
        thumb: thumb[0],
      }
      if(that.data.id>0)
        data.id = that.data.id;
      http.requestUrl({
        url: url,
        news: true,
        method: 'post',
        data: data
      }).then(res => {
        tip.loaded();
        tip.success('发布成功', 1000);
        wx.navigateBack();
      })
    })
  },

  pickerChange: function(evt) {
    this.setData({
      pickerIndex: evt.detail.value
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

  teacherNameInput: function(evt) {
    this.setData({
      teacher_name: evt.detail.value
    })
  },

  teacherInfoInput: function(evt) {
    this.setData({
      teacher_info: evt.detail.value
    })
  },
  chooseImage(evt) {
    let that = this;
    let max = that.data.max - that.data.imgList.length;
    wx.chooseImage({
      count: max, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (that.data.imgList.length != 0) {
          that.setData({
            imgList: that.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          that.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },

  chooseTeacherImage(evt) {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          teacher_thumb: res.tempFilePaths[0]
        })
      }
    });
  },

  chooseThumbImage(evt) {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          thumb: res.tempFilePaths[0]
        })
      }
    });
  },

  delImg(evt) {
    let type = evt.currentTarget.dataset.type;
    let that = this;
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          if (type == 'thumb') {
            that.setData({
              thumb: ''
            })
          } else {
            that.data.imgList.splice(evt.currentTarget.dataset.index, 1);
            that.setData({
              imgList: that.data.imgList
            })
          }

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