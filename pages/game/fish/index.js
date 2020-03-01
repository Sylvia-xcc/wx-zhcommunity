// pages/fish/index.js

var timer = 0;
var arrFish = [];
var rule = 0.02;
var out = 30; //出界范围
var fishDirection = 0;
var dieId = 0; //被抓到鱼的id
var fishDirection = [
  [0, 380, 1, 0, 1.1],
  [350, 500, 2, 180, 0.8],
  [200, 550, 3, 180, 1],
  [130, 420, 4, 0, 0.9]
  // [180, 460, 5, 0, 0.5]
];

var sH = 0;
var sW = 0;

var anim = false;
var gouzi = null;
var line = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showHidden: true,
    width: 375,
    height: 667,
    id: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('----------- init fish')
    this.ctx = wx.createCanvasContext('xcanvas', this);
    sW = wx.getSystemInfoSync().windowWidth;
    sH = wx.getSystemInfoSync().windowHeight;
    console.log(sW, sH);
    this.setData({
      height: sH,
      width: sW
    })
    this.initialGame();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log('------------- 移除 fish 计时器')
    clearInterval(timer);
    timer = 0;
    line = null;
    gouzi = null;
    for (var i = 0; i < arrFish.length; i++) {
      arrFish[i].destroy();
      arrFish[i] = null;
    }
    arrFish = [];
  },

  initialGame: function() {
    let that = this;
    var out = 10; //出界范围

    gouzi = new GouZi(1);
    line = new Line();

    //初始化鱼
    for (let j = 0; j < fishDirection.length; j++) {
      let f = that.initFish(j);
      arrFish.push(f);
    }

    timer = setInterval(function() {
      let w = that.data.width;
      let h = that.data.height;
      that.ctx.clearRect(0, 0, w, h);
      //画鱼
      for (var i = 0; i < arrFish.length; i++) {
        arrFish[i].draw(that.ctx);
      }
      //画线
      line.draw(that.ctx);
      //画钩子
      gouzi.draw(that.ctx);
      that.ctx.draw();

      //检测钩子出界
      if (gouzi.x < -out || gouzi.x > sW + out || gouzi.y < -out || gouzi.y > sH - out * 3) {
        console.log("====================== 出界")
        gouzi.setState(state_2_nocaught);
        line.setState(state_2_nocaught);
        line.speed = speedBack;
        gouzi.speed = speedBack;
      }
      //初始状态-休息
      if (gouzi.radius <= 100) {
        if (gouzi.state == 3) { //钓到鱼-弹窗
          console.log('抓到鱼--弹窗', that.data.id);
          that.setData({
            showHidden: false,
          })
        }
        gouzi.setState(state_0_rest);
        line.setState(state_0_rest);
      }

      //检测钩子和鱼碰到
      for (var i = 0; i < arrFish.length; i++) {
        if (arrFish[i].isIn(gouzi.x, gouzi.y) && gouzi.state == 1) {
          var type = arrFish[i].type;
          var x = arrFish[i].x;
          var y = arrFish[i].y;
          var rotate = arrFish[i].rotate;
          console.log('=====================>>>>抓到鱼')

          gouzi.setState(state_3_yescaught);
          line.setState(state_3_yescaught)
          gouzi.fishid = type;

          //鱼死
          dieId = arrFish[i].type;
          that.setData({
            id: dieId,
          })
          arrFish[i].destroy();
          arrFish.splice(i, 1);
          i--;
        }
      }
    }, 30);
  },
  //初始化鱼
  initFish(type) {
    var f = new Fish(fishDirection[type][2]);
    f.x = fishDirection[type][0];
    f.y = fishDirection[type][1]+ sH-667;
    f.rotate = fishDirection[type][3];
    f.speed = fishDirection[type][4];
    // console.log(f)
    return f;
  },

  clickTap: function(evt) {
    if (gouzi.state != 0) //休息状态下才可以抓鱼
      return;
    // console.log(evt)

    gouzi.setState(state_1_grap)
    line.setState(state_1_grap);
  },

  onClose(evt) {
    this.setData({
      showHidden: true,
    });
    var f = this.initFish(dieId - 1);
    arrFish.push(f);
    dieId = 0;
  },

  gotoTap(evt) {
    let id = evt.currentTarget.dataset.id;
    let url = '';
    console.log('----', id)
    if (id == 1) {
      url = '/pager/yuehui/yuehui?id=' + id;
    } else if (id == 2) {
      url = '/pager/renwu/renwu?id=' + id;
    } else if (id == 3) {
      url = '/pager/liaotian/liaotian?id=' + id;
    } else if (id == 4) {
      url = '/pages/news/news?id=' + id;
    }
    if(url=='')
    return;
    wx.navigateTo({
      url: url,
    })
    this.onClose(null)
  },
})

