import tip from './tip.js';

var url = 'ws://47.97.42.146:9502'; //服务器地址
function connect(user, func) {
  wx.connectSocket({
    url: url + '/chat?uid=' + getApp().d.uid,
    header: {
      'content-type': 'application/json'
    },
    success: function() {
      console.log('websocket连接成功~')
    },
    fail: function() {
      console.log('websocket连接失败~')
    }
  })
  wx.onSocketOpen(function(res) {    
    console.log('WebSocket连接打开')
    //接受服务器消息
    wx.onSocketMessage(func); //func回调可以拿到服务器返回的数据
  });
  wx.onSocketError(function(res) {
    console.log('WebSocket连接打开失败！')
  });
  wx.onSocketClose((res) => {
    console.log('WebSocket已关闭！')
    // that.reconnect()
  })
}
//发送消息
function send(msg) {
  wx.sendSocketMessage({
    data: msg
  });
}
module.exports = {
  connect: connect,
  send: send
}