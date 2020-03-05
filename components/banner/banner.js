// components/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    banner: {
      type: Array,
      value: []
    },
    videoUrl: {
      type: String,
      value: ''
    },
    radius: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    autoplay: false,
    swiperH: 0,
    btnH: 0,
    isVideoPlay: false, //视频是否在播放
    interval: 5000,
    current: 0,
    num: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**设置轮播图容器的高度*/
    setContainerHeight: function(evt) {
      let that = this;
      let winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
      let imgh = evt.detail.height; //图片高度
      let imgw = evt.detail.width; //图片宽度
      let swiperH = winWid * imgh / imgw;
      swiperH = (swiperH >= that.data.swiperH) ? swiperH : that.data.swiperH;
      swiperH = 300;
      let btnH = (swiperH - 96) / 2;
      btnH = btnH >= that.data.btnH ? btnH : that.data.btnH;
      that.setData({
        swiperH: swiperH, //设置高度
        btnH: btnH,
        num: that.data.num + 1
      })
      // console.log('------num', that.data.num, swiperH)
    },

    previewImgTap: function(evt) {
      let that = this;
      let id = evt.currentTarget.dataset.id;
      let type = evt.currentTarget.dataset.type;
      let items = that.data.banner;
      let imgs = [];
      if (type == 'url') {
        for (var i = 0; i < items.length; i++) {
          imgs.push(items[i].url);
        }
      } else {
        imgs = items;
      }
      wx.previewImage({
        current: imgs[id],
        urls: imgs
      });
    },

    /**video自带播放事件监听*/
    play: function(evt) {
      if (this.properties.videoUrl == '')
        return;
      // console.log("play:", evt)
      this.setData({
        autoplay: false,
        isVideoPlay: true,
      })
    },

    /**video自带暂停事件监听*/
    pause: function(evt) {
      if (this.properties.videoUrl == '')
        return;
      // console.log("pause:", evt)
      let interval = this.data.current == 0 ? 1000 : 5000;
      this.setData({
        autoplay: true,
        isVideoPlay: false,
        interval: interval
      })
    },

    /**swiper 切换*/
    swiperChange: function(evt) {
      var that = this;
      let current = evt.detail.current;
      that.setData({
        current: current,
        interval: 5000
      });

      if (that.properties.videoUrl == '')
        return;
      if (!that.data.isVideoPlay)
        return;
      setTimeout(function() {
        var videoContextPrev = wx.createVideoContext("myvideo", that)
        // console.log("------->>>. pause", that.data.isVideoPlay)
        videoContextPrev.stop();
      }, 100)
    },

    /**自定义 播放/暂停 按钮事件*/
    playVideo: function(evt) {
      var that = this;
      if (that.properties.videoUrl == '')
        return;
      setTimeout(function() {
        var videoContextPrev = wx.createVideoContext("myvideo", that);
        if (that.data.isVideoPlay)
          videoContextPrev.pause();
        else
          videoContextPrev.play();
      }, 100)
    },
  }
})