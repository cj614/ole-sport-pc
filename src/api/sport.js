import axios from "@/axios/request"

/**
 * @description 创建评论
 * @herder {*} {
 *   lang, // 邮件
 * }"sport_news_id": 3, //sport_news_id 和 sport_video_id 不可以同时都赋值
"sport_video_id": 0, //sport_news_id和sport_video_id 必需有一个为0，否则接口会报错
"comment": "nice aritle" //评论文字内容
 * @return {*}
 */
export async function makeComment({ sport_news_id, sport_video_id, comment }) {
  return axios.request({
    url: "/sport/make_comment",
    data: { sport_news_id, sport_video_id, comment },
    method: "POST",
  })
}

/**
 * @description 点赞评论
 * @herder {*} {
 *   lang, // 邮件
 * }"comment_id": 2,
"status": false //点赞：true 取消：false
 * @return {*}
 */
export async function likeComment({ comment_id, status }) {
  return axios.request({
    url: "/sport/like_comment",
    data: { comment_id, status },
    method: "POST",
  })
}


/**
 * @description 管理员 操作评论
 * @herder {*} {
 *   lang, // 邮件
 * }
 * @return {*}
 */
export async function operateComment({ shutup_user_id, del_comment_id, block_user_id }) {
  return axios.request({
    url: "/sport/operate_comment",
    data: { shutup_user_id, del_comment_id, block_user_id },
    method: "POST",
  })
}
