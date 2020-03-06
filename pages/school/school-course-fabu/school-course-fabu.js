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
    imgList: [],
    name: '1',
    intro: '2',
    teacher_name: '3',
    teacher_info: '4',
    teacher_thumb: '',
    imgList: [],
    thumb: '', //背景
    max: 8,
    picker: [{
      name: 'a',
      id: 1
    }, {
      name: 'bb',
      id: 2
    }],
    pickerIndex: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    if (that.data.pickerIndex, 0) {
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
    uploadPic.push(that.data.teacher_thumb);
    uploadPic.push(that.data.thumb);
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