//鱼
var FISH_SIZE = [
  null,
  {
    w: 55,
    h: 37,
    collR: 17
  },
  {
    w: 78,
    h: 64,
    collR: 24
  },
  {
    w: 72,
    h: 56,
    collR: 20
  },
  {
    w: 77,
    h: 59,
    collR: 22
  },
  {
    w: 107,
    h: 122,
    collR: 29
  }
];

function Fish(type) {
  this.x = 0;
  this.y = 0;
  this.rotate = 0;
  this.type = type;

  this.speed = 1; //速度定成1
  this.cur = 0;

  this.timerCount = 0; //计算器
  this.timerCount2 = 0;
  this.die = 0;
  this.move();
  console.log('------ type', this.type)
  this.collR = FISH_SIZE[this.type].collR;
}

Fish.prototype.draw = function(gd) {
  var w = FISH_SIZE[this.type].w;
  var h = FISH_SIZE[this.type].h;
  var left = sW;
  this.rotate = (this.x >= left) ? 180 : (this.x <= 0) ? 0 : this.rotate;

  // console.log('draw fish =======', this.x, this.y, w, h, this.rotate)

  gd.save();
  gd.translate(this.x, this.y);
  gd.rotate(d2a(this.rotate));

  if (this.rotate > 90 && this.rotate < 270) {
    gd.scale(1, -1);
  }
  var url = '/images/fish/fish' + this.type + '.png';
  gd.drawImage(url, 0, this.cur * h, w, h, -w / 2, -h / 2, w, h);
  gd.restore();
};

Fish.prototype.move = function() {
  var _this = this;
  //鱼走
  _this.timerCount = setInterval(function() {
    var speedX = _this.speed * Math.cos(d2a(_this.rotate));
    var speedY = _this.speed * Math.sin(d2a(_this.rotate));
    _this.x += speedX;
    _this.y += speedY;
  }, 30);

  //尾巴动
  _this.timerCount2 = setInterval(function() {
    _this.cur++;
    if (_this.cur == 4) {
      _this.cur = 0;
    }
  }, 150);
};

//检测子弹是否进去
Fish.prototype.isIn = function(x, y) {
  var a = x - this.x;
  var b = y - this.y;
  var c = Math.sqrt(a * a + b * b);
  if (c < this.collR) {
    return true;
  } else {
    return false;
  }
};

Fish.prototype.destroy = function() {
  clearInterval(this.timerCount);
  clearInterval(this.timerCount2);
}

//钩子
var speedMove = 9; //绳子正常的速度
var speedBack = 12; //绳子碰壁返回的速度
var speedFood = 4; //绳子抓到东西的速度
const state_0_rest = 0; //状态1：休息
const state_1_grap = 1; //状态2：抓人
const state_2_nocaught = 2; //状态3：没抓到
const state_3_yescaught = 3; //状态4：抓到

var GOUZI_SIZE = [
  null,
  {
    w: 72,
    h: 50
  },
];

function GouZi(type) {
  this.x = 0 || sW/2;
  this.y = 0 || 0;
  this.type = type;
  this.cx = sW / 2;
  this.cy = 0;
  this.g = 0; //钩子旋转时的临时角度
  this.state = state_0_rest; //钩子初始状态
  this.rotate = 0; //旋转角度
  this.speed = speedMove; //速度定义
  this.radius = 100; //初始半径
  this.speedR = 0.5; //绳子旋转速度
  this.fishid = 0; //被抓住鱼的id
}

