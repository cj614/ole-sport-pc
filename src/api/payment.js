import axios from "@/axios/request"

/**
 * @description 获取支付通道
 * @param {*} {
 * }
 * @return {*}
 */
export async function paymentChannel() {
  return axios.request({
    url: "/payment/channel",
    data: {},
    method: "GET",
  })
}

/**
 * @description 充值下单
 * @param {*} {
 * }
 * @return {*}
 */
export async function paymentPay({ pay_channel_id, pay_amount, pay_code, pay_address, rela_name, img_url, phone }) {
  return axios.request({
    url: "/payment/pay",
    data: {
      pay_channel_id, pay_amount, pay_code, pay_address, rela_name, img_url, phone
    },
    method: "POST",
  })
}

/**
 * @description 充值历史记录
 * @param {*} {
 * }
 * @return {*}
 */
export async function payOrdersList({ page, limit }) {
  return axios.request({
    url: "/payment/pay_orders",
    data: {
      page, limit
    },
    method: "GET",
  })
}

/**
 * @description 打赏明细
 * @param {*} {
 * }
 * @return {*}
 */
export async function chatGiftsOrderDetail({ page, limit }) {
  return axios.request({
    url: "chatGiftsOrder/fromList",
    data: {
      page, limit
    },
    method: "GET",
  })
}

/**
 * @description 打赏记录
 * @param {*} {
 * }
 * @return {*}
 */
export async function getChatGiftsOrder({ page, limit }) {
  return axios.request({
    url: "/chatGiftsOrder/getList",
    data: {
      page, limit
    },
    method: "GET",
  })
}