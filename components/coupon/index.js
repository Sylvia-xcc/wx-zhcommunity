// components/coupon/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupons_list: {
      type: Array,
      value: [],
      observer(value) {
        this.initData(value)
      }
    },
    couponId: {
      type: Number,
      value: 0,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false,
    coupons:[],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //初始化弹窗所有属性
    initData: function (value) {
      let that = this;
      value.push({
        coupon_id:0,
        coupon_name:'不使用优惠劵'
      })
      that.setData({
        coupons_list:value,
      })
    },

    changeTap:function(evt){
      console.log(evt)
      this.setData({
        couponId:evt.detail.value
      })
    },

    submitTap:function(){
      this.triggerEvent("onCouponChoiceTap", {couponId:this.data.couponId});
      this.toggleModal();
    },

    toggleModal() {
      this.setData({
        showModal: !this.data.showModal,
      })
      this.triggerEvent('toggleModal', { showModal: this.data.showModal})
    },
  }
})