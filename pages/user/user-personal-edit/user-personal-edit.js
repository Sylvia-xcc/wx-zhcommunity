// pages/user/user-personal-edit/user-personal-edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    job: '111',
    birthday: '',
    address: [],
    sex: [{
      id: 1,
      name: '男'
    }, {
      id: 2,
      name: '女'
    }],
    sexIndex: -1,
    upload_pic: ['/images/head.png'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  submitTap: function() {
    let that = this;
    console.log('------------- 昵称：', that.data.nickname);
    console.log('------------- 性别：', that.data.sex[that.data.sexIndex].name);
    console.log('------------- 生日：', that.data.birthday);
    console.log('------------- 常驻：', that.data.address);
    console.log('------------- 行业：', that.data.job);
  },

  sexChange: function(evt) {
    this.setData({
      sexIndex: evt.detail.value
    })
  },
  birthdayChange: function(evt) {
    this.setData({
      birthday: evt.detail.value
    })
  },
  addressChange: function(evt) {
    this.setData({
      address: evt.detail.value
    })
  },

  nameInput: function(evt) {
    this.setData({
      nickname: evt.detail.value
    })
  },

  jobInput: function(evt) {
    this.setData({
      job: evt.detail.value
    })
  },

  //选择图片
  chooseImage() {
    let that = this;
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res)
        this.setData({
          upload_pic: res.tempFilePaths
        })
      }
    });
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