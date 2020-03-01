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
    youhui: 0,
    type: 1,
    isLoading: false,
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
      let youhui = Math.ceil(res.ord.price - res.ord.amount);
      that.setData({
        productData: res.pro,
        orderData: res.ord,
        youhui: youhui,
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

})