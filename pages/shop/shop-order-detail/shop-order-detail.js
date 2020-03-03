// pages/shop/shop-order-detail/shop-order-detail.js
var app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    productData: [],
    orderData: {},
    type: 1,
    isLoading: false,
    jifen:0,
    totalNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:',options)
    let that = this;
    that.setData({
      orderId: options.id || 0,
    })
    if (options.from2 == 'ruihuan') {
      that.setData({
        type: 2
      })
      that.loadJifenOrderInfo();
    } else {
      that.loadOrderInfo();
    }

  },

  loadOrderInfo: function (type) {
    let that = this;
    http.requestUrl({
      url: '/wxapp/Order/order_details',
      data: {
        order_id: that.data.orderId,
        uid: app.d.uid,
      },
      loading: true,
      method: 'post',
    }).then(res => {
      let jifen = 0;
      let items = res.pro;
      for(var i=0; i<items.length; i++){
        jifen += (parseInt(items[i].pro_jifen) * parseInt(items[i].pro_num));
        totalNum += parseInt(items[i].pro_num);
      }
      that.setData({
        productData: res.pro,
        orderData: res.ord,
        jifen:jifen,
        totalNum:totalNum,
        isLoading: true,
      })
    })
  },

  loadJifenOrderInfo: function () {
    let that = this;
    http.requestUrl({
      url: '/wxapp/jifenProduct/order_detail',
      data: {
        order_id: that.data.orderId,
        uid: app.d.uid,
      },
      loading: true,
      method: 'post',
    }).then(res => {
      let data = res.data
      data.pay_type = '积分兑换';
      data.kuaidi_number = data.kuaidi_num;
      data.price = data.pro_jifen;
      data.express_money = 0;
      data.amount = data.total;
      data.order_status = data.status == 10 ? '待发货' : data.status == 20 ? '待收货' : '交易完成';
      let pro = {};
      pro.pro_id = data.pid;
      pro.pro_thumb = data.pro_photo;
      pro.pro_name = data.pro_name;
      pro.pro_price = data.pro_jifen;
      pro.pro_num = data.num;
      that.setData({
        orderData: data,
        productData: [pro],
        isLoading: true,
      })
    })
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
            url: '/pages/user/user-chongzhi/user-chongzhi',
          })
        })
        return;
      }
    }
    that.setData({
      paytype: payType,
    })
    //创建订单
    http.requestUrl({
      url: 'wxapp/Payment/payment',
      method: 'post',
      data: {
        uid: app.d.uid,
        pay_type: that.data.paytype,
        use_jifen: 0, //that.data.use_jifen ? 1 : 0
        address_id: that.data.address.id, //地址的id
        remark: that.data.remark, //用户备注
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

})