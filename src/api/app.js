import axios from "@/axios/request"
import CONFIG from "@/config/config.js"

/**
 * @description 自适应链接
 * @param {*} {
 *   web_url, // 发起调用的网站地址
 * }
 * @return {*}
 */
export async function adaptationUrl() {
  return axios.request({
    url: "/global/adaptation_url",
    data: {
      web_url:
        CONFIG.ENV === "PRODUCTION"
          ? window.location.origin
          : "https://black.leying.me",
    },
    loading: false,
    method: "GET",
  })
}

/**
 * @description pc app 联系 二维码
 * @param {*} {
 *   web_url, // 发起调用的网站地址
 * }
 * @return {*}
 */
export async function socialAppContact() {
  return axios.request({
    url: "/global/social_app_contact",
    data: {
      web_url:
        CONFIG.ENV === "PRODUCTION"
          ? window.location.origin
          : "https://black.leying.me",
    },
    loading: false,
    method: "GET",
  })
}

/**
 * @description pc 底部栏目
 * @param {*} {
 *   web_url, // 发起调用的网站地址
 * }
 * @return {*}
 */
export async function pcBottomTab() {
  return axios.request({
    url: "/global/pc_bottom_tab",
    data: {
      web_url:
        CONFIG.ENV === "PRODUCTION"
          ? window.location.origin
          : "https://black.leying.me",
    },
    loading: false,
    method: "GET",
  })
}

// 获取渠道配置信息
export async function getChannel(channel_id) {
  return axios.request({
    url: "/v2/channel/detail",
    data: {
      channel_id: channel_id,
    },
    method: "GET",
  });
}

// 获取出入明细
export async function getDepAdd() {
  return axios.request({
      url: "/v2/anchor/deposit_add",
      method: "GET"
  });
}
// 获取客服联系方式
export async function getAppContact() {
  return axios.request({
      url: "/global/social_app_contact",
      data: {
        web_url:
          CONFIG.ENV === "PRODUCTION"
            ? window.location.origin
            : "https://black.leying.me",
      },
      loading: false,
      method: "GET",
  });
}
// 是否开通vip
export async function vipStatus(data) {
  return axios.request({
    url: "/v2/user/is_vip",
    data,
    method: "GET",
  });
}