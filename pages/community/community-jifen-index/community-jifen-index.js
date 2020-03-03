// pages/community/community-jifen-index/community-jifen-index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: ['/images/ershou1.png', '/images/ershou2.png'],
    jifenCur: 2,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    loading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  tabJFSelect: function (evt) {
    let id = evt.currentTarget.dataset.id;
    let that = this;
    if (that.data.jifenCur == id)
      return;
    that.setData({
      jifenCur: id
    })
  },

  loadJifenList:function(){
    let that = this;
    http.requestUrl({
      url: 'banner/index',
      news: true,
      data: {
        model: 2,
      }
    }).then(res => {
      that.setData({
        banner: res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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