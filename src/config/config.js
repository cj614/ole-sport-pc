export default {
  /**
   * @description api 请求基础路径
  */
  OtherBillLink: 'https://olevip.com',
  
  API_ROOT_MAP: {
    DEVELOP: window.location.origin,
    PRODUCTION: window.location.origin,
    PREFIX: '/api'
  },
  MQTT: {
    TOPIC: {
      SINGLE_CHAT: "ole/single_chat",
      GROUP_CHAT: "ole/anchor_live_",
      GROUP_CHAT_OFFICIAL: "ole/official_live_",
      GROUP_CHAT_BILL: "ole/official_bill_",
      GROUP_CHAT_PUBLIC: "ole/public_chat",
  },
    DEVELOP: {
      URL: 'wss://mqtt.leying.me/mqtt',
      USERNAME: 'sendMsg',
      PASSWORD: 'daKi!wqDdUIXCD'
    },
    PRODUCTION: {
      URL: 'wss://mqtt.olelivesports.com/mqtt',
      USERNAME: 'getMsg',
      PASSWORD: 'daKi!wqDdUIXCDqaz'
    }
  },
  WS_PREFIX: 'wss://api.huobi.pro/ws',
  /**
   * @description 对应 API_ROOT_MAP
   */
  ENV: 'DEVELOP',
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 应用名称
   */
  APPNAME: 'BACCARAT',
  /**
   * @description 图片前缀地址
   */
  IMAGE_PREFIX_URL: 'static/image',
  LOTTIE_PREFIX_URL: {
    DEVELOP: 'static',
    PRODUCTION: 'static'
  },
  /**
   * @description 接口超时时间
   */
  DEFAULT_REQUEST_TIMEOUT: 20000,
  /**
   * @description:
   * @params {
   *  TYPE // 语言类型 zh-CN 中文
   *  FIELD // API 接口对应语言类型字段
   * }
   */
  LANG_CONFIG: {
    TYPE: ['vi-VN','en-US',  'th-TH', 'id-ID'],
    PREFIX: {
      'vi-VN': 'VN',
      'en-US': 'EN',
      'th-TH': 'TH',
      'id-ID': 'ID',
      
    },
    DAY: {
      'vi-VN': 'vi',
      'en-US': 'en',
      'th-TH': 'th',
      'id-ID': 'id',
     

    },
    SWITCH: false // 更改国际化开关
  }
}
