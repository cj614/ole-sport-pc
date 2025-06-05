import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import theme from "./theme";
import "@mdi/font/css/materialdesignicons.css";
import deDE from "vuetify/lib/locale/de";
import enUS from "vuetify/lib/locale/en";
import frFR from "vuetify/lib/locale/fr";
import itIT from "vuetify/lib/locale/it";
import jaJP from "vuetify/lib/locale/ja";
import koKR from "vuetify/lib/locale/ko";
import trTR from "vuetify/lib/locale/tr";
import viVN from "vuetify/lib/locale/vi";
import zhCN from "vuetify/lib/locale/zh-Hans";
import zhTW from "vuetify/lib/locale/zh-Hant";
Vue.use(Vuetify);
export default new Vuetify({
  icons: {
    iconfont: "mdi", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  theme,
  lang: {
    locales: { deDE, enUS, frFR, itIT, jaJP, koKR, trTR, viVN, zhCN, zhTW },
  },
});
