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
    banner: ['/images/ershou1.png'],
    classify: [],
    cates: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.loadShopHome();
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
  loadProductList: function(cid, id) {
    let that = this;
    http.requestUrl({
      url: 'wxapp/index/cate_product',
      data: {
        cate_id: id,
        cid: cid,
        page: that.data.page,
        count: 10,
        uid: app.d.uid || 0
      },
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
      })

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
    })
    if (index != 0) {
      that.loadProductList(id, 0);
    }
  },

  catesTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    let cid = that.data.classify[that.data.tabCur - 1].id;
    that.loadProductList(cid, id);
  },

  detailTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop-detail/shop-detail?id=' + id,
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