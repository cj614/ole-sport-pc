import axios from "@/axios/request"

/**
 * @description 新闻资讯list
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function sportNewList(data) {
  return axios.request({
    url: "/sport_news/list",
    data,
    method: "GET",
  })
}


/**
 * @description 资讯详情
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function sportNewDetail({ id }) {
  return axios.request({
    url: "/sport_news/detail",
    data: { id },
    method: "GET",
  })
}

/**
 * @description 本条资讯所有评论
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function commentSportNews({ id }) {
  return axios.request({
    url: "/sport_news/comment",
    data: { id },
    method: "GET",
  })
}

/**
 * @description 新闻资讯 赛事 list
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function getCompetitionSportNews({ page, limit, column_set_id }) {
  return axios.request({
    url: "/sport_news/competition/list",
    data: { page, limit, column_set_id },
    method: "GET",
  })
}


/**
 * @description 新闻资讯头条list
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function topSportNewList({ page, limit }) {
  return axios.request({
    url: "/sport_news/top/list",
    data: { page, limit },
    method: "GET",
  })
}

// 点赞文章
export async function niceNews({news_id, status}) {
  return axios.request({
      url: "/v2/news/nice_news",
      data: {news_id, status},
      method: "POST",
  });
}
