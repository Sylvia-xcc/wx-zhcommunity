// components/meeting/meeting.js
const app = getApp();
const http = require('../../utils/http.js');
import tip from '../../utils/tip.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:null,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalName: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null,
        meet: null,
      })
    },

    //报名
    joinTap: function (evt) {
      let that = this;
      http.requestUrl({
        url: 'meeting/join',
        news: true,
        data: {
          uid: app.d.uid,
          mid: that.data.item.id,
        },
        method: 'post',
      }).then(res => {
        tip.success('报名成功', 1000);
        that.hideModal();
      })
    }, 

    //预览
    previewImgTap: function (evt) {
      let id = evt.currentTarget.dataset.id;
      let dataimg = evt.currentTarget.dataset.dataimg;
      wx.previewImage({
        current: dataimg[id],
        urls: dataimg
      });
    },
  }
})
