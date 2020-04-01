import tip from './tip.js';

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatTime2 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('/')
}

/**
 * 将标准时间转化为时间戳(秒)
 * @param time-'2018-09-11 13:50:52'
 * @return 时间戳
 */
function formatTime5(time) {
  var thisTime = time;
  thisTime = thisTime.replace(/-/g, '/');
  var timestamp = new Date(thisTime);
  timestamp = timestamp.getTime();
  timestamp = Math.floor(timestamp / 1000);
  return timestamp;
}


function copyObj(obj) {
  var tmp = {};
  tmp = JSON.parse(JSON.stringify(obj));
  return tmp;
}


const personal = (uid) => {
  let id = getApp().d.uid;
  // if(uid==id)
  //   return;
  wx.navigateTo({
    url: '/pages/homepage/index?uid=' + uid,
  })
}

const detailTap = (model, mid) => {
  let url = "";
  console.log('------------->>>', model, mid)
  if (mid <= 0) {
    if (model == 'activity')
      url = "/pages/commonweal/index"
  } else {
    if (model == 'used' || model == "used_like")
      url = "/pages/secondhand/secondhand-detail/secondhand-detail?id=" + mid;
    else if (model == "product")
      url = "/pages/shop/shop-detail/shop-detail?id=" + mid;
    else if (model == "news" || model == "news_like")
      url = "/pages/community/community-news-detail/community-news-detail?id=" + mid;
    else if (model == "job")
      url = "/pages/job/job-detail/job-detail?id=" + mid;
    else if (model == "house")
      url = "/pages/house/house-sell/house-sell-detail/house-sell-detail?id=" + mid;
    else if (model == "score_shop")
      url = "/pages/community/community-jifen-shop-detail/community-jifen-shop-detail?id=" + mid;
    else if (model == "chat" || model == "chat_like")
      url = "/pages/community/community-chat-detail/community-chat-detail?id=" + mid;
  }

  console.log('------------->>>', model, mid, url)

  if (url == "")
    return;

  wx.navigateTo({
    url: url,
  })
}

const liveChatTap = (uid) => {
  // tip.text('该功能暂未开放，敬请期待~~');
  console.log('------------- 聊天', uid, getApp().d.uid)
  if (getApp().d.chat == 0) {
    tip.text('该功能暂未开放，敬请期待~');
    return;
  }
  if (!hasAuthorize()) {
    return;
  }
  if (uid == undefined) {
    tip.error('该用户不存在', 1000);
    return;
  }
  if (uid <= 0) {
    tip.error('该用户不存在', 1000);
    return;
  }
  if (uid == getApp().d.uid) {
    tip.text('请勿与自己聊天', 1000);
    return;
  }
  wx.navigateTo({
    url: '/pages/message/message-detail/message-detail?tid=' + uid,
  })
}

