var app = getApp();
import tip from './tip.js';

const requestUrl = ({
  url,
  data,
  success,
  method = "get",
  loading = false,
  news = false,
}) => {
  var that = this;
  return new Promise(function(resolve, reject) {
    if (loading) {
      var loadingTimer = setTimeout(function() {
        wx.showLoading({
          title: '加载中...',
        })
      }, 80)
    }
    var hostUrl = news ? app.d.hostUrlNew : app.d.hostUrl;
    if (method == 'get') {
      // console.log('-------------- data:', data );
      if (data && data.uid === undefined){
        delete data.uid;
        // console.log("========================", data)
      }
    }
    wx.request({
      url: hostUrl + url,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: method,
      success: (res) => {
        console.log("----------------- request: ", url, res, data)
        if (loading) {
          wx.hideLoading();
          clearTimeout(loadingTimer);
        }
        if (res.statusCode == 404) {
          tip.success('网络异常！', 2000)
          return;
        }
        let code = news ? res.data.code : res.data.status;
        if (code == 1) {
          resolve(res.data);
        } else {
          let str = res.data.msg || res.data.err
          if (str.length > 7)
            tip.text(str, 2000)
          else
            tip.error(str, 2000)

          // reject(res.data);
        }
      },
      fail: (res) => {
        console.log('-------------- fail:', res)
        tip.success('网络异常！', 2000)
        // reject(res.data);
      },
    })
  })
}

const request = function(path, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.d.hostUrl + path,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success: function(res) {
        resolve(res.data)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  })
}


const uploadFile = function(data) {
  return new Promise((resolve, reject) => {
    let url = 'http://education.fengzhankeji.com/api/../addons/qiniu/index/upload'; //data.url || 'common/upload';
    console.log('------------------- upload:', data.tempFilePaths)
    if (data.tempFilePaths.indexOf('.com') > -1) {
      console.log('------------>>> 已上传的图片')
      let obj = {
        code: 1,
        data: {
          url: data.tempFilePaths
        }
      }
      resolve(obj);
    }
    wx.uploadFile({
      url: url, //app.d.hostUrlNew + url,
      filePath: data.tempFilePaths,
      name: 'file',
      formData: {
        uid: app.d.uid
      },
      success: function(res) {
        console.log('----------- uploadfile', res.data);
        resolve(res.data)
      }
    })
  })
}

// const uploadFile = function(data) {
//   return new Promise((resolve, reject) => {
//     let url = data.url || 'file/upload?action=uploadimage';
//     requestUrl({
//       url: url,
//       data: {
//         upfile: data.tempFilePaths
//       },
//       method: 'post',
//     })
//   })
// }

const base64 = function(url, type) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: url, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => {
        resolve('data:image/' + type.toLocaleLowerCase() + ';base64,' + res.data)
      },
      fail: res => reject(res.errMsg)
    })
  })
}


const getConfigVal = (data) => {
  return requestUrl({
    url: '/wxapp/config/getconfig',
    data
  });
}

module.exports = {
  requestUrl: requestUrl,
  request: request,
  uploadFile: uploadFile,
  getConfigVal: getConfigVal,
  base64: base64
}