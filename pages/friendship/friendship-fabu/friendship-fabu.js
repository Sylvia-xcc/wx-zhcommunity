// pages/friendship/friendship-fabu/friendship-fabu.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    type: -1,
    upload_pic: [],
    upload_max: 9, //上传图片最大数量
    video: '',
    optype: 0, //0：图片 1：视频
    address: null,
    checked: false,
    desc: '',
    money: '',
    tags: [],
    isLoading: true,
    mobile:'',
    id: 0,
    status: 0,
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
      url: 'wxapp/QingyiClass/lists',
    }).then(res => {
      that.setData({
        list: res.data.list
      })
      that.loagTagList();
    })
  },

  loagTagList: function() {
    let that = this;
    http.requestUrl({
      url: 'wxapp/QingyiTag/lists',
    }).then(res => {
      that.setData({
        tags: res.data.list
      })
      if(that.data.id>0){
        that.loadDetail();
      }else{
        setTimeout(function () {
          tip.loaded();
          that.setData({
            isLoading: false
          })
        }, 400)
      }
    })
  },

  loadDetail: function () {
    let that = this;
    http.requestUrl({
      url: 'wxapp/QingyiIndex/getDetail',
      data: {
        id: that.data.id,
        user_id: app.d.uid
      },
    }).then(res => {
      let type = -1;
      for (var i = 0; i < that.data.list.length; i++) {
        if (that.data.list[i].name == res.data.class_name) {
          type = i;
          break;
        }
      }
      let items = that.data.tags;
      for(i=0; i<items.length; i++){
        if(that.canFit(items[i].id, res.data.tag_list)){
          items[i].checked = true;
        }else
          items[i].checked = false;
      }
      that.setData({
        desc: res.data.intro,
        money:res.data.money,
        mobile: res.data.mobile,
        upload_pic: res.data.img_list || [],
        video: res.data.video_list ? res.data.video_list[0]:'',
        type: type,
        status: res.data.status,
        checked: res.data.set_money==1?false:true,
        tags:items,
      })
      console.log('-------- video', that.data.video);
      setTimeout(function () {
        tip.loaded();
        that.setData({
          isLoading: false
        })
      },400)
    })
  },

  canFit:function(id, temp){
    for(var i=0; i<temp.length; i++){
      if(temp[i].id==id)
        return true;
    }
    return false;
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
    if (that.data.type < 0) {
      tip.error('请选择需求类型', 1000);
      return;
    }
    if (that.data.money == '') {
      tip.error('请填写预算价格', 1000);
      return;
    }
    if (that.data.mobile == '') {
      tip.error('请填写联系方式', 1000);
      return;
    }
    // if (that.data.upload_pic.length <= 0) {
    //   tip.error('请上传附件', 1000);
    //   return;
    // }
    // if (that.data.desc == '') {
    //   tip.error('请填写具体描述', 1000);
    //   return;
    // }
    console.log('--------- 需求类型：', that.data.list[that.data.type].name);
    console.log('--------- 预算价格：', that.data.money);
    console.log('--------- 联系方式：', that.data.mobile);
    console.log('--------- 是否接受议价：', that.data.checked);
    console.log('--------- 描述：', that.data.desc);
    let items = that.data.tags;
    let tags = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].checked) {
        tags.push(items[i].id);
      }
    }
    console.log('--------- 标签：', tags);
    let upload_pic = util.copyObj(that.data.upload_pic);
    let video = that.data.video;
    if(video!='')
      upload_pic.unshift(video);
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
      // let content = JSON.stringify(files);
      if (type == 'submit')
        that.submit(files,tags);
      else if (type == 'republish')
        that.republish(files, tags);
    })
  },

  submit: function (content, tags) {
    let that = this;
    content.reverse();
    let imgList = (that.data.video == '') ? content : content.slice(1);
    let videoList = (that.data.video == '') ? '' : content.slice(0, 1);
    console.log('---------- uploadfile: ', imgList, videoList)
    imgList = imgList.length <= 0 ? [] : JSON.stringify(imgList);
    videoList = videoList.length <= 0 ? [] : JSON.stringify(videoList);
    http.requestUrl({
      url: 'wxapp/QingyiIndex/publish',
      data: {
        user_id: app.d.uid,
        class_id: that.data.list[that.data.type].id,
        money: that.data.money,
        set_money: that.data.checked ? 0 : 1,
        img_list: imgList,
        video_list: videoList,
        intro: that.data.desc,
        tags: tags,
        mobile: that.data.mobile
      },
      method: 'post',
    }).then(res => {
      tip.success('提交成功', 1000);
      wx.navigateBack();
    })
  },

  republish: function (content, tags) {
    let that = this;
    content.reverse();
    let imgList = (that.data.video == '') ? content : content.slice(1);
    let videoList = (that.data.video == '') ? '' : content.slice(0, 1);
    console.log('---------- uploadfile: ', imgList, videoList)
    imgList = imgList.length <= 0 ? [] : JSON.stringify(imgList);
    videoList = videoList.length <= 0 ? [] : JSON.stringify(videoList);
    http.requestUrl({
      url: 'wxapp/QingyiIndex/republish',
      method: 'post',
      data: {
        id: that.data.id,
        user_id: app.d.uid,
        class_id: that.data.list[that.data.type].id,
        money: that.data.money,
        set_money: that.data.checked ? 0 : 1,
        img_list: imgList,
        video_list: videoList,
        intro: that.data.desc,
        tags: tags,
        mobile: that.data.mobile
      }
    }).then(res => {
      tip.loaded();
      tip.success('重新提交成功', 1000);
      wx.navigateBack();
    })
  },

  //立即发布
  publish: function (content) {
    let that = this;
    http.requestUrl({
      url: 'wxapp/QingyiIndex/publishNow',
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
  cancel: function (content) {
    let that = this;
    http.requestUrl({
      url: 'wxapp/QingyiIndex/repeal',
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

  tagTap: function(evt) {
    let that = this;
    let index = evt.currentTarget.dataset.index;
    let items = that.data.tags;
    for (var i = 0; i < items.length; i++) {
      if (i == index) {
        items[i].checked = !items[i].checked;
      }
    }
    that.setData({
      tags: items
    })
  },
  checkTap: function() {
    this.setData({
      checked: !this.data.checked
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
  moneyInput: function(evt) {
    this.setData({
      money: evt.detail.value
    })
  },

  mobileInput: function (evt) {
    this.setData({
      mobile: evt.detail.value
    })
  },

  updateFile:function(evt){
    console.log('upload:', evt.detail)
    let that = this;
    that.setData({
      upload_pic:evt.detail.pics,
      video: evt.detail.video
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
        console.log('----------- res', res);
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