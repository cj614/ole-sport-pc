import { set, storage } from '@/store/vuex'

export default {
  setAjaxLoading: set('ajaxLoading'),
  setApptheme: storage('appTheme'),
  setLocalConfig: storage('localConfig'),
  setLocalMenuConfig: set('localMenuConfig'),
  setGlobalConfig: set('globalSetting'),
  setGlobalBannerList: set('globalBannerList'),
  setGlobalAnchorDetail: set('globalAnchorDetail'),
  setMessageCount: set('messageCount'),
  setGiftList: set('giftList')
}
