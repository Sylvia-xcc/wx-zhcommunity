// pages/finance/finance-fabu/finance-fabu.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upload_pic: [],
    upload_max: 9, //上传图片最大数量
    video: '',
    optype: 0, //0：图片 1：视频
    list: [],
    type: -1,
    desc: '',
    mobile: '',
    remark: '',
    id: 0,
    status: 0,
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
    that.loadClassifyList();
  },

  loadClassifyList: function() {
    let that = this;
    tip.loading();
    http.requestUrl({
      url: 'wxapp/FinanceClass/lists',
    }).then(res => {
      that.setData({
        list: res.data.list
      })
      if (that.data.id > 0) {
        that.loadDetail();
      } else {
        tip.loaded();
        that.setData({
          isLoading: false
        })
      }
    })
  },

  loadDetail: function() {
    let that = this;
    http.requestUrl({
      url: 'wxapp/FinanceIndex/getDetail',
      data: {
        id: that.data.id,
        user_id: app.d.uid
      }
    }).then(res => {
      let type = -1;
      for (var i = 0; i < that.data.list.length; i++) {
        if (that.data.list[i].name == res.data.class_name) {
          type = i;
          break;
        }
      }
      that.setData({
        desc: res.data.content,
        mobile: res.data.mobile,
        upload_pic: res.data.img_list || [],
        remark: res.data.remark,
        type: type,
        status: res.data.status,
      })
      setTimeout(function() {
        tip.loaded();
        that.setData({
          isLoading: false
        })
      }, 400)
    })
  },

  submitTap: function(evt) {
    let type = evt.currentTarget.dataset.type;
    console.log('------------ type:', type)
    let that = this;
    if (type == 'publish') {
      that.publish();
      return;
    }
    if (type == 'cancel') {
      that.cancel();
      return;
    }
    if (that.data.desc == '') {
      tip.error('请填写发布内容', 1000);
      return;
    }
    if (that.data.mobile == '') {
      tip.error('请填写类型方式', 1000);
      return;
    }
    if (that.data.type < 0) {
      tip.error('请选择服务类型', 1000);
      return;
    }
    if (!util.filterMobile(that.data.mobile)) {
      // tip.error('请填写联系电话', 1000);
      return;
    }
    console.log('------------- 发布内容：', that.data.desc);
    console.log('------------- 联系方式：', that.data.mobile);
    console.log('------------- 服务类型：', that.data.list[that.data.type].name);
    console.log('------------- 备注：', that.data.remark);
    console.log('------------- 图片', that.data.upload_pic);
    let {
      upload_pic
    } = that.data;
    let temp = [];
    let files = [];
    tip.loading('发布中...');
    for (var i = 0; i < upload_pic.length; i++) {
      temp.push(
        http.uploadFile({
          tempFilePaths: upload_pic[i]
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
      console.log('-------上传完成', files, that.data.optype)
      let content = JSON.stringify(files);
      if (type == 'submit')
        that.submit(content);
      else if (type == 'republish')
        that.republish(content);
    })
  },

  //提交审核
  submit: function(content) {
    let that = this;
    http.requestUrl({
      url: 'wxapp/FinanceIndex/publish',
      method: 'post',
      data: {
        user_id: app.d.uid,
        class_id: that.data.list[that.data.type].id,
        content: that.data.desc,
        mobile: that.data.mobile,
        remark: that.data.remark,
        img_list: content
      }
    }).then(res => {
      tip.loaded();
      tip.success('提交成功', 1000);
      wx.navigateBack();
    })
  },

  //重新提交审核
  republish: function(content) {
    let that = this;
    http.requestUrl({
      url: 'wxapp/FinanceIndex/republish',
      method: 'post',
      data: {
        id: that.data.id,
        user_id: app.d.uid,
        class_id: that.data.list[that.data.type].id,
        content: that.data.desc,
        mobile: that.data.mobile,
        remark: that.data.remark,
        img_list: content
      }
    }).then(res => {
      tip.loaded();
      tip.success('重新提交成功', 1000);
      wx.navigateBack();
    })
  },

  //立即发布
  publish: function(content) {
    let that = this;
    http.requestUrl({
      url: 'wxapp/FinanceIndex/publishNow',
      method: 'post',
      data: {
        id: that.data.id,
      }
    }).then(res => {
      tip.loaded();
      tip.success('发布成功', 1000);
      wx.navigateBack();
    })
  },

  //撤销
  cancel: function(content) {
    let that = this;
    http.requestUrl({
      url: 'wxapp/FinanceIndex/repeal',
      method: 'post',
      data: {
        id: that.data.id,
      }
    }).then(res => {
      tip.loaded();
      tip.success('撤销成功', 1000);
      wx.navigateBack();
    })
  },

  typeChange: function(evt) {
    this.setData({
      type: evt.detail.value
    })
  },
  descInput: function(evt) {
    this.setData({
      desc: evt.detail.value
    })
  },
  remarkInput: function(evt) {
    this.setData({
      remark: evt.detail.value
    })
  },
  mobileInput: function(evt) {
    this.setData({
      mobile: evt.detail.value
    })
  },

  //选择图片
  chooseImage() {
    let that = this;
    let len = that.data.upload_max - that.data.upload_pic.length;
    len = len <= 0 ? 0 : len;
    wx.chooseImage({
      count: len, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.upload_pic.length != 0) {
          this.setData({
            upload_pic: this.data.upload_pic.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            upload_pic: res.tempFilePaths
          })
        }
      }
    });
  },
  //选择视频
  chooseVideo() {
    wx.chooseVideo({
      success: (res) => {
        console.log(res.tempFilePath)
        this.setData({
          video: res.tempFilePath,
          optype: 1,
          upload_pic: [res.tempFilePath]
        })
      }
    })
  },

  //预览图片
  previewImg(e) {
    wx.previewImage({
      urls: this.data.upload_pic,
      current: e.currentTarget.dataset.url
    });
  },
  //删除图片
  delTap(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          let that = this;
          that.data.upload_pic.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            upload_pic: that.data.upload_pic,
            video: '',
            optype: 0,
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