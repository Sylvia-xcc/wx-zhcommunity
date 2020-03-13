// components/textarea/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:'写评论...'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false,
    comment:'',
    id:0,
    tid:0,
    focus:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggleModal(id=0,tid=0) {
      this.setData({
        showModal: !this.data.showModal,
        comment:'',
        id:id||0,
        tid:tid||0,
        focus:true,
      })
    },
    submitTap(evt){      
      this.triggerEvent("OnSubmit", {value:this.data.comment, id:this.data.id, tid:this.data.tid})
      this.setData({
        showModal: !this.data.showModal,
        focus:false,
      })
    },
    bindinput(evt){
      this.setData({
        comment: evt.detail.value
      })
    }
  }
})
