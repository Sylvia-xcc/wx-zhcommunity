// pages/community/community-jifen-shop-detail/community-jifen-shop-detail.js
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
    banner: ['/images/ershou1.png', '/images/ershou2.png'],
    videoUrl: 'https://www.fengzhankeji.com/qizhuhome/data/upload/2019-11-27/5dde39f275eea.mp4',
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

  // 商品详情数据获取
  loadProductDetail: function () {
    var that = this;
    tip.loading();
    http.requestUrl({
      url: '/wxapp/product/detail',
      data: {
        pid: that.data.productId,
        uid: app.d.uid || 0
      },
    }).then(res => {
      let product = res.product;
      let isCollect = res.collection;

      let content = res.product.content;
      WxParse.wxParse('content', 'html', content, that, 0);

      let banner = product.banner;
      let attr_list = res.attr_list || [];

      let area_main = product.area_main || ''
      let area = area_main.split('|');

      var realData = {};
      realData['pid'] = that.data.productId;
      realData['name'] = product.name;
      realData['imgUrl'] = product.thumb;
      realData['price'] = (app.d.vip >= 3) ? product.price_vip : product.price_yh;
      realData['price_yj'] = product.price;
      realData['stock'] = product.stock;
      realData['buynum'] = 1;
      realData['attrValueList'] = attr_list;
      that.setData({
        product: product,
        isCollect: isCollect,
        banner: banner,
        itemData: realData,
        video: product.video || '',
        area: area,
        cont: content,
      });
      setTimeout(function () {
        that.setData({
          isLoading: true,
        })
        tip.loaded()
      }, 100);
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