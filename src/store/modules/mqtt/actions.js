import ROOTVUE from '@/main.js'
// import { storageRead } from "@/libs/util"
import CONFIG from '@/config/config.js'
import mqtt from 'mqtt'

export default {
  /**
   * @return {}
   * @description 打开 mqtt 连接
   */
  MQTT_CONNECT({ state, dispatch, commit }) {
    return new Promise((resolve, reject) => {
      let { URL, USERNAME, PASSWORD } = CONFIG.MQTT[CONFIG.ENV]
      state.mqttTask = mqtt.connect(URL, {
        username: USERNAME,
        password: PASSWORD,
        clientId: ROOTVUE.$store.state.app.clientId,
        keepAlive: 30,
        cleanSession: true,
        clear: true
      })
      state.mqttTask.on('connect', e => {
        console.log('mqtt connect')
        dispatch('MQTT_SUBSCRIBE', 'ole/global')
      })

      // 消息处理
      state.mqttTask.on('message', (topic, message) => {
        let data = new TextDecoder().decode(message)
        data = eval('(' + data + ')')
        if (topic === 'ole/global') {
          let { notice_type } = data
          if (notice_type === 3) {
            let { user_id } = data.data
            let { user } = JSON.parse(ROOTVUE.$store.state.user.userInfo)
            if (user_id === user.id) {
              ROOTVUE.$toast.waring(ROOTVUE.$t(`Code['-400802']`))
              ROOTVUE.$store.dispatch('user/handleLoginOut')
            }
          }
        }
        ROOTVUE.$bus.$emit(topic, data)
      })

      // 断线重连
      state.mqttTask.on('reconnect', error => {
        console.log('mqtt reconnect')
      })

      // 连接失败
      state.mqttTask.on('error', err => {
        console.log('mqtt error', err)
        state.mqttTask.end()
        state.mqttTask = null
      })
      // 关闭
      state.mqttTask.on('end', err => {
        console.log('mqtt end', err)
      })
    })
  },
  /**
   * @return {}
   * @description mqtt 订阅
   */
  MQTT_SUBSCRIBE({ state, dispatch, commit }, subscribe) {
    state.mqttTask &&
      state.mqttTask.subscribe(
        subscribe,
        {
          qos: 2
        },
        res => {
          console.log('mqtt subscribe', subscribe)
        }
      )
  },
  /**
   * @return {}
   * @description 取消 mqtt 订阅
   */
  MQTT_UNSUBSCRIBE({ state, dispatch, commit }, subscribe) {
    state.mqttTask &&
      state.mqttTask.unsubscribe(subscribe, res => {
        console.log('mqtt unsubscribe', subscribe)
      })
  },
  /**
   * @return {}
   * @description 关闭 mqtt 连接
   */

  MQTT_END({ state, dispatch, commit }) {
    dispatch('MQTT_UNSUBSCRIBE', 'ole/global')
    state.mqttTask?.end()
    state.mqttTask = null
  }
}