GouZi.prototype.draw = function(gd) {
  var w = GOUZI_SIZE[this.type].w;
  var h = GOUZI_SIZE[this.type].h;
  // console.log(w, h, this.x, this.y)

  gd.save();
  gd.translate(this.x, this.y);
  gd.rotate(d2a(this.rotate));
  let url = (this.fishid == 0) ? '/images/fish/gouzi.png' : ('/images/fish/gouzi' + this.fishid + '.png')
  gd.drawImage(
    url,
    0, 0, w, h, -w / 2, -h / 2, w, h
  );
  gd.restore();
  this.animation();
};

GouZi.prototype.animation = function() {
  var _this = this;
  if (_this.state == state_1_grap) //前进
    _this.radius += _this.speed;
  else if (_this.state == state_3_yescaught || _this.state == state_2_nocaught) //返回
    _this.radius -= _this.speed;
  else { //休息
    _this.radius = 100;
    _this.speedR = (_this.g >= 45 || _this.g <= -45) ? -1 * _this.speedR : _this.speedR;
    _this.g += _this.speedR;
  }
  var speedX = _this.radius * Math.sin(d2a(_this.g));
  var speedY = _this.radius * Math.cos(d2a(_this.g));
  _this.x = speedX + _this.cx;
  _this.y = speedY + _this.cy;
  _this.rotate = 360 - _this.g;
  // console.log(_this.rotate)
};

//设置钩子状态
GouZi.prototype.setState = function(state) {
  var _this = this;
  _this.state = state;
  if (state == state_0_rest) { //1. 休息状态
    _this.speed = 0;
    _this.fishid = 0;
  } else if (state == state_1_grap) { //2. 抓人状态
    _this.speed = speedMove;
  } else if (state == state_2_nocaught) { //3. 没抓到东西返回
    _this.speed = speedBack;
  } else { //4. 抓到东西-返回
    _this.speed = speedFood;
  }
}

function Line() {
  this.x = sW/2
  this.y = 0;
  this.cx = sW / 2;
  this.cy = 0;
  this.rotate = 0;
  this.speed = speedMove; //速度定义
  this.radius = 80;
  this.g = 0;
  this.anim = false;
  this.speedR = 0.5;
  this.state = state_0_rest;
  console.log('------>',sW)
}

Line.prototype.draw = function(gd) {
  var _this = this;
  gd.save();
  if (_this.state == state_1_grap) //前进
    _this.radius += _this.speed;
  else if (_this.state == state_3_yescaught || _this.state == state_2_nocaught) //返回
    _this.radius -= _this.speed;
  else { //休息
    _this.radius = 80;
    _this.speedR = (_this.g >= 45 || _this.g <= -45) ? -1 * _this.speedR : _this.speedR;
    _this.g += _this.speedR;
  }

  var speedX = parseInt(_this.radius * Math.sin(d2a(_this.g)));
  var speedY = parseInt(_this.radius * Math.cos(d2a(_this.g)));
  var tx = speedX + _this.cx;
  var ty = speedY + _this.cy;

  // console.log(_this.radius, _this.anim, _this);
  gd.setLineWidth(3)
  gd.moveTo(_this.x, 0);
  gd.lineTo(tx, ty);
  gd.style
  gd.stroke();
  gd.restore();
};

//设置绳子状态
Line.prototype.setState = function(state) {
  var _this = this;
  _this.state = state;
  if (state == state_0_rest) { //1. 休息状态
    _this.speed = 0;
  } else if (state == state_1_grap) { //2. 抓人状态
    _this.speed = speedMove;
  } else if (state == state_2_nocaught) { //3. 没抓到东西返回
    _this.speed = speedBack;
  } else { //4. 抓到东西-返回
    _this.speed = speedFood;
  }
}


//角度转弧度的公式
function d2a(n) {
  return n * Math.PI / 180;
}

function a2d(n) {
  return n * 180 / Math.PI;
}

function rnd(n, m) {
  return parseInt(Math.random() * (m - n) + n);
}