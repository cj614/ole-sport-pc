import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'
import { storageRead, scrollToTop } from '@/libs/util'

import CONFIG from '@/config/config.js'
const { homeName } = CONFIG

import routes from './router'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  routes,
  mode: 'hash'
})

let whiteList = [
  homeName,
  'homeMore',
  'homeSearch',
  'privacyPolicy',
  'contactUs',
  'aboutUs',
  'userAgreement',
  'live',
  'chatRoom',
  'video',
  'videoDetails',
  'matchScore',
  'anchorRoom',
  // 'sportNews',
  // 'sportNewsDetails',
  // 'sportVideo',
  // 'sportVideoDetails',
  'activity',
  'activityDetail',
  'App'
]

router.beforeEach((to, from, next) => {
  if (to.name === 'main') {
    next({
      name: homeName
    })
  } else if (whiteList.indexOf(to.name) !== -1) {
    next()
  } else {
    let userInfo = storageRead('userInfo')
    let token = userInfo ? JSON.parse(userInfo).token : ''
    if (!token) {
      router.push({
        name: homeName
      })
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  scrollToTop()
})

export default router
