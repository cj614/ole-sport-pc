import axios from "@/axios/request"

/**
 * @description 公告list
 * @herder {*} {
 *   Authorization
 * }
 * @params{
 *  page limit
 * }
 * @return {*}
 */
export async function getNoticeList({ page, limit }) {
  return axios.request({
    url: "/notice/list",
    data: { page, limit },
    method: "GET",
  })
}

/**
 * @description 公告详情
 * @herder {*} {
 *   Authorization
 * }
 * @params{
 *  related_id, create_timestamp
 * }
 * @return {*}
 */
export async function getNoticeDetail({ notice_id, create_timestamp,id }) {
  return axios.request({
    url: "/notice/detail",
    data: { notice_id, create_timestamp,id },
    method: "GET",
  })
}

/**
 * @description 读取公告
 * @herder {*} {
 *   Authorization
 * }
 * @params{
 *  id
 * }
 * @return {*}
 */
export async function readNotice({ id }) {
  return axios.request({
    url: "/notice/read",
    data: { id },
    method: "GET",
  })
}

/**
 * @description 删除公告
 * @herder {*} {
 *   Authorization
 * }
 * @params{
 *  id
 * }
 * @return {*}
 */
export async function deleteNotice({ id }) {
  return axios.request({
    url: "/notice/delete",
    data: { id },
    method: "GET",
  })
}

/**
 * @description 用户创建公告
 * @herder {*} {
 *   Authorization
 * }
 * @params{
 *  "title": "快看啊",
"content": "<p>nice nice</p",
"related_id": 10, //glive id / live room id //  当 notice type 1-客服聊天室公告 3-系统app 时 为0
"notice_type": 4 //1-客服聊天室公告；2-直播间；3-系统app，4-主播公告
 * }
 * @return {*}
 */
export async function createNotice({ title, content, related_id, notice_type }) {
  return axios.request({
    url: "/notice/create",
    data: { title, content, related_id, notice_type },
    method: "POST",
  })
}

/**
 * @description 更新公告
 * @herder {*} {
 *   Authorization
 * }
 * @params{
  "title": "快看啊",
  "content": "<p>nice nice</p",
    "id": 3 
 * }
 * @return {*}
 */
export async function updateNotice({ title, content, id, notice_type }) {
  return axios.request({
    url: "/notice/update",
    data: { title, content, id, notice_type },
    method: "POST",
  })
}

/**
 * @description 直播间公告
 * @herder {*} {
 *   Authorization
 * }
 * @params{related_id, notice_type, limit, page
 
 * }
 * @return {*}
 */
export async function getNoticeRoomList({ related_id, notice_type, limit, page }) {
  return axios.request({
    url: "/notice/getList",
    data: { related_id, notice_type, limit, page },
    method: "GET",
  })
}