import axios from "@/axios/request"

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
export async function getCompetitionListBySportType({ sport_type, page, limit }) {
  return axios.request({
    url: "/live/match_competition_list",
    data: { sport_type, page, limit },
    method: "GET",
  })
}
// 主播列表
export async function liveUserList(data) {
  return axios.request({
    url: "/v2/anchor/list",
    data,
    method: "GET",
  });
}

// 关注主播
export async function liveFollow({ to_user_id,status }) {
  return axios.request({
    url: "/v2/user/follow",
    data: {
      to_user_id,
      status
    },
    method: "POST",
  });
}

/**
 * @description 现在直播视频list
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * @param {*} {
 *  sport_type 賽事類型
 *  page 页码，从1开始
 *  limit 每页条数
 *  competition 直播联赛list 获取的数据 league 字段
 * }
 * @return {*}
 */
export async function getMatchLiveListPage({ sport_type, page, limit, competition, key_word }) {
  return axios.request({
    url: "/live/match_list",
    data: { sport_type, page, limit, competition, key_word },
    method: "GET",
  })
}


/**
 * @description 主播选择的直播源
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * http://127.0.0.1:20301/live/glive_match?page=&limit=&start=1722528000&end=1722614399&sport_type=
 * @param {*} {
 *  sport_type 賽事類型
 *  page 页码，从1开始
 *  limit 每页条数
 *  competition 直播联赛list 获取的数据 league 字段
 * }
 * @return {*}
 */
export async function getLiveMatchList({ start, end, page, limit, sport_type }) {
  return axios.request({
    url: "/live/glive_match",
    data: { start, end, page, limit, sport_type },
    method: "GET",
  })
}

/**
 * @description 明日比赛list 用于订阅
 * @herder {*} {
 *   Authorization 不是必須
 * }
 * 
 * @param {*} {
 * 
 *  page 页码，从1开始
 *  limit 每页条数
 *  start 开始时间
 *  end 结束时间
 * }
 * @return {*}
 */
export async function getLiveSubscribeMatchList({ start, end, page, limit }) {
  return axios.request({
    url: "/live/subscribe/match_list",
    data: { start, end, page, limit },
    method: "GET",
  })
}

/**
 * @description 预约 订阅
 * @param {*} {
 *   match_id, // 直播赛事 id
 *   nami_match_id, // 赛事比分 id
 * status, before, after
 * }
 * @return {*}
 */
export async function matchSubscribe(data) {
  return axios.request({
    url: "/live/subscribe/match",
    data,
    method: "POST",
  })
}

/**
 * @description 比赛订阅状态
 * @param {*} {
 *   match_id, // 直播赛事 id
 *   nami_match_id, // 赛事比分 id
 * }
 * @return {*}
 */
export async function subscribeMatchStatus({ nami_match_id, match_id, match_time, sport_type, Type, UTCTimeStartInt }) {
  return axios.request({
    url: "/live/subscribe/match/status",
    data: { nami_match_id, match_id, match_time, sport_type, Type, UTCTimeStartInt },
    method: "POST",
  })
}


/**
 * @description 主播赛程计划
 * @param {*} {
 *   anchor_user_id, // 直播赛事 id
 *   start, // 赛事比分 id
 *   end
 * }
 * @return {*}
 */
export async function anchorScheduleList({ anchor_user_id, start, end }) {
  return axios.request({
    url: "/anchor/schedule",
    data: { anchor_user_id, start, end },
    method: "GET",
  })
}


/**
 * @description 主播赛程计划
 * @param {*} {
 *    params
 * }
 * @return {*}
 */
export async function myAnchorSubscribe(data) {
  return axios.request({
    url: "/sub/my_subscribe/anchor",
    data,
    method: "POST",
  })
}

/**
 * @description 主播赛程计划
 * @param {*} {
 *   anchor_user_id, // 直播赛事 id
 *   start, // 赛事比分 id
 *   end
 * }
 * @return {*}
 */
export async function mySubscribe({ page, limit }) {
  return axios.request({
    url: "/v2/user/sub_match_list",
    data: { page, limit },
    method: "GET",
  })
}

/**
 * @description 直播播放链接 play url
 * @param {*} {
 *   match_id, // 赛事比分 id
 * }
 * @return {*}
 */
export async function getLivePlayerUrl({ match_id }) {
  return axios.request({
    url: "/live/player_url",
    data: { match_id },
    method: "POST",
  })
}

/**
 * @description glvie 详情
 * @param {*} {
 *   glive_match_id, // 赛事比分 id
 * }
 * @return {*}
 */
export async function getLiveDetail({ glive_match_id }) {
  return axios.request({
    url: "/live/glive_detail",
    data: { glive_match_id },
    method: "GET",
  })
}

// /**
//  * @description 阵容
//  * @param {*} {
//  *   glive_match_id
//  * }
//  * @return {*}
//  */
// export async function getLineUp({ glive_match_id }) {
//   return axios.request({
//     url: "/live/lineup",
//     data: {
//       glive_match_id
//     },
//     method: "GET",
//   })
// }

/**
 * @description 阵容

 * @return {*}
 */
