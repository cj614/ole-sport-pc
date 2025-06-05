import axios from '@/axios/request'

/**
 * @description 通知list
 * @herder {*} {
 *   Authorization
 * }
 * @params{
 *  page limit
 * }
 * @return {*}
 */
export async function getNotificationList({ page, limit }) {
  return axios.request({
    url: '/notification/list',
    data: { page, limit },
    method: 'GET'
  })
}

/**
 * @description 通知详情
 * @herder {*} {
 *   Authorization
 * }
 * @params{
 *  related_id, notification_type, create_timestamp
 * }
 * @return {*}
 */
export async function getNotificationDetail({
  related_id,
  notification_type,
  create_timestamp,
  id
}) {
  return axios.request({
    url: '/notification/detail',
    data: { related_id, notification_type, create_timestamp, id },
    method: 'GET'
  })
}

/**
 * @description 读取详情
 * @herder {*} {
 *   Authorization
 * }
 * @params{
 *  id
 * }
 * @return {*}
 */
export async function readNotification({ id }) {
  return axios.request({
    url: '/notification/read',
    data: { id },
    method: 'GET'
  })
}

/**
 * @description 删除详情
 * @herder {*} {
 *   Authorization
 * }
 * @params{
 *  id
 * }
 * @return {*}
 */
export async function deleteNotification({ id }) {
  return axios.request({
    url: '/notification/delete',
    data: { id },
    method: 'GET'
  })
}
