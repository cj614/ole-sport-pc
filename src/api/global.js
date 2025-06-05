import axios from "@/axios/request"
import CONFIG from "@/config/config.js"
/**
 * @description 发送邮件验证码
 * @herder {*} {
 *   lang, // 邮件
 * }
 * @return {*}
 */
export async function getMobileCountryCodeList() {
  return axios.request({
    url: "/global/mobile_country_code",
    method: "GET",
  })
}

/**
 * @description 新闻、视频 栏目
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function getColumnList(data) {
  return axios.request({
    url: "/global/column_set",
    data,
    method: "GET",
  })
}

///global/home_notice
/**
 * @description 首页 跑马灯公告
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function getHomeNotice() {
  return axios.request({
    url: "/global/home_notice",
    data: {},
    method: "GET",
  })
}

/**
 * @description 聊天室公告
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function getChatNotice() {
  return axios.request({
    url: "/global/chat_notice",
    data: {},
    method: "GET",
  })
}

/**
 * @description 首页下载
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function homeDownLoad() {
  return axios.request({
    url: "/global/home_download",
    data: {
      web_url:window.location.origin,
    },
    method: "GET",
  })
}

/**
 * @description 配置项-分享链接
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function globalSetting() {
  return axios.request({
    url: "/global/setting",
    data: {},
    method: "GET",
  })
}

/**
 * @description banner swiper list
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function globalBannerType() {
  return axios.request({
    url: "/global/banner_type",
    data: {},
    method: "GET",
  })
}


/**
 * @description banner swiper list
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
//, web_url: window.location.origin 'https://test-pc.leying.me' || 
export async function globalBannerList({ type_name }) {
  return axios.request({
    url: "/global/banner/swiper_list",
    data: { type_name, web_url: window.location.origin },
    // data: { type_name, web_url: 'https://test-pc.leying.me' },
    method: "GET",
  })
}

/**
 * @description 上传图片
 * @herder {*} {
 *   Authorization
 * }
 * @return {*}
 */
export async function postImg(formData) {
  return axios.request({
    url: "/post_img",
    data: formData,
    method: "POST",
  })
}

/**
 * @description 首页热门主播
 * @herder {*} {
 *   Authorization
 * }
 * @return {*}
 */
export async function hotAnchorList({ key_word }) {
  return axios.request({
    url: "/global/anchor",
    data: { key_word },
    method: "GET",
  })
}

/**
 * @description 配置项-分享链接
 * @herder {*} {
 *   Authorization
 * }
 * @return {*}
 */
export async function setting() {
  return axios.request({
    url: "/global/setting",
    data: {},
    method: "GET",
  })
}