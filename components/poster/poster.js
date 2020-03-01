module.exports = {
  getDrawCanvasData: function (detail) {
    let data = {};
    data = {
      canvasData: {
        top: 150,
        left: 142,
        width: 468,
        height: 742,
        comment: '画布大小'
      },
      content: [{
        type: 'image-local',
        url: '/images/backbg.png',
        top: 0,
        left: 0,
        shape: 'square',
        width: 468,
        height: 742,
        comment: ''
      }]
    }
    let name = detail.name;
    if (name != '') {
      data.content.push({
        type: 'text',
        content: name,
        top: 536,
        left: 34,
        fontSize: 32,
        lineHeight: 32,
        color: '#3A3A3A',
        textAlign: 'left',
        weight: 'bold',
        maxWidth: 400,
        lineMax: 1,
      })
    }

    data.content.push({
      type: 'text',
      content: '柒筑创意家居',
      top: 97,
      left: 170,
      fontSize: 24,
      lineHeight: 24,
      color: '#747474',
      textAlign: 'left',
      weight: '400',
      maxWidth: 400,
      lineMax: 1,
    })

    let price = detail.price;
    if (price != '') {
      data.content.push({
        type: 'text',
        content: '￥' + price,
        top: 586,
        left: 34,
        fontSize: 28,
        lineHeight: 28,
        color: '#ff3b30',
        textAlign: 'left',
        weight: '400',
        maxWidth: 400,
        lineMax: 1,
      });
      // console.log('-------- price', price.length)

      let yj = detail.price_yj||'';
      if (yj != '') {
        let len = (price.length + 1) * 15 + 44;
        data.content.push({
          type: 'text',
          content: '￥' + yj,
          top: 586,
          left: len,
          fontSize: 20,
          lineHeight: 20,
          color: '#cccccc',
          textAlign: 'left',
          weight: '400',
          maxWidth: 400,
          lineMax: 1,
        });
        let len2 = yj.length * 15 + len;
        data.content.push({
          type: 'line',
          x1: len,
          y1: 580,
          x2: len2,
          y2: 580,
          color: '#cccccc'
        })
      }
    }


    let business = detail.desc;
    if (business != '') {
      data.content.push({
        type: 'text',
        content: business,
        top: 630,
        left: 34,
        fontSize: 26,
        lineHeight: 32,
        color: '#999999',
        textAlign: 'left',
        weight: '400',
        maxWidth: 250,
        lineMax: 3,
      })
    }

    let thumb = detail.photo;
    if (thumb != '') {
      data.content.push({
        type: 'image',
        url: thumb,
        top: 104,
        left: 74,
        shape: 'square',
        width: 320,
        height: 320,
        comment: ''
      })
    }
    // data.content.push({
    //   type: 'image-local',
    //   url: '/images/logo.png',
    //   top: 64,
    //   left: 140,
    //   shape: 'square',
    //   width: 44,
    //   height: 44,
    //   comment: ''
    // })

    data.content.push({
      type: 'text',
      content: '长按识别小程序码',
      top: 688,
      left: 318,
      fontSize: 14,
      lineHeight: 14,
      color: '#999999',
      textAlign: 'left',
      weight: '400',
      maxWidth: 250,
      lineMax: 3,
    })

    if(detail.code!=''){
      data.content.push({
        type: 'image',
        url: detail.code,
        top: 550,
        left: 314,
        shape: 'square',
        width: 120,
        height: 120,
        comment: ''
      })
    }
    return data;
  }
}