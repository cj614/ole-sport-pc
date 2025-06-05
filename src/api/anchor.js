import axios from "@/axios/request"

/**
 * @description 认证提交
 * @herder {*} {
 *   Authorization
 * }
 * @params{
    email:''
    info:''
    code:''
 * }
 * @return {*}
 */
export async function createAnchor({ email, info, code }) {
  return axios.request({
    url: "/anchor/create",
    data: { email, info, code },
    method: "POST",
  })
}

/**
 * @description 认证详情
 * @herder {*} {
 *   Authorization
 * }
 * @params{
 * }
 * @return {*}
 */
export async function getAnchorDetail() {
  return axios.request({
    url: "/anchor/detail",
    method: "GET",
  })
}

/**
 * @description 认证修改
 * @herder {*} {
 *   Authorization
 * }
 * @params{
    email:''
    info:''
    code:''
 * }
 * @return {*}
 */
export async function updateAnchor({ email, info, code }) {
  return axios.request({
    url: "/anchor/update",
    data: { email, info, code },
    method: "POST",
  })
}

/**
 * @description 主播赛程计划
 * @herder {*} {
 *   Authorization
 * }
 * @params{
    email:''
    info:''
    code:''
 * }
 * @return {*}
 */
export async function anchorSchedule({ anchor_user_id, start, end }) {
  return axios.request({
    url: "/anchor/schedule",
    data: { anchor_user_id, start, end },
    method: "POST",
  })
}