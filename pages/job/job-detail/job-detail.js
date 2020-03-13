// pages/job/job-detail/job-detail.js
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
    markers: [],
    isFload: false,
    showFload:false,
    isLoading: true,
    detail: null,
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
    that.loadJobDetail();
  },

  //详情
  loadJobDetail: function() {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'job/fulltimeDetail',
      news: true,
      data: {
        id: that.data.id,
        uid: app.d.uid,
      }
    }).then(res => {
      let detail = res.data;
      detail.treatment = detail.treatment.split('|');
      detail.work_day = detail.work_day.split('|').join('，');
      let n = detail.description.split("\n");
      console.log('---------->>>', n)
      that.setData({
        detail: detail,
        showFload: (n.length > 2 || detail.description.length>50)?true:false
      })
      that.loadMap();
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
      model: 'job',
      mid: that.data.detail.id,
    }
    http.requestUrl({
      url: url,
      news: true,
      data: data,
      method: 'post',
    }).then(res => {
      let msg = that.data.detail.fav > 0 ? '取消收藏成功' : '收藏成功';
      tip.success(msg, 1000);
      that.loadJobDetail();
    })
  },

  //文本展开与缩放
  floadTap: function(evt) {
    this.setData({
      isFload: !this.data.isFload,
    })
  },

  loadMap: function() {
    let that = this;
    let about = {
      latitude: Number(that.data.detail.lat),
      longitude: Number(that.data.detail.lon),
      // name:'测试地址路径测试地址路径测试地址路径',
      address: that.data.detail.address
    };
    let lat = about.latitude;
    let long = about.longitude;

    var markers = [{
      id: 1,
      latitude: lat,
      longitude: long,
      iconPath: '/images/location.png',
      width: 5,
      height: 1,
      callout: {
        content: about.address + ' ▶',
        fontSize: 14,
        bgColor: "#FFF",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 13,
        display: "ALWAYS",
        textAlign: "center",
        borderRadius: 30,
      },
    }];
    that.setData({
      about: about,
      markers: markers,

    })
    setTimeout(function() {
      tip.loaded();
      that.setData({
        isLoading: false,
      })
    }, 400)

  },

  markerTap: function(evt) {
    let that = this;
    wx.openLocation({
      latitude: that.data.about.latitude,
      longitude: that.data.about.longitude,
      scale: 18,
      // name: that.data.about.name,
      address: that.data.about.address
    })
  },

  //拨打电话
  phoneTap: function() {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.detail.mobile,
    })
  },

  personalTap: function (evt) {
    let uid = evt.currentTarget.dataset.uid;
    util.personal(uid);
  },

  chatTap: function (evt) {
    let uid = evt.currentTarget.dataset.uid;
    util.liveChatTap(uid);
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