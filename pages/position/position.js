var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const app = getApp()
var qqmapsdk;
Page({
  data: {
    latitude: 0,//地图初次加载时的纬度坐标
    longitude: 0, //地图初次加载时的经度坐标
    name: "" //选择的位置名称
  },
  onLoad: function () {
    let that = this
    // 实例化腾讯地图API核心类
    qqmapsdk = new QQMapWX({
      key: 'MNXBZ-G5TWD-GYF42-HHZJL-2W2J3-PVBX4' // 必填
    });
    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        console.log(res)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            console.log(addressRes)
            var address = addressRes.result.formatted_addresses.recommend;
            var city = addressRes.result.address_component.city;
            var lat = addressRes.result.ad_info.location.lat;
            var lng = addressRes.result.ad_info.location.lng;
            that.setData({
              address: address,
              city: city,
              latitude1: lat,
              longitude1: lng
            })
            console.log(lng + address + city + lat)
          }
        })
      }
    })

    this.moveToLocation();
  },
  //移动选点
  moveToLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log("ditu ===>", res)
        console.log(res.name);
        app.globalData.select_address = {
          name:res.name,
          address:res.address,
          latitude: res.latitude,
          longitude: res.longitude
        }
        wx.navigateBack({
          delta: 1
        })

      },
      fail: function (err) {
        wx.navigateBack({
          delta: 1
        })
      }
    });
  },
  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {
    console.log("------------------------ onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("------------------------ onUnload")
  },
});