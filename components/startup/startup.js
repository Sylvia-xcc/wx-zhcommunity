// components/startup/startup.js
var timer = 0; //计时器
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    swiperList: ['http://image.fengzhankeji.com/static/startup1.png'],
    show: true,
    autoplay: true,
    count:4,
  },

  lifetimes: {
    ready: function() {
      console.log('-------------- ready');
      // let that = this;
      // that.startCount();
    },
    detached: function() {
      console.log('-------------- detached')
      clearInterval(this.timer);
    },
  },

  pageLifetimes: {
    show: function() {
      // 页面被展示
      console.log('------------ show');
    },
    hide: function() {
      // 页面被隐藏
      console.log('------------ hide');
      clearInterval(this.timer);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    skinTap: function(evt) {
      this.hide();
    },

    bindchange: function(evt) {
      console.log(evt)
      if (evt.detail.current == 2) {
        this.setData({
          autoplay: false,
        })
      }
    },

    hide:function(){
      this.setData({
        show: false,
      })
      clearInterval(this.timer);
      this.triggerEvent("startup");
    },

    /**计时器*/
    startCount: function () {
      let that = this;
      that.setTick();
      if (that.data.count>0) {
        that.timer = setTimeout(() => {
          that.startCount();
        }, 1000)
      }else{
        that.hide();
      }
    },

    //计算时间方法
    setTick: function () {
      let that = this;
      let count = that.data.count;
      count--;
      that.setData({
        count: count
      })
      console.log('----- skin ', count)
    },
  }
})