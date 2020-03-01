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
    tabCur:2,
    scrollLeft: 0,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    banner:['/images/ershou1.png'],
    classify:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.loadRootCateTopLevel();
  },

  //一级分类
  loadRootCateTopLevel: function () {
    let that = this;
    http.requestUrl({
      url: 'wxapp/index/category',
      method: 'post',
      data: {},
    }).then((res) => {
      let list = res.list;
      that.setData({
        classify: list,
        banner:res.banner,
      });
      that.loadProductList();
    })
  },

  loadShopHome:function(){

  },

  /**物品分类列表数据*/
  loadProductList: function (loading = false) {
    // var that = this;
    // http.requestUrl({
    //   url: '/wxapp/product/getGoodsList',
    //   data: {
    //     cid: that.data.navTab || 0,
    //     ccid: that.data.cnavTab || 0,
    //     page: that.data.page,
    //     count: 10,
    //     uid: app.d.uid || 0
    //   },
    //   loading: loading,
    // }).then((res) => {
    //   let items = that.data.list;
    //   if (that.data.page == 1) {
    //     items = res.data;
    //   } else {
    //     items = items.concat(res.data);
    //   }
    //   that.setData({
    //     list: items,
    //     haveMore: (res.data.length <= 0) ? false : true
    //   })
    //   app.globalData.updataClassifty = true;
    //   if (!that.data.isLoading) {
    //     setTimeout(function () {
    //       that.setData({
    //         isLoading: true
    //       })
    //       tip.loaded();
    //     }, 300)
    //   }
    // })
  },

  tabSelect: function (evt) {
    let index = evt.currentTarget.dataset.index;
    let id = evt.currentTarget.dataset.id;
    let that = this;
    if (that.data.tabCur == index)
      return;
    that.setData({
      tabCur: index,
      scrollLeft: (index - 1) * 60,
      page:1,
    })
    that.loadProductList(id);
  },

  detailTap:function(evt){
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop-detail/shop-detail?id='+id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})