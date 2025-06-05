import axios from "@/axios/request"

/**
 * @description 获取短信验证码
 * @param {*} {
 *   mobile, // phone,
 *  mobile_pre 手机号国家好 +86
 * }
 * @return {*}
 */
export async function getSmsCode({ mobile_pre, mobile }) {
  return axios.request({
    url: "/user/sms",
    data: {
      mobile_pre,
      mobile
    },
    method: "POST",
  })
}

/**
 * @description 注册
 * @param {*} {
 *   mobile, //  手机号
 *   pass_word, // 密码
 *   verify_code, // 验证码
 *   user_name, // 用户名
 * }
 * @return {*}
 */
export async function userRegister({
  user_name,
  mobile,
  verify_code,
  pass_word,
    channel
}) {
  return axios.request({
    url: "/user/register",
    data: {
      user_name,
      mobile,
      verify_code,
      pass_word,
      channel
    },
    method: "POST",
  })
}

/**
 * @description 登录
 * @param {*} {
 *   user, //login type 是mobile j就填写手机，email 填写邮件
 *   password, //包含以下：email,mobile，user_name
 *   login_type //包含以下：email,mobile，user_name
 * }
 * @return {*}
 */
export async function userLogin({ user, pass_word, login_type }) {
  return axios.request({
    url: "/user/login",
    data: {
      user,
      pass_word,
      login_type
    },
    method: "POST",
  })
}


/**
 * @description 获取邮箱验证码
 * @param {*} {
 *   email, // email
 * }
 * @return {*}
 */
export async function getEmailCaptcha({ email }) {
  return axios.request({
    url: "/base/emailCode",
    data: {
      email,
    },
    method: "POST",
  })
}


/**
 * @description 忘记密码
 * @param {*} {
 *   mobile, "+86123456789", //手机号，必须带国际区号
 *   verify_code, //包含以下：email,mobile，user_name
 *   pass_word //包含以下：email,mobile，user_name
 *   email //邮箱
 * }
 * @return {*}
 */
export async function userForget({ mobile, verify_code, pass_word, email }) {
  return axios.request({
    url: "/user/forget",
    data: {
      mobile, verify_code, pass_word, email
    },
    method: "POST",
  })
}

/**
 * @description 更新头像
 * @header {*} {Authorization}
 * @param {*} {
 *   
 *   file
 * }
 * @return {*}
 */

export async function userUploadHeadImg(formData) {
  return axios.request({
    url: "/user/upload_head_img",
    data: formData,
    method: "POST",
  })
}


/**
 * @description 修改密码
 * @param {*} {
 *   password, // 老密码
 *   newPassword, // 新密码
 * }
 * @return {*}
 */
export async function updatePassword({ old_password, new_password }) {
  return axios.request({
    url: "/user/reset_ps",
    data: {
      old_password,
      new_password,
    },
    method: "POST",
  })
}

/**
 * @description 更新昵称
 * @param {*} {
 *   user_name, // 昵称
 * }
 * @return {*}
 */
export async function updateUserName({ user_name, status_info }) {
  return axios.request({
    url: "/user/update",
    data: {
      user_name,
      status_info
    },
    method: "POST",
  })
}

/**
 * @description 发送邮件验证码
 * @param {*} {
 *   email, // 邮件
 * }
 * @return {*}
 */
export async function userSes({ email }) {
  return axios.request({
    url: "user/ses",
    data: {
      email,
    },
    method: "POST",
  })
}

/**
 * @description 更新用户邮件
 * @param {*} {
 *   email, // 邮件
 *  verify_code
 * }
 * @return {*}
 */
export async function updateEmail({ email, verify_code }) {
  return axios.request({
    url: "user/update_email",
    data: {
      email,
      verify_code
    },
    method: "POST",
  })
}

/**
 * @description 获取用户信息
 * @param {*} {
 * }
 * @return {*}
 */
export async function getUserInfo() {
  return axios.request({
    url: "/user/info",
    method: "GET",
  })
}

/**
 * @description 是否被踢出该聊天室
 * @param {*} {
 * }
 * @return {*}
 */
export async function kickOut({ glive_id }) {
  return axios.request({
    url: "/user/is_kick_out",
    data: { glive_id },
    method: "GET",
  })
}


/**
 * @description 获取他人信息
 * @param {*} {
 * }
 * @return {*}
 */
export async function userDetail({ user_id }) {
  return axios.request({
    url: "/user/detail",
    data: { user_id },
    method: "GET",
  })
}


/**
 * @description 未读消息条数
 * @param {*} {
 * }
 * @return {*}
 */
export async function noReadNoticeCount() {
  return axios.request({
    url: "/user/no_read_notice_count",
    data: {},
    method: "GET",
  })
}

// 领取钻石
export async function getDiamondApi() {
  return axios.request({
      url: "/v2/user/get_diamond",
      method: "GET",
  });
}

// 检查是否签到
export async function isSignUpApi() {
  return axios.request({
      url: "/v2/user/is_sign_up",
      method: "GET",
  });
}

// 签到
export async function signUpApi() {
  return axios.request({
      url: "/v2/user/sign_up",
      method: "GET",
  });
}

