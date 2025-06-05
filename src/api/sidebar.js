import axios from "@/axios/request"

/**
 * @description 联系我们
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  "first_name": "acm", //名字
"last_name": "zou", //姓
"mobile": "123234123", //手机号
"email": "1232@qq.com", //邮箱
"content": "app is nice" //内容
 * }
 * @return {*}
 */
export async function submitContact({ first_name, last_name, mobile, email, content }) {
  return axios.request({
    url: "/contact",
    data: { first_name, last_name, mobile, email, content },
    method: "POST",
  })
}


/**
 * @description 活动list
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function getActivityList({ status, page, limit }) {
  return axios.request({
    url: "/activity/list",
    data: { status, page, limit },
    method: "GET",
  })
}

/**
 * @description 直播联赛list
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function getSubscribe({ page, limit }) {
  return axios.request({
    url: "/sub/my_subscribe",
    data: { page, limit },
    method: "GET",
  })
}