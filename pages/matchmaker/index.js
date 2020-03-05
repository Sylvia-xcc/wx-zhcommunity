// pages/matchmaker/index.js
const app = getApp();
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
const Const = require('../../utils/const.js');
import tip from '../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 1,
    banner: ['/images/ershou1.png', '/images/ershou2.png'],
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    loading:true,
    msgNum: 2,
    scrollLeft: 0,
    modalName: null,
    region: [],
    xueliArray: [],
    xueliIndex: -1,
    yearsArray: [{
      id: 0,
      name: '不限'
    }, {
      id: 1,
      name: '20岁以下'
    }, {
      id: 2,
      name: '20-30岁'
    }, {
      id: 3,
      name: '30-40岁'
    }, {
      id: 4,
      name: '40-50岁'
    }, {
      id: 5,
      name: '50岁以上'
    }, ],
    yearsIndex: -1,
    detail: null,
    user: null,
    city:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!util.hasAuthorize())
      return;
    this.setData({
      xueliArray: Const.educationArr
    })
    this.loadOwnInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.loadTab();
  },

  loadCityList: function (id=820) {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/city',
      news: true,
      data: {
        province: id
      }
    }).then(res => {      
      that.setData({
        city: res.data,
      })
    })
  },

  loadOwnInfo: function() {
    let that = this;
    tip.loading();
    wx.request({
      url: app.d.hostUrlNew + 'matchmaker/own',
      data: {
        uid: app.d.uid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'get',
      success: function(res) {
        console.log('------', res)
        if (res.data.code == 3) {
          setTimeout(function() {
            tip.loaded();
            wx.redirectTo({
              url: '/pages/matchmaker/matchmaker-edit/matchmaker-edit',
            })
          }, 600)
        } else if (res.data.code == 1) {
          that.setData({
            user: res.data.data
          })
          that.loadTab();
        }
      },

    })
  },

  loadTab: function() {
    let that = this;
    if (that.data.tabCur == 0)
      that.loadRandInfo();
    else if (that.data.tabCur == 1)
      that.loadList();
    else if(that.data.tabCur==2)
      that.loadUser();
  },

  loadMsgList: function() {

  },

  loadList: function() {
    let that = this;
    if (that.data.msgNum == 0)
      that.loadMsgList();
    let url = (that.data.msgNum == 1) ? 'fallinlovelist' : (that.data.msgNum == 2) ? 'likeList' : (that.data.msgNum == 3) ? 'notlovelist' : 'tolikelist';
    http.requestUrl({
      url: 'matchmaker/' + url,
      news: true,
      data: {
        uid: app.d.uid,
        listRows: 10,
        page: that.data.page
      }
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

  //随机
  loadRandInfo: function() {
    let that = this;
    that.setData({
      loading: true,
    })
    tip.loading();
    http.requestUrl({
      url: 'matchmaker/rand',
      news: true,
      data: {
        uid: app.d.uid
      }
    }).then(res => {
      that.setData({
        detail: res.data
      })
      setTimeout(function() {
        tip.loaded();
        that.setData({
          loading: false,
        })
      }, 200)
    })
  },

  //操作
  caozuoTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    if (that.data.msgNum == 1) {

    } else if (that.data.msgNum == 2) {
      that.sendLoveTap(id);
    } else if (that.data.msgNum == 3) {
      that.wanhuiTap(id);
    } else {
      that.xindongTap(id);
    }
  },

  //送爱心
  sendLoveTap: function(id) {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/sendLove',
      news: true,
      data: {
        uid: app.d.uid,
        id: id,
      },
      method: 'post',
    }).then(res => {
      tip.success('送爱心成功', 1000);
    })
  },

  //挽回
  wanhuiTap: function(id) {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/wanhui',
      news: true,
      data: {
        uid: app.d.uid,
        id: id,
      },
      method: 'post',
    }).then(res => {
      tip.success('挽回成功', 1000);
    })
  },

  //心动
  xindongTap: function(id) {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/sendHeart',
      news: true,
      data: {
        uid: app.d.uid,
        id: id,
      },
      method: 'post',
    }).then(res => {
      tip.success('心动成功', 1000);
    })
  },

  //喜欢
  likeTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    http.requestUrl({
      url: 'matchmaker/addLike',
      news: true,
      data: {
        uid: app.d.uid,
        id: id,
      },
      method: 'post',
    }).then(res => {
      tip.success('关注成功', 1000);
    })
  },

  //不喜欢
  nolikeTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    http.requestUrl({
      url: 'matchmaker/addUnLike',
      news: true,
      data: {
        uid: app.d.uid,
        id: id,
      },
      method: 'post',
    }).then(res => {
      that.loadRandInfo();
    })
  },

  loadUser:function(){
    let that = this; 
    http.requestUrl({
      url: 'matchmaker/preference',
      news: true,
      data: {
        uid: app.d.uid,
      },
    }).then(res => {
      
    })
  },

  detailTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/matchmaker/matchmaker-personal/matchmaker-personal?id=' + id,
    })
  },

  tabSelectTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    let that = this;
    if (that.data.tabCur == id)
      return;
    that.setData({
      tabCur: id
    })
    that.loadTab();
  },

  tabSelect: function(evt) {
    let id = evt.currentTarget.dataset.id;
    let that = this;
    if (that.data.msgNum == id)
      return;
    this.setData({
      msgNum: id,
      scrollLeft: id * 100,
      page: 1,
      bottoming: false,
      showBottomLoading: true,
    })
    that.loadList();
  },

  editTap: function(evt) {
    wx.navigateTo({
      url: '/pages/matchmaker/matchmaker-edit/matchmaker-edit?uid='+app.d.uid,
    })
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
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
        that.loadList();
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})