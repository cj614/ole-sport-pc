import axios from "@/axios/request"

/**
 * @description 去直播-创建直播间-获取房间类型
 * @herder {*} {
 *   Authorization
 * }
 * @return {*}
 */
export async function getCateList() {
  return axios.request({
    url: "/room/cate_list",
    method: "GET",
  })
}

/**
 * @description 去直播-创建直播间-提交
 * @herder {*} {
 *   Authorization
 * }
 * @return {*}
 */
export async function createRoom({ title,
  sport_types_id,
  glive_matches_id,
  img_url,remark }) {
  return axios.request({
    url: "/room/create",
    data: {
      title,
      sport_types_id,
      glive_matches_id,
      status: 0,
      img_url,
      remark
    },
    method: "POST",
  })
}

/**
 * @description 直播间-修改
 * @herder {*} {
 *   Authorization
 * }
 * @return {*}
 */
export async function updateRoom({ title,
  sport_types_id,
  glive_matches_id,
  id,
  status,
  img_url }) {
  return axios.request({
    url: "/room/update",
    data: {
      title,
      sport_types_id,
      glive_matches_id,
      status,
      id,
      img_url
    },
    method: "POST",
  })
}

/**
 * @description 直播间详情&我的直播间详情获取obs 推流地址
 * @herder {*} {
 *   Authorization
 * }
 * @return {*}
 */
export async function getRoomDetail({ id }) {
  return axios.request({
    url: "/room/detail",
    data: {
      id
    },
    method: "GET",
  })
}

/**
 * @description 主播正在直播的直播间详情
 * @herder {*} {
 *   Authorization
 * }
 * @return {*}
 */
export async function getLiveDetail({ id }) {
  return axios.request({
    url: "/room/detail",
    data: {
      id
    },
    method: "GET",
  })
}

export async function getRoomDetailV2(body) {
  return axios.request({
    url: "/v2/live_room/detail",
    data: body,
    method: "POST",
  });
}


/**
 * @description 获取封面
 * @herder {*} {
 *   Authorization
 * }
 * @return {*}
 */
export async function getCoverImg() {
  return axios.request({
    url: "/room/cover",
    data: {},
    method: "GET",
  })
}

/**
 * @description 直播间列表&我的直播间列表
 * @herder {*} {
 *   Authorization
 * }
 * @return {*}
 */
export async function getRoomList({ page, limit, user_id, sport_types_id, glive_matches_id, title, status }) {
  return axios.request({
    url: "/room/get_list",
    data: { page, limit, user_id, sport_types_id, glive_matches_id, title, status },
    method: "GET",
  })
}


