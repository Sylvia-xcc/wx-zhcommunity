// pages/shop/index.js
const app = getApp();
const util = require('../../utils/util.js');
const http = require('../../utils/http.js');
import tip from '../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    scrollLeft: 0,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    loading: true,
    banner: ['/images/ershou1.png'],
    classify: [],
    cates: [],
    cartId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.loadList();
  },

  loadList: function(p = true) {
    let that = this;
    if (p) {
      that.setData({
        bottoming: false,
        showBottomLoading: true,
        loading: true,
      })
    }

    setTimeout(function() {
      if (that.data.tabCur == 0)
        that.loadShopHome();
      else
        that.loadProductList();
    }, 600)
  },

  loadShopHome: function() {
    let that = this;
    if (that.data.isLoading)
      tip.loading();
    http.requestUrl({
      url: 'wxapp/index/index',
      data: {},
    }).then((res) => {
      that.setData({
        banner: res.banner,
        list: res.product_new,
        classify: res.cate_one,
        loading: false,
        bottoming: true,
        showBottomLoading: false,
        total:res.product_new.length,
      });
      setTimeout(function() {
        tip.loaded();
        that.setData({
          isLoading: false,
        });
      }, 600)
    })
  },

  /**物品分类列表数据*/
  loadProductList: function() {
    let that = this;
    let cid = that.data.classify[that.data.tabCur - 1].id;
    http.requestUrl({
      url: 'wxapp/index/cate_product',
      data: {
        cate_id: that.data.cartId,
        cid: cid,
        p: that.data.page,
        count: 10,
        uid: app.d.uid || 0
      },
      method: 'post',
    }).then((res) => {
      let items = that.data.list;
      if (that.data.page == 1) {
        items = res.product_list;
      } else {
        items = items.concat(res.product_list);
      }
      that.setData({
        list: items,
        total: res.page.totalRows,
        cates: res.category,
        bottoming: true,
        showBottomLoading: false,
        loading: false,
      })
      console.log('-----------------', that.data.total, that.data.list.length)
    })
  },

  tabSelect: function(evt) {
    let index = evt.currentTarget.dataset.index;
    let id = evt.currentTarget.dataset.id;
    let that = this;
    if (that.data.tabCur == index)
      return;
    that.setData({
      tabCur: index,
      scrollLeft: (index - 1) * 60,
      page: 1,
      cartId: 0,
      list:[],
    })
    that.loadList();
  },

  catesTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      cartId: id,
    })
    that.loadProductList();
  },

  detailTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop-detail/shop-detail?id=' + id,
    })
  },

  searchTap:function(evt){
    wx.navigateTo({
      url: '/pages/shop/shop-search/shop-search',
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