// pages/shop/shop-address/shop-address.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [],
    cartId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this;
    that.setData({
      cartId: options.cartId || 0,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    that.loadAddressList();
  },

  loadAddressList: function() {
    let that = this;
    http.requestUrl({
      url: '/wxapp/address/index',
      data: {
        uid: app.d.uid,
      }
    }).then(res => {
      let list = res.address_list;
      list.sort(function(vo1, vo2) {
        if (vo1.default > vo2.default)
          return -1;
        else if (vo1.default < vo2.default)
          return 1;
        else
          return 0
      })
      that.setData({
        address: res.address_list
      })
    })
  },

  //购物时选择的收货地址
  setDefault: function(evt) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    http.requestUrl({
      url: '/wxapp/Address/set_default',
      data: {
        uid: app.d.uid,
        addr_id: addrId
      }
    }).then(res => {
      var cartId = that.data.cartId;
      if (cartId > 0) {
        wx.redirectTo({
          url: '../../order/pay?cartId=' + cartId,
        });
      }
    })
  },

  //选择收货地址
  selectTap: function(evt) {
    let addrId = evt.currentTarget.dataset.id;
    let obj = evt.currentTarget.dataset.obj;
    app.globalData.address = obj;
    wx.navigateBack();
  },

  //编辑地址
  editAddress: function(evt) {
    let that = this;
    let addrId = evt.currentTarget.dataset.id;
    let addr = evt.currentTarget.dataset.item;

    wx.navigateTo({
      url: '/pages/shop/shop-address-edit/shop-address-edit?addrId=' + addrId,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

})