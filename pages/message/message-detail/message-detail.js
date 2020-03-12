// pages/secondhand/secondhand-chat/secondhand-chat.js
const app = getApp()
const websocket = require('../../../utils/wechat-websocket.js');
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid: 0,
    uid: 0,
    InputBottom: 0,
    message: '',
    list: [],
    history: [],
    page: 1,
    bottoming: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('options:', options)
    let that = this;
    that.setData({
      uid: app.d.uid,
      tid: options.tid || 8
    })
    that.loadHistoryList();
    websocket.connectSocket();
    websocket.onSocketMessageCallback = this.onSocketMessageCallback;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  loadHistoryList: function(p = true) {
    let that = this;
    tip.loading('加载中...')
    http.requestUrl({
      url: 'chat/history',
      news: true,
      data: {
        uid: app.d.uid,
        tid: that.data.tid,
        page: that.data.page,
        count: 10,
      },
    }).then(res => {
      let list = res.data.data;
      let items = that.data.history;
      items.reverse();
      if (that.data.page == 1) {
        items = list
      } else {
        items = items.concat(list)
      }
      items.reverse();
      that.setData({
        history: items,
        total: res.data.total,
        bottoming: true,
      }, function() {
        if (p)
          that.bottom();
      })
      setTimeout(function() {
        tip.loaded();
      }, 600);
    })
  },

  // socket收到的信息回调
  onSocketMessageCallback: function (msg) {
    let that = this;
    let data = JSON.parse(msg);
    console.log('收到消息回调', data, data.to_user_id);
    if((data.to_user_id!=undefined && ((data.to_user_id==that.data.uid && data.uid==that.data.tid)||(data.to_user_id==that.data.tid&& data.uid==that.data.uid))) || data.to_user_id==undefined){
      let list = []
      list = that.data.list
      if (typeof msg == 'string') {
        list.push(JSON.parse(msg))
      }
      that.setData({
        list: list
      }, function () {
        that.bottom();
      })
    }
  },

  onSendMessage(type, content) {
    let that = this;
    let data = {
      content: content,
      type: type,
      tid: that.data.tid
    }
    websocket.sendSocketMessage({
      msg: JSON.stringify(data),
      success: function(res) {
        setTimeout(function() {
          that.setData({
            message: ''
          })
          // that.bottom();
        }, 50)
        return false;
      },
      fail: function(res) {
        console.log('fail:', res);
        return false;
      }
    })
  },

  submitTap: function(evt) {
    let that = this;
    if (that.data.message.trim() == "") {
      tip.text('消息不能为空哦~', 2000);
    } else {
      that.onSendMessage('text', that.data.message);
    }
  },

  messageInput: function(evt) {
    this.setData({
      message: evt.detail.value
    })
  },

  //发送图片
  chooseImage: function(evt) {
    let that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths
        http.uploadFile({
          tempFilePaths: tempFilePaths[0]
        }).then(res => {
          if (typeof res == 'string') {
            res = JSON.parse(res);
          }
          console.log('上传完路径', res)
          if (res.code == 1) {
            that.onSendMessage('image', res.data.url);
          }
        })
      }
    })
  },
  //图片预览
  previewImg: function(evt) {
    let that = this
    let res = evt.currentTarget.dataset.src;
    let list = [res];

    wx.previewImage({
      current: res,
      urls: list
    })
  },

  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },

  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },

  //聊天消息始终显示最底端
  bottom: function() {
    // var query = wx.createSelectorQuery()
    // query.select('#flag').boundingClientRect()
    // query.selectViewport().scrollOffset()
    // query.exec(function(res) {
    //   console.log(res)
    //   wx.pageScrollTo({
    //     scrollTop: res[0].bottom // #the-id节点的下边界坐标
    //   })
    //   res[1].scrollTop // 显示区域的竖直滚动位置
    // })
    wx.createSelectorQuery().select('#flag').boundingClientRect(function(rect) {
      // 使页面滚动到底部
      // console.log(rect)
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
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
    // websocket.closeSocket();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    websocket.closeSocket();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('--------- 下拉刷新')
    let that = this;
    if (that.data.history.length < that.data.total && that.data.bottoming) { //有更多时加载
      wx.showNavigationBarLoading();
      setTimeout(function() {
        that.setData({
          page: that.data.page + 1,
          bottoming: false,
        })
        that.loadHistoryList(false);
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }, 600)
    }
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