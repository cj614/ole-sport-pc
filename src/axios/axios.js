import axios from "axios"
import ROOTVUE from "@/main.js"
import CONFIG from "@/config/config.js"
import {getUserIPs} from "@/axios/get_user_ip";

class HttpRequest {
  constructor(baseUrl = '/') {
    this.baseUrl = baseUrl
  }
  async getInsideConfig() {
    let token = JSON.parse(ROOTVUE.$store.state.user.userInfo).token || ""
    let lang = ROOTVUE.$store.state.app.localConfig
      ? JSON.parse(ROOTVUE.$store.state.app.localConfig).prefix
      : ""

    let hashIp = await getUserIPs(); // 等待 getUserIPs 返回值

    let config = {
      baseURL: this.baseUrl,
      timeout: CONFIG.DEFAULT_REQUEST_TIMEOUT,
      showError: true,
      loading: true,
      headers: {
        "Content-Type":
          this.baseUrl.indexOf("/user/upload_head_img") !== -1
            ? "multipart/form-data"
            : "application/json; charset=utf-8",
        "Authorization": `${token}@${hashIp}`,
        "lang": `${lang}`,
      },
    }
    return config
  }
  interceptors(instance, options) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )
    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        let { data, status } = res
        let { Code, Msg } = data
        
        switch (status) {
          case 401:
            ROOTVUE.$store.dispatch("user/handleLoginOut")
            break
          case 200:
            switch (Code) {
              case -400203:
              case 200:
                return data
              default:
                if (Code === -400206 ) {
                  ROOTVUE.$store.dispatch("user/handleLoginOut")
                } else {
                  Msg = ROOTVUE.$t(`Code[${Code.toString()}]`)
                }
                if (options.showError) {
                  if (Msg.includes('Code[')) Msg = data.Msg
                  ROOTVUE.$toast.error(Msg, "Error", {
                    position: "topCenter",
                    timeout: 3000,
                    color: "red",
                    messageSize: '16px',
                  })
                }
                return data
            }
          default:
            if (options.showError) {
              ROOTVUE.$toast.error(Msg, "Error", {
                position: "topCenter",
                timeout: 3000,
                balloon: true,
                color: "red",
                messageSize: '16px',
              })
            }
            return data
        }
      },
      error => {
        if (error.response && error.response.status === 401) {
          // 👉 401 未授权，处理逻辑
          ROOTVUE.$toast.error( ROOTVUE.$t(`Module['登录状态已失效，请登录']`), "Error", {
            position: "topCenter",
            timeout: 3000,
            color: "red",
            messageSize: '16px',
          })
    
          return Promise.reject(error)
        }
    
        // 其他错误继续抛出
        return Promise.reject(error)
      }
    )
    
  }
  async request(options) {
    const instance = axios.create()
    const config = await this.getInsideConfig();

    options = Object.assign(config, options)
    if (options.method.toLocaleLowerCase() === "get") {
      options.params = options.data
    }
    this.interceptors(instance, options)
    return instance(options)
  }
}
export default HttpRequest
