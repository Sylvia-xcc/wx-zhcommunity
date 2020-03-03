// pages/shop/shop-detail/shop-detail.js
const app = getApp();
const WxParse = require('../../../wxParse/wxParse.js');
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId: 0,
    banner: [],
    video: '',
    product: null,
    attrValueList: [], //购物车属性数组
    itemData: {}, //购物车属性对象
    isCollect: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    let that = this;
    that.setData({
      productId: options.id || 0
    })

    that.loadProductDetail();

  },

  loadProductDetail: function() {
    let that = this;
    tip.loading();
    http.requestUrl({
      url: 'wxapp/product/detail',
      data: {
        uid: app.d.uid,
        pid: that.data.productId
      }
    }).then(res => {
      let product = res.product;

      let content = res.product.content;
      WxParse.wxParse('content', 'html', content, that, 0);

      let banner = product.banner;
      // for (var i = 0; i < product.banner.length; i++){
      //   banner.push(product.banner[i].url);
      // }
      let attr_list = res.attr_list || [];
      var realData = {};
      realData['pid'] = that.data.productId;
      realData['name'] = product.name;
      realData['imgUrl'] = product.thumb;
      realData['price'] = (that.data.vip == 0) ? product.price_yh : product.price_vip;
      realData['price_yj'] = product.price;
      realData['stock'] = product.stock;
      realData['buynum'] = 1;
      realData['attrValueList'] = attr_list;
      that.setData({
        product: product,
        isCollect: res.collection,
        banner: banner,
        itemData: realData,
        video: product.video,
      });
      setTimeout(function() {
        that.setData({
          isLoading: true,
        })
        tip.loaded()
      }, 100);
    })
  },

  buyTap: function(evt) {
    if (!util.hasAuthorize()) {
      return;
    }
    let optype = evt.currentTarget.dataset.optype;
    this.selectComponent('#my-commodity').toggleModal(optype);
  },

  collectTap: function(evt) {
    if (!util.hasAuthorize()) {
      return;
    }
    let that = this;
    http.requestUrl({
      url: 'wxapp/product/collection',
      data: {
        uid: app.d.uid,
        pid: that.data.productId
      }
    }).then(res => {
      let collect = that.data.isCollect;
      tip.success(collect == 0 ? '收藏成功' : '取消成功');
      that.setData({
        isCollect: collect == 0 ? 1 : 0
      })
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