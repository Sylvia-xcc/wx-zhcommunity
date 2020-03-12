//app.js
import tip from 'utils/tip.js';
App({
  d: {
    hostUrl: 'https://zhichang.fengzhankeji.com/index.php/',//'https://www.fengzhankeji.com/zhichangcoummunity/index.php/',
    hostUrlNew: 'https://education.fengzhankeji.com/api/', //新增功能
    openid: undefined,
    sessionkey: undefined,
    uid: undefined,
    chat:0,
  },
  globalData: {
    userInfo: null,
    checkLogin: false,
    select_address: null,
  },
  onLaunch: function() {
    wx.hideTabBar();
    let that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log('已授权，直接登录');
          that.onLogin();
        } else {
          console.log('未授权');
          this.globalData.checkLogin = true;
          if (this.checkLoginReadyCallback) {
            this.checkLoginReadyCallback();
          }
        }
      }
    })
  },

  /**登录方法*/
  onLogin: function () {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        console.log('------------ code:', res)
        wx.getUserInfo({
          success: function (res) {
            console.log('----------- userinfo', res.userInfo)
            that.globalData.userInfo = res.userInfo
            typeof cb == "function" && cb(that.globalData.userInfo);
            that.getUserSessionKey(code);
          },
          fail: function () {
            that.getUserSessionKey(code);
          }
        });
      }
    });
  },

  //获取用户sessionkey
  getUserSessionKey: function (code) {
    //用户的订单状态
    var that = this;
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    wx.request({
      url: this.d.hostUrl + '/wxapp/login/getsessionkey',
      data: {
        code: code
      },
      success: (res) => {
        console.log('------------ getsessionkey:', res)
        let that = this;
        that.d.openid = res.data.openid
        that.d.sessionkey = res.data.session_key;
        that.onLoginUser()
      },
      fail: function (e) {
        tip.error('网络异常!');
      },
    })
  },

  onLoginUser: function () {
    let that = this;
    var user = that.globalData.userInfo;
    wx.request({
      url: this.d.hostUrl + '/wxapp/Login/authlogin',
      data: {
        sex: user.gender,
        nickname: user.nickName,
        photo: user.avatarUrl,
        openid: that.d.openid
      },
      success: (res) => {
        console.log('----------获取登录信息: ', res, that.d.openid);
        if (res.data.status == 1) {
          that.d.uid = res.data.uid;
          this.globalData.checkLogin = true;
          if (that.checkLoginReadyCallback) {
            that.checkLoginReadyCallback();
          }
        } else {
          tip.error('网络异常!');
        }
      },
      fail: res => {
        tip.error('网络异常!');
      }
    })
  },
})