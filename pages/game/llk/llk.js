// pages/game/llk/llk.
const app = getApp();
const util = require('../../../utils/util.js');
const http = require('../../../utils/http.js');
import tip from '../../../utils/tip.js';
var symbols = 'ABCDEFGHIGKLMNOPQRSTUV'; //WXYZ123456789
var config = 0;
var timer = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    nx: 6,
    ny: 8,
    count: 0,
    selectedCell: null,
    drawPath: [],
    timestamp: '00:00',
    gameOver: 0,
    progress:100,
    timer:[90],
    level:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.reset();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.clearTimer();
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.clearTimer();
  },

  clearTimer: function() {
    clearTimeout(timer);
  },

  reset: function() {
    let that = this;
    let {
      nx,
      ny,
      list
    } = that.data;
    let all = nx * ny;
    let halfAll = all / 2;
    let tmp = [];
    for (let i = 0; i < halfAll; i++) {
      var c = symbols.charAt(Math.floor(Math.random() * 22));
      tmp.push(c);
      tmp.push(c);
    }
    list = [];
    for (let i = all - 1; i >= 0; i--) {
      let r = Math.floor(Math.random() * i);
      let c = tmp.splice(r, 1).join('');
      let y = Math.floor(i / nx);
      let x = i - y * nx;
      // console.log('----------->>>', c, y, x)
      list.push({
        x: x,
        y: y,
        c: c,
        checked: false,
      })
    }
    list.reverse();
    console.log('-------', list)
    that.setData({
      list: list,
      count: that.data.timer[that.data.level],
      gameOver: 0,
      progress:100,
    })
    that.startTimer();
  },

  startTimer: function() {
    let that = this;
    let count = that.data.count;
    that.onTimestamp();
    timer = setTimeout(function() {
      count--;
      if (count <= 0) {
        count = count <= 0 ? 0 : count;
        // tip.success('游戏失败', 2000)
        console.log('游戏失败');
        that.setData({
          gameOver: 1,
        })
        that.clearTimer();
      } else {
        that.startTimer();
      }
      let max = that.data.timer[that.data.level];
      let pro = Math.floor(count/max *100);
      that.setData({
        count: count,
        progress:pro
      })
    }, 1000)
  },

  onTimestamp: function() {
    let that = this;
    let count = that.data.count;
    let m = Math.floor(count / 60);
    let s = count % 60;
    let str = util.formatNumber(m) + ':' + util.formatNumber(s);
    console.log('---------------- 分：', m, s, str)
    that.setData({
      timestamp: str,
    })
  },

  clickTap: function(evt) {
    let item = evt.currentTarget.dataset.item;
    if (item.checked)
      return;
    console.log('----- click cell: ', item);
    let that = this;
    let {
      selectedCell
    } = that.data;
    if (selectedCell) {
      config = 0;
      that.tryMatch(selectedCell, item);
      selectedCell = null;
    } else {
      selectedCell = item;
    }
    that.setData({
      selectedCell: selectedCell,
    })
  },

  tryMatch: function(ca, cb) {
    console.log('------ tryMatch: ', ca, cb)
    let that = this;
    if (ca.x == cb.x && ca.y == cb.y) {
      console.log('=======>>>> 点击同一块icon')
      return;
    }
    if (ca.c !== cb.c) {
      console.log('------->> 点击的不是同一个字符')
      return;
    }

    let pathStack = that.matchBlokcTwo(ca, cb);
    let found = pathStack.length > 0 ? true : false;

    if (!found)
      return;

    let {
      list
    } = that.data;
    for (let i = 0; i < list.length; i++) {
      if (list[i].x == ca.x && list[i].y == ca.y) {
        list[i].checked = true;
      }
      if (list[i].x == cb.x && list[i].y == cb.y)
        list[i].checked = true;
    }
    setTimeout(that.drawPath, 10, pathStack);

    that.setData({
      list: list,
    })

    if (that.gameOver()) {
      that.setData({
        gameOver: 2
      })
      console.log('游戏成功')
      this.clearTimer();
    }
  },

  gameOver: function() {
    let that = this;
    let {
      list
    } = that.data;
    for (let i = 0; i < list.length; i++) {
      if (!list[i].checked)
        return false;
    }
    return true;
  },

  //两这点
  matchBlokcTwo: function(ca, cb) {
    let that = this;
    let path = [];
    //判断0折连接
    path = that.matchBlackLine(ca, cb)
    if (path.length > 0) {
      console.log('------------------- 0 折')
      return path;
    }
    //判断1折连接
    path = that.matchBlockCorner(ca, cb);
    if (path.length > 0) {
      console.log('------------------- 1 折')
      return path;
    }
    //判断2折连线
    let i, cp, path2;
    let {
      nx,
      ny
    } = that.data;
    for (i = ca.y + 1; i < ny + 1; i++) {
      cp = {
        x: ca.x,
        y: i
      };
      console.log('--------------- <<< 1', cp)
      if (that.findChecked(cp)) {
        path = that.matchBlockCorner(cp, cb);
        path2 = that.matchBlackLine(ca, cp);
        if (path.length > 0 && path2.length > 0) {
          console.log('--------------- 2折  下')
          return path2.concat(path);
        }
      } else break;
    }

    for (i = ca.y - 1; i > -2; i--) {
      cp = {
        x: ca.x,
        y: i
      };
      console.log('--------------- <<< 2', cp)
      if (that.findChecked(cp)) {
        path = that.matchBlockCorner(cp, cb);
        path2 = that.matchBlackLine(ca, cp);
        if (path.length > 0 && path2.length > 0) {
          console.log('--------------- 2折  上')
          return path2.concat(path);
        }
      } else break;
    }

    for (i = ca.x + 1; i < nx + 1; i++) {
      cp = {
        x: i,
        y: ca.y
      };
      console.log('--------------- <<< 3', cp)
      if (that.findChecked(cp)) {
        path = that.matchBlockCorner(cp, cb);
        path2 = that.matchBlackLine(ca, cp);
        if (path.length > 0 && path2.length > 0) {
          console.log('--------------- 2折  右')
          return path2.concat(path);
        }
      } else break;
    }

    for (i = ca.x - 1; i > -2; i--) {
      cp = {
        x: i,
        y: ca.y
      };
      console.log('--------------- <<< 4', cp)
      if (that.findChecked(cp)) {
        path = that.matchBlockCorner(cp, cb);
        path2 = that.matchBlackLine(ca, cp);
        if (path.length > 0 && path2.length > 0) {
          console.log('--------------- 2折  左')
          return path2.concat(path);
        }
      } else break;
    }

    return [];
  },
  //直线
  matchBlackLine: function(ca, cb) {
    let that = this;
    if (!(ca.x == cb.x || ca.y == cb.y)) //如果不属于0折线，返回false
      return [];
    let min, max, obj;
    let path = [ca, cb];
    if (ca.x == cb.x) { //如果两点的x坐标相等，则在水平方向上扫描
      min = ca.y < cb.y ? ca.y : cb.y;
      max = ca.y > cb.y ? ca.y : cb.y;
      for (min++; min < max; min++) {
        obj = {
          x: ca.x,
          y: min
        };
        if (!that.findChecked(obj))
          return [];
        path.push(obj);
      }
    } else { //如果两点的y坐标相等，则在竖直方向上扫描
      min = ca.x < cb.x ? ca.x : cb.x;
      max = ca.x > cb.x ? ca.x : cb.x;
      for (min++; min < max; min++) {
        obj = {
          x: min,
          y: ca.y
        };
        if (!that.findChecked(obj))
          return [];
        path.push(obj);
      }
    }
    return path;
  },

  //一个转角
  matchBlockCorner: function(ca, cb) {
    // console.log('------ 1折判断 ', ca, cb)
    if (ca.x == cb.x || ca.y == cb.y) //如果不属于1折连接则返回false
      return [];

    let that = this;
    let path1 = [];
    let path2 = [];
    let cp = {
      x: ca.x,
      y: cb.y
    };
    if (that.findChecked(cp)) {
      path1 = that.matchBlackLine(ca, cp);
      path2 = that.matchBlackLine(cp, cb);
      if (path1.length > 0 && path2.length > 0)
        return path1.concat(path2);
    }

    cp = {
      x: cb.x,
      y: ca.y
    };
    if (that.findChecked(cp)) {
      path1 = that.matchBlackLine(ca, cp);
      path2 = that.matchBlackLine(cp, cb);
      if (path1.length > 0 && path2.length > 0)
        return path1.concat(path2);
    }
    return [];
  },

  //该点是否为---1.边缘地带，2.还没消除方块
  findChecked: function(c) {
    let that = this;
    let {
      list
    } = that.data;
    for (var i = 0; i < list.length; i++) {
      if (list[i].x == c.x && list[i].y == c.y)
        return list[i].checked;
    }
    return true;
  },

  neibors: function(c) {
    let that = this;
    let neiborArr = [
      that.fc(c.x - 1, c.y),
      that.fc(c.x + 1, c.y),
      that.fc(c.x, c.y + 1),
      that.fc(c.x, c.y - 1)
    ];
    return neiborArr;
  },

  fc: function(x, y) {
    let that = this;
    let {
      nx,
      ny
    } = that.data;
    if (x < -1 || x > nx || y < -1 || y > ny) {
      return null;
    }
    return {
      x: x,
      y: y
    };
  },

  clearPath: function(path) {
    this.setData({
      drawPath: []
    })
  },

  drawPath: function(path) {
    console.log('----- draw:', path)
    let that = this;
    that.setData({
      drawPath: path
    })
    setTimeout(that.clearPath, 150, path);
  },
})