import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/lang'
import { storageRead } from '@/libs/util'
Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: storageRead('lang') ? storageRead('lang') : 'vi-VN',
    fallbackLocale: storageRead('lang'),
    messages,
})
export default i18n
