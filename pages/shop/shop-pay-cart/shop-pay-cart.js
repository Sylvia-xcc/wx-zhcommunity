// pages/shop/shop-pay-cart/shop-pay-cart.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartId: 0,
    address: null,
    productData: [],
    userInfo: null,
    fastPrice: 0,//运费
    totalPrice: 0,//实际支付
    hasAddress: false,
    remark: '',
    paytype: 'weixin',
    isLoading: false,
    totalNum: 0,
    jifen: 0,
    showModal: false,
    money: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:',options)
    let that = this;
    that.setData({
      cartId: options.cartId || 0
    })
    app.globalData.address = null;
    console.log('----load address', app.globalData.address);
    that.loadProductDetail();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('----show', app.globalData.address);
    if (app.globalData.address) {
      this.setData({
        address: app.globalData.address,
        hasAddress: app.globalData.address ? true : false,
      })
    }
  },

  /**物品详细信息*/
  loadProductDetail: function () {
    var that = this;
    tip.loading();
    http.requestUrl({
      url: '/wxapp/payment/buy_cart',
      method: 'post',
      data: {
        cart_id: that.data.cartId,
        uid: app.d.uid,
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
        userInfo: res.userinfo,
        hasAddress: hasAddress,
        isLoading: true,
        jifen: jifen||0,
        totalNum: totalNum,
        money: res.userinfo.money
      });
      tip.loaded();
    });
  },

  //提交订单
  submitTap: function (evt) {
    let that = this;
    let payType = evt.currentTarget.dataset.paytype;
    if (that.data.address == null) {
      tip.success('请填写收货地址')
      return;
    }
    if (payType == 'cash') {
      if (that.data.money < that.data.price) {
        tip.confirm('余额不足,是否前往充值').then(res => {
          wx.navigateTo({
            url: '/pages/user/chongzhi/chongzhi',
          })
        })
        return;
      }
    }
    that.setData({
      paytype: payType,
    })
    console.log('-----支付方式：', that.data.paytype)
    //创建订单
    http.requestUrl({
      url: '/wxapp/payment/payment',
      method: 'post',
      data: {
        uid: app.d.uid,
        cart_id: that.data.cartId,
        pay_type: that.data.paytype,
        address_id: that.data.address.id, //地址的id
        remark: that.data.remark, //用户备注
        use_jifen: 0, //that.data.use_jifen ? 1 : 0
        coupons_id: that.data.couponId,
      },
    }).then((res) => {
      if (res.pay_type == 'cash') {
        that.paySuccess();
      } else if (res.pay_type == 'offline') {
        that.paySuccess();
      } else if (res.pay_type == 'weixin') {
        //微信支付        
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
    }).then(res => {
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

  remarkInput: function (evt) {
    this.setData({
      remark: evt.detail.value
    })
  },

  /**支付成功*/
  paySuccess: function () {
    wx.redirectTo({
      url: '/pages/shop/shop-pay-result/shop-pay-result?type=success',
    })
  },

  /**支付失败*/
  payFail: function () {
    wx.redirectTo({
      url: '/pages/shop/shop-pay-result/shop-pay-result?type=fail',
    })
  },


  addressTap: function (evt) {
    wx.navigateTo({
      url: '/pages/shop/shop-address/shop-address',
    })
  },
})