export async function liveMatchLineup({ all_match_id }) {
  return axios.request({
    url: "/v2/live_room/lineup",
    data: {
      all_match_id,
    },
    method: "GET",
  });
}
/**
 * @description 重要事件
 * @param {*} {
 *   all_match_id, // 比赛id
 * }
 * @return {*}
 */
export async function live_room_incidents({ all_match_id }) {
  return axios.request({
    url: "/v2/live_room/incidents",
    data: {
      all_match_id,
    },
    method: "GET",
  });
}


/**
 * @description 比分
 * @param {*} {
 *   all_match_id, // 比赛id
 * }
 * @return {*}
 */
export async function live_room_score({ all_match_id }) {
  return axios.request({
    url: "/v2/live_room/score",
    data: {
      all_match_id,
    },
    method: "GET",
  });
}

// 赛况
export async function live_room_stats({ all_match_id }) {
  return axios.request({
    url: "/v2/live_room/stats",
    data: {
      all_match_id,
    },
    method: "GET",
  });
}

/**
 * @description 数据分析
 * @param {*} {
 *   glive_match_id
 * }
 * @return {*}
 */
export async function getStats({ glive_match_id }) {
  return axios.request({
    url: "/live/stats",
    data: {
      glive_match_id
    },
    method: "GET",
  })
}


/**
 * @description 比分
 * @param {*} {
 *  glive_match_id
 * }
 * @return {*}
 */
export async function getScore({ glive_match_id }) {
  return axios.request({
    url: "/live/score",
    data: {
      glive_match_id
    },
    method: "GET",
  })
}


/**
 * @description 市场赔率
 * @param {*} {
 *  glive_match_id
 * }
 * @return {*}
 */
export async function getMarket({ glive_match_id }) {
  return axios.request({
    url: "/live/market",
    data: {
      glive_match_id
    },
    method: "GET",
  })
}

// 排行榜
export async function live_room_top({ type, anchor_user_id}) {
  return axios.request({
    url: "/v2/live_room/top",
    data: {
     type, anchor_user_id
    },
    method: "GET",
  });
}
// 直播回放
export async function playback({ anchor_user_id }) {
  return axios.request({
    url: "/v2/live_room/playback",
    data: {
      anchor_user_id
    },
    method: "GET",
  });
}

// 直播预告
export async function anchor_schedule({ anchor_user_id }) {
  return axios.request({
    url: "/v2/live_room/anchor_schedule",
    data: {
      anchor_user_id
    },
    method: "GET",
  });
}
export async function subMatch(data) {
  return axios.request({
    url: "/v2/user/sub_match",
    data,
    method: "POST",
  });
}

/**
 * @description 重要事件
 * @param {*} {
 *   page, // 页数
 *   limit, // 页量
 * }
 * @return {*}
 */
export async function getIncidents({ glive_match_id }) {
  return axios.request({
    url: "/live/incidents",
    data: {
      glive_match_id
    },
    method: "GET",
  })
}


/**
 * @description 足球积分榜
 * @param {*} {
 *   glive_match_id
 * }
 * @return {*}
 */
export async function getFootballPoint({ glive_match_id }) {
  return axios.request({
    url: "/live/football_point",
    data: {
      glive_match_id
    },
    method: "GET",
  })
}



/**
 * @description 现在直播视频计数
 * @param {*} {
 *   lang
 * }
 * @return {*}
 */
export async function getMatchListCount({ lang }) {
  return axios.request({
    url: "/live/match_list/count",
    data: {
      lang
    },
    method: "GET",
  })
}


/**
 * @description 首页顶部轮播图 list
 * @return {*}
 */
export async function liveHomeSwiper(body) {
  return axios.request({
    url: "/v2/live_home/swiper",
    body,
    method: "GET",
  });
}


export async function HomeLive(data) {
  
  return axios.request({
    url: "/v2/live_home/live",
    data,
    method: "GET",
  });
}
// 教程
export async function getVideoList(data) {
  return axios.request({
    url: "/sport_video/list",
    data,
    method: "GET",
  });
}

/**
 * @description 首页顶部比赛 list
 * @return {*}
 */
export async function top_match_list(data) {
  return axios.request({
    url: "/v2/live_home/top_match_list",
    data,
    method: "GET",
  });
}


/**
 * @description 首页顶部比赛预约
 * @return {*}
 */
export async function sub_top_match_list({all_match_id,match_time,status}) {
  return axios.request({
    url: "/v2/user/sub_match",
    data: {
      all_match_id,
      match_time,
      status
    },
    method: "POST",
  });
}

// 我预约的比赛数量
export async function sub_match_count() {
  return axios.request({
      url: "/v2/user/sub_match_count",
      method: "GET",
  });
}


/**
 * @description 比赛预约
 * @return {*}
 */
export async function sub_match(data) {
  return axios.request({
    url: "/v2/user/sub_match",
    data,
    method: "POST",
  });
}

// 推荐-直播列表
export async function liveRecommend(params={}) {
  return axios.request({
    url: "/v2/live_room/recommend",
    data: params,
    method: "GET",
  });
}
