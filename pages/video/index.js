// pages/video/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    classify: [{
      id: 1,
      name: '社区那点事儿'
    }, {
      id: 2,
      name: '南京本地'
    }, {
      id: 3,
      name: '影视娱乐'
    }],
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
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  loadVideoList:function(){
    let that = this;
  },

  tabSelect:function(evt){
    let index = evt.currentTarget.dataset.index;
    let that = this;
    if(that.data.tabCur==index)
      return;
    that.setData({
      tabCur:index,
    })
    that.loadVideoList();
  },

  detailTap:function(evt){
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/video/video-detail/video-detail?id='+id,
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
    let that = this;
    if (that.data.list.length < that.data.total && that.data.bottoming) { //有更多时加载
      that.setData({
        showBottomLoading: true,
        bottoming: false,
      })
      setTimeout(function () {
        that.setData({
          page: that.data.page + 1,
        })
        that.loadVideoList();
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})