import axios from "@/axios/request"

/**
 * @description 每日赛事比分
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function matchDairyList({ sport_type, page, limit, status, start, end, competition_id, key_word }) {
  return axios.request({
    url: "/match/dairy",
    data: { sport_type, page, limit, status, start, end, competition_id, key_word },
    method: "GET",
  })
}


/**
 * @description 赛事比分-赛事接口
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function matchCompetitionList({ sport_type, page, limit, status, start, end }) {
  return axios.request({
    url: "/match/competition",
    data: { sport_type, page, limit, status, start, end },
    method: "GET",
  })
}

/**
 * @description 每日赛事比分简版
 * @param {*} {
 *   page, // 页数
 *   limit, // 页量
 *   sport_type, //
 *   status, // 0 全部；1:直播中，2：未开赛；3：结束
 *   start, // 开始时间
 *   end, // 结束时间
 * }
 * @return {*}
 */
export async function everySimpleMatchScore(data) {
  return axios.request({
    url: "/match/dairy/simple",
    data,
    method: "GET",
  })
}

/**
 * @description 赛事比分主播数据
 * @param {*} {
 *   id, // 赛事 id
 *   sport_type, //
 * }
 * @return {*}
 */
export async function matchAnchor(data) {
  return axios.request({
    url: "/match/anchor",
    data,
    method: "POST",
  })
}

/**
 * @description 赛事比分赔率数据
 * @param {*} {
 *   id, // 赛事 id
 *   sport_type, //
 * }
 * @return {*}
 */
export async function matchMarket(data) {
  return axios.request({
    url: "/match/market",
    data,
    method: "POST"
  })
}


/**
 * @description 每日赛事比分-简版-计数
 * @param {*} {
 *   id, // 赛事 id
 *   sport_type, //
 * }
 * @return {*}
 */
export async function matchDairySimpleCount(data) {
  return axios.request({
    url: "/match/dairy/simple/count",
    data,
    method: "GET"
  })
}

export async function matchFocus(data) {
  return axios.request({
    url: "/v2/match/focus",
    data:data,
    method: "POST",
  });
}