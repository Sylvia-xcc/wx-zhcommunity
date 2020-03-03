// components/commodity/index.js
const app = getApp();
import tip from '../../utils/tip.js';
const http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commodityData: {
      type: Object,
      value: {},
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
    showModal: false,
    buynum: 1,
    show_attr_value: true,
    attrValueList: [],
    itemData: {},
    optype: 'addcart', //操作方式
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //初始化弹窗所有属性
    initData: function(value) {
      let that = this;
      let attr = that.initAttributeValue(value.attrValueList);
      let show = that.canFitHaveSelectedAttrValue(attr);
      that.setData({
        itemData: value,
        attrValueList: attr,
        show_attr_value: show,
      });
    },
    toggleModal(value) {
      // console.log('>>>>>> ', value)
      this.setData({
        showModal: !this.data.showModal,
        optype: value || 'addcart'
      })
      console.log('-------------', this.data.optype)
    },

    closeTap:function(){
      this.setData({
        showModal: !this.data.showModal
      })
    },

    //初始化弹窗属性
    initAttributeValue(attrValueList) {
      for (let i = 0; i < attrValueList.length; i++) {
        attrValueList[i].selectedValue = '';
        attrValueList[i].selectedId = -1;
      }
      return attrValueList
    },
    /**选择购物车属性*/
    selectAttrValueTap(evt) {
      let data = evt.currentTarget.dataset;
      let idx = data.idx;
      let id = data.id;
      let value = data.value
      let selectedValue = data.selectedvalue;
      let that = this;
      let {
        attrValueList
      } = that.data;
      if (selectedValue == value) { //取消当前选择
        attrValueList[idx].selectedValue = '';
        attrValueList[idx].selectedId = -1;
      } else { //重新选择
        attrValueList[idx].selectedValue = value;
        attrValueList[idx].selectedId = id;
      }
      let show = that.canFitHaveSelectedAttrValue(attrValueList);
      that.setData({
        attrValueList: attrValueList,
        show_attr_value: show
      })
      that.updateRealItemData();
    },

    //弹窗属性更新
    updateRealItemData() {
      let that = this;
      let guigeValue = that.getAttrValue();
      console.log('----guigevalue ', guigeValue);
      if (guigeValue == '')
        return;

      http.requestUrl({
        url: '/wxapp/product/guige_price',
        data: {
          pid: that.data.itemData.pid,
          buff: guigeValue,
        }
      }).then(res => {
        let real = res.realdata;
        if (JSON.stringify(real) == '[]')
          return;
        let itemData = that.data.itemData;
        itemData['imgUrl'] = (real && (real.thumb != null || real.thumb != '')) ? real.thumb : that.itemData['imgUrl'];
        itemData['price_yj'] = real.price;
        itemData['price'] = (getApp().d.vip >= 3) ? real.price_vip : real.price_yh;
        itemData['stock'] = real.stock;
        that.setData({
          itemData: itemData,
        })
      })
    },
    //确定按钮
    sureCartTap(evt) {
      let that = this;
      let value = that.getAttrValue(true);
      console.log('click 确定购买 =========', that.data.optype, value, that.data.itemData['stock']);
      if (value == '' && that.data.attrValueList.length > 0)
        return;
      let stock = that.data.itemData['stock'];
      if (that.data.buynum > stock) {
        tip.success('库存不足', 1500);
        return;
      }

      if (that.data.optype == 'addcart') {
        http.requestUrl({
          url: '/wxapp/product/add_cart',
          data: {
            uid: app.d.uid,
            pid: that.data.itemData.pid,
            num: that.data.buynum,
            buff: value,
          }
        }).then(res => {
          tip.success('加入购物车成功')
          that.toggleModal();
        })
      } else if (that.data.optype == 'buynow') {
        wx.navigateTo({
          url: '/pages/shop/shop-pay-now/shop-pay-now?pid=' + that.data.itemData.pid + '&buff=' + value + '&buy_num=' + that.data.buynum
        });
      } else if (that.data.optype == 'buyjifen'){        
        wx.navigateTo({
          url: '/pages/community/community-jifen-shop-pay/community-jifen-shop-pay?pid=' + that.data.itemData.pid + '&buff=' + value + '&buy_num=' + that.data.buynum
        });
      }

    },
    getAttrValue(showTip = false) {
      let that = this;
      let value = '';
      for (let i = 0; i < that.data.attrValueList.length; i++) {
        if (that.data.attrValueList[i].selectedId < 0) {
          if (showTip) {
            tip.text('请选择 "' + that.data.attrValueList[i].attr_name + '"', 1500);
          }
          return '';
        }
        value += (that.data.attrValueList[i].selectedId + ",");
      }
      return value;
    },

    //数量更新
    changeNum(evt) {
      setTimeout(() => {
        let that = this;
        let type = evt.currentTarget.dataset.type;
        let num = that.data.buynum;
        num = (type == 0) ? num - 1 : num + 1;
        console.log('-----> num', type, num)
        if (num <= 0)
          return;
        if (num > that.properties.itemData.stock) {
          tip.success('库存不足');
          return;
        }
        that.setData({
          buynum: num
        })
      }, 200)
    },

    /**是否已经选择了购物车属性*/
    canFitHaveSelectedAttrValue(attrValueList) {
      let that = this;
      for (let i = 0; i < attrValueList.length; i++) {
        if (attrValueList[i].selectedId >= 0)
          return true
      }
      return false;
    }
  }
})