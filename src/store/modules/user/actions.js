import ROOTVUE from '@/main.js'
import { userRegister, userLogin, userForget } from '@/api/user.js'
import { getUserInfo } from '@/api/user.js'
import {getAdjustWebUuid, getChannelData, trackEvent} from "@/libs/channel";

export default {
  /**
   * @return {}
   * @description 退出登录
   */
  handleLoginOut({ state, dispatch, commit }) {
    localStorage.clear()
    let userInfo = JSON.parse(state.userInfo)
    userInfo.token = ''
    userInfo.user = {}
    commit('setUserInfo', JSON.stringify(userInfo))
    ROOTVUE.$store.dispatch('mqtt/MQTT_END')
    ROOTVUE.$router.push({
      name: 'live'
    })
  },
  /**
   * @return {}
   * @description 获取用户信息
   */
  handleGetUserInfo({ state, dispatch, commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          let info = JSON.parse(state.userInfo)
          info.user = Data
          commit('setUserInfo', JSON.stringify(info))
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  },
  /**
   * @return {}
   * @description 用户注册
   */
  handleUserRegister({ state, dispatch, commit }, body) {
    return new Promise((resolve, reject) => {
        body.channel = {
            adjust_web_uuid: getAdjustWebUuid(),
            channel_id: getChannelData().id || 0
        }
      userRegister({ ...body }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
            trackEvent('register')
          let { token } = Data
          commit(
            'setUserInfo',
            JSON.stringify({
              token,
              Data
            })
          )
          resolve(res)
          ROOTVUE.$store.dispatch('app/handleGlobalRequest')
        } else {
          resolve(res)
        }
      })
    })
  },
  /**
   * @return {}
   * @description 重置密码
   */
  handleResetPassword({ state, dispatch, commit }, body) {
    return new Promise((resolve, reject) => {
      userForget({ ...body }).then(res => {
        let { code, data } = res
        if (code === 0) {
          ROOTVUE.$toast.success('密码修改成功，请重新登录', '成功', {
            position: 'topCenter',
            timeout: 1000 * 3,
            balloon: true
          })
          ROOTVUE.$router.push({
            name: 'login'
          })
          resolve(res)
        } else {
          resolve(res)
        }
      })
    })
  },
  /**
   * @return {}
   * @description 用户登录
   */
  handleUserLogin({ state, dispatch, commit }, body) {
    return new Promise((resolve, reject) => {
      userLogin({ ...body }).then(res => {
        let { Code, Data } = res
        if (Code === 200) {
          let { token, user } = Data
          commit(
            'setUserInfo',
            JSON.stringify({
              token,
              user
            })
          )
          resolve(res)
          ROOTVUE.$store.dispatch('app/handleGlobalRequest')
        } else {
          resolve(res)
        }
      })
    })
  }
}
