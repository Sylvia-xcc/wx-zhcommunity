// pages/house/house-buy/house-buy-fabu/house-buy-fabu.js
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp()
const util = require('../../../../utils/util.js');
const http = require('../../../../utils/http.js');
const Const = require('../../../../utils/const.js');
import tip from '../../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, //0：求购；1：求租
    roomArr: [
      ['1室', '2室', '3室', '4室', '5室', '6室', '7室', '8室', '9室', '10室'],
      ['1厅', '2厅', '3厅', '4厅', '5厅', '6厅', '7厅', '8厅', '9厅', '10厅'],
      ['1卫', '2卫', '3卫', '4卫', '5卫', '6卫', '7卫', '8卫', '9卫', '10卫'],
    ], //户型
    roomIndex: [],
    homeTypeArr: [], //用途
    homeTypeIndex: -1,
    spaceArr: [], //面积
    spaceIndex: -1,
    renovationArray: [], //装修情况
    renovationIndex: -1,
    rentingTypeArray: [], //租房类型
    rentingTypeIndex: -1,
    tenancyArray: [],//租期
    tenancyIndex: -1,
    address: null,
    mobile:'',
    msg:'',
    name:'',
    areaArray:[],
    areaIndex:-1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options:', options);
    let that = this;
    let areaArr = Const.areaArr;
    areaArr.shift();
    that.setData({
      type: options.type || 0,
      // homeTypeArr: Const.homeTypeArr,
      // spaceArr: Const.spaceArr,
      // renovationArray: Const.renovationArr,
      rentingTypeArray: Const.rentingTypeArr,
      // tenancyArray: Const.tenancyArr,
      areaArray:areaArr,
    })
    wx.setNavigationBarTitle({
      title: that.data.type == 0 ? '发布求购信息' : '发布求租信息',
    })
    that.loadList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let address = app.globalData.select_address;
    if (address != null) {
      that.setData({
        address: address
      })
    }
  },

  loadList: function () {
    let that = this;
    http.requestUrl({
      url: 'house/info',
      news: true,
    }).then(res => {
      // res.data.area.shift();
      res.data.zx.shift();
      // res.data.zuqi.shift();
      res.data.yt.shift();
      // res.data.lg.shift();
      that.setData({
        spaceArr: res.data.area,
        renovationArray: res.data.zx,
        tenancyArray: res.data.zuqi,
        homeTypeArr: res.data.yt,
        // houseYearArray: res.data.lg,
      })
    })
  },

  sumbitTap: function () {
    let that = this;
    if (that.data.name == '') {
      tip.error('请填写联系人', 1000);
      return;
    }
    if(that.data.mobile==''){
      tip.error('请填写联系方式',1000);
      return;
    }    
    if (that.data.homeTypeIndex<0){
      tip.error('请选择房屋用途',1000);
      return;
    }
    if (that.data.spaceIndex<0){
      tip.error('请选择房屋面积',1000);
      return;
    }
    if (that.data.renovationIndex<0){
      tip.error('请选择装修情况',1000);
      return;
    }
    
    if (that.data.areaIndex <0){
      tip.error('请选择地址',1000);
      return;
    }

    console.log('------------- 联系人：', that.data.name);
    console.log('------------- 联系方式：', that.data.mobile);
    
    console.log('------------- 租房用途：', that.data.homeTypeArr[that.data.homeTypeIndex].value);
    console.log('------------- 租房面积：', that.data.spaceArr[that.data.spaceIndex].name);
    console.log('------------- 装修情况：', that.data.renovationArray[that.data.renovationIndex].value);
    
    console.log('------------- 地址：', that.data.areaArray[that.data.areaIndex].name);
    console.log('------------- 备注：', that.data.msg);

    if(that.data.type==0)
      that.buySumbit();
    else
      that.rentSubmit();
  },

  //求购提交
  buySumbit:function(){
    let that = this;
    if (that.data.roomIndex.length<=0){
      tip.error('请选择房屋户型', 1000);
      return;
    }
    console.log('------------- 房屋户型：', that.data.roomIndex);
    http.requestUrl({
      url: 'house/addAskBuy',
      news: true,
      method: 'post',
      data: {
        uid: app.d.uid,
        mobile: that.data.mobile,
        content: that.data.msg,
        yongtu: that.data.homeTypeArr[that.data.homeTypeIndex].id,
        room_decorate: that.data.renovationArray[that.data.renovationIndex].id,
        area: that.data.spaceArr[that.data.spaceIndex].id,
        name: that.data.name,
        layout1: that.data.roomIndex[0]+1,
        layout2: that.data.roomIndex[1] + 1,
        layout3: that.data.roomIndex[2] + 1,
        diqu: that.data.areaArray[that.data.areaIndex].name,
      }
    }).then(res => {
      tip.success('发布成功', 1000);
      wx.navigateBack()
    })
  },

  //求租提交
  rentSubmit:function(){
    let that = this;
    if (that.data.rentingTypeIndex < 0) {
      tip.error('请选择租房类型', 1000);
      return;
    }
    if (that.data.tenancyIndex < 0) {
      tip.error('请选择租期', 1000);
      return;
    }

    console.log('------------- 租房类型：', that.data.rentingTypeArray[that.data.rentingTypeIndex].name, that.data.rentingTypeArray[that.data.rentingTypeIndex].id);
    console.log('------------- 租期：', that.data.tenancyArray[that.data.tenancyIndex].value);

    http.requestUrl({
      url: 'house/addAskHire',
      news: true,
      method: 'post',
      data: {
        mobile: that.data.mobile,
        is_joint: that.data.rentingTypeArray[that.data.rentingTypeIndex].id == 1 ? 0 : 1,
        uid: app.d.uid,
        name: that.data.name,
        area: that.data.spaceArr[that.data.spaceIndex].id,
        decor: that.data.renovationArray[that.data.renovationIndex].id,
        zuqi: that.data.tenancyArray[that.data.tenancyIndex].id,
        address: that.data.areaArray[that.data.areaIndex].name,
        title: that.data.msg,
        yongtu: that.data.homeTypeArr[that.data.homeTypeIndex].id,
      }
    }).then(res => {
      tip.success('发布成功', 1000);
      wx.navigateBack()
    })
  },

  //户型选择
  roomColumnChange: function (evt) {
    console.log('------------ 户型选择:', evt.detail.value)
    this.setData({
      roomIndex: evt.detail.value
    })
  },
  //用途(住宅类型)选择
  homeTypePickerChange: function (evt) {
    this.setData({
      homeTypeIndex: evt.detail.value
    })
  },
  //面积选择
  spacePickerChange: function (evt) {
    this.setData({
      spaceIndex: evt.detail.value
    })
  },
  //装修情况选择
  renovationPickerChange: function (evt) {
    this.setData({
      renovationIndex: evt.detail.value
    })
  },
  //租房类型选择
  rentingTypePickerChange: function (evt) {
    this.setData({
      rentingTypeIndex: evt.detail.value
    })
  },
  //租期选择
  tenancyPickerChange: function (evt) {
    this.setData({
      tenancyIndex: evt.detail.value
    })
  },
  //区域选择
  areaPickerChange:function(evt){
    this.setData({
      areaIndex: evt.detail.value
    })
  },

  nameInput: function (evt) {
    this.setData({
      name: evt.detail.value
    })
  },

  mobileInput:function(evt){
    this.setData({
      mobile:evt.detail.value
    })
  },

  textareaInput:function(evt){
    this.setData({
      msg:evt.detail.value
    })
  },

  //地址选择
  addressTap: function (evt) {
    console.log('==============')
    wx.getSetting({
      success: function (res) {
        console.log(res);
        let a = res.authSetting['scope.userLocation']
        if (a = true) {
          wx.navigateTo({
            url: "/pages/position/position"
          });

        } else {
          wx.showToast({
            title: '需要授权，地理位置',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('======== onUnload 清除地址');
    app.globalData.select_address = null;
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