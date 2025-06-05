import axios from "@/axios/request"

/**
 * @description 聊天室登录
 * @param {*} {
 * }
 * @return {*}
 */
export async function chatLogin() {
    return axios.request({
        url: "/chat/chat_room/chat_login",
        data: {},
        method: "POST",
    })
}

/**
 * @description 聊天室退出
 * @param {*} {
 * }
 * @return {*}
 */
export async function chatLoginOut() {
    return axios.request({
        url: "/chat/chat_room/chat_login_out",
        data: {},
        method: "POST",
    })
}

/**
 * @description 聊天室成员list
 * @param {*} {
 * }
 * @return {*}
 */
export async function chatUserList() {
    return axios.request({
        url: "/chat/chat_room/chat_user_list",
        data: {},
        method: "POST",
    })
}

/**
 * @description 聊天室成员list
 * @param {*} {
 * }
 * @return {*}
 */
export async function countUser() {
    return axios.request({
        url: "/chat/chat_room/count",
        data: {},
        method: "GET",
    })
}

// 获取通讯录
export async function addressList() {
    return axios.request({
        url: "/v2/chat/address/list",
        data: {},
        method: "GET",
    });
}

// 私聊消息记录
export async function singleHistory({
                                        from_user_id,
                                        from_msg_id
                                    }) {
    return axios.request({
        url: "/v2/chat/single/history",
        data: {
            from_user_id,
            from_msg_id,
        },
        method: "POST",
    });
}

/**
 * @description 获取用户昵称头像信息
 * @param {*} {
 * }
 * @return {*}
 */
export async function userinfoByIds({user_ids}) {
    return axios.request({
        url: "/chat/chat_room/user_info",
        data: {
            user_ids
        },
        method: "POST",
    })
}

/**
 * @description 礼物list
 * @param {*} {
 * }
 * @return {*}
 */
export async function giftList() {
    return axios.request({
        url: "/chat/gift/list",
        data: {},
        method: "GET",
    })
}

/**
 * @description v2-管理员-禁言 删除消息 拉黑
 * @param {*} {
 * "shutup_user_id": 2, //禁言用户id
 "del_msg_id": 0, //删除消息 msgid
 "block_user_id": 0, //拉黑用户id
 "kick_out_user_id": 0, //踢出用户id
 "topic": "" //聊天室
 * }
 * @return {*}
 */
export async function operateChat({shutup_user_id, del_msg_id, block_user_id, kick_out_user_id, topic}) {
    return axios.request({
        url: "/chat_v2/operate_chat",
        data: {
            shutup_user_id, del_msg_id, block_user_id, kick_out_user_id, topic
        },
        method: "POST",
    })
}

/**
 * @description v2-聊天发送礼物
 * @param {*} {
 * "gift_id": 10, //礼物ID
 "topic": ""
 * }
 * @return {*}
 */
export async function sendGift({gift_id, topic, ref_type, ref_id}) {
    return axios.request({
        url: "/v2/live_room/send_gift",
        data: {
            gift_id, topic, ref_type,
            ref_id
        },
        method: "POST",
    })
}

/**
 * @description v2-聊天发送消息
 * @param {*} {
 * "msg": "{\"type\":\"text\",\"data\":{\"text\":\"ceshi5\"}}", //客户端定义的json 数据
 "topic": "ole/chat_room" //聊天室topic
 * }
 * @return {*}
 */
export async function sendMsg(data) {
    return axios.request({
        url: "/v2/chat/send",
        data,
        method: "POST",
    })
}

/**
 * @description v2-聊天室历史消息
 * @param {*} {
 * }
 * @return {*}
 */
export async function chatHistoryList({from_time, topic, action, limit}) {
    return axios.request({
        url: "/v2/chat/group/history",
        data: {
            from_time, topic, action, limit
        },
        method: "POST",
    })
}


export async function chatSendMsg({topic, msg, to_user_id}) {
    return axios.request({
        url: "/v2/chat/send",
        data: {
            topic,
            msg,
            to_user_id
        },
        method: "POST",
    });
}


/**
 * @description 改用户的消息已读完
 * @param {*} {
 * }
 * @return {*}
 */
export async function chatRead({from_user_id, from_msg_id}) {
    return axios.request({
        url: "/v2/chat/read",
        data: {
            from_user_id,
            from_msg_id,
        },
        method: "POST",
    });
}
