// pages/job/job-search/job-search.js
Page({
  data: {
    tabCur: 0,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options)
    let that = this;
    that.setData({
      tabCur: options.tab || 0,
    })
    that.loadList();
  },

  loadList: function() {
    let that = this;
    if (that.data.tabCur == 0)
      that.loadFulltimeList();
    else
      that.loadParttimeList();
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
      data.treatment = treatment;
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
})