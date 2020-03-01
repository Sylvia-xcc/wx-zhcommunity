// pages/shop/shop-order/shop-order.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur:0,
    scrollLeft: 0, 
    status: ["all", "pay", "deliver", "receive", "evaluate", "finish"],
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    loading:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadOrderList();
  },

  //订单列表
  loadOrderList: function () {
    let that = this;
    if(that.data.isLoading)
      tip.loading();
    let status = that.data.status[that.data.tabCur];
    http.requestUrl({
      url: 'wxapp/order/lists',
      data: {
        uid: app.d.uid,
        order_type: status,
        page: that.data.page,
      },
    }).then(res => {
      let items = that.data.list;
      if (that.data.page == 1) {
        items = res.ord;
      } else {
        items = items.concat(res.ord);
      }
      that.setData({
        list: items,
        total: res.total_count,
        bottoming: true,
        showBottomLoading: false,
        loading:false,
      })
      setTimeout(function(){
        tip.loaded();
        that.setData({
          isLoading:false,
        })
      }, 400)
    })
  },

  tabSelect:function(evt){
    let id = evt.currentTarget.dataset.id;
    let that = this;
    if(that.data.tabCur==id)
      return;
    that.setData({
      tabCur:id,
      scrollLeft: (id - 1) * 60,
      list:[],
      loading:true,
    })
    that.loadOrderList();
  },

  detailTap:function(evt){
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop-order-detail/shop-order-detail?id='+id,
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
    let that = this;
    if (that.data.list.length < that.data.total && that.data.bottoming) { //有更多时加载
      that.setData({
        showBottomLoading: true,
        bottoming: false,
      })
      setTimeout(function () {
        that.setData({
          page: that.data.page + 1,
        })
        that.loadOrderList();
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})