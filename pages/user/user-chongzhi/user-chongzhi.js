// pages/user/user-chongzhi/user-chongzhi.js
var app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    list:[],
    selectId:0,
    recharge:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadConfigInfo();
    this.loadRechargeList();
  },

  loadConfigInfo: function () {
    let that = this;
    http.requestUrl({
      url: 'common/config',
      news: true,
    }).then(res => {
      that.setData({
        recharge: res.data.recharge
      })
    })
  },

  loadRechargeList:function(){
    let that = this;
    http.requestUrl({
      url: 'wxapp/Recharge/getList',
    }).then((res) => {
      that.setData({
        list:res.data.list
      })
    })
  },

  selectedTap:function(evt){
    let id = evt.currentTarget.dataset.id;
    let money = evt.currentTarget.dataset.money;
    let that = this;
    if(that.data.selectId==id)
    {
      id = 0;
      money = '';
    }
    that.setData({
      selectId:id,
      money:money,
    })
  },

  submitTap: function(evt) {
    let that = this;
    if (that.data.money == '') {
      tip.error('请输入充值金额', 1000);
      return;
    }

    http.requestUrl({
      url: 'wxapp/Wxpay/wxpay_money',
      data: {
        money: that.data.money,
        uid: app.d.uid,
        recharge_id:that.data.selectId,
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
        success: function(ress) {
          console.log("-------- ress", ress)
          tip.success('充值成功', 1000)
        },
        fail: function(ress) {
          console.log(ress)
          tip.error('充值失败', 1000);
        }
      })
    })
  },

  moneyInput: function(evt) {
    this.setData({
      money: evt.detail.value,
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