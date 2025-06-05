import { storageRead } from '@/libs/util'
import { v4 as uuidv4 } from 'uuid'
// import ROOTVUE from "@/main.js"

export default {
  ajaxLoading: false,
  appTheme: storageRead('appTheme') || 'dark',
  // 国际化配置
  localConfig: storageRead('localConfig'),
  // 多语言配置菜单
  localMenuConfig: [],

  globalSetting: {},
  globalBannerList: [],

  globalAnchorDetail: {},
  clientId: uuidv4(),
  // 礼物列表
  giftList: [],

  messageCount: 0,
  //通知数量

  // 赛事 tag
  matchTagList: [
    // {
    //   id: 0,
    //   type: 'ANCHOR',
    //   text: '主播'
    // },
    {
      id: 8,
      type: 'FOOTBALL',
      text: '足球'
    },
    {
      id: 3,
      type: 'BASKETBALL',
      text: '篮球'
    },
    // {
    //   id: 7,
    //   type: 'ESPORTS',
    //   text: '电子竞技'
    // },
    // {
    //   id: 15,
    //   type: 'BADMINTON',
    //   text: '羽毛球'
    // },
    // {
    //   id: 14,
    //   type: 'VOLLEYBALL',
    //   text: '排球'
    // },
    // {
    //   id: 12,
    //   type: 'TABLETENNIS',
    //   text: '乒乓球'
    // },

    // {
    //   id: 13,
    //   type: 'TENNIS',
    //   text: '网球'
    // },
    // {
    //   id: 4,
    //   type: 'BOXING',
    //   text: '泰拳'
    // },
    // {
    //   id: 5,
    //   type: 'CRICKET',
    //   text: '板球'
    // },
    // {
    //   id: 18,
    //   type: 'MMA',
    //   text: '综合格斗'
    // },
    // {
    //   id: 11,
    //   type: 'SNOOKER',
    //   text: '斯诺克'
    // },

    // {
    //   id: 19,
    //   type: 'FUTSAL',
    //   text: '五人制足球'
    // },
    // {
    //   id: 17,
    //   type: 'FIELDHOCKEY',
    //   text: '曲棍球'
    // },
    // {
    //   id: 16,
    //   type: 'GOLF',
    //   text: '高尔夫'
    // },
    // {
    //   id: 2,
    //   type: 'BASEBALL',
    //   text: '棒球'
    // },

    // {
    //   id: 10,
    //   type: 'RUGBY',
    //   text: '橄榄球'
    // },

    // {
    //   id: 9,
    //   type: 'ICEHOCKEY',
    //   text: '冰球'
    // },

    // {
    //   id: 6,
    //   type: 'EFOOTBALL',
    //   text: '电子足球'
    // },
    // {
    //   id: 20,
    //   type: 'EBASKETBALL',
    //   text: '电子篮球'
    // }
  ],
  // 事件 tag
  incidentsList: [
    {
      id: 1,
      type: 'Goal',
      width: '24rpx',
      height: '24rpx'
    },
    {
      id: 17,
      type: 'OwnGoal',
      width: '24rpx',
      height: '24rpx'
    },
    {
      id: 8,
      type: 'Penalty',
      width: '24rpx',
      height: '24rpx'
    },
    {
      id: 29,
      type: 'Penalty',
      width: '24rpx',
      height: '24rpx',
      hide: true
    },
    {
      id: 16,
      type: 'MissedPenalty',
      width: '24rpx',
      height: '24rpx'
    },
    {
      id: 30,
      type: 'MissedPenalty',
      width: '24rpx',
      height: '24rpx',
      hide: true
    },
    {
      id: 18,
      type: 'Assist',
      width: '24rpx',
      height: '24rpx'
    },
    {
      id: 3,
      type: 'YellowCard',
      width: '24rpx',
      height: '24rpx'
    },
    {
      id: 4,
      type: 'RedCard',
      width: '24rpx',
      height: '24rpx'
    },
    {
      id: 15,
      type: 'SecondYellowCard',
      width: '24rpx',
      height: '24rpx'
    },
    {
      id: 9,
      type: 'Substitution',
      width: '48rpx',
      height: '24rpx'
    },
    {
      id: 28,
      type: 'VAR',
      width: '24rpx',
      height: '24rpx'
    }
  ]
}
