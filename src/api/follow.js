import axios from "@/axios/request"

/**
 * @description 我的关注列表
 * @param {*} {
 *   page,
 *  limit
 * }
 * @return {*}
 */
export async function myFollowList({page, limit}) {
    return axios.request({
        url: "/v2/user/follow/anchor_list",
        data: {
            page,
            limit
        },
        method: "GET",
    })
}

/**
 * @description 关注，取消关注
 * @param {*} {
 *   page,
 *  limit
 * }
 * @return {*}
 */
export async function setFollow({to_user_id}) {
    return axios.request({
        url: "/follow/follow",
        data: {
            to_user_id
        },
        method: "POST",
    })
}

// 是否关注该主播
export async function followStatusV2(to_user_id) {
    return axios.request({
        url: "/v2/user/follow_status",
        data: {
            to_user_id: to_user_id,
        },
        method: "GET",
    });
}

/**
 * @description 关注取消关注主播
 * @param {*} {
 *   to_user_id, // 对方用户id
 * }
 * @return {*}
 */
export async function liveFollowV2(to_user_id, status) {
    return axios.request({
        url: "/v2/user/follow",
        data: {
            to_user_id: to_user_id,
            status: status
        },
        method: "POST",
    });
}
// 查询关注 粉丝 消息
export async function getCount() {
    return axios.request({
        url: "/v2/user/count",
        body: {},
        method: "GET",
        loading: false,
    });
  }
// 粉丝列表
export async function liveFollowerList({ page, limit }) {
    return axios.request({
      url: "/v2/user/follower",
      data: {
        page,
        limit,
      },
      method: "GET",
    });
  }

export async function liveFollowListV2({ page, limit }) {
    return axios.request({
        url: "/v2/user/follow/anchor_list",
        body: {
            page,
            limit,
        },
        method: "GET",
    });
}