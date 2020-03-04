// pages/community/community-jifen-shop-pay/community-jifen-shop-pay.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId: 0,
    buff: '',
    buyNum: 1,
    hasAddress: false,
    productData: [],
    fastPrice: 0,
    totalPrice: '',//最终支付价格
    remark: '',
    paytype: "weixin",
    isLoading: false,
    jifen: 0,
    totalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('----------积分支付页面：', options)
    let that = this;
    that.setData({
      productId: options.pid || 0,
      buff: options.buff || '',
      buyNum: options.buy_num || 1,
    });
    app.globalData.address = null;
    that.loadProductDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.address) {
      this.setData({
        address: app.globalData.address,
        hasAddress: true,
      })
    }
  },

  /**物品详细信息*/
  loadProductDetail: function () {
    var that = this;
    tip.loading();
    http.requestUrl({
      url: 'wxapp/payment/buy_now',
      data: {
        pid: that.data.productId,
        uid: app.d.uid,
        buff: that.data.buff,
        num: that.data.buyNum,
      },
    }).then((res) => {
      let hasAddress = (res.address) ? true : false;
      let jifen = 0;
      let totalNum = 0;
      for (var i = 0; i < res.product.length; i++) {
        jifen += (parseInt(res.product[i].jifen_get) * parseInt(res.product[i].num));
        totalNum += parseInt(res.product[i].num);
      }
      that.setData({
        address: res.address, //地址
        productData: res.product, //商品列表
        fastPrice: res.express_money, //运费
        totalPrice: res.price,
        hasAddress: hasAddress,
        isLoading: true,
        jifen: jifen || 0,
        totalNum: totalNum
      });
      tip.loaded();
    });
  },

  //提交订单
  submitTap: function (evt) {
    //创建订单
    var that = this;
    http.requestUrl({
      url: 'wxapp/payment/payment',
      method: 'post',
      data: {
        uid: app.d.uid,
        pay_type: 'integral',
        address_id: that.data.address.id, //地址的id
        remark: that.data.remark, //用户备注
        use_jifen: 0, //that.data.use_jifen ? 1 : 0
        pid: that.data.productId,
        num: that.data.buyNum,
        buff: that.data.buff,
      },
    }).then((res) => {
      tip.success('兑换成功',1000);
      wx.navigateBack();
    })
  },

  

  remarkInput: function (evt) {
    this.setData({
      remark: evt.detail.value
    })
  },  

  addressTap: function (evt) {
    wx.navigateTo({
      url: '/pages/shop/shop-address/shop-address',
    })
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