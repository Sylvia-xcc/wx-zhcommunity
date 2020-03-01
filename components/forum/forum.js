// components/forum/forum.js
const http = require('../../utils/http.js');
import tip from '../../utils/tip.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
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
    isCard: true,
    content: '',
    shareModel:null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 数据初始化
    initData(value) {
      let that = this;
      let pics = value.pics || [];
      let share = {
        title: value.subject,
        path:'/pages/forum/forum-detail/forum-detail?tid='+ value.tid,
        imageUrl: pics.length > 0 ? pics[0].thumb:''
      }
      that.setData({
        shareModel:share
      })
    },
    //版块详情
    sectionTap: function(evt) {
      let fid = evt.currentTarget.dataset.fid;
      wx.navigateTo({
        url: '/pages/section/section-detail/section-detail?fid=' + fid,
      })
    },
    //帖子详情
    forumTap: function(evt) {
      let tid = evt.currentTarget.dataset.tid;
      wx.navigateTo({
        url: '/pages/forum/forum-detail/forum-detail?tid=' + tid,
      })
    },
    //个人主页
    personalTap: function(evt) {
      let uid = evt.currentTarget.dataset.uid;
      let anonymous = evt.currentTarget.dataset.anonymous;
      if(anonymous>0 || anonymous==null)
        return;
      wx.navigateTo({
        url: '/pages/personal-page/personal-page?uid=' + uid,
      })
    },

    //收藏帖子
    collectTap: function(evt) {
      let tid = evt.currentTarget.dataset.tid;
      let that = this;
      let url = that.data.item.isfav > 0 ? "thread/removeBookmark" : "thread/addBookmark";
      http.requestUrl({
        url: url,
        methods: 'post',
        data: {
          id: tid
        }
      }).then(res => {
        let item = that.data.item;
        item.isfav = item.isfav > 0 ? 0 : 1;
        item.favs = item.isfav > 0 ? item.favs + 1 : item.favs - 1;
        item.favs = item.favs <= 0 ? 0 : item.favs;
        that.setData({
          item: item
        })
        tip.success(res.msg, 1000)
      })
    },
    //点赞帖子
    likeTap: function(evt) {
      let tid = evt.currentTarget.dataset.tid;
      let pid = evt.currentTarget.dataset.pid;
      let that = this;
      let url = that.data.item.islike > 0 ? "thread/removelike" : "thread/addlike";
      let id = that.data.item.islike > 0 ? pid : tid;
      http.requestUrl({
        url: url,
        methods: 'post',
        data: {
          id: id
        }
      }).then(res => {
        let item = that.data.item;
        item.islike = item.islike > 0 ? 0 : 1;
        item.likes = item.islike > 0 ? item.likes + 1 : item.likes - 1;
        item.likes = item.likes <= 0 ? 0 : item.likes;
        that.setData({
          item: item
        })
        tip.success(res.msg, 1000)
      })
    },
    //预览
    previewImgTap: function (evt) {
      let id = evt.currentTarget.dataset.id;
      let dataimg = evt.currentTarget.dataset.dataimg;
      let tmp = [];
      for(var i=0; i<dataimg.length; i++){
        tmp.push(dataimg[i].thumb)
      }
      console.log('============>>>', id, tmp)
      wx.previewImage({
        current: tmp[id],
        urls: tmp
      });
    },
  }
})