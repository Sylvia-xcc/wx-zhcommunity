// pages/shop/shop-pay-now/shop-pay-now.js
var app = getApp();
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
    coupon_list: [],
    totalPrice: '',
    pay_price: 0, //除优惠劵价格
    price: 0, //最终支付价格
    remark: '',
    paytype: "weixin",
    couponId: 0,
    coupon: null,
    isLoading: false,
    jifen: 0,
    totalNum: 0,
    showModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('----------立即支付页面：', options)
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
      url: '/wxapp/payment/buyNow',
      method: 'post',
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
        pay_price: res.pay_price,
        price: res.pay_price,
        totalPrice: res.price, //不含运费价格
        userInfo: res.userinfo,
        // jifen_use: res.jifen_use,
        hasAddress: hasAddress,
        coupon_list: res.coupon_list, //优惠劵
        money: res.userinfo.money,
        vip: res.userinfo.is_vip,
        isLoading: true,
        jifen: jifen,
        totalNum: totalNum
      });
      let couponId = (res.coupon_list.length > 0) ? res.coupon_list[0].coupon_id : 0;
      that.updateCoupons(couponId);
      tip.loaded();
    });
  },

  //提交订单
  submitTap: function (evt) {
    //创建订单
    var that = this;
    http.requestUrl({
      url: '/wxapp/payment/payment',
      method: 'post',
      data: {
        uid: app.d.uid,
        pay_type: that.data.paytype,
        address_id: that.data.address.id, //地址的id
        remark: that.data.remark, //用户备注
        use_jifen: 0, //that.data.use_jifen ? 1 : 0
        coupons_id: that.data.couponId,
        pid: that.data.productId,
        num: that.data.buyNum,
        buff: that.data.buff,
      },
    }).then((res) => {
      if (res.pay_type == 'cash') {
        that.paySuccess();
      } else if (res.pay_type == 'offline') {
        that.paySuccess();
      } else if (res.pay_type == 'weixin') {
        that.wxpay(res);
      }
    })
  },

  //调起微信支付
  wxpay: function (order) {
    let that = this
    http.requestUrl({
      url: '/wxapp/Wxpay/wxpay',
      data: {
        order_id: order.order_id,
        order_sn: order.order_sn,
        uid: app.d.uid,
      },
      method: 'POST',
    }).then((res) => {
      let order = res.arr;
      wx.requestPayment({
        timeStamp: order.timeStamp,
        nonceStr: order.nonceStr,
        package: order.package,
        signType: 'MD5',
        paySign: order.paySign,
        success: function (res) {
          that.paySuccess();
        },
        fail: function (res) {
          that.payFail();
        }
      })
    })
  },

  couponTap: function (evt) {
    this.selectComponent("#my-coupon").toggleModal();
  },

  toggleModal(evt) {
    let showModal = evt.detail.showModal;
    console.log('---------------', evt.detail)
    this.setData({
      showModal: showModal
    })
  },

  onCouponChoiceTap: function (evt) {
    console.log('----- 组件选择的优惠劵id', evt)
    let that = this;
    let couponId = evt.detail.couponId;
    that.updateCoupons(couponId);
  },
  //优惠劵计算价格
  updateCoupons: function (couponId) {
    let that = this;
    let pay_price = that.data.pay_price;
    let price = that.data.pay_price;
    let coupon = null;
    for (var i = 0; i < that.data.coupon_list.length; i++) {
      let item = that.data.coupon_list[i]
      if (item && item.coupon_id == couponId) {
        coupon = item;
        console.log(pay_price, item.coupon_amount)
        if (item.coupon_type.value == 10) { //满减
          price = util.sub(pay_price, item.coupon_amount);
        } else if (item.coupon_type.value == 20) {//折扣
          price = util.mul(pay_price, item.coupon_amount / 10);
        }
      }
    }
    console.log('------------- 优惠卷减', price)
    price = util.floatRound(price)
    price = price <= 0 ? 0.01 : price;
    that.setData({
      couponId: couponId,
      price: price,
      coupon: coupon
    })
  },

  remarkInput: function (evt) {
    this.setData({
      remark: evt.detail.value
    })
  },

  /**支付成功*/
  paySuccess: function () {
    wx.redirectTo({
      url: '../pay-success/pay-success',
    })
  },

  /**支付失败*/
  payFail: function () {
    wx.redirectTo({
      url: '../pay-fail/pay-fail',
    })
  },

  addressTap: function (evt) {
    wx.navigateTo({
      url: '/pages/address/address',
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