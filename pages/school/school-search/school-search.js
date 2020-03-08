// pages/school/school-search/school-search.js
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({
  data: {
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    searchValue: '',
    isLoading: true
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
  },

  doSearch() {
    let that = this;
    let searchKey = that.data.searchValue;
    console.log('===> search', searchKey)
    if (searchKey == '' || searchKey == undefined) {
      tip.confirm('请输入相关搜索')
      return;
    }
    that.setData({
      page: 1,
      bottoming: true,
      showBottomLoading: false,
      isLoading: true
    })
    tip.loading('加载中...')
    setTimeout(function() {
      that.loadList();
    }, 500)

  },

  searchValueInput(evt) {
    let that = this;
    that.setData({
      searchValue: evt.detail.value
    })
    if (!that.data.searchValue) {
      that.setData({
        list: [],
        page: 1,
      })
    }
  },

  loadList: function() {
    let that = this;
    that.loadList();
  },

  loadList: function() {
    let that = this;
    http.requestUrl({
      url: 'teacher/index',
      news: true,
      data: {
        listRows: 10,
        page: that.data.page,
        keywords: that.data.searchValue,
      },
    }).then(res => {
      let items = that.data.list;
      if (that.data.page == 10) {
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
        tip.loaded();
        that.setData({
          isLoading: false,
        })
      }, 200)
    })
  },

  //详情
  detailTap: function (evt) {
    let id = evt.currentTarget.dataset.lid;
    wx.navigateTo({
      url: '/pages/school/school-course-detail/school-course-detail?id=' + id,
    })
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
})