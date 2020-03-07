// pages/house/house-sell/house-sell-fabu/house-sell-fabu.js
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
    floorArr: [
      ['1层', '2层', '3层', '4层', '5层', '6层', '7层', '8层', '9层', '10层', '11层', '12层', '13层', '14层', '15层', '16层', '17层', '18层', '19层', '20层', '21层', '22层', '23层', '24层', '25层', '26层', '27层', '28层', '29层', '30层', '31层', '32层'],
      ['1层', '2层', '3层', '4层', '5层', '6层', '7层', '8层', '9层', '10层', '11层', '12层', '13层', '14层', '15层', '16层', '17层', '18层', '19层', '20层', '21层', '22层', '23层', '24层', '25层', '26层', '27层', '28层', '29层', '30层', '31层', '32层']
    ], //楼层--32层
    floorIndex: [],
    renovationArray: [], //装修
    renovationIndex: -1,
    liftArray: [], //电梯
    liftIndex: -1,
    orientationsArray: [], //朝向
    orientationsIndex: -1,
    houseTypeArray: [], //房屋类型
    houseTypeIndex: -1,
    houseYearArray: [], //房屋年龄
    houseYearIndex: -1,
    area: '', //房屋面积
    name: '', //小区名字
    sellpirce: '', //小区售价
    houseSpeArray: [], //特殊选项(多选)
    houseSpeIndex: [],
    desc: '', //
    displays: 'block',
    videoUrl: '',
    uploadPic: [],
    address: null,
    roomTypeArray: [{
      id: 1,
      value: '主卧'
    }, {
      id: 2,
      value: '次卧'
    }, {
      id: 3,
      value: '客卧'
    }, ],
    roomTypeIndex: -1,
    rentpirce: '',
    payTypeArray: [],
    payTypeIndex: -1,
    linkname: '',
    mobile: '',
    rentingTypeArray: [], //租房类型
    rentingTypeIndex: 0,
    ruzhuArray: [], //入住方式
    ruzhuIndex: -1,
    zuqiArray: [], //租期，
    zuqiIndex: -1,
    title: '',
    chanquan: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    let that = this;
    console.log('------------', that.data.rentingTypeArray, Const.rentingTypeArr)
    that.setData({
      type: options.type || 0,
      rentingTypeArray: Const.rentingTypeArr,
    })
    wx.setNavigationBarTitle({
      title: that.data.type == 0 ? '发布卖房信息' : '发布租房信息',
    })
    that.loadList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    let address = app.globalData.select_address;
    if (address != null) {
      that.setData({
        address: address
      })
    }
  },

  loadList: function() {
    let that = this;
    http.requestUrl({
      url: 'house/info',
      news: true,
    }).then(res => {
      res.data.dt.shift();
      res.data.zx.shift();
      res.data.ts.shift();
      res.data.yt.shift();
      res.data.lg.shift();
      that.setData({
        liftArray: res.data.dt,
        renovationArray: res.data.zx,
        houseSpeArray: res.data.ts,
        houseTypeArray: res.data.yt,
        houseYearArray: res.data.lg,
        ruzhuArray: res.data.ruzhu,
        payTypeArray: res.data.pay_type,
        zuqiArray: res.data.zuqi,
        orientationsArray: res.data.cx,
      })
    })
  },

  sumbitTap: function() {
    let that = this;

    if (that.data.title == '') {
      tip.error('请填写发布标题', 1000);
      return;
    }
    if (that.data.name == '') {
      tip.error('请填写小区名称', 1000);
      return;
    }
    if (that.data.roomIndex.length <= 0) {
      tip.error('请选择房屋户型', 1000);
      return;
    }
    if (that.data.area == '') {
      tip.error('请填写房屋面积', 1000);
      return;
    }
    if (that.data.floorIndex.length <= 0) {
      tip.error('请选择房屋楼层', 1000);
      return;
    }
    if (that.data.renovationIndex < 0) {
      tip.error('请选择装修情况', 1000);
      return;
    }
    if (that.data.liftIndex < 0) {
      tip.error('请选择电梯情况', 1000);
      return;
    }
    if (that.data.address == null) {
      tip.error('请选择房屋位置', 1000);
      return;
    }
    if (that.data.linkname == '') {
      tip.error('请填写联系人', 1000);
      return;
    }
    if (!util.filterMobile(that.data.mobile)) {
      // tip.error('请填写联系电话', 1000);
      return;
    }
    if (that.data.orientationsIndex < 0) {
      tip.error('请选择房屋朝向', 1000);
      return;
    }
    if (that.data.uploadPic.length <= 0) {
      tip.error('请上传图片', 1000);
      return;
    }

    console.log('-------- 发布标题：', that.data.title);
    console.log('-------- 小区名称：', that.data.name);
    console.log('-------- 面积：', that.data.area);
    console.log('-------- 房屋楼层：', that.data.floorIndex);
    console.log('-------- 装修情况：', that.data.renovationArray[that.data.renovationIndex].id, that.data.renovationArray[that.data.renovationIndex].value);
    console.log('-------- 是否有电梯', that.data.liftArray[that.data.liftIndex].id, that.data.liftArray[that.data.liftIndex].value);
    console.log('-------- 房屋朝向:', that.data.orientationsArray[that.data.orientationsIndex].name);

    console.log('-------- 房屋特色：', that.data.houseSpeIndex);
    console.log('-------- 房屋描述：', that.data.desc);
    console.log('-------- 户型', that.data.roomIndex);
    console.log('-------- 联系人电话：', that.data.mobile);
    console.log('-------- 联系人称呼：', that.data.linkname);
    console.log('-------- 地址：', that.data.address.address);

    if (that.data.type == 0)
      that.houseSellSumbit();
    else
      that.houseRentSumbit();
  },

  //卖房-提交
  houseSellSumbit: function() {
    let that = this;

    if (that.data.houseTypeIndex < 0) {
      tip.error('请填写房屋类型', 1000);
      return;
    }
    if (that.data.houseYearIndex < 0) {
      tip.error('请选择房屋年龄', 1000);
      return;
    }
    if (that.data.sellpirce == '') {
      tip.error('请填写房屋售价', 1000);
      return;
    }
    if (that.data.chanquan == '') {
      tip.error('请填写产权年限', 1000);
      return;
    }

    console.log('-------- 房屋类型：', that.data.houseTypeArray[that.data.houseTypeIndex].value);
    console.log('-------- 房屋年龄：', that.data.houseYearArray[that.data.houseYearIndex].value);
    console.log('-------- 房屋售价:', that.data.sellpirce);
    console.log('-------- 房屋产权:', that.data.chanquan);
    let videoUrl = that.data.videoUrl;
    let uploadPic = util.copyObj(that.data.uploadPic);
    if (videoUrl != '')
      uploadPic.push(videoUrl);
    let temp = [];
    let files = [];
    tip.loading('发布中...');
    for (var i = 0; i < uploadPic.length; i++) {
      temp.push(
        http.uploadFile({
          tempFilePaths: uploadPic[i]
        }).then(res => {
          if (typeof res == 'string') {
            res = JSON.parse(res);
          }
          console.log('上传完路径', res)
          if (res.code == 1)
            files.push(res.data.url);
        })
      );
    }

    Promise.all(temp).then(res => {
      let content = JSON.stringify(files);
      console.log('-------上传完成', files, content);
      http.requestUrl({
        url: 'house/addBuy',
        news: true,
        method: 'post',
        data: {
          name: that.data.name,
          layout1: that.data.roomIndex[0] + 1,
          layout2: that.data.roomIndex[1] + 1,
          layout3: that.data.roomIndex[2] + 1,
          measure: that.data.area,
          top: that.data.floorIndex[1] + 1,
          live: that.data.floorIndex[0] + 1,
          room_decorate: that.data.renovationArray[that.data.renovationIndex].id,
          dt: that.data.liftArray[that.data.liftIndex].id,
          money: that.data.sellpirce,
          u_mobile: that.data.mobile,
          photo: content,
          chanquan: that.data.chanquan,
          address: that.data.address.address,
          content: that.data.desc,
          house_type: that.data.houseTypeArray[that.data.houseTypeIndex].id,
          u_name: that.data.linkname,
          tese: that.data.houseSpeIndex.join(','),
          uid: app.d.uid,
          title: that.data.title,
          chaoxiang: that.data.orientationsArray[that.data.orientationsIndex].id,
          house_age: that.data.houseYearArray[that.data.houseYearIndex].id,
        }
      }).then(res => {
        tip.loaded();
        tip.success('发布成功', 1000);
        wx.navigateBack();
      })
    })
  },

  //租房-提交
  houseRentSumbit: function() {
    let that = this;
    if (that.data.roomTypeIndex < 0 && that.data.rentingTypeIndex == 1) {
      tip.error('请选择卧室类型', 1000);
      return;
    }
    if (that.data.rentpirce == '') {
      tip.error('请填写房屋租金', 1000);
      return;
    }
    if (that.data.zuqiIndex < 0) {
      tip.error('请选择租期', 1000);
      return;
    }
    if (that.data.ruzhuIndex < 0) {
      tip.error('请选择入住情况', 1000);
      return;
    }
    if (that.data.payTypeIndex < 0) {
      tip.error('请选择付款方式', 1000);
      return;
    }
    if (that.data.rentingTypeIndex == 1)
      console.log('-------- 卧室类型:', that.data.roomTypeArray[that.data.roomTypeIndex].id, that.data.roomTypeArray[that.data.roomTypeIndex].value);
    console.log('-------- 入住情况', that.data.ruzhuArray[that.data.ruzhuIndex].id, that.data.ruzhuArray[that.data.ruzhuIndex].name);
    console.log('-------- 租金：', that.data.rentpirce);
    console.log('-------- 租期：', that.data.zuqiArray[that.data.zuqiIndex].id, that.data.zuqiArray[that.data.zuqiIndex].value)
    console.log('-------- 付款方式：', that.data.payTypeArray[that.data.payTypeIndex].id, that.data.payTypeArray[that.data.payTypeIndex].name)

    let videoUrl = that.data.videoUrl;
    let uploadPic = util.copyObj(that.data.uploadPic);
    if (videoUrl != '') {
      uploadPic.push(videoUrl);
    }
    let temp = [];
    let files = [];
    tip.loading('发布中...');
    for (var i = 0; i < uploadPic.length; i++) {
      temp.push(
        http.uploadFile({
          tempFilePaths: uploadPic[i]
        }).then(res => {
          if (typeof res == 'string') {
            res = JSON.parse(res);
          }
          console.log('上传完路径', res)
          if (res.code == 1)
            files.push(res.data.url);
        })
      );
    }

    Promise.all(temp).then(res => {
      let content = JSON.stringify(files);
      console.log('-------上传完成', files, content);
      let url = that.data.rentingTypeIndex == 0 ? 'house/addAllHire' : 'house/addHire';
      let roomType = (that.data.rentingTypeIndex == 1) ? that.data.roomTypeArray[that.data.roomTypeIndex].id : 0;
      http.requestUrl({
        url: url,
        news: true,
        method: 'post',
        data: {
          name: that.data.name,
          measure: that.data.area,
          room_type: roomType,
          top: that.data.floorIndex[1] + 1,
          live: that.data.floorIndex[0] + 1,
          room_decorate: that.data.renovationArray[that.data.renovationIndex].id,
          dt: that.data.liftArray[that.data.liftIndex].id,
          money: that.data.rentpirce,
          pay: that.data.payTypeArray[that.data.payTypeIndex].id,
          tese: that.data.houseSpeIndex.join(','),
          content: that.data.desc,
          uid: app.d.uid,
          layout1: that.data.roomIndex[0] + 1,
          layout2: that.data.roomIndex[1] + 1,
          layout3: that.data.roomIndex[2] + 1,
          u_mobile: that.data.mobile,
          photo: content,
          title: that.data.title,
          chaoxiang: that.data.orientationsArray[that.data.orientationsIndex].id,
          ruzhu: that.data.ruzhuArray[that.data.ruzhuIndex].id,
          u_name: that.data.linkname,
          address: that.data.address.address,
          zuqi: that.data.zuqiArray[that.data.zuqiIndex].id,
        }
      }).then(res => {
        tip.loaded();
        tip.success('发布成功', 1000);
        wx.navigateBack();
      })
    })
  },

  //租房选择
  rentingTypePickerChange: function(evt) {
    console.log('------------ 户型选择:', evt.detail.value)
    this.setData({
      rentingTypeIndex: evt.detail.value
    })
  },

  //户型选择
  roomColumnChange: function(evt) {
    console.log('------------ 户型选择:', evt.detail.value)
    this.setData({
      roomIndex: evt.detail.value
    })
  },
  //卧室类型
  roomTypePickerChange: function(evt) {
    console.log('------------ 卧室类型选择:', evt.detail.value)
    this.setData({
      roomTypeIndex: evt.detail.value
    })
  },
  //楼层选择
  floorColumnChange: function(evt) {
    console.log('------------ 楼层选择:', evt.detail.value)
    this.setData({
      floorIndex: evt.detail.value
    })
  },
  //入住情况选择
  ruzhuPickerChange: function(evt) {
    this.setData({
      ruzhuIndex: evt.detail.value
    })
  },
  //装修情况选择
  renovationPickerChange: function(evt) {
    this.setData({
      renovationIndex: evt.detail.value
    })
  },
  //电梯选择
  liftPickerChange: function(evt) {
    this.setData({
      liftIndex: evt.detail.value
    })
  },
  //租期选择
  zuqiPickerChange: function(evt) {
    this.setData({
      zuqiIndex: evt.detail.value
    })
  },
  //付款方式选择
  payTypePickerChange: function(evt) {
    this.setData({
      payTypeIndex: evt.detail.value
    })
  },
  //朝向选择
  orientationsPickerChange: function(evt) {
    this.setData({
      orientationsIndex: evt.detail.value
    })
  },
  //房屋类型选择
  houseTypePickerChange: function(evt) {
    this.setData({
      houseTypeIndex: evt.detail.value
    })
  },
  //房屋年龄选择
  houseYearPickerChange: function(evt) {
    this.setData({
      houseYearIndex: evt.detail.value
    })
  },
  //发布标题
  titleInput: function(evt) {
    this.setData({
      title: evt.detail.value,
    })
  },
  //面积输入
  areaInput: function(evt) {
    this.setData({
      area: evt.detail.value
    })
  },
  //小区名字
  nameInput: function(evt) {
    this.setData({
      name: evt.detail.value
    })
  },
  //联系人称呼
  linkInput: function(evt) {
    this.setData({
      linkname: evt.detail.value
    })
  },
  chanquanInput: function(evt) {
    this.setData({
      chanquan: evt.detail.value
    })
  },
  mobileInput: function(evt) {
    this.setData({
      mobile: evt.detail.value
    })
  },
  //售价
  sellpirceInput: function(evt) {
    this.setData({
      sellpirce: evt.detail.value
    })
  },
  //出租--合租价格
  rentpirceInput: function(evt) {
    this.setData({
      rentpirce: evt.detail.value
    })
  },
  //描述
  textareaInput: function(evt) {
    this.setData({
      desc: evt.detail.value
    })
  },

  houseSpeTap: function(evt) {
    let items = this.data.houseSpeArray;
    let id = evt.currentTarget.dataset.id;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].id == id) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    let tmp = [];
    for (let j = 0; j < items.length; j++) {
      if (items[j].checked)
        tmp.push(items[j].id)
    }
    this.setData({
      houseSpeArray: items,
      houseSpeIndex: tmp
    })
  },

  //地址选择
  addressTap: function(evt) {
    console.log('==============')
    wx.getSetting({
      success: function(res) {
        console.log(res);
        let a = res.authSetting['scope.userLocation']
        if (a == true || a == undefined) {
          wx.navigateTo({
            url: "/pages/position/position"
          });
        } else {
          wx.showModal({
            content: '检测到您没打开地址权限，是否去设置打开？',
            confirmText: "确认",
            cancelText: "取消",
            success: function(res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {} //打开设置面板
                })
              } else {
                console.log('用户点击取消')
              }
            }
          });
        }
      }
    })
  },

  //打开相机
  addImageTap: function(evt) {
    this.setData({
      displays: 'none'
    })
    this.selectComponent('#my-addImage').chooseImage();
  },

  OnSubmit: function(evt) {
    console.log('----------------', evt.detail)
    let that = this;
    that.setData({
      displays: 'block',
      videoUrl: evt.detail.videoUrl,
      uploadPic: evt.detail.uploadPic,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
    console.log('======== onUnload 清除地址');
    app.globalData.select_address = null;
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