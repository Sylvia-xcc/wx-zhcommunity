// components/startup/startup.js
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
    show:true,
    autoplay:true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goTap:function(evt){
      this.setData({
        show:false,
      })
      this.triggerEvent("startup");
    },

    bindchange: function (evt) {
      console.log(evt)
      if (evt.detail.current == 2) {
        this.setData({
          autoplay: false,
        })
      }
    },
  }
})