// pages/school/school-fabu-detail/school-fabu-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    list: [1, 5, 6],
    pptlist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  delTap:function(evt){
    let index = evt.currentTarget.dataset.id;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除这份文件吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          that.data.pptlist.splice(index, 1);
          that.setData({
            pptlist: that.data.pptlist
          })
        }
      }
    })
  },

  addFileTap:function(evt){
    let that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        if (that.data.pptlist.length != 0) {
          that.setData({
            pptlist: that.data.pptlist.concat(res.tempFiles)
          })
        } else {
          that.setData({
            pptlist: res.tempFiles
          })
        }
        console.log('------', that.data.pptlist)
      }
    })
  },

  editCourseTap: function(evt) {
    wx.navigateTo({
      url: '/pages/school/school-course-fabu/school-course-fabu?id=' + this.data.id,
    })
  },

  editLessonTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    id = id == undefined ? 0 : id;
    wx.navigateTo({
      url: '/pages/school/school-lesson-fabu/school-lesson-fabu?id=' + this.data.id + '&lid=' + id,
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