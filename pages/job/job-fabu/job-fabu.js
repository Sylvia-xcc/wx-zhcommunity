// pages/job/job-qz-fabu/job-qz-fabu.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
const Const = require('../../../utils/const.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, //类型 0-全职：1-兼职
    jobArr: [],
    jobIndex: -1,
    moneyArr: [],
    moneyIndex: -1,
    educationalArr: [],
    educationalIndex: -1,
    workArray: [],
    wordIndex: -1,
    modalName: null,
    checkbox: [],
    checkArr: [],
    // address: '',
    desc: '',
    mobile: '',
    original: 1,
    jiesuanArr: ['日结', '周结', '月结', '完工结算'],
    jiesuanIndex: 0,
    workTimercheckbox: [{
      value: 0,
      name: '周一',
      checked: false,
    }, {
      value: 1,
      name: '周二',
      checked: false,
    }, {
      value: 2,
      name: '周三',
      checked: false,
    }, {
      value: 3,
      name: '周四',
      checked: false,
    }, {
      value: 4,
      name: '周五',
      checked: false,
    }, {
      value: 5,
      name: '周六',
      checked: false,
    }, {
      value: 6,
      name: '周日',
      checked: false,
    }, ],
    worktimers: [],
    address: null,
    money: '',
    validityTime:0,//是否长期有效
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    let that = this;
    let moneyArr = Const.monthlypayArr;
    moneyArr[0].name = '面议';
    that.setData({
      type: options.type || 1,
      workArray: Const.worktimeArr,
      educationalArr: Const.educationArr,
      moneyArr: moneyArr,
    })
    wx.setNavigationBarTitle({
      title: that.data.type == 0 ? '全职发布' : '兼职发布',
    })
    that.loadJobList();
    that.loadJobTreatmentList();
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

  //获取工作列表
  loadJobList: function() {
    let that = this;
    http.requestUrl({
      url: 'job/index',
      news: true,
    }).then(res => {
      let job = res.data;
      that.setData({
        jobArr: job
      })
    })
  },

  //获取工作待遇列表
  loadJobTreatmentList: function() {
    let that = this;
    http.requestUrl({
      url: 'job/treatment',
      news: true,
    }).then(res => {
      let checkbox = res.data;
      for (var i = 0; i < checkbox.length; i++) {
        checkbox.checked = false;
      }
      that.setData({
        checkbox: checkbox,
      })
    })
  },

  //发布
  sumbitTap: function(evt) {
    let that = this;
    if (that.data.type == 0)
      that.fulltimeSubmit();
    else
      that.partimeSubmit();
  },

  fulltimeSubmit: function() {
    let that = this;
    if (that.data.jobIndex < 0) {
      tip.error('请选择招聘职位', 1000);
      return;
    }
    if (that.data.moneyIndex < 0) {
      tip.error('请选择月薪', 1000);
      return;
    }
    if (that.data.checkArr.length <= 0) {
      tip.error('请选择福利待遇', 1000);
      return;
    }
    if (that.data.wordIndex < 0) {
      tip.error('请选择工作年限', 1000);
      return;
    }
    if (that.data.educationalIndex < 0) {
      tip.error('请选择学历要求', 1000);
      return;
    }
    if (that.data.address == null) {
      tip.error('请选择工作地点', 1000);
      return;
    }
    // if (that.data.mobile == '') {
    //   tip.error('请填写联系电话', 1000);
    //   return;
    // }
    if (!util.filterMobile(that.data.mobile)) {
      // tip.error('请填写联系电话', 1000);
      return;
    }
    if (that.data.desc == '') {
      tip.error('请填写职位描述', 1000);
      return;
    }

    console.log('------- 职位描述：', that.data.desc);
    let job = that.data.jobArr[that.data.jobIndex].id;
    console.log('------- 招聘职位：', job, that.data.jobArr[that.data.jobIndex].name);
    let money = that.data.moneyArr[that.data.moneyIndex].id;
    console.log('------- 招聘月薪：', money, that.data.moneyArr[that.data.moneyIndex].name);
    let treatment = [];
    let items = this.data.checkbox;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].checked) {
        treatment.push(items[i].id);
      }
    }
    treatment = treatment.join(',')
    console.log('------- 招聘福利待遇：', treatment, that.data.checkArr);
    let years = that.data.workArray[that.data.wordIndex].id;
    console.log('------- 招聘工作年限：', years, that.data.workArray[that.data.wordIndex].name);
    let education = that.data.educationalArr[that.data.educationalIndex].id;
    console.log('------- 招聘学历：', education, that.data.educationalArr[that.data.educationalIndex].name);

    http.requestUrl({
      url: 'job/addFulltime',
      news: true,
      method: 'post',
      data: {
        uid: app.d.uid,
        job: job,
        money: money,
        treatment: treatment,
        description: that.data.desc,
        years: years,
        education: education,
        lat: that.data.address.latitude,
        lon: that.data.address.longitude,
        address: that.data.address.address,
        mobile: that.data.mobile,
      }
    }).then(res => {
      tip.success('发布成功', 1000);
      wx.navigateBack();
    })
  },

  partimeSubmit: function() {
    let that = this;
    if (that.data.jobIndex < 0) {
      tip.error('请选择招聘职位', 1000);
      return;
    }
    if (that.data.money == '') {
      tip.error('请填写兼职薪资', 1000);
      return;
    }
    let temp = [];
    let items = this.data.workTimercheckbox;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].checked) {
        temp.push(items[i].value+1);
      }
    }
    if (temp.length <= 0) {
      tip.error('请选择工作时间', 1000);
      return;
    }
    if (that.data.address == null) {
      tip.error('请选择工作地点', 1000);
      return;
    }
    if (that.data.mobile == '') {
      tip.error('请填写联系电话', 1000);
      return;
    }
    if (that.data.desc == '') {
      tip.error('请填写职位描述', 1000);
      return;
    }

    console.log('------- 职位描述：', that.data.desc);
    let job = that.data.jobArr[that.data.jobIndex].id;
    console.log('------- 招聘职位：', job, that.data.jobArr[that.data.jobIndex].name);
    console.log('------- 招聘月薪：', that.data.money);

    temp = temp.join(',')
    console.log('------- 招聘工作时间：', temp);
    console.log('--------- 招聘薪资单位', that.data.original);
    console.log('-------- 是否长期有效', that.data.validityTime);

    http.requestUrl({
      url: 'job/addPartTime',
      news: true,
      method: 'post',
      data: {
        uid: app.d.uid,
        job: job,
        money: that.data.money,
        money_type: that.data.original,
        description: that.data.desc,
        pay_type: that.data.jiesuanIndex ,
        work_day: temp,
        validity_time:that.data.validityTime,
        lat: that.data.address.latitude,
        lon: that.data.address.longitude,
        address: that.data.address.address,
        mobile: that.data.mobile
      }
    }).then(res => {
      tip.success('发布成功', 1000);
      wx.navigateBack();
    })
  },

  //地址选择
  addressTap: function (evt) {
    console.log('==============')
    wx.getSetting({
      success: function (res) {
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
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => { } //打开设置面板
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

  //职位选择
  jobPickerChange: function(evt) {
    console.log(evt.detail);
    this.setData({
      jobIndex: evt.detail.value
    })
  },
  //结算方式选择
  jiesuanPickerChange: function(evt) {
    this.setData({
      jiesuanIndex: evt.detail.value
    })
  },
  //薪资选择
  moneyPickerChange: function(evt) {
    console.log(evt.detail);
    this.setData({
      moneyIndex: evt.detail.value
    })
  },
  radioChange: function(evt) {
    this.setData({
      original: evt.detail.value
    })
  },
  //学历选择
  educationalPickerChange: function(evt) {
    console.log(evt.detail);
    this.setData({
      educationalIndex: evt.detail.value
    })
  },
  //工作年限选择
  workPickerChange: function(evt) {
    console.log(evt.detail);
    this.setData({
      wordIndex: evt.detail.value
    })
  },
  //工作时间选择
  ChooseWorkTimerCheckbox: function(evt) {
    let items = this.data.workTimercheckbox;
    let values = evt.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].value == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      workTimercheckbox: items,
    })
  },
  //福利待遇选择(多选)
  ChooseCheckbox: function(evt) {
    let items = this.data.checkbox;
    let values = evt.currentTarget.dataset.value;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].name == values) {
        items[i].checked = !items[i].checked;
        break
      }
    }
    this.setData({
      checkbox: items,
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(evt) {
    this.setData({
      modalName: null
    })
    if (evt.currentTarget.dataset.type == 'ok') {
      let items = this.data.checkbox;
      let temp = [];
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        if (items[i].checked) {
          temp.push(items[i].name);
        }
      }
      this.setData({
        checkArr: temp
      })
    } else if (evt.currentTarget.dataset.type == 'worktimerok') {
      let items = this.data.workTimercheckbox;
      let temp = [];
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        if (items[i].checked) {
          temp.push(items[i].name);
        }
      }
      this.setData({
        worktimers: temp
      })

      console.log('===========', temp)
    }
  },

  //职位描述
  textareaInput: function(evt) {
    // console.log('===============>>> ', evt.detail.value);
    this.setData({
      desc: evt.detail.value
    })
  },
  //兼职薪资
  moneyInput: function(evt) {
    this.setData({
      money: evt.detail.value
    })
  },

  //电话
  mobileInput: function(evt) {
    this.setData({
      mobile: evt.detail.value
    })
  },

  //是否长期有效
  validityTimeChange:function(evt){
    console.log('----', evt.detail);
    this.setData({
      validityTime:evt.detail.value==true?1:0
    })
  },

  getAddress() {
    let that = this
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'MNXBZ-G5TWD-GYF42-HHZJL-2W2J3-PVBX4' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(addressRes) {
            var address = addressRes.result.formatted_addresses.recommend;
            that.setData({
              address: address
            })
          }
        })
      }
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
    console.log('======== onunload fabu');
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