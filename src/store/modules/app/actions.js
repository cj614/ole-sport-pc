import CONFIG from '@/config/config'
import Vue from 'vue'

import { globalSetting, globalBannerList, globalBannerType } from '@/api/global'
import { getAnchorDetail } from '@/api/anchor'
import { noReadNoticeCount } from '@/api/user'
import { adaptationUrl } from '@/api/app'

import theme from '@/ui/theme.js'
import imgList from '@/libs/imgList'
import lottieList from '@/libs/lottieList'
import { giftList } from '@/api/chat.js'
import { Parser, DB } from 'svga'

let ROOTVUE = ''

export default {
  /**
   * 当前主播认证
   */
  handleAnchorDetail({ commit }) {
    return new Promise((resolve, reject) => {
      getAnchorDetail()
        .then(res => {
          let { Code, Data } = res
          if (Code === 200) {
            const { data } = Data
            commit('setGlobalAnchorDetail', data)
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch(r => reject(r))
    })
  },

  /**
   * @return {}
   * @description 获取礼物
   */
  handleChatGiftList({ state, dispatch, commit }) {
    giftList().then(res => {
      let { Code, Data } = res
      if (Code === 200) {
        let { list } = Data
        ROOTVUE.$store.commit('app/setGiftList', list)
        list.forEach(async item => {
          let { animate_file } = item
          if (animate_file.indexOf('.svga') !== -1) {
            const db = new DB()
            let svga = await db.find(animate_file)
            if (!svga) {
              const parser = new Parser({ isDisableImageBitmapShim: true })
              svga = await parser.load(animate_file)
              await db.insert(animate_file, svga)
              parser.destroy()
            }
          }
        })
      }
    })
  },

  /***
   *
   * 当前用户通知数
   *
   */
  handleMessageCount({ commit }) {
    return new Promise((resolve, reject) => {
      noReadNoticeCount()
        .then(res => {
          let { Code, Data } = res
          if (Code === 200) {
            const { count } = Data
            commit('setMessageCount', count)
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch(r => reject(r))
    })
  },

  /**
   * @return {}
   * @description 全局配置项
   */
  handleGlobalSettingConfig({ commit }) {
    return new Promise((resolve, reject) => {
      globalSetting()
        .then(res => {
          let { Code, Data } = res
          if (Code === 200) {
            commit('setGlobalConfig', Data)
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch(r => reject(r))
    })
  },

  globalBannerListByTypeName(object, typeName) {
    return new Promise((resolve, reject) => {
      globalBannerList({ type_name: typeName })
        .then(res => {
          let { Code, Data } = res
          if (Code === 200) {
            resolve(Data)
          } else {
            resolve(false)
          }
        })
        .catch(r => reject(r))
    })
  },

  handleGlobalBannerType({ commit }) {
    return new Promise((resolve, reject) => {
      globalBannerType()
        .then(res => {
          let { Code, Data } = res
          if (Code === 200) {
            ROOTVUE.$store.dispatch('app/handleGlobalBannerList', Data)
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch(r => reject(r))
    })
  },

  /**
   * @return {}
   * @description 全部的Banner
   */
  handleGlobalBannerList({ commit }) {
    return new Promise((resolve, reject) => {
      globalBannerList()
        .then(res => {
          let { Code, Data } = res
          if (Code === 200) {
            commit('setGlobalBannerList', Data)
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch(r => reject(r))
    })
  },

  /**
   * @return {}
   * @description 全局接口请求
   */
  handleGlobalRequest() {
    if (!ROOTVUE.$store.state.app.localMenuConfig.length) {
      ROOTVUE.$store.dispatch('app/handleSetLocal', { lang: '' })
    }

    let token = JSON.parse(ROOTVUE.$store.state.user.userInfo).token || ''
    if (token) {
      ROOTVUE.$store.dispatch('user/handleGetUserInfo')
      ROOTVUE.$store.dispatch('app/handleAnchorDetail')
      ROOTVUE.$store.dispatch('app/handleMessageCount')
      ROOTVUE.$store.dispatch('app/handleChatGiftList')
    }
    // ROOTVUE.$store.dispatch('app/handleGlobalAdaptation') 业务需求需要注释
    ROOTVUE.$store.dispatch('mqtt/MQTT_CONNECT')
    ROOTVUE.$store.dispatch('app/handleGlobalSettingConfig')
    // ROOTVUE.$store.dispatch("app/handleGlobalBannerType")
  },

  /**
* @return {}
* @description 自适应
*/
  handleGlobalAdaptation() {
    adaptationUrl().then((res) => {
      let { Code, Data } = res
      if (Code === 200) {
        let { h5_url } = Data
        let width = window.innerWidth
        if (width < 960) {
          location.href = `${h5_url}`
        }
        window.addEventListener("resize", () => {
          let width = window.innerWidth
          if (width < 960) {
            location.href = `${h5_url}`
          }
        })
      }
    })
  },

  /**
   * @return {}
   * @description 设置全局主题
   */
  handleSetAppTheme({ state, dispatch, commit }, { appTheme = '', root }) {
    if (root) {
      ROOTVUE = root
    }
    appTheme = appTheme || state.appTheme
    commit('setApptheme', appTheme)
    let { themes } = theme
    Vue.prototype.$color = theme[`${appTheme}`]
    Vue.prototype.$img = imgList
    Vue.prototype.$lottie = lottieList
  },
  /**
   * @return {}
   * @description 设置国际化菜单
   */
  handleSetLocalMenu({ state, dispatch, commit }) {
    let { Lang } = ROOTVUE.$img.Icon
    let { TYPE, PREFIX } = CONFIG.LANG_CONFIG
    let localConfigMenuArr = []
    localConfigMenuArr = TYPE.map(item => {
      return {
        name: ROOTVUE.$t(`Lang.${item}`),
        lang: item,
        prefix: PREFIX[item],
        icon: Lang[item.split('-').join('')]
      }
    })
    commit('setLocalMenuConfig', localConfigMenuArr)
    let localInfo = JSON.parse(state.localConfig)
    localInfo = localConfigMenuArr.filter(item => {
      return item.lang === localInfo.lang
    })[0]
    commit('setLocalConfig', JSON.stringify(localInfo))
  },
  /**
   * @return {}
   * @description 设置国际化
   */
  handleSetLocal({ state, dispatch, commit }, { lang }) {
    let { TYPE } = CONFIG.LANG_CONFIG
    let localConfig = state.localConfig ? JSON.parse(state.localConfig) : ''
    let localInfo = {}
    if (lang) {
      localInfo.lang = lang
    } else {
      if (localConfig) {
        localInfo.lang = localConfig.lang
      } else {
        let language = navigator.language
        let languageShow = TYPE.indexOf(language)
        if (languageShow !== -1) {
          localInfo.lang = language
        } else {
          localInfo.lang = 'vi-VN'
        }
      }
    }
    ROOTVUE.$i18n.locale = localInfo.lang
    ROOTVUE.$vuetify.lang.current = localInfo.lang.split('-').join('')
    commit('setLocalConfig', JSON.stringify(localInfo))
    ROOTVUE.$store.dispatch('app/handleSetLocalMenu')
  }
}
