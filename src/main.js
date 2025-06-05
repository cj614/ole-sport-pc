import Vue from "vue"
import App from "./App.vue"
import "windi.css"
import "./components"
import "@/style/common.scss"
import router from "./router"
import store from "./store"
import CONFIG from "@/config/config.js"
import i18n from "@/il8n"
import vuetify from "@/ui/vuetify"
import dayjs from "dayjs"
import imgList from "@/libs/imgList"
import lottieList from "@/libs/lottieList"
import VueClipboard from "vue-clipboard2"
import VueSocialSharing from "@/components/page/vue-social-sharing/vue-social-sharing.js"

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(VueSocialSharing, {
  networks: {},
})
Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.prototype.$img = imgList
Vue.prototype.$date = dayjs
Vue.prototype.$config = CONFIG
Vue.prototype.$lottie = lottieList
import VueIziToast from "vue-izitoast"
import "izitoast/dist/css/iziToast.min.css"
Vue.use(VueIziToast)
import fullscreen from "vue-fullscreen"
Vue.use(fullscreen)

const ROOTVUE = new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this
  },
}).$mount("#app")
export default ROOTVUE
