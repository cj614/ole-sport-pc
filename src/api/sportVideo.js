import axios from "@/axios/request"

/**
 * @description 精彩视频list
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function sportVideoList({ sport_type, page, limit, competition, column_set_id, key_word }) {
  return axios.request({
    url: "/sport_video/list",
    data: { sport_type, page, limit, competition, column_set_id, key_word },
    method: "GET",
  })
}

// 我的收藏
export async function myStoreVideo({limit, page}) {
  return axios.request({
    url: "/v2/video/store_video/list",
    data: {
      limit,
      page
    },
    method: "GET",
  });
}

/**
 * @description 精彩视频详情
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function sportVideoDetail({ id }) {
  return axios.request({
    url: "/sport_video/detail",
    data: { id },
    method: "GET",
  })
}
// 收藏视频
export async function storeVideo({video_id, status}) {
  return axios.request({
    url: "/v2/video/store_video",
    data: {video_id, status},
    method: "POST",
  });
}

// 点赞视频
export async function niceVideo({video_id, status}) {
  return axios.request({
    url: "/v2/video/nice_video",
    data: {video_id, status},
    method: "POST",
  });
}
/**
 * @description 精彩视频 所有评论
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function commentSportVideos({ id }) {
  return axios.request({
    url: "/sport_video/comment",
    data: { id },
    method: "GET",
  })
}

/**
 * @description 精彩视频 赛事 list
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function getCompetitionSportVideos({ page, limit, column_set_id }) {
  return axios.request({
    url: "/sport_video/competition/list",
    data: { page, limit, column_set_id },
    method: "GET",
  })
}


/**
 * @description 精彩视频推荐list
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type
 * }
 * @return {*}
 */
export async function topSportVideoList({ page, limit, id }) {
  return axios.request({
    url: "/sport_video/random/list",
    data: { page, limit, id },
    method: "GET",
  })
}


