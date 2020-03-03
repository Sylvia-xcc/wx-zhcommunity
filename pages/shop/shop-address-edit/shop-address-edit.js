// pages/shop/shop-address-edit/shop-address-edit.js
var app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addrId: 0,
    address: {},
    region: [],
    isdefault: 0,
    addressLen: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    let addrId = options.addrId || 0;

    if (addrId > 0) {
      that.setData({
        addrId: addrId
      })
      wx.setNavigationBarTitle({
        title: '编辑收货地址',
      })
      // console.log(that.data.address)
      that.loadAddressDetail();
    }
    that.setData({
      addressLen: options.len || 1
    })
  },

  loadAddressDetail: function () {
    let that = this;
    http.requestUrl({
      url: '/wxapp/Address/info',
      data: {
        uid: app.d.uid,
        aid: that.data.addrId
      }
    }).then(res => {
      let address = res.address;
      let region = [address.province, address.city, address.areas];
      that.setData({
        address: address,
        region: region,
        isdefault: address.default
      })
    })
  },

  //删除收货地址
  delAddress: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认删除？',
      success: function (res) {
        if (res.confirm) {
          http.requestUrl({
            url: '/wxapp/address/del_adds',
            data: {
              uid: app.d.uid,
              id_arr: that.data.addrId
            },
            method: 'post'
          }).then(res => {
            tip.success('删除成功', 1000)
            wx.navigateBack();
          })
        }
      }
    });
  },

  formSubmit: function (e) {
    console.log(e.detail.value)
    let that = this;
    let value = e.detail.value;
    if (value.name == '') {
      tip.success('填写用户名');
      return;
    }
    //判断手机号
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(value.mobile)) {
      tip.success('填写正确手机号')
      return;
    }
    if (value.address == '') {
      tip.success('填写详细地址');
      return;
    }
    if (that.data.addrId > 0) {
      //编辑保存
      http.requestUrl({
        url: '/wxapp/address/edit_adds',
        data: {
          uid: app.d.uid,
          aid: that.data.addrId,
          username: value.name,
          phone: value.mobile,
          province: that.data.region[0],
          city: that.data.region[1],
          areas: that.data.region[2],
          addr: value.address,
          default: that.data.isdefault,
        }
      }).then(res => {
        tip.success('保存成功');
        wx.navigateBack();
      })
    } else { //新建
      http.requestUrl({
        url: '/wxapp/address/add_adds',
        data: {
          uid: app.d.uid,
          username: value.name,
          phone: value.mobile,
          province: that.data.region[0],
          city: that.data.region[1],
          areas: that.data.region[2],
          addr: value.address,
          default: (that.data.addressLen == 0) ? 1 : that.data.isdefault,
        },
      }).then(res => {
        tip.success('保存成功');
        wx.navigateBack();
      })
    }

  },
  //地址选择器
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  //设置默认地址
  defaultTap: function (evt) {
    let that = this;
    that.setData({
      isdefault: that.data.isdefault == 0 ? 1 : 0
    })
  }
})