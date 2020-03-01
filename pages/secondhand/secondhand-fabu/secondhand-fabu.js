// pages/secondhand/secondhand-fabu/secondhand-fabu.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    classifyId: -1,
    msg: '',
    upload_pic: [],
    upload_max: 9, //上传图片最大数量
    video: '',
    optype: 0, //0：图片 1：视频
    address: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options', options)
    let that = this;
    that.loadCategoryList();
    // that.getAddress();
  },

  loadCategoryList: function() {
    let that = this;
    http.requestUrl({
      url: 'used/category',
      news: true,
    }).then(res => {
      that.setData({
        list: res.data,
      })
    })
  },

  submit: function(evt) {
    let that = this;
    if (that.data.msg == '') {
      tip.error('请输入物品详情', 1000)
      return;
    }
    if (that.data.classifyId < 0) {
      tip.error('请选择物品分类', 1000)
      return;
    }
    if(that.data.upload_pic.length<=0)
    {
      tip.error('请上传图片视频',1000);
      return;
    }
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
      that.fabu(content);
    }).catch(res => {
      tip.error('网络异常!', 1000);
    })
  },

  fabu: function(content) {
    // console.log('----fabu', content)
    let that = this;
    let id = that.data.list[that.data.classifyId].id;
    let data = {
      uid: app.d.uid,
      class_id: id,
      content: that.data.msg,
      type: that.data.optype + 1
    };
    if (that.data.optype == 1) {
      data.videos = content;
      data.imgs = [];
    } else {
      data.imgs = content;
      data.videos = [];
    }
    http.requestUrl({
      url: 'used/add',
      news: true,
      data: data,
      method: 'post',
    }).then(res => {
      tip.success(res.msg);
      wx.navigateBack();
    })
  },

  getAddress() {
    let that = this
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'MNXBZ-G5TWD-GYF42-HHZJL-2W2J3-PVBX4' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {
            var address = addressRes.result.address_component.city + '，' + addressRes.result.address_component.district;
            that.setData({
              address: address
            })
            console.log('------------ 当前地理坐标', addressRes)
          }
        })
      }
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


  textareaInput: function(evt) {
    let value = evt.detail.value;
    this.setData({
      msg: evt.detail.value
    })
  },

  classifyChange: function(evt) {
    console.log(evt.detail.value)
    console.log('----------- 选择的版块', this.data.list[evt.detail.value].name)
    this.setData({
      classifyId: evt.detail.value
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