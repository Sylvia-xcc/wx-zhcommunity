// components/textarea/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:'评论'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false,
    comment:'',
    id:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggleModal(id) {
      this.setData({
        showModal: !this.data.showModal,
        comment:'',
        id:id||0,
      })
    },
    submitTap(evt){      
      this.triggerEvent("OnSubmit", {value:this.data.comment, id:this.data.id})
      this.setData({
        showModal: !this.data.showModal,
      })
    },
    bindinput(evt){
      this.setData({
        comment: evt.detail.value
      })
    }
  }
})
