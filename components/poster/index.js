// components/poster/index.js
import tip from '../../utils/tip.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    drawDataList: {
      type: Object,
      value: null,
      observer(value) {
        if (JSON.stringify(value) != "{}") {
          this.initData(value)
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imagePath: "",
    maskHidden: false,
    showMask: false,
    canvasData: {},
    drawList: [],
    customData: {
      imageList: [],
      textList: []
    },
    haveDrawEnd: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    generatePaper(value) {
      console.log('-------------- AAA 点击海报');
      let that = this;
      that.setData({
        maskHidden:true
      })
      if (!that.data.haveDrawEnd) {
        tip.loading('海报生成中...');
        that.initData(value)
        that.drawImgInit();
      }
    },
    // 数据初始化
    initData(value) {
      let that = this;
      let {
        canvasData,
        drawList,
      } = that.data;
      canvasData = value.canvasData || []
      drawList = value.content || []
      that.setData({
        canvasData,
        drawList,
      })
    },

    drawImgInit() {
      let that = this
      let {
        canvasData,
        drawList,
        customData,
      } = that.data
      let imageList = customData.imageList
      let textList = customData.textList
      let lineList = [];
      // 分离图片和文字
      if (drawList.length) {
        drawList.forEach((item, index) => {
          switch (item.type) {
            case 'image':
            case 'image-local':
              imageList.push(item)
              break;
            case 'text':
              textList.push(item)
              break;
            case 'line':
              lineList.push(item);
          }
        })
      }
      for (let i in textList) {
        textList[i].left = parseInt(textList[i].left / 1) || 0
        textList[i].top = parseInt(textList[i].top / 1) || 0
        textList[i].fontSize = parseInt(textList[i].fontSize / 1) || 16
        textList[i].lineHeight = parseInt(textList[i].lineHeight / 1) || 16
        textList[i].maxWidth = parseInt(textList[i].maxWidth / 1) || 300
      }
      // 下载图片到本地后
      let downloadimgs = []; //存储正在下载的网络图片方法promise
      for (let i in imageList) {
        imageList[i].left = parseInt(imageList[i].left / 1) || 0
        imageList[i].top = parseInt(imageList[i].top / 1) || 0
        imageList[i].width = parseInt(imageList[i].width / 1) || 100
        imageList[i].height = parseInt(imageList[i].height / 1) || 100
        if (imageList[i].type == 'image') {
          // console.log("保存的 网络图片Map", savedFilePaths)
          downloadimgs.push(
            that.downLoadImg(imageList[i].url, imageList[i].comment, i).then(res => {
              imageList[i].url = res
            }, err => {
              console.log('错误提示', err)
            })
          );
        }
      }
      //判断是否所以网络图片都下载完成
      if (downloadimgs.length > 0) {
        Promise.all(downloadimgs).then(res => {
          console.log("画布", 'init初始化完成...')
          that.data.drawData = [...imageList, ...textList, ...lineList];
          that.beginDraw()
        })
      } else { //没有网络图片，不需要等待
        console.log("画布", 'init初始化完成...')
        that.data.drawData = [...imageList, ...textList, ...lineList];
        that.beginDraw()
      }
    },
    downLoadImg(imgurl, msg) {
      return new Promise((resolve, reject) => {
        let that = this
        tip.loading('下载中...')
        wx.downloadFile({
          url: imgurl,
          complete: function(res) {
            if (res.statusCode === 200) {
              tip.loaded()
              resolve(res.tempFilePath)
            } else {
              reject(new Error('downloadFail fail'))
            }
          }
        })
      })
    },
    // 裁剪圆形头像
    circleImg(params, ctx) {
      const {
        url,
        left,
        top,
        width
      } = params;
      let r = parseInt(width / 2) // 半径
      ctx.save()
      let d = 2 * r
      let cx = left + r
      let cy = top + r
      ctx.arc(cx, cy, r, 0, 2 * Math.PI)
      ctx.clip()
      ctx.drawImage(url, left, top, d, d)
      ctx.restore()
    },
    drawImg(params, ctx) {
      let that = this
      const {
        url = '', top = 0, left = 0, width = 50, height = 50, shape = 'square'
      } = params
      if (params.shape == 'circle') {
        that.circleImg(params)
      } else {
        console.log("---->>draw", params)
        ctx.drawImage(url, left, top, width, height)
      }
    },
    // 绘制文字
    fillText(params, ctx) {
      const {
        fontSize = 16, color = '#FFFFFF', content, left = 0, top = 0, textAlign = 'center', lineHeight = 16, lineMax = 2, maxWidth = 300, weight = 'normal'
      } = params
      let arrText = content.split('')
      let line = '',
        _top = top,
        lineNum = 1,
        testLine = ''
      ctx.setFillStyle(color)
      ctx.setTextAlign(textAlign)
      ctx.font = 'normal normal ' + weight + ' ' + fontSize + 'px ' + 'cursive';
      for (let i = 0; i < arrText.length; i++) {
        testLine += [arrText[i]]
        let testWidth = ctx.measureText(testLine).width || 0
        if (testWidth > maxWidth) {
          if (lineNum === lineMax) { //最多显示多少行，暂时去掉此限制
            if (i !== arrText.length) {
              testLine = testLine.substring(0, testLine.length - 1) + '...'
              ctx.fillText(testLine, left, _top, maxWidth)
              testLine = ''
              break
            }
          }
          ctx.fillText(testLine, left, _top, maxWidth)
          testLine = ''
          _top += lineHeight
          lineNum++
        }
      }
      ctx.fillText(testLine, left, _top, maxWidth)
    },
    drawLine(params, ctx) {
      let that = this
      const {
        x1 = 0, x2 = 0, y1 = 0, y2 = 0, color = '#FFFFFF', lineHeight = 1
      } = params
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.setStrokeStyle(color);
      ctx.setLineWidth(lineHeight);
      ctx.stroke()
    },
    // 开始绘制
    beginDraw() {
      let that = this
      let {
        drawData
      } = that.data
      let imgIndex = 0
      let ctx = wx.createCanvasContext('xcanvas', that)
      for (let i in drawData) {
        switch (drawData[i].type) {
          case 'image':
          case 'image-local':
            that.drawImg({
              ...drawData[i]
            }, ctx)
            imgIndex++
            break;
          case 'text':
            that.fillText({
              ...drawData[i]
            }, ctx)
            break;
          case 'line':
            that.drawLine({
              ...drawData[i]
            }, ctx)
            break
        }
      }
      ctx.draw();
      console.log("beginDraw");
      //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'xcanvas',
          success: function (res) {
            var tempFilePath = res.tempFilePath;
            console.log(res)
            that.setData({
              imagePath: tempFilePath,
              showMask:true,
              haveDrawEnd:true
            })
            wx.hideLoading();
          },
          fail: function (res) {
            console.log(res);
          }
        }, that);
      }, 600);
    },
    saveAlbum() {
      var that = this;
      var IMG_URL = that.data.imagePath;
      console.log('---------- imgUrl:',IMG_URL)
      wx.saveImageToPhotosAlbum({
        filePath: IMG_URL,
        success(res) {
          wx.showModal({
            content: '图片已保存到相册，赶紧晒一下吧~',
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#333',
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  maskHidden:false
                })
              }
            },
            fail: function (res) {
              // console.log(11111)
            }
          })
        }
      })
    },
    closeTap(evt) {
      let that = this;
      if (!that.data.haveDrawEnd)
        return;
      that.setData({
        maskHidden:false
      }) 
    },
  }
})