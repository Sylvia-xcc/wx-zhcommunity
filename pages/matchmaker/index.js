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
    tabCur: 0,
    banner: ['/images/ershou1.png', '/images/ershou2.png'],
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    loading: true,
    msgNum: 1,
    scrollLeft: 0,
    modalName: null,
    region: [],
    xueliArray: [],
    xueliIndex: -1,
    xueliIndex2: -1,
    ageArray: [],
    ageIndex: -1,
    ageIndex2: -1,
    detail: null,
    user: null,
    city: [],
    cityIndex: -1,
    large: false,
    status: 0,
    a: false,
    b: false,
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
    if (!util.hasAuthorize())
      return;
    this.loadOwnInfo();
  },

  loadOwnInfo: function(init = true) {
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
        console.log('------ init 红娘', res)
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
          if (init)
            that.loadTab();
          else
            tip.loaded();
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
    else if (that.data.tabCur == 2)
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
        loading: false,
      })
      setTimeout(function() {
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
    if (that.data.isLoading)
      tip.loading();
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
          isLoading: false,
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
      that.reset();
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
      that.reset();
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
      that.loadRandInfo();
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
      list: [],
      loading: true,
    })
    setTimeout(function() {
      that.loadList();
    }, 400);
  },

  reset: function() {
    let that = this;
    that.setData({
      page: 1,
      bottoming: false,
      showBottomLoading: true,
    })
    that.loadList();
  },

  editTap: function(evt) {
    wx.navigateTo({
      url: '/pages/matchmaker/matchmaker-edit/matchmaker-edit?uid=' + app.d.uid,
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


  loadUser: function() {
    let that = this;
    tip.loading();
    that.canFit();
    if (!that.data.a)
      that.loadInfoList();
    if (!that.data.b)
      that.loadCityList();
  },

  canFit: function() {
    let that = this;
    if (that.data.a && that.data.b) {
      setTimeout(function() {
        tip.loaded();
        that.loadStatusInfo();
        that.loadLoveInfo();
        that.loadNoLoveInfo();
      }, 400)
    }
  },

  loadInfoList: function() {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/info',
      news: true,
    }).then(res => {
      that.setData({
        xueliArray: res.data.education,
        ageArray: res.data.age,
        a: true,
      })
      that.canFit();
    })
  },

  loadCityList: function(id = 820) {
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
        b: true,
      })
      that.canFit();
    })
  },

  // 偏好设置===============================
  loadLoveInfo: function(evt) {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/preference',
      news: true,
      data: {
        uid: app.d.uid,
      },
    }).then(res => {
      if (res.data == null)
        return;
      let ages = that.data.ageArray;
      let age = -1;
      for (var i = 0; i < ages.length; i++) {
        if (ages[i].id == res.data.age)
          age = i;
      }
      let educations = that.data.xueliArray;
      let education = -1;
      for (i = 0; i < educations.length; i++) {
        if (educations[i].id == res.data.education)
          education = i;
      }
      let citys = that.data.city;
      let city = -1;
      for (i = 0; i < citys.length; i++) {
        if (citys[i].id == res.data.city)
          city = i;
      }

      that.setData({
        cityIndex: city,
        xueliIndex: education,
        ageIndex: age,
        large: res.data.large == 1 ? true : false
      })
    })
  },
  phSetupTap: function(evt) {
    let that = this;
    let data = {
      uid: app.d.uid,
      large: that.data.large ? 1 : 0
    };
    if (that.data.cityIndex >= 0) {
      console.log('------城市：', that.data.city[that.data.cityIndex].name);
      data.city = that.data.city[that.data.cityIndex].id;
    }
    console.log('------范围：', that.data.large);
    if (that.data.xueliIndex >= 0) {
      console.log('------学历：', that.data.xueliArray[that.data.xueliIndex].name);
      data.education = that.data.xueliArray[that.data.xueliIndex].id;
    }
    if (that.data.ageIndex >= 0) {
      console.log('------年龄：', that.data.ageArray[that.data.ageIndex].name);
      data.age = that.data.ageArray[that.data.ageIndex].id;
    }
    that.hideModal();
    http.requestUrl({
      url: 'matchmaker/preference',
      news: true,
      data: data,
      method: 'post',
    }).then(res => {
      tip.success('修改成功', 1000);
    })

  },

  xueliPickerChange: function(evt) {
    this.setData({
      xueliIndex: evt.detail.value,
    })
  },

  agePickerChange: function(evt) {
    this.setData({
      ageIndex: evt.detail.value,
    })
  },

  cityRegionChange: function(evt) {
    this.setData({
      cityIndex: evt.detail.value,
    })
  },

  switchTap: function(evt) {
    this.setData({
      large: evt.detail.value,
    })
  },

  //状态设置================================
  loadStatusInfo: function() {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/lock',
      news: true,
      data: {
        uid: app.d.uid
      },
    }).then(res => {
      that.setData({
        status: res.data.status,
      })
    })
  },
  statusTap: function(evt) {
    let that = this;
    wx.showActionSheet({
      itemList: ['开启推荐', '停止推荐'],
      success(res) {
        let status = res.tapIndex;
        if (status == that.data.status)
          return;
        http.requestUrl({
          url: 'matchmaker/lock',
          news: true,
          method: 'post',
          data: {
            uid: app.d.uid,
            status: status
          },
        }).then(res => {
          tip.success('设置成功', 1000);
          that.setData({
            status: status,
          })
        })
      },
    })
  },

  //推荐设置=========================================
  loadNoLoveInfo: function() {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/shield',
      news: true,
      data: {
        uid: app.d.uid
      },
    }).then(res => {
      if (res.data == null)
        return;
      let ages = that.data.ageArray;
      let age = -1;
      for (var i = 0; i < ages.length; i++) {
        if (ages[i].id == res.data.age)
          age = i;
      }
      let educations = that.data.xueliArray;
      let education = -1;
      for (i = 0; i < educations.length; i++) {
        if (educations[i].id == res.data.education)
          education = i;
      }
      that.setData({
        xueliIndex2: education,
        ageIndex2: age,
      })
    })
  },

  tjSetupTap: function(evt) {
    let that = this;
    let data = {};
    if (that.data.xueliIndex2 >= 0) {
      console.log('------学历：', that.data.xueliArray[that.data.xueliIndex2].name);
      data.education = that.data.xueliArray[that.data.xueliIndex2].id;
    }
    if (that.data.ageIndex2 >= 0) {
      console.log('------年龄：', that.data.ageArray[that.data.ageIndex2].name);
      data.age = that.data.ageArray[that.data.ageIndex2].id;
    }
    that.hideModal();
    if (JSON.stringify(data) === '{}')
      return;
    data.uid = app.d.uid;
    http.requestUrl({
      url: 'matchmaker/shield',
      news: true,
      data: data,
      method: 'post',
    }).then(res => {
      tip.success('修改成功', 1000);
    })

  },

  xueliPickerChange2: function(evt) {
    this.setData({
      xueliIndex2: evt.detail.value,
    })
  },

  agePickerChange2: function(evt) {
    this.setData({
      ageIndex2: evt.detail.value,
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