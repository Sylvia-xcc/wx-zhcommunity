// pages/index/index.js
const app = getApp();
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
import tip from '../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    swiperList: ['/images/head.png', '/images/head.png'],
    tabCur: 0,
    scrollLeft: 0,
    tagIndex: 0,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    a: false,
    b: false,
    cates: [{
        name: '永辉生活超市',
        url: 'http://image.fengzhankeji.com/static/g6.png',
        appId: 'wxc9cf7c95499ee604',
        path: 'pages/scanbuyhome/index'
      }, {
        name: '京东',
        url: 'http://image.fengzhankeji.com/static/g4.png',
        appId: 'wx91d27dbf599dff74',
        path: 'pages/index/index'
      },
      {
        name: '肯德基',
        url: 'http://image.fengzhankeji.com/static/g5.png',
        appId: 'wx23dde3ba32269caa',
        path: 'pages/home/home'
      }, {
        name: '柒筑',
        url: 'https://images.fengzhankeji.com/weixin/20191226/5e047e5d1336b.png',
        appId: 'wx2c314ac4404bb74f',
        path: 'pages/index/index'
      },
      {
        name: '红杜鹃',
        url: 'http://image.fengzhankeji.com/static/g2.png',
        appId: 'wx925c033ff5414f58',
        path: 'pages/index/index'
      },
      {
        name: '顺口溜滋补汤锅',
        url: 'http://image.fengzhankeji.com/static/g7.png',
        appId: 'wxec640c7ff16e8314',
        path: 'pages/index/index'
      },
      {
        name: '一把壶',
        url: 'http://image.fengzhankeji.com/static/g8.png',
        appId: 'wxa99810e091613a64',
        path: 'pages/index/index'
      }
    ],
    isShow:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadConfigInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    if (app.globalData.checkLogin) {
      console.log('------ home AAA')
      that.initHome();
    } else {
      app.checkLoginReadyCallback = () => {
        console.log('------ home  BBB')
        that.initHome();
      }
    }
  },
  initHome: function() {
    let that = this;
    that.setData({
      showLoading: false
    })
  },

  startupTap: function(evt) {
    let that = this;
    wx.showTabBar()
    tip.loading();
    that.loadBanner();
    that.loadIndex();
  },

  canFit: function() {
    let that = this;
    if (that.data.a && that.data.b) {
      setTimeout(function() {
        tip.loaded();
      }, 400)
    }
  },

  loadConfigInfo: function () {
    let that = this;
    http.requestUrl({
      url: 'common/config',
      news: true,
      data: {
        aid: app.d.uid,
      },
    }).then(res => {
      that.setData({
        isShow: res.data.is_show
      })
    })
  },
  loadBanner: function() {
    let that = this;
    http.requestUrl({
      url: 'banner/index',
      news: true,
      data: {
        type: 'index'
      },
    }).then(res => {
      that.setData({
        swiperList: res.data,
        a: true,
      })
      that.canFit();
    })
  },

  loadIndex: function() {
    let that = this;
    let models = ['used', 'full_job', 'product', 'activities', 'all_hire'];
    let model = models[that.data.tabCur];
    model = (model == 'full_job' && that.data.tagIndex == 1) ? 'part_job' : model;
    if (that.data.tabCur == 4) {
      let job = ['all_hire', 'part_hire', 'house_buy'];
      model = job[that.data.tagIndex];
    }
    http.requestUrl({
      url: 'index/index',
      news: true,
      data: {
        model: model,
        uid: app.d.uid,
        listRows: 10,
        page: that.data.page
      },
    }).then(res => {
      let items = that.data.list;
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
        loading: false,
        b: true,
      })
      that.canFit();
    })
  },

  tabSelect: function(evt) {
    let id = evt.currentTarget.dataset.id;
    let that = this;
    if (that.data.tabCur == id)
      return;
    that.setData({
      tabCur: id,
      scrollLeft: (id - 1) * 140,
      loading: true,
      page: 1,
      tagIndex: 0,
      list: [],
      bottoming: false,
      showBottomLoading: true,
    })
    setTimeout(function() {
      that.loadIndex();
    }, 600)

  },

  tagSelect: function(evt) {
    let id = evt.currentTarget.dataset.id;
    let that = this;
    if (that.data.tagIndex == id)
      return;
    that.setData({
      tagIndex: id,
      loading: true,
      page: 1,
      list: false,
      bottoming: false,
      showBottomLoading: true,
    })
    setTimeout(function() {
      that.loadIndex();
    }, 600)
  },

  detailTap: function(evt) {
    let mid = evt.currentTarget.dataset.id;
    let model = evt.currentTarget.dataset.model;
    util.detailTap(model, mid);
  },

  swiperTap: function(evt) {
    console.log('------------', evt)
    let mid = evt.currentTarget.dataset.mid;
    let model = evt.currentTarget.dataset.model;
    util.detailTap(model, mid);
  },

  personalTap: function(evt) {
    let uid = evt.currentTarget.dataset.uid;
    util.personal(uid);
  },

  toOtherTap: function(evt) {
    console.log('-------- 跳转其他小程序')
    let appId = evt.currentTarget.dataset.appid;
    let path = evt.currentTarget.dataset.path;
    wx.navigateToMiniProgram({
      appId: appId,
      path: path,
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log('------打开成功')
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
    let that = this;
    if (that.data.list.length < that.data.total && that.data.bottoming) { //有更多时加载
      that.setData({
        showBottomLoading: true,
        bottoming: false,
      })
      setTimeout(function() {
        that.setData({
          page: that.data.page + 1,
        })
        that.loadIndex();
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})