//参加活动授权
const joinActAuthorizedService = ()=>{
  return new Promise((resolve, reject)=>{
    wx.requestSubscribeMessage({
      tmplIds: ['xSAkxWAN9b-AgB1MpibGh21kUkFDbRXj9kBBWDiOt4s'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
      success(res) {
        console.log('已授权接收订阅消息')
        tip.success('授权订阅成功', 1000);
      },
      complete(res){
        resolve(res);
      }
    })
  })
}

//参加活动授权
const cancelActAuthorizedService = () => {
  return new Promise((resolve, reject) => {
    wx.requestSubscribeMessage({
      tmplIds: ['9SZ7M1ks14FTbEb3mYEj2GWuiL1DoYokgccpfHbfr3Y'], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
      success(res) {
        console.log('已授权接收订阅消息')
        tip.success('授权成功', 1000);
      },
      complete(res) {
        resolve(res);
      }
    })
  })
}





/**是否授权*/
const hasAuthorize = () => {
  let user = getApp().globalData.userInfo;
  console.log("=====>>>> userinfo", user, getApp().d.uid)
  if (getApp().d.uid == undefined) {
    // tip.error('请登录后操作',1000);
    wx.showModal({
      title: '提示',
      content: '您尚未登录，是否前往登录页面',
      success(res) {
        console.log("是否前往授权页面", res);
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
    return false;
  }
  return true;
}

//判断手机号是否授权
const hasAuthorizePhoneNum = () => {
  if (getApp().d.tel == undefined || getApp().d.tel == '')
    return false;
  return true;
}


//判断是否是该版块版主
const hasAuthorizeSection = (fid) => {
  let moderator = getApp().globalData.userInfo ? getApp().globalData.userInfo.moderator : [];
  moderator = moderator || [];
  for (var i = 0; i < moderator.length; i++) {
    if (moderator[i].fid == fid)
      return true;
  }
  return false;
}

const friendstimer = (time) => {
  var tip = '';
  var timestamp = new Date().getTime();
  var startstamp = time * 1000;
  var usedTime = Math.abs(Math.floor((timestamp - startstamp) / 1000)); //两个时间戳相差的毫秒数  
  var days = Math.floor(usedTime / (24 * 3600));
  usedTime = usedTime % (24 * 3600);
  var hours = Math.floor(usedTime / 3600);
  usedTime = usedTime % 3600;
  var minutes = Math.floor(usedTime / 60);
  var second = Math.floor(usedTime % 60);
  var mouth = Math.floor(days / 30);
  var year = Math.floor(mouth / 12);
  // console.log('===== timer ', timestamp, startstamp, usedTime, year, mouth, days, hours, minutes, second)
  if (year > 0)
    return year + '年前';
  if (mouth > 0)
    return mouth + '个月前';
  if (days > 0)
    return days + '天前';
  if (hours > 0)
    return hours + '小时前';
  if (minutes > 0)
    return minutes + '分钟前';
  if (second > 0)
    return second + '秒前'
  return tip;
}

//浮点型加法
const add = (num1, num2) => {
  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits))
  return (mul(num1, baseNum) + mul(num2, baseNum)) / baseNum
}
//浮点型减法
const sub = (num1, num2) => {
  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits))
  return (mul(num1, baseNum) - mul(num2, baseNum)) / baseNum
}
//浮点型乘法
const mul = (num1, num2) => {
  const num1String = num1.toString()
  const num2String = num2.toString()
  const num1Digits = (num1String.split('.')[1] || '').length
  const num2Digits = (num2String.split('.')[1] || '').length
  const baseNum = Math.pow(10, num1Digits + num2Digits)
  return Number(num1String.replace('.', '')) * Number(num2String.replace('.', '')) / baseNum
}
//浮点型除法
const div = (num1, num2) => {
  const num1String = num1.toString()
  const num2String = num2.toString()
  const num1Digits = (num1String.split('.')[1] || '').length
  const num2Digits = (num2String.split('.')[1] || '').length
  const baseNum = Math.pow(10, num1Digits + num2Digits)
  let n1 = mul(num1, baseNum)
  let n2 = mul(num2, baseNum)
  return Number(n1) / Number(n2)
}

// len表示保留几位数小数
const floatRound = (num, len = 2) => {
  let n = div(Math.round(mul(num, Math.pow(10, len))), Math.pow(10, len))
  return n.toFixed(len)
}

//正则去掉所有的html标记
const delHtmlTag = (str) => {
  return str.replace(/<[^>]+>/g, "");
}

const findHtmlImg = (str) => {
  let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i // 匹配图片中的src
  let arr = str.match(imgReg) || [] //筛选出所有的img
  let srcArr = []
  for (let i = 0; i < arr.length; i++) {
    let src = arr[i].match(srcReg)
    // 获取图片地址
    srcArr.push(src[1])
  }
  return srcArr;
}

//手机号检测
const filterMobile = (mobile) => {
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (!myreg.test(mobile)) {
    tip.error('请填写正确手机号')
    return false;
  }
  return true;
}

module.exports = {
  formatNumber: formatNumber,
  formatTime: formatTime,
  formatTime2: formatTime2,
  formatTime5: formatTime5,
  hasAuthorize: hasAuthorize,
  hasAuthorizePhoneNum: hasAuthorizePhoneNum,
  friendstimer,
  add,
  sub,
  mul,
  div,
  floatRound,
  hasAuthorizeSection,
  delHtmlTag,
  findHtmlImg,
  copyObj: copyObj,
  personal,
  filterMobile,
  detailTap,
  liveChatTap,
  joinActAuthorizedService,
  cancelActAuthorizedService,
}