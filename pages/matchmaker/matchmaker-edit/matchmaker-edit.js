// pages/matchmaker/matchmaker-edit/matchmaker-edit.js
const app = getApp()
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: 0,
    isLoading: true,
    upload_pic: [],
    upload_max: 9, //上传图片最大数量
    optype: 0, //0：图片 1：视频
    sexArray: [{
      id: 1,
      name: '男'
    }, {
      id: 2,
      name: '女'
    }], //性别
    sexIndex: -1,
    date: '', //出生年月
    region: [], //地区
    xueliArray: [],
    xueliIndex: -1,
    zhiye: '',
    moneyArray: [],
    moneyIndex: -1,
    provinces: [],
    multiArray: [],
    multiIndex: [],
    nickname: '',
    stature: '',
    college: '',
    occupation: '',
    weixin: '',
    intro: '',
    hobby: '',
    emotion: '',
    demand: '',
    info: null,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options);
    let that = this;
    that.setData({
      uid: options.uid || 0,
    })
    tip.loading();
    that.loadInfoList();
  },

  loadInfoList: function() {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/info',
      news: true,
    }).then(res => {
      that.setData({
        moneyArray: res.data.income,
        xueliArray: res.data.education,
      })
      that.canFit();
    })
  },

  canFit: function() {
    let that = this;
    if (that.data.uid > 0 && that.data.info == null)
      this.loadUserInfo();
    if (that.data.uid <= 0) {
      that.loadProvinceList();
    }
  },

  loadUserInfo: function() {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/own',
      news: true,
      data: {
        uid: that.data.uid,
      }
    }).then(res => {
      let moneyArray = that.data.moneyArray;
      let moneyIndex = -1;
      for (var i = 0; i < moneyArray.length; i++) {
        if (moneyArray[i].name == res.data.income) {
          moneyIndex = moneyArray[i].id;
          break;
        }
      }
      let xueliArray = that.data.xueliArray;
      let xueliIndex = -1;
      for (var i = 0; i < xueliArray.length; i++) {
        if (xueliArray[i].name == res.data.education) {
          xueliIndex = xueliArray[i].id;
          break;
        }
      }
      that.setData({
        info: res.data,
        upload_pic: res.data.photo || [],
        nickname: res.data.name,
        sexIndex: res.data.sex - 1,
        date: res.data.birthday,
        stature: res.data.height,
        college: res.data.school,
        occupation: res.data.job,
        wx_account: res.data.wx_account,
        intro: res.data.intro,
        hobby: res.data.hobby,
        emotion: res.data.felling,
        demand: res.data.requirement,
        moneyIndex: moneyIndex,
        xueliIndex: xueliIndex,
      })

      that.loadProvinceList();
    })
  },



  loadProvinceList: function() {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/province',
      news: true,
    }).then(res => {
      that.setData({
        provinces: res.data
      })
      if (that.data.uid > 0) {
        let provinces = that.data.provinces;
        let multiIndex = that.data.multiIndex;
        for (var i = 0; i < provinces.length; i++) {
          if (provinces[i].name == that.data.info.province) {
            that.loadCityList(provinces[i].id, true);
            multiIndex[0] = i;
          }
        }
        that.setData({
          multiIndex: multiIndex
        })
      } else
        that.loadCityList(that.data.provinces[0].id);
    })
  },

  loadCityList: function(id, init = false) {
    let that = this;
    http.requestUrl({
      url: 'matchmaker/city',
      news: true,
      data: {
        province: id
      }
    }).then(res => {
      let multiArray = [that.data.provinces, res.data]
      that.setData({
        multiArray: multiArray,
      })
      if (init) {
        let multiIndex = that.data.multiIndex;
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].name == that.data.info.city) {
            multiIndex[1] = i;
          }
        }
        that.setData({
          multiIndex: multiIndex,
        })
      }
      setTimeout(function() {
        tip.loaded();
        that.setData({
          isLoading: false,
        })
      }, 400)
    })
  },

  submitTap: function(evt) {
    let that = this;
    console.log('-------昵称：', that.data.nickname);
    console.log('-------性别：', that.data.sexArray[that.data.sexIndex].name);
    console.log('-------生日：', that.data.date);
    console.log('-------身高：', that.data.stature);
    console.log('-------所在城市：', that.data.multiArray[0][that.data.multiIndex[0]].name, that.data.multiArray[1][that.data.multiIndex[1]].name);
    console.log('-------毕业院校：', that.data.college);
    console.log('-------学历：', that.data.xueliArray[that.data.xueliIndex].name);
    console.log('-------职业：', that.data.occupation);
    console.log('-------年薪：', that.data.moneyArray[that.data.moneyIndex].name);
    console.log('-------微信号：', that.data.weixin);
    console.log('-------自我介绍：', that.data.intro);
    console.log('-------兴趣爱好：', that.data.hobby);
    console.log('-------感情观：', that.data.emotion);
    console.log('-------对另一半要求', that.data.demand);

    if (that.data.upload_pic.length <= 0) {
      tip.error('请上传头像', 1000);
      return;
    }
    if (that.data.nickname == '') {
      tip.error('请填写微信昵称', 1000);
      return;
    }
    if (that.data.sexIndex < 0) {
      tip.error('请选择性别', 1000);
      return;
    }
    if (that.data.date == '') {
      tip.error('请选择生日', 1000);
      return;
    }
    if (that.data.stature == '') {
      tip.error('请填写身高', 1000);
      return;
    }
    if (that.data.multiIndex <= 0) {
      tip.error('请选择所在城市', 1000);
      return;
    }
    if (that.data.college == '') {
      tip.error('请填写毕业院校', 1000);
      return;
    }
    if (that.data.xueliIndex < 0) {
      tip.error('请选择学历', 1000);
      return;
    }
    if (that.data.occupation == '') {
      tip.error('请填写职业', 1000);
      return;
    }
    if (that.data.moneyIndex < 0) {
      tip.error('请选择年薪', 1000);
      return;
    }
    if (that.data.intro == '') {
      tip.error('请填写自我介绍', 1000);
      return;
    }
    if (that.data.hobby == '') {
      tip.error('请填写兴趣爱好', 1000);
      return;
    }
    if (that.data.emotion == '') {
      tip.error('请填写感情观', 1000);
      return;
    }
    if (that.data.demand == '') {
      tip.error('请填写要求', 1000);
      return;
    }

    let {
      upload_pic
    } = that.data;
    let temp = [];
    let files = [];
    tip.loading('发布中...');
    for (var i = 0; i < upload_pic.length; i++) {
      temp.push(
        http.uploadFile({
          tempFilePaths: upload_pic[i]
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
      console.log('-------上传完成', files, that.data.optype)
      let content = JSON.stringify(files);
      let url = that.data.info == null ? 'matchmaker/addMaker' : 'matchmaker/edit';
      http.requestUrl({
        url: url,
        news: true,
        method: 'post',
        data: {
          photo: content,
          name: that.data.nickname,
          sex: that.data.sexArray[that.data.sexIndex].id,
          birthday: that.data.date,
          height: that.data.stature,
          province: that.data.multiArray[0][that.data.multiIndex[0]].id,
          city: that.data.multiArray[1][that.data.multiIndex[1]].id,
          school: that.data.college,
          education: that.data.xueliArray[that.data.xueliIndex].id,
          job: that.data.occupation,
          income: that.data.moneyArray[that.data.moneyIndex].id,
          intro: that.data.intro,
          hobby: that.data.hobby,
          felling: that.data.emotion,
          requirement: that.data.demand,
          wx_account: that.data.weixin,
          wx_id: app.d.uid,
          uid: app.d.uid,
        }
      }).then(res => {
        tip.loaded();
        if (that.data.uid > 0)
          wx.navigateBack();
        else {
          wx.navigateTo({
            url: '/pages/matchmaker/index',
          })
        }
      })
    })
  },



  bindMultiPickerColumnChange: function(evt) {
    // console.log('---------->>>aa ', evt)
    let that = this;
    let column = evt.detail.column;
    let value = evt.detail.value;
    if (column == 0) {
      that.loadCityList(that.data.provinces[value].id);
    }
  },

  bindMultiPickerChange: function(evt) {
    console.log('----------地区 ', evt)
    this.setData({
      multiIndex: evt.detail.value
    })
  },

  sexPickerChange: function(evt) {
    this.setData({
      sexIndex: evt.detail.value
    })
  },

  dateChange: function(evt) {
    this.setData({
      date: evt.detail.value
    })
  },

  // regionChange: function (e) {
  //   this.setData({
  //     region: e.detail.value
  //   })
  // },

  xueliPickerChange: function(e) {
    this.setData({
      xueliIndex: e.detail.value
    })
  },

  zhiyePickerChange: function(e) {
    this.setData({
      zhiyeIndex: e.detail.value
    })
  },

  moneyPickerChange: function(e) {
    this.setData({
      moneyIndex: e.detail.value
    })
  },

  nicknameInput: function(evt) {
    this.setData({
      nickname: evt.detail.value
    })
  },
  statureInput: function(evt) {
    this.setData({
      stature: evt.detail.value
    })
  },
  collegeInput: function(evt) {
    this.setData({
      college: evt.detail.value
    })
  },
  occupationInput: function(evt) {
    this.setData({
      occupation: evt.detail.value
    })
  },
  weixinInput: function(evt) {
    this.setData({
      weixin: evt.detail.value
    })
  },
  introInput: function(evt) {
    this.setData({
      intro: evt.detail.value
    })
  },
  hobbyInput: function(evt) {
    this.setData({
      hobby: evt.detail.value
    })
  },
  emotionInput: function(evt) {
    this.setData({
      emotion: evt.detail.value
    })
  },
  demandInput: function(evt) {
    this.setData({
      demand: evt.detail.value
    })
  },

  //选择图片
  chooseImage() {
    let that = this;
    let len = that.data.upload_max - that.data.upload_pic.length;
    len = len <= 0 ? 0 : len;
    wx.chooseImage({
      count: len, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.upload_pic.length != 0) {
          this.setData({
            upload_pic: this.data.upload_pic.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            upload_pic: res.tempFilePaths
          })
        }
      }
    });
  },

  //预览图片
  previewImg(e) {
    wx.previewImage({
      urls: this.data.upload_pic,
      current: e.currentTarget.dataset.url
    });
  },
  //删除图片
  delTap(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          let that = this;
          that.data.upload_pic.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            upload_pic: that.data.upload_pic,
            video: '',
            optype: 0,
          })
        }
      }
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