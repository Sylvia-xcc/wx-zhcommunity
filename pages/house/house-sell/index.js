// pages/house/house-sell/index.js
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
const Const = require('../../../utils/const.js');
import tip from '../../../utils/tip.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    list: [],
    page: 1,
    total: 0,
    bottoming: true,
    showBottomLoading: false,
    isLoading: true,
    loading: true,
    currentTab: -1,
    displays: 'none',
    height: 800,
    areaArray: [],
    areaIndex: 0,
    houseSellPriceArray: [], //房屋售价
    houseSellPriceIndex: 0,
    spaceArray: [], //面积
    spaceIndex: 0,
    houseYearArray: [], //房屋年龄
    houseYearIndex: 0,
    renovationArray: [], //装修情况
    renovationIndex: 0,
    liftArray: [], //电梯
    liftIndex: 0,
    orientationsArray: [], //房屋朝向
    orientationsIndex: 0,
    houseStoreyArray: [], //楼层情况
    houseStoreyIndex: 0,
    houseTypeArray: [], //房屋类型
    houseTypeIndex: 0,
    houseSpeArray: [], //房屋特色
    houseSpeIndex: 0,
    reprisesArray: [], //租金
    reprisesIndex: 0,
    rentingTypeArray: [], //租房类型
    rentingTypeIndex: 0,
    zuqiArray: [], //租期
    zuqiIndex: 0,
    shaixuanNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let rentingTypeArr = util.copyObj(Const.rentingTypeArr);
    rentingTypeArr.unshift({
      id: 0,
      name: '不限'
    })
    that.setData({
      height: wx.getSystemInfoSync().windowHeight - 130,
      areaArray: Const.areaArr,
      // houseSellPriceArray: Const.houseSellPriceArr,
      // reprisesArray: Const.houseReprisesArr,
      rentingTypeArray: rentingTypeArr,
    })
    that.loadHouseInfoList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    // that.loadHouseInfoList();
  },

  loadHouseInfoList: function() {
    let that = this;
    http.requestUrl({
      url: 'house/info',
      news: true,
    }).then(res => {
      let chaoxiang = res.data.cx;
      chaoxiang.unshift({
        id: -1,
        name: '不限'
      });
      let zuqi = res.data.zuqi;
      zuqi.unshift({
        id: -1,
        value: '不限'
      });
      that.setData({
        spaceArray: res.data.mj,
        houseTypeArray: res.data.yt,
        houseSpeArray: res.data.ts,
        houseYearArray: res.data.lg,
        houseStoreyArray: res.data.lc,
        orientationsArray: chaoxiang,
        renovationArray: res.data.zx,
        liftArray: res.data.dt,
        zuqiArray: zuqi,
        houseSellPriceArray: res.data.buy_money,
        reprisesArray: res.data.hire_money,
      })

      that.loadList();
    });
  },

  loadList: function() {
    let that = this;
    that.setData({
      loading: true,
      bottoming: false,
      showBottomLoading: true,
    })
    if (that.data.tabCur == 1)
      that.loadHireList();
    else
      that.loadBuyList();
  },
  //买房列表
  loadBuyList: function() {
    let that = this;
    if (that.data.isLoading)
      tip.loading();

    let area = that.data.areaArray[that.data.areaIndex].name;
    console.log('----------- 搜索区域：', area);
    let money = that.data.houseSellPriceArray[that.data.houseSellPriceIndex].id;
    console.log('----------- 售价', money, that.data.houseSellPriceArray[that.data.houseSellPriceIndex].name);
    let mj = that.data.spaceArray[that.data.spaceIndex].id;
    console.log('----------- 面积：', mj, that.data.spaceArray[that.data.spaceIndex].value);
    let yt = that.data.houseTypeArray[that.data.houseTypeIndex].id;
    console.log('----------- 用途', yt, that.data.houseTypeArray[that.data.houseTypeIndex].value);
    let ln = that.data.houseYearArray[that.data.houseYearIndex].id;
    console.log('----------- 楼龄：', yt, that.data.houseYearArray[that.data.houseYearIndex].value);
    let lc = that.data.houseStoreyArray[that.data.houseStoreyIndex].id;
    console.log('----------- 楼层：', lc, that.data.houseStoreyArray[that.data.houseStoreyIndex].value);
    let chaoxiang = that.data.orientationsArray[that.data.orientationsIndex].id;
    console.log('----------- 朝向：', chaoxiang, that.data.orientationsArray[that.data.orientationsIndex].name);
    let zx = that.data.renovationArray[that.data.renovationIndex].id;
    console.log('----------- 装修：', zx, that.data.renovationArray[that.data.renovationIndex].value);
    let dt = that.data.liftArray[that.data.liftIndex].id;
    console.log('----------- 电梯：', dt, that.data.liftArray[that.data.liftIndex].value);
    let items = that.data.houseSpeArray;
    let treatment = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].selected) {
        if (i == 0) {
          treatment = [];
          break;
        }
        treatment.push(items[i].id);
      }
    }
    console.log('---------- 房源特色：', treatment);

    let num = 0;
    let data = {
      listRows: 10,
      page: that.data.page
    };
    if (area != '不限')
      data.area = area;
    if (money > 0)
      data.money = money;

    if (mj > 1) {
      data.measure = mj;
      num++;
    }

    if (yt > 1) {
      data.house_type = yt;
      num++;
    }

    if (treatment.length > 0) {
      data.tese = treatment;
      num++;
    }

    if (ln > 1) {
      data.house_age = ln;
      num++;
    }

    if (lc > 1) {
      data.top = lc;
      num++;
    }

    if (chaoxiang > 0) {
      data.chaoxiang = chaoxiang;
      num++;
    }

    if (zx > 1) {
      data.room_decorate = zx;
      num++;
    }
    if (dt > 1) {
      data.dt = dt;
      num++;
    }

    that.setData({
      shaixuanNum: num
    })

    http.requestUrl({
      url: 'house/buyList',
      news: true,
      data: data,
    }).then(res => {
      let items = that.data.list;
      if (that.data.page == 1) {
        items = res.data.data
      } else {
        items = items.concat(res.data.data)
      }
      that.setData({
        list: items,
        total: res.data.total,
        bottoming: true,
        showBottomLoading: false,
        loading: false,
      })
      setTimeout(function() {
        tip.loaded();
        that.setData({
          isLoading: false,
        })
      }, 600);
    })
  },

  //租房列表
  loadHireList: function() {
    let that = this;
    let area = that.data.areaArray[that.data.areaIndex].name;
    console.log('----------- 搜索区域：', area);
    let rentType = that.data.rentingTypeArray[that.data.rentingTypeIndex].name;
    console.log('----------- 租房方式：', rentType);
    let reprises = that.data.reprisesArray[that.data.reprisesIndex].id;
    console.log('----------- 租金：', reprises, that.data.reprisesArray[that.data.reprisesIndex].name);
    let lc = that.data.houseStoreyArray[that.data.houseStoreyIndex].id;
    console.log('----------- 楼层：', lc, that.data.houseStoreyArray[that.data.houseStoreyIndex].value);
    let chaoxiang = that.data.orientationsArray[that.data.orientationsIndex].id;
    console.log('----------- 朝向：', chaoxiang, that.data.orientationsArray[that.data.orientationsIndex].name);
    let zuqi = that.data.zuqiArray[that.data.zuqiIndex].id;
    console.log('----------- 租期：', zuqi, that.data.zuqiArray[that.data.zuqiIndex].value);
    let zx = that.data.renovationArray[that.data.renovationIndex].id;
    console.log('----------- 装修：', zx, that.data.renovationArray[that.data.renovationIndex].value);
    let dt = that.data.liftArray[that.data.liftIndex].id;
    console.log('----------- 电梯：', dt, that.data.liftArray[that.data.liftIndex].value);

    let num = 0;
    let data = {
      listRows: 10,
      page: that.data.page
    };
    if (area != '不限')
      data.area = area;
    if (reprises > 0)
      data.money = reprises
    if (chaoxiang > 0) {
      data.chaoxiang = chaoxiang;
      num++;
    }
    if (dt > 1) {
      data.dt = dt;
      num++;
    }
    if (zuqi > 0) {
      data.zuqi = zuqi;
      num++;
    }
    if (lc > 1) {
      data.top = lc;
      num++;
    }
    if (zx > 1) {
      data.room_decorate = zx;
      num++;
    }
    if (rentType != '不限')
      data.rental_type = rentType == '整租' ? 1 : 2

    that.setData({
      shaixuanNum: num
    })
    http.requestUrl({
      url: 'house/hireList',
      news: true,
      data: data,
    }).then(res => {
      let items = that.data.list;
      if (that.data.page == 1) {
        items = res.data.data
      } else {
        items = items.concat(res.data.data)
      }
      that.setData({
        list: items,
        total: res.data.total,
        showBottomLoading: false,
        bottoming: true,
        loading: false,
      })
    })
  },

  //类型选择
  tabSelect: function(evt) {
    let index = evt.currentTarget.dataset.id;
    let that = this;
    if (that.data.tabCur == index)
      return;
    that.setData({
      tabCur: index,
      page: 1,
      bottoming: false,
      showBottomLoading: true,
      loading: true,
      areaIndex: 0,
      houseSellPriceIndex: 0,
      rentingTypeIndex: 0,
      reprisesIndex: 0,
      spaceIndex: 0,
      houseTypeIndex: 0,
      houseYearIndex: 0,
      houseStoreyIndex: 0,
      orientationsIndex: 0,
      zuqiIndex: 0,
      renovationIndex: 0,
      liftIndex: 0,
    })
    let items = that.data.houseSpeArray;
    for (var i = 0; i < items.length; i++) {
      if (i == 0) { //选择不限
        items[i].selected = true;
      } else {
        items[i].selected = false;
      }
    }
    that.setData({
      houseSpeArray: items
    })
    that.loadList();
  },

  //发布
  fabuTap: function(evt) {
    if (!util.hasAuthorize())
      return;
    wx.navigateTo({
      url: '/pages/house/house-sell/house-sell-fabu/house-sell-fabu?type=' + this.data.tabCur,
    })
  },

  detailTap: function(evt) {
    let id = evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/house/house-sell/house-sell-detail/house-sell-detail?id=' + id + '&type=' + this.data.tabCur,
    })
  },
  // 筛选
  tabNav: function(evt) {
    let that = this;
    let current = evt.currentTarget.dataset.current;
    let display = 'block'
    if (that.data.currentTab === current) {
      display = 'none';
      current = -1;
    }
    that.setData({
      displays: display,
      currentTab: current,
    })
  },
  // 隐藏筛选
  hideNav: function() {
    this.setData({
      displays: "none",
      currentTab: -1,
    })
  },

  //地区选择
  areaTap: function(evt) {
    let that = this;
    that.setData({
      areaIndex: evt.currentTarget.dataset.id
    });
    that.hideNav();
    that.loadList();
  },

  //房屋售价选择
  houseSellPriceTap: function(evt) {
    let that = this;
    that.setData({
      houseSellPriceIndex: evt.currentTarget.dataset.id
    });
    that.hideNav();
    that.loadList();
  },
  //租金
  reprisesTap: function(evt) {
    let that = this;
    that.setData({
      reprisesIndex: evt.currentTarget.dataset.id
    });
    that.hideNav();
    that.loadList();
  },

  //租房方式
  rentingTypeTap: function(evt) {
    let that = this;
    that.setData({
      rentingTypeIndex: evt.currentTarget.dataset.id
    });
    that.hideNav();
    that.loadList();
  },

  //筛选-面积
  selectSpaceTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      spaceIndex: id
    })
  },

  //筛选-房屋特色
  selectHouseSpeTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    let items = that.data.houseSpeArray;
    for (var i = 0; i < items.length; i++) {
      if (id == 0) { //选择不限
        items[i].selected = i == 0 ? true : false;
      } else {
        items[0].selected = false;
        if (items[i].id == id) {
          items[i].selected = !items[i].selected;
        }
      }
    }
    that.setData({
      houseSpeArray: items
    })
  },

  //筛选-房屋年龄
  selectHouseYearTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      houseYearIndex: id
    })
  },

  //筛选-房屋类型
  selectHouseTypeTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      houseTypeIndex: id
    })
  },

  //筛选-装修情况
  selectRenovationTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      renovationIndex: id
    })
  },
  //筛选-电梯情况
  selectLiftTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      liftIndex: id
    })
  },
  //筛选-房屋朝向
  selectOrientationsTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      orientationsIndex: id
    })
  },
  //筛选-房屋楼层
  selectHouseStoreyTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      houseStoreyIndex: id
    })
  },
  //筛选-租期
  selectZuQiTap: function(evt) {
    let that = this;
    let id = evt.currentTarget.dataset.id;
    that.setData({
      zuqiIndex: id
    })
  },
  shaixuanTap: function(evt) {
    let that = this;
    that.hideNav();
    that.loadList();
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
      setTimeout(function() {
        that.setData({
          page: that.data.page + 1,
        })
        that.loadList();
      }, 800)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})