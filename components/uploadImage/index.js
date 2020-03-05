// components/uploadImage/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    upload_pic:{
      type:Array,
      value:[]
    },
    video:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // upload_pic: [],
    upload_max: 9, //上传图片最大数量
    // video: '',
    optype: 0, //0：图片 1：视频
    height: 108,
    px:90,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    submit:function(){
      let that = this;
      that.triggerEvent("uploadFun", { video: that.data.video, pics: that.data.upload_pic });
    },
    //选择图片
    chooseImage() {
      let that = this;
      let max = that.data.upload_max;// that.data.video == '' ? 9 : 8;
      let len = max - that.data.upload_pic.length;
      len = len <= 0 ? 0 : len;
      wx.chooseImage({
        count: len, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: (res) => {
          if (this.data.upload_pic.length != 0) {
            this.setData({
              upload_pic: this.data.upload_pic.concat(res.tempFilePaths)
            })
          } else {
            this.setData({
              upload_pic: res.tempFilePaths
            })
          }
          that.submit();
          // console.log('---------- 上传视频', this.data.upload_pic)
        }
      });
    },
    //选择视频
    chooseVideo() {
      let that = this;
      let height = wx.getSystemInfoSync().windowWidth;
      height = Math.floor((height - 20) / 3) - 10;
      let px = (300-height)/2
      wx.chooseVideo({
        success: (res) => {
          console.log(res.tempFilePath)
          this.setData({
            video: res.tempFilePath,
            height: height,
            upload_max:8,
            px:px,
          })
          that.submit();
        }
      })
    },

    //预览图片
    previewImg(e) {
      wx.previewImage({
        urls: this.data.upload_pic,
        current: e.currentTarget.dataset.url
      });
    },
    //删除图片
    delTap(e) {
      wx.showModal({
        title: '提示',
        content: '确定要删除这段回忆吗？',
        cancelText: '再看看',
        confirmText: '再见',
        success: res => {
          if (res.confirm) {
            let that = this;
            that.data.upload_pic.splice(e.currentTarget.dataset.index, 1);
            that.setData({
              upload_pic: that.data.upload_pic,
            })
            that.submit();
          }
        }
      })
    },

    delVideoTap(e) {
      wx.showModal({
        title: '提示',
        content: '确定要删除这段回忆吗？',
        cancelText: '再看看',
        confirmText: '再见',
        success: res => {
          if (res.confirm) {
            let that = this;
            that.setData({
              video: '',
              upload_max:9,
            })
            that.submit();
          }
        }
      })
    }
  }
})
