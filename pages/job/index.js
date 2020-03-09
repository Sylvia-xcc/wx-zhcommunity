// pages/job/index.js
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
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    loading: true,
    currentTab: -1,
    displays: 'none',
    monthlypayArr: [],
    monthlypayIndex: 0,
    height: 800,
    treatmentArr: [],
    worktimeArr: [],
    worktimeIndex: 0,
    educationArr: [],
    educationId: 0,
    areaArr: [],
    areaIndex: 0,
    sortArr: [{
        id: 0,
        name: '不限'
      },
      {
        id: 1,
        name: '最近发布'
      },
      // {
      //   id: 2,
      //   name: '距离由近到远'
      // },
      // {
      //   id: 3,
      //   name: '距离由远到近'
      // },
    ],
    sortIndex: 0,
    jzmoneyArr: [{
        id: 0,
        name: '不限'
      },
      {
        id: 1,
        name: '100元以下'
      },
      {
        id: 2,
        name: '100-200元'
      },
      {
        id: 3,
        name: '200-300元'
      },
      {
        id: 4,
        name: '300元以上'
      },
    ],
    jzmoneyIndex: 0,
    jobArr: [],
    jobIndex: 0,
    shaixuanNum: 0,
    treatmentArr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      height: wx.getSystemInfoSync().windowHeight - 130,
      educationArr: Const.educationArr,
      worktimeArr: Const.worktimeArr,
      monthlypayArr: Const.monthlypayArr,
      areaArr: Const.areaArr,
      // treatmentArr: Const.treatmentArr,
    })
    console.log('=============>>', this.data.heigh);
    // console.log('------------- ', Const.areaArr);

    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page:1,
    })
    this.loadJobList();
  },

  //获取工作列表
  loadJobList: function() {
    let that = this;
    tip.loading();
    http.requestUrl({
      url: 'job/index',
      news: true,
    }).then(res => {
      let job = res.data;
      job.unshift({
        id: 0,
        name: '不限'
      });
      that.setData({
        jobArr: job
      })
      that.loadJobTreatmentList();
    })
  },

  //获取工作待遇列表
  loadJobTreatmentList: function() {
    let that = this;
    http.requestUrl({
      url: 'job/treatment',
      news: true,
    }).then(res => {
      let treatmentArr = res.data;
      for (var i = 0; i < treatmentArr.length; i++) {
        treatmentArr[i].selected = false;
      }
      treatmentArr.unshift({
        id: -1,
        name: '不限',
        selected: true
      })
      that.setData({
        treatmentArr: treatmentArr
      })
      tip.loaded();
      that.loadList();
    })
  },

  loadList: function(p = true) {
    if (this.data.treatmentArr.length <= 0 || this.data.jobArr.length <= 0)
      return;
    if (p) {
      this.setData({
        page:1,
        loading: true,
        bottoming: false,
        showBottomLoading: true,
      })
    }

    if (this.data.tabCur == 0)
      this.loadFulltimeList();
    else
      this.loadParttimeList();
  },

  //获取全职工作列表
  loadFulltimeList: function() {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    let area = that.data.areaArr[that.data.areaIndex].name;
    console.log('----------- 搜索区域：', area);
    let job = that.data.jobArr[that.data.jobIndex].id;
    console.log('----------- 搜索职业类型：', job, that.data.jobArr[that.data.jobIndex].name);
    let monthlypay = that.data.monthlypayArr[that.data.monthlypayIndex].id;
    console.log('----------- 搜索月薪', monthlypay, that.data.monthlypayArr[that.data.monthlypayIndex].name)
    let years = that.data.worktimeArr[that.data.worktimeIndex].id;
    console.log('----------- 搜索年限', years, that.data.worktimeArr[that.data.worktimeIndex].name);
    let education = that.data.educationArr[that.data.educationId].id;
    console.log('----------- 搜索学历', education, that.data.educationArr[that.data.educationId].name);
    let items = that.data.treatmentArr;
    let treatment = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].selected) {
        if (i == 0) {
          treatment = [];
          break;
        }
        treatment.push(items[i].id);
      }
    }
    console.log('---------- 搜索福利待遇', treatment);
    let data = {
      listRows: 10,
      page: that.data.page
    };
    let num = 0;
    if (area != '不限')
      data.area = area;
    if (job > 0)
      data.job = job;
    if (monthlypay > 0) {
      data.month_pay = monthlypay;
      num++;
    }
    if (years > 0) {
      data.years = years;
      num++;
    }
    if (education > 0) {
      data.education = education;
      num++;
    }
    if (treatment.length > 0) {
      data.treatment = treatment.join(',');
      num++;
    }
    that.setData({
      shaixuanNum: num
    })

    http.requestUrl({
      url: 'job/fulltimeList',
      news: true,
      data: data,
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
          isLoading: false,
        })
      }, 200)
    })
  },

  //获取兼职工作列表
  loadParttimeList: function() {
    let that = this;
    let area = that.data.areaArr[that.data.areaIndex].name;
    console.log('----------- 搜索区域：', area);
    let job = that.data.jobArr[that.data.jobIndex].id;
    console.log('----------- 搜索职业类型：', job, that.data.jobArr[that.data.jobIndex].name);
    let money = that.data.jzmoneyArr[that.data.jzmoneyIndex].id;
    console.log('----------- 搜索薪资', money, that.data.jzmoneyArr[that.data.jzmoneyIndex].name)
    console.log('----------- 搜索最近', that.data.sortIndex)
    let data = {
      listRows: 10,
      page: that.data.page
    };
    if (area != '不限')
      data.area = area;
    if (job > 0)
      data.job = job;
    if (money > 0)
      data.month_pay = money;
    if (that.data.sortIndex > 0)
      data.news = true;

    http.requestUrl({
      url: 'job/parttimeList',
      news: true,
      data: data,
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
    })
  },

  //类型选择
  tabSelect: function(evt) {
    let index = evt.currentTarget.dataset.id;
    let that = this;
    if (index == that.data.tabCur)
      return;
    that.setData({
      tabCur: index,
      displays: 'none',
      currentTab: -1,
      page: 1,
      bottoming: false,
      showBottomLoading: true,
      areaIndex: 0,
      jobIndex: 0,
      jzmoneyIndex: 0,
      sortIndex: 0,
      monthlypayIndex: 0,
      worktimeIndex: 0,
      educationId: 0,
    })
    let items = that.data.treatmentArr;
    for (var i = 0; i < items.length; i++) {
      if (i == 0) { //选择不限
        items[i].selected = true;
      } else {
        items[i].selected = false;
      }
    }
    that.setData({
      treatmentArr: items
    })
    that.loadList();
  },

  // 筛选
  tabNav: function(evt) {
    let that = this;
    let current = evt.currentTarget.dataset.current;
    let display = 'block'
    if (that.data.currentTab === current) {
      display = 'none';
      current = -1;
    }
    that.setData({
      displays: display,
      currentTab: current,
    })
  },
  // 隐藏筛选
  hideNav: function() {
    this.setData({
      displays: "none",
      currentTab: -1,
    })
  },

  //地区选择
  areaTap: function(evt) {
    let that = this;
    that.setData({
      areaIndex: evt.currentTarget.dataset.id
    });
    that.hideNav();
    that.loadList();
  },
  //排序选择
  sortTap: function(evt) {
    let that = this;
    that.setData({
      sortIndex: evt.currentTarget.dataset.id
    });
    that.hideNav();
    that.loadList();
  },

  //职业选择
  jobTap: function(evt) {
    let that = this;
    that.setData({
      jobIndex: evt.currentTarget.dataset.id
    });
    that.hideNav();
    that.loadList();
  },
  //薪资选择
  moneyTap: function(evt) {
    let that = this;
    that.setData({
      jzmoneyIndex: evt.currentTarget.dataset.id
    });
    that.hideNav();
    that.loadList();
  },

  //筛选-薪资
  selectMoneyTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      monthlypayIndex: id
    })
  },
  //筛选-福利
  selectFuliTap: function(evt) {
    console.log('------------>>>0 ',evt);
    let that = this;
    let id = evt.currentTarget.dataset.id;
    let items = that.data.treatmentArr;
    for (var i = 0; i < items.length; i++) {
      if (id == -1) { //选择不限
        items[i].selected = i == 0 ? true : false;
      } else {
        items[0].selected = false;
        if (items[i].id == id) {
          items[i].selected = !items[i].selected;
        }
      }
    }
    that.setData({
      treatmentArr: items
    })
  },
  //筛选-工作年限
  selectWorkTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      worktimeIndex: id
    })
  },
  //筛选-学历
  selectEducationTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      educationId: id
    })
  },
  //筛选确定
  shaixuanTap: function(evt) {
    let that = this;
    that.hideNav();
    that.loadList();
  },

  //详情
  detailTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/job/job-detail/job-detail?id=' + id + '&type=' + this.data.tabCur,
    })
  },

  //发布
  fabuTap: function (evt) {
    if (!util.hasAuthorize())
      return;
    wx.navigateTo({
      url: '/pages/job/job-fabu/job-fabu?type=' + this.data.tabCur,
    })
  },
  //搜索
  searchTap: function(evt) {
    wx.navigateTo({
      url: '/pages/job/job-search/job-search?tab=' + this.data.tabCur,
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
        that.loadList(false);
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})