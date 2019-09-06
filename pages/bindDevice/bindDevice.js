// pages/bindDevice/bindDevice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devEui: '',
    nodeID: '',
    password: '',
    dataList: [],
    dataListNative: [],
    spanList: [
      { val: '' },
      { val: '' },
      { val: '' },
      { val: '' },
      { val: '' },
      { val: '' },
    ],
    closeHidden1: true,
    closeHidden2: true,
    scanHidden1: false,
    scanHidden2: false,
    passwordLayout: false,
    autoFocus: false,
    allowPass: false, // 控制pass阈值
    timer: '',
    nodeIDFocus: false,
    nodeIDFocusClass: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.getDeviceInfo('8cf957200000dec4')

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 关闭定时器
    clearInterval(this.data.timer)
    this.setData({
      timer: ''
    })
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 关闭定时器
    clearInterval(this.data.timer)
    this.setData({
      timer: ''
    })
    console.log('onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 开启定时器
  setTimer() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
      this.setData({
        timer: ''
      })
    }
    
    this.getDeviceInfo(this.data.devEui)
    this.data.timer = setInterval(() => {
      this.getDeviceInfo(this.data.devEui)
    }, 2000)
  },
  
  // 获取设备详情
  getDeviceInfo(id) {
    const app = getApp() // 获取全局实例
    this.setData({
      nodeIDFocusClass: false,
      allowPass: false
    })

    wx.request({
      url: `${app.globalData.URL}/puffer/v1/devInfo/${id}?acc=unitadmin==`,
      success: res => {
        console.log('设备详情', res)
        if (res.data.code != 200) {
          wx.showToast({
            title: '设备不存在',
            image: '../../assets/images/error.png'
          })
          this.setData({
            allowPass: false
          })
          // 关闭定时器
          clearInterval(this.data.timer)
          this.data.timer = ''
          return
        }

        if (res.data.code == 200 && res.data.data == null) {
          wx.showToast({
            title: '设备暂无数据',
            image: '../../assets/images/error.png'
          })
          this.setData({
            allowPass: true,
            dataList: [],
            dataListNative: []
          })
          return
        }

        this.setData({
          allowPass: true
        })
        let dataListTemp = []
        res.data.data.datas.forEach((item, i) => {
          let tempObj = {
            val: item.toFixed(2),
            unit: res.data.data.unit
          }
          dataListTemp.push(tempObj)
        })
        if (res.data.data.datas1 !== undefined) {
          res.data.data.datas1.forEach((item, i) => {
            dataListTemp[i].val1 = item.toFixed(2)
            dataListTemp[i].unit1 = res.data.data.unit1
          })
        }
        // 信号强度
        dataListTemp.push({
          rssi: res.data.data.rssi
        })
        if (res.data.data.rssi1 !== undefined) {
          dataListTemp[5].rssi1 = res.data.data.rssi1
        }

        console.log('dataListTemp详情', dataListTemp)

        this.setData({
          dataListNative: res.data.data,
          dataList: dataListTemp
        })
      }
    })
  },

  // 双向绑定devEui
  setDevEui(e) {
    this.setData({
      devEui: e.detail.value
    })
    if (this.data.devEui !== '') {
      this.setData({
        closeHidden1: false,
        scanHidden1: true
      })
    } else {
      this.setData({
        closeHidden1: true,
        scanHidden1: false
      })
    }
  },

  // 双向绑定nodeID
  setNodeID(e) {
    this.setData({
      nodeID: e.detail.value
    })
    if (this.data.nodeID !== '') {

      this.setData({
        closeHidden2: false,
        scanHidden2: true
      })

    } else {
      this.setData({
        closeHidden2: true,
        scanHidden2: false
      })
    }
  },

  // devEui失去焦点
  devEuiInput() {
    setTimeout(() => {
      this.setData({
        closeHidden1: true,
        scanHidden1: false
      })
    }, 100)
  },

  // nodeID失去焦点
  nodeIDInput() {
    setTimeout(() => {
      this.setData({
        closeHidden2: true,
        scanHidden2: false
      })
    }, 100)
  },

  // 清空input值
  clearVal(e) {
    var name = e.currentTarget.dataset['valname']
    var closename = e.currentTarget.dataset['closename']
    // 中括号动态设置元素
    this.setData({
      [name]: '',
      [closename]: false
    })
  },

  // 关闭弹窗
  closeLayout() {
    let spanListBlank = [
      { val: '' },
      { val: '' },
      { val: '' },
      { val: '' },
      { val: '' },
      { val: '' }
    ]
    this.setData({
      password: '',
      spanList: spanListBlank,
      autoFocus: false,
      passwordLayout: false
    })
  },

  // 分割密码框字符，提交密码
  passwordChart(e) {
    const app = getApp()
    let spanListBlank = [
      {val: ''},
      {val: ''},
      {val: ''},
      {val: ''},
      {val: ''},
      {val: ''}
    ]
    this.setData({
      spanList: spanListBlank,
      password: e.detail.value
    })

    if (this.data.password.length <= 0) return

    if (this.data.password.length == 6) {
      console.log('发送密码', this.data.password)
      let password = this.data.password.substring(0, 6)
      let param = {
        "devEui": this.data.devEui,
        "devSn": this.data.nodeID,
        "devModel": this.data.dataListNative.devModel,
        "devName": this.data.dataListNative.devName,
        "manId": this.data.dataListNative.manId,
        "password": password,
        "acc": "unitadmin=="
      }

      this.closeLayout()

      wx.request({
        url: `${app.globalData.URL}/puffer/unit/v1/factory/device`,
        method: 'POST',
        data: param,
        success: res => {
          console.log('提交密码', res)
          switch (res.data.code) {
            case 200:
              wx.showToast({
                title: '绑定成功',
                icon: 'success'
              })
              break;
            case 40004001:
              wx.showToast({
                title: '设备不存在',
                image: '../../assets/images/error.png'
              })
              break;
            case 40004007:
              wx.showToast({
                title: '设备已绑定',
                image: '../../assets/images/error.png'
              })
              break;
            case 40004020:
              wx.showToast({
                title: '设备SN已绑定',
                image: '../../assets/images/error.png'
              })
              break;
            case 40001015:
              wx.showToast({
                title: '密码错误',
                image: '../../assets/images/error.png'
              })
              break;
            default:
              wx.showToast({
                title: '未知错误',
                image: '../../assets/images/error.png'
              })
          }
        
        }
        
      })

    }

    for (var i = 0; i < this.data.password.length; i++) {
      var val = 'spanList['+ i +'].val'
      this.setData({
        [val]: this.data.password.charAt(i)
      })
    }

  },

  // 重置
  reset() {
    // 关闭定时器
    clearInterval(this.data.timer)
    this.setData({
      devEui: '',
      nodeID: '',
      closeHidden1: true,
      scanHidden1: false,
      closeHidden2: true,
      scanHidden2: false,
      autoFocus: false,
      nodeIDFocus: false,
      nodeIDFocusClass: false,
      allowPass: false,
      dataListNative: [],
      dataList: [],
      timer: ''
    })
  },

  // 重新聚焦（用于密码框失焦）
  reFocus() {
    this.setData({
      autoFocus: true,
    })
  },

  // 扫一扫
  scanCode(e) {
    // 传值获取需要更改的data值
    let name = e.currentTarget.dataset['valname']
    wx.scanCode({
      scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
      success: res => {
        console.log('扫码成功', res)
        wx.showToast({
          title: '扫码成功',
          icon: 'success'
        })
        this.setData({
          [name]: res.result
        })
      }
    })
  },

  // 提交
  // PASS，如果已绑定，则弹出密码框
  submit() {
    const app = getApp()
    if (!this.data.allowPass) {
      wx.showToast({
        title: '请先查询',
        image: '../../assets/images/error.png'
      })
      this.setData({
        nodeIDFocus: true,
        nodeIDFocusClass: true,
      })
      return
    }
    let param = {
      "devEui": this.data.devEui,
      "devSn": this.data.nodeID,
      "devModel": this.data.dataListNative.devModel,
      "devName": this.data.dataListNative.devName,
      "manId": this.data.dataListNative.manId,
      "acc": "unitadmin=="
    }
    console.log('param', param)
    wx.request({
      url: `${app.globalData.URL}/puffer/unit/v1/factory/device`,
      method: 'POST',
      data: param,
      success: res => {
        console.log('pass', res)
        // 若绑定不成功，则弹出密码框
        if (res.data.code == 200) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success'
          })
        } 
        else {
          this.setData({
            password: '',
            passwordLayout: true,
            autoFocus: true
          })
        }
      }
    })


  },

})