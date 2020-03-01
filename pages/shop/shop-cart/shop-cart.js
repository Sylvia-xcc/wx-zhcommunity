// pages/shop/shop-cart/shop-cart.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [],
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: true, // 全选状态，默认全选
    selectAllNum: 0, // 选择的数量，默认0
    isLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!util.hasAuthorize())
      return;
    if (!app.globalData.updateCart) {
      this.setData({
        isLoading: false
      })
      this.loadCartList();
    }
  },

  /**加载数据*/
  loadCartList: function () {
    let that = this;
    tip.loading();
    http.requestUrl({
      url: '/wxapp/order/cart',
      data: {
        uid: app.d.uid,
      },
    }).then(res => {
      app.globalData.updateCart = true;
      let cart = res.cart_list;
      for (var i = 0; i < cart.length; i++) {
        cart[i].selected = true;
      }
      cart.reverse();
      that.setData({
        carts: cart,
      });
      setTimeout(function () {
        that.setData({
          isLoading: true
        })
        tip.loaded();
      }, 100)
      that.getTotalPrice(); // 重新获取总价
    })
  },

  detailTap: function (evt) {
    var id = evt.currentTarget.dataset.pid;
    if (id <= 0)
      return;
    wx.navigateTo({
      url: '/pages/detail/detail?productId=' + id,
    })
  },

  // 计算总价
  getTotalPrice: function () {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    let totalnums = 0;
    let selectnums = 0;
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        total += parseInt(carts[i].num) * carts[i].price;
        totalnums += parseInt(carts[i].num);
        selectnums++;
      }
    }
    //改变全选的状态
    let selectAllStatus = selectnums >= carts.length ? true : false;
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      selectAllNum: totalnums,
      selectAllStatus: selectAllStatus
    });
  },

  //全选
  selectAll: function (evt) {
    let that = this;
    let {
      selectAllStatus,
      carts
    } = that.data;
    selectAllStatus = !selectAllStatus;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus; // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice(); // 重新获取总价
  },

  //单选
  selectList: function (evt) {
    const index = evt.currentTarget.dataset.index;
    let carts = this.data.carts;
    let selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice(); // 重新获取总价
  },

  //单个删除
  deleteList: function (evt) {
    let that = this;
    let index = evt.currentTarget.dataset.index;
    let carts = this.data.carts;
    if (carts.length <= 0) {
      return;
    }
    let cardId = carts[index].id;
    wx.showModal({
      title: '提示',
      content: '确认将该物品从购物车中移除？',
      success(res) {
        if (res.confirm) {
          http.requestUrl({
            url: '/wxapp/product/del_cart',
            data: {
              uid: app.d.uid,
              cart_id: cardId
            },
          }).then(res => {
            that.loadCartList();
          })
        }
      }
    })
  },
  //增加数量
  addCount: function (evt) {
    let that = this;
    let index = evt.currentTarget.dataset.index;
    let num = parseInt(that.data.carts[index].num);
    let cartId = evt.currentTarget.dataset.cartid;
    num = num + 1;
    that.updateGoodNum(cartId, num, index);
  },
  // 减少数量
  minusCount: function (evt) {
    let that = this;
    let index = evt.currentTarget.dataset.index;
    let num = parseInt(that.data.carts[index].num);
    let cartId = evt.currentTarget.dataset.cartid;
    if (num <= 1) {
      wx.showModal({
        title: '提示', //提示的标题,
        content: '最小购买数量为1', //提示的内容,
        showCancel: false, //是否显示取消按钮,
      });
      return;
    }
    num = num - 1;
    that.updateGoodNum(cartId, num, index);
  },
  //数量更新
  updateGoodNum: function (id, num, index) {
    let that = this;
    http.requestUrl({
      url: '/wxapp/product/up_cart',
      data: {
        uid: app.d.uid,
        num: num,
        cart_id: id
      }
    }).then(res => {
      let carts = that.data.carts;
      carts[index].num = num;
      that.setData({
        carts: carts,
      })
      that.getTotalPrice();
    })
  },
  //结算
  jiesuanTap: function (evt) {
    let that = this;
    var cartIds = '';
    for (var i = 0; i < that.data.carts.length; i++) {
      if (that.data.carts[i].selected) {
        cartIds += (that.data.carts[i].id + ',');
      }
    }
    if (cartIds === '') {
      tip.success('请选择商品！', 2000)
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/pay-cart/pay-cart?cartId=' + cartIds,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('--------- 下拉刷新')
    let that = this;
    wx.showNavigationBarLoading();
    setTimeout(function () {
      that.loadCartList();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 600)
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