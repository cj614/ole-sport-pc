import ROOTVUE from '@/main.js'
import dayjs from 'dayjs'
import IMAGE_LIST from "./imgList";

export function getIncidentLogo(type) {
  const typeMap = {
    1: "Goal",
    10: "MatchStart",
    11: "HalfTime",
    12: "MatchEnd",
    13: "HalfTimeScore",
    15: "SecondYellowCard",
    16: "MissedPenalty",
    17: "OwnGoal",
    18: "Assist",
    19: "InjuryTime",
    2: "Corner",
    21: "ShotOnTarget",
    22: "ShotOffTarget",
    23: "Attack",
    24: "DangerousAttack",
    25: "BallPossession",
    26: "EndofExtraTime",
    27: "EndofPenaltyShootout",
    28: "VAR",
    29: "Penalty",
    3: "YellowCard",
    30: "MissedPenalty",
    4: "RedCard",
    5: "Offside",
    6: "FreeKick",
    7: "GoalKick",
    8: "Penalty",
    9: "Substitution",
  }
  // console.log(typeMap[type])
  switch (type) {
    case 'in':
      return require(`@/${IMAGE_LIST.Page.Substitution.Up}`);
    case 'out':
      return require(`@/${IMAGE_LIST.Page.Substitution.Down}`)
    default:
      return require(`@/${IMAGE_LIST.Page.Substitution[typeMap[type]]}`)
  }
}

export const isChinese = str => {
  if (/^[\u3220-\uFA29]+$/.test(str)) {
    return true
  } else {
    return false
  }
}

export const storageRead = key => {
  return localStorage.getItem(key) || ''
}

export const storageSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const storageRemove = key => {
  localStorage.removeItem(key)
}

export const storageClear = () => {
  localStorage.clear()
}

/**
 * @param {phone}  number 要验证的手机号
 * @description 验证手机号
 */

export function verifyPhone(phone) {
  if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
    return false
  }
  return true
}

/**
 * @param {email} String 要验证的邮箱号
 * @description 验证邮箱号
 */

export function verifyEmail(email) {
  // let emailRegExp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  let emailRegExp =
    /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,20})$/
  return emailRegExp.test(email)
}

/**
 * @param {*} 字符转 hex字符
 */
export function charToHex(str) {
  var out, i, h
  out = ''
  i = 0
  while (i < str.length) {
    h = str.charCodeAt(i++).toString(16)
    h.length > 1 ? (h = h) : (h = '0' + h)
    out += '\\0x' + h
    out += i > 0 && i % 8 == 0 ? '\r\n' : ', '
  }
  return out
}

/**
 * @param {*} hex 字符转字符串
 */
export function hexTostring(str) {
  let strs = str.split('\\0x').join('').split(',').join('').split('↵').join('')
  return strs.replace(/\s+$/, '')
}

/**
 * @param {*} 转换 ascill 码
 */
export function strToAscll(strs) {
  let result = ''
  for (let item = 0; item < strs.length / 2; item++) {
    result += String.fromCharCode(parseInt(strs.substr(2 * item, 2), 16))
  }
  return result
}

/**
 * @param {*} String 按位增加字符
 * @param {lens} 间隔位数
 * @param {strs} 增加的字符
 */
export function addReplace(str, lens, strs) {
  let result = ''
  for (var i = 0, len = str.length; i < len; i++) {
    result += str[i].toString()
    if (i % lens == lens - 1) result += strs
  }
  result = result.substring(0, result.lastIndexOf(strs))
  return result
}

/**
 * @param {*} 清除 String，所有特定的字符
 */
export function clearReplace(str, strs) {
  let re = new RegExp('' + strs, 'g')
  str = str.replace(re, '')
  return str
}

// 时间戳
export function formatDayTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatOnlytimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatTimestampDayAndTime(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return {day: `${year}-${month}-${day}`, time: `${hours}:${minutes}`}
}

/**
 * @param {*} base64 解码
 */
export function base64Decode(str) {
  var base64DecodeChars = new Array(
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    62,
    -1,
    -1,
    -1,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    -1,
    -1,
    -1,
    -1,
    -1
  )
  var c1, c2, c3, c4
  var i, len, out
  len = str.length
  i = 0
  out = ''
  while (i < len) {
    /* c1 */
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c1 == -1)
    if (c1 == -1) break

    /* c2 */
    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff]
    } while (i < len && c2 == -1)
    if (c2 == -1) break

    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4))

    /* c3 */
    do {
      c3 = str.charCodeAt(i++) & 0xff
      if (c3 == 61) return out
      c3 = base64DecodeChars[c3]
    } while (i < len && c3 == -1)
    if (c3 == -1) break

    out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2))

    /* c4 */
    do {
      c4 = str.charCodeAt(i++) & 0xff
      if (c4 == 61) return out
      c4 = base64DecodeChars[c4]
    } while (i < len && c4 == -1)
    if (c4 == -1) break
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4)
  }
  return out
}

/**
 * @param {str}  string 要编码字符串
 * @description base64 编码
 */

export function base64Encode(str) {
  var base64EncodeChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  var out, i, len
  var c1, c2, c3

  len = str.length
  i = 0
  out = ''
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt((c1 & 0x3) << 4)
      out += '=='
      break
    }
    c2 = str.charCodeAt(i++)
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
      out += base64EncodeChars.charAt((c2 & 0xf) << 2)
      out += '='
      break
    }
    c3 = str.charCodeAt(i++)
    out += base64EncodeChars.charAt(c1 >> 2)
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
    out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6))
    out += base64EncodeChars.charAt(c3 & 0x3f)
  }
  return out
}

/**
 * @param {length}  Number 字符串长度
 * @description 随机生成字符串
 */

export function randomString(length) {
  length = length || 18
  let t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789'
  let a = t.length
  let n = ''
  for (let i = 0; i < length; i++) {
    n += t.charAt(Math.floor(Math.random() * a))
  }
  return n
}

/**
 * @param {length} Number
 * @description 将数组均等份分成多维数组
 */

export function averageCutArray(array, subLength) {
  let index = 0
  let newArr = []
  while (index < array.length) {
    newArr.push(array.slice(index, (index += subLength)))
  }
  return newArr
}

/**
 * @param {str} type // h-full-navbar h-full-navbar-tabbar
 * @description 获取页面高度
 */

export function getPageContentHeight(type) {
  let style = {}
  let insetTop = ROOTVUE.$u.addUnit(ROOTVUE.$u.sys().statusBarHeight, 'px')
  if (type === 'h-full') {
    style = {
      height: `calc(var(--app-height))`
    }
  }
  if (type === 'h-full-navbar') {
    style = {
      height: `calc(var(--app-height) - ${insetTop} - constant(safe-area-inset-bottom) - 45px)`,
      height1: `calc(var(--app-height) - ${insetTop} - env(safe-area-inset-bottom) - 45px)`
    }
  }
  if (type === 'h-full-navbar-tabbar') {
    style = {
      height: `calc(var(--app-height) - ${insetTop} - constant(safe-area-inset-bottom) - 45px - 51px)`,
      height1: `calc(var(--app-height) - ${insetTop} - env(safe-area-inset-bottom) - 45px - 51px)`
    }
  }
  if (type === 'h-full-tabbar') {
    style = {
      height: `calc(var(--app-height) - ${insetTop} - constant(safe-area-inset-bottom) - 51px)`,
      height1: `calc(var(--app-height) - ${insetTop} - env(safe-area-inset-bottom) - 51px)`
    }
  }
  return style
}

/**
 * @param {*} 二进制流转 ascill 码
 */
export function binaryToAscll(buffer) {
  let str = Array.prototype.map.call(new Uint8Array(buffer), bit => {
    return String.fromCharCode(bit)
  })
  return str.join('')
}

/**
 * @param {*} 二进制流转十六进制
 */
export function binaryToHex(buffer) {
  return addReplace(
    Array.prototype.map
      .call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2))
      .join('')
      .toUpperCase(),
    2,
    ' '
  )
}

/**
 * @param {*} 十六进制字符串转二进制流
 */
export function hexStrToBinary(hex) {
  return new Uint8Array(
    hex.match(/[\da-f]{2}/gi).map(h => {
      return parseInt(h, 16)
    })
  ).buffer
}

/**
 * @param {*} 10进制字符串转16进制补零
 * @param {dec} 10 进制数
 * @param {len} 转化成16进制的长度
 */
export function dec2hex(dec, len) {
  let hex = ''
  while (dec) {
    let last = dec & 15
    hex = String.fromCharCode((last > 9 ? 55 : 48) + last) + hex
    dec >>= 4
  }
  if (len) {
    while (hex.length < len) hex = '0' + hex
  }
  return hex
}

/**
 * @param {str}
 * @description 复制文本
 */
export function copyText(str) {
  ROOTVUE.$copyText(str).then(res => {
    ROOTVUE.$toast.success('复制成功', '', {
      position: 'topCenter',
      timeout: 1000 * 3,
      balloon: true
    })
  })
}

/**
 * @param {url} Stirng 判断是不是真实链接
 * @description
 */
export function isUrl(str) {
  var v = new RegExp(
    '^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    'i'
  )
  return v.test(str)
}

/**
 * @param {url} Stirng 跳转外部浏览器
 * @description
 */

export function handleOpenChromeSafariBrowser(url, type) {
  if (!url) {
    return false
  }
  if (isUrl(url)) {
    window.open(url)
  } else {
  }
}

/**
 * @param {url} Stirng 切换 webview 链接
 * @description
 */

export function handleChangeWebviewURL(url) {
  if (window.handleChangeWebviewURL) {
    window.handleChangeWebviewURL.postMessage(url)
  } else if (window.webkit) {
    if (
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.handleChangeWebviewURL
    ) {
      window.webkit.messageHandlers.handleChangeWebviewURL.postMessage({
        url
      })
    }
  }
}

/**
 * @param {url} Stirng 清除缓存
 * @description
 */

export function handleClearWebViewCache() {
  uni.clearStorage()
  if (window.handleClearWebViewCache) {
    window.handleClearWebViewCache.postMessage('')
  } else if (window.webkit) {
    if (
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.handleClearWebViewCache
    ) {
      window.webkit.messageHandlers.handleClearWebViewCache.postMessage('')
    } else {
      window.location.href = getApp().globalData.url
    }
  } else {
    window.location.href = getApp().globalData.url
  }
}

/**
 * @param 获取 UUID
 * @description
 */

export function handleDeviceUUID() {
  return new Promise((resolve, reject) => {
    if (window.handleDeviceUUID || window.webkit) {
      window.handleDeviceUUIDMethod = uuid => {
        resolve(uuid)
        delete window.handleDeviceUUIDMethod
      }
      if (window.handleDeviceUUID) {
        window.handleDeviceUUID.postMessage('')
      } else if (window.webkit) {
        if (
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.handleDeviceUUID
        ) {
          window.webkit.messageHandlers.handleDeviceUUID.postMessage('')
        } else {
          resolve('')
        }
      }
    } else {
      resolve('')
    }
  })
}

/**
 * @param
 * @description 图片保存
 */

export function handleSaveImage(url) {
  if (window.handleSaveImage) {
    window.handleSaveImage.postMessage(url)
    return
  } else if (window.webkit) {
    if (
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.handleSaveImage
    ) {
      window.webkit.messageHandlers.handleSaveImage.postMessage({
        url: url
      })
      return
    }
  } else {
    uni.downloadFile({
      url: url,
      success: res => {
        if (res.statusCode === 200) {
          h5DownloadFile(res.tempFilePath)
        }
      }
    })
  }
}

/**
 * @param
 * @description base64图片保存
 */

export function handleSaveBase64Image(base64) {
  if (window.handleSaveBase64Image) {
    window.handleSaveBase64Image.postMessage(base64.split('base64,')[1])
    return
  } else if (window.webkit) {
    if (
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.handleSaveBase64Image
    ) {
      window.webkit.messageHandlers.handleSaveBase64Image.postMessage({
        base64: base64.split('base64,')[1]
      })
      return
    }
  } else {
    uni.downloadFile({
      url: base64,
      success: res => {
        if (res.statusCode === 200) {
          h5DownloadFile(res.tempFilePath)
        }
      }
    })
  }
}

/**
 * @param
 * @description H5 下载
 */

export function h5DownloadFile(url) {
  let eleLink = document.createElement('a')
  eleLink.download = ROOTVUE.$date().format('YYYY-MM-DD HH:mm:ss')
  eleLink.style.display = 'none'
  eleLink.href = url
  document.body.appendChild(eleLink)
  eleLink.click()
  document.body.removeChild(eleLink)
}

/**
 * @param {*} 保留几位小数（不四舍五入）
 */
export function numRetainDecimals(num, len = 6, sw = false) {
  num = Number(num)
  let lenFold = len * 10
  num = Math.floor(num * Math.pow(10, len)) / Math.pow(10, len)
  if (sw) {
    return {
      value: num,
      text: ROOTVUE.$u.priceFormat(num, len)
    }
  } else {
    return ROOTVUE.$u.priceFormat(num, len)
  }
}

export function translateFun() {
  // let keyFile = require("@/lang/zh-CN/Key.json")
  // let valueFile = require("@/lang/zh-CN/value.json")
  // let info = {}
  // let keyArr = Object.keys(keyFile)
  // let valueArr = Object.keys(valueFile)
  // keyArr.forEach((item, key) => {
  //   info[item] = {};
  //   let arr1 = Object.keys(keyFile[item]);
  //   let arr2 = Object.keys(keyFile[keyArr[key]]);
  //   arr1.forEach((child, index) => {
  //     info[item][child] = arr2[index];
  //   });
  // });
  // keyArr.forEach((item, key) => {
  //   info[item] = valueFile[valueArr[key]]
  // })
}
// translateFun();

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accAdd(arg1, arg2) {
  var r1, r2, m, c
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  c = Math.abs(r1 - r2)
  m = Math.pow(10, Math.max(r1, r2))
  if (c > 0) {
    var cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
export function accSub(arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2)) //last modify by deeka //动态控制精度长度
  n = r1 >= r2 ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
export function accMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) { }
  try {
    m += s2.split('.')[1].length
  } catch (e) { }
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  )
}

/**
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
export function accDiv(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1,
    r2
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) { }
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) { }
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

/**
 * @param {str}
 * @description 设置比分
 */
export function setScores(scores, sport_type, status = 0) {
  let score = 0
  switch (sport_type) {
    case 'BASKETBALL':
      if (Array.isArray(scores)) {
        score = scores.reduce((acc, cur) => acc + cur, 0)
      }
      break
    case 'FOOTBALL':
      if (Array.isArray(scores) && scores.length > 0) {
        score = scores[0]
      }
      break
  }
  if (status > 2 && score == 0) {
    return '-'
  }
  return score
}

/**
 * @param {str}
// 比赛开始了多少分钟,分为
// 足球，足球每节45分钟，中间休息15分钟，加上3分钟伤停补时，
// 篮球，FIBA篮球比赛的时间为40分钟，分4节，每节10分钟; NBA篮球比赛的时间是48分钟，分4节，每节12分钟。
*/
export function setStartM(item) {
  let {
    id,
    competition_id,
    status_id,
    glive_match_id,
    bar_remain_time,
    match_time,
    sport_type,
    kick_off_time
  } = item
  let elapsedMinutes = ''
  switch (sport_type) {
    case 'BASKETBALL':
      let is_nba = false
      if (id === glive_match_id && competition_id === 506) {
        is_nba = true
      }
      if (id !== glive_match_id && competition_id == 1) {
        is_nba = true
      }
      if (status_id != 0) {
        let distanceMinutes = ROOTVUE.$date(bar_remain_time * 1000).minute()
        elapsedMinutes = `${distanceMinutes}'`
        switch (status_id) {
          case 2:
            elapsedMinutes = `${elapsedMinutes} 1Q`
            break
          case 3:
            elapsedMinutes = "0' 1Q"
            break
          case 4:
            elapsedMinutes = `${elapsedMinutes} 2Q`
            break
          case 5:
            elapsedMinutes = "0' 2Q"
            break
          case 6:
            elapsedMinutes = `${elapsedMinutes} 3Q`
            break
          case 7:
            elapsedMinutes = "0' 3Q"
            break
          case 8:
            elapsedMinutes = `${elapsedMinutes} 4Q`
            break
          case 9:
            elapsedMinutes = `${elapsedMinutes} OT`
            break
        }
      } else {
        let distanceMinutes = ROOTVUE.$date(
          ROOTVUE.$date().valueOf() - match_time * 1000
        ).minute()
        if (distanceMinutes < 0) {
          distanceMinutes = 0
        }
        let allMinutes = 100
        if (is_nba) {
          allMinutes = 140
        }
        const t = distanceMinutes / allMinutes
        if (t < 0.2) {
          elapsedMinutes = '1Q'
        } else if (t < 0.5) {
          elapsedMinutes = '2Q'
        } else if (t < 0.7) {
          elapsedMinutes = '3Q'
        } else {
          elapsedMinutes = '4Q'
        }
      }
      break
    case 'FOOTBALL':
      if (kick_off_time > 0 || status_id > 0) {
        elapsedMinutes = ROOTVUE.$date(
          ROOTVUE.$date().valueOf() - kick_off_time * 1000
        ).minute()
        switch (status_id) {
          case 1:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12:
          case 13:
            elapsedMinutes = ''
            break
          case 3:
            elapsedMinutes = ROOTVUE.$t(`Module['半场结束']`)
            break
          case 4:
            elapsedMinutes = elapsedMinutes + 45
            if (elapsedMinutes > 90) {
              elapsedMinutes = "90'+"
            }
            break
          case 5:
          case 6:
          case 7:
            elapsedMinutes = elapsedMinutes + 90
            if (elapsedMinutes > 90) {
              elapsedMinutes = "90'+"
            }
            break
          case 2:
            if (elapsedMinutes > 45) {
              elapsedMinutes = "45'+"
            }
            break
        }
      } else {
        if (kick_off_time > 0) {
          elapsedMinutes = ROOTVUE.$date(
            ROOTVUE.$date().valueOf() - kick_off_time * 1000
          ).minute()
          if (elapsedMinutes < 0) {
            elapsedMinutes = 0
          }
        }
      }
      if (typeof elapsedMinutes === 'number' && !isNaN(elapsedMinutes)) {
        if (elapsedMinutes > 90) {
          elapsedMinutes = "90'+"
        } else {
          elapsedMinutes = elapsedMinutes + "'"
        }
      }
      break
  }

  return elapsedMinutes
}

/**
// 解析比赛数据
*/
export function analysisMatches(list) {
  let ids = []
  let arr = []
  list.forEach(item => {
    let obj = {}
    obj.competitionId = item.competition_id
    obj.competitionLogo = item.competition_logo
    obj.competitionName = item.competition_name
    obj.sportType = item.sport_type
    obj.downList = item.bet_type
    obj.selVal = item.bet_type[0] || ''
    obj.list = []
    item.Matches.forEach(matches => {
      let info = {
        id: matches.id,
        status: matches.status,
        statusId: matches.status_id,
        endStatus: matches.end_status,
        sportType: item.sport_type,
        awayLogo: matches.away_logo,
        awayName: matches.away_name,
        liveId: matches.glive_match_id,
        playTime: setStartM(matches),
        barRemainTime: matches.bar_remain_time || 0,
        kickOffTime: matches.kick_off_time || 0,
        matchTime: matches.match_time,
        awayScores: setScores(
          matches.away_scores,
          item.sport_type,
          matches.status
        ),
        homeLogo: matches.home_logo,
        homeName: matches.home_name,
        homeScores: setScores(
          matches.home_scores,
          item.sport_type,
          matches.status
        ),
        liveRoomId: matches.live_room_id,
        livePlayId: matches.live_play_id,
        allMatchId: matches.all_match_id,
        marketList: [],
        anchorList: []
      }
      obj.list.push(info)
      ids.push({
        id: matches.id,
        sport_type: matches.sport_type
      })
    })
    arr.push(obj)
  })
  return {
    ids,
    arr
  }
}

/**
// 解析主播数据
*/
export function analysisAnchor(Data, _this) {
  let anchorList = Object.keys(Data).map(item => {
    return {
      key: item,
      ...Data[item]
    }
  })
  anchorList.forEach(anchor => {
    _this.listData.forEach(item => {
      item.list.forEach(matches => {
        if (matches.id == anchor.key.split('-')[0]) {
          let diff = matches.anchorList.filter(msg => {
            return msg.live_room_user_id === anchor.live_room_user_id
          })
          if (!diff.length) {
            matches.anchorList.push(anchor)
          }
        }
      })
    })
  })
}

/**
// 解析赔率数据
*/
export function analysisMarket(Data, _this) {
  let { markets } = Data
  if (markets) {
    let marketList = Object.keys(markets).map(item => {
      return {
        key: item,
        ...markets[item]
      }
    })
    marketList.forEach(market => {
      _this.listData.forEach(item => {
        item.list.forEach(matches => {
          if (matches.id == market.key.split('-')[0]) {
            let obj = {}
            for (let item in market) {
              if (item !== 'key') {
                obj[item] = []
                market[item].forEach(msg => {
                  let info = {}
                  info.key = msg.key
                  info.price =
                    (msg.oddsPrice && msg.oddsPrice.decimalPrice) || 0
                  info.point = msg.point || 0
                  info.priceType = ''
                  info.pointType = ''
                  info.time = ''
                  obj[item].push(info)
                })
              }
            }
            matches.marketList.push(obj)
          }
        })
      })
    })
  }
}

/**
// mqtt 解析赛事/赔率数据
*/
export function analysisMQTTMarketMatches(res, _this) {
  let { notice_type, data } = res
  let { listData, prefix } = _this
  listData.forEach((item, key) => {
    item.list.forEach((matches, index) => {
      if (matches.id === data.id && matches.sportType === data.sport_type) {
        // if (notice_type === 1) {
        //   console.log(`-----赛事，比分 MQ-----${data.id}`)
        //   console.log(res)
        // }
        // if (notice_type === 2) {
        //   console.log(`-----赛事，赔率 MQ-----${data.id}`)
        //   console.log(res)
        // }
        if (notice_type === 1) {
          let oldArr = {}
          if (_this.listData[key].list[index].marketList.length) {
            oldArr = JSON.parse(
              JSON.stringify(_this.listData[key].list[index].marketList[0])
            )
            Object.keys(oldArr).forEach(oldItem => {
              let newItem = oldArr[oldItem]
              newItem = newItem.map(item => {
                let time = item.time
                let newTime = Math.floor(new Date().valueOf() / 1000)
                if (time && newTime - time > 6) {
                  return {
                    ...item,
                    priceType: '',
                    pointType: '',
                    time: ''
                  }
                } else {
                  return {
                    ...item
                  }
                }
              })
              oldArr[oldItem] = newItem
            })
            _this.$set(listData[key].list[index].marketList, 0, oldArr)
          }
          let {
            away_scores,
            bar_remain_time,
            kick_off_time,
            home_scores,
            status,
            end_status,
            status_id
          } = data
          _this.$set(
            listData[key].list[index],
            'awayScores',
            setScores(away_scores, matches.sportType, status, end_status)
          )
          _this.$set(
            listData[key].list[index],
            'homeScores',
            setScores(home_scores, matches.sportType, status, end_status)
          )
          _this.$set(
            listData[key].list[index],
            'playTime',
            setStartM({
              id: data.id,
              competition_id: item.competitionId,
              status_id,
              glive_match_id: matches.liveId,
              bar_remain_time: bar_remain_time || 0,
              match_time: matches.matchTime,
              kick_off_time: kick_off_time || 0,
              sport_type: matches.sportType
            })
          )
          _this.$set(listData[key].list[index], 'status', status)
          _this.$set(listData[key].list[index], 'statusId', status_id)
        }
        if (notice_type === 2) {
          let { markets } = data
          let marketObj = markets[prefix]
          marketObj = marketObj || markets['default']
          if (marketObj && Object.keys(marketObj).length) {
            Object.keys(marketObj).forEach((market, num) => {
              if (listData[key].list[index].marketList.length) {
                let newArr = []
                marketObj[market].forEach(msg => {
                  let info = {}
                  info.key = msg.key
                  info.price =
                    (msg.oddsPrice && msg.oddsPrice.decimalPrice) || 0
                  info.point = msg.point || 0
                  info.priceType = ''
                  info.pointType = ''
                  newArr.push(info)
                })
                let oldArr = {}
                if (_this.listData[key].list[index].marketList.length) {
                  if (_this.listData[key].list[index].marketList[0][market]) {
                    oldArr = JSON.parse(
                      JSON.stringify(
                        _this.listData[key].list[index].marketList[0][market]
                      )
                    )
                    newArr = newArr.map((newItem, num) => {
                      let oldItem = oldArr[num]
                      return {
                        ...newItem,
                        priceType: oldItem.price
                          ? newItem.price - oldItem.price === 0
                            ? ''
                            : newItem.price - oldItem.price > 0
                              ? 'success'
                              : 'error'
                          : '',
                        pointType: oldItem.point
                          ? newItem.point - oldItem.point === 0
                            ? ''
                            : newItem.point - oldItem.point > 0
                              ? 'success'
                              : 'error'
                          : '',
                        time: Math.floor(new Date().valueOf() / 1000)
                      }
                    })
                    _this.$set(
                      listData[key].list[index].marketList[0],
                      market,
                      newArr
                    )
                  }
                }
              }
            })
          }
        }
      }
    })
  })
}
export function getWithExpire(key) {
  if (!key) {
    return null
  }

  let item = localStorage.getItem(key)
  if (!item) {
    return null
  }

  item = JSON.parse(item)

  if (new Date().getTime() > item.expireAt) {
    localStorage.removeItem(key)
    return null
  }

  return JSON.parse(item.value)
}

export function setWithExpire(key, value, expire = 24 * 60 * 60 * 1000) {
  if (!key) {
    return
  }

  let now = new Date().getTime()
  let expireAt = new Date(now + expire)

  let item = {
    value: JSON.stringify(value),
    expireAt: expireAt.getTime()
  }

  localStorage.setItem(key, JSON.stringify(item))
}
export function scrollToTop() {
  // const num = document.documentElement.scrollTop || document.body.scrollTop
  // if (num > 0) {
  //   // window.requestAnimationFrame(scrollToTop)
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth'
  //   })

  // }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

export function formatCurrency(num, flag = false, decimal = 2, split = ',') {
  /*
    parameter：
    num：格式化目标数字
    decimal：保留几位小数，默认2位
    split：千分位分隔符，默认为,
    moneyFormat(123456789.87654321, 2, ',') // 123,456,789.88
  */
  function thousandFormat(num) {
    const len = num.length
    return len <= 3
      ? num
      : thousandFormat(num.substr(0, len - 3)) + split + num.substr(len - 3, 3)
  }
  if (isFinite(num)) {
    // num是数字
    if (flag) {
      num = num / 100
    }
    if (num === 0) {
      // 为0
      return num.toFixed(decimal)
    } else {
      // 非0
      var res = ''
      var dotIndex = String(num).indexOf('.')
      if (dotIndex === -1) {
        // 整数
        res = thousandFormat(String(num)) + '.' + '0'.repeat(decimal)
      } else {
        // 非整数
        // js四舍五入 Math.round()：正数时4舍5入，负数时5舍6入
        // Math.round(1.5) = 2
        // Math.round(-1.5) = -1
        // Math.round(-1.6) = -2
        // 保留decimals位小数
        const numStr = String(
          (
            Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal)
          ).toFixed(decimal)
        ) // 四舍五入，然后固定保留2位小数
        const decimals = numStr.slice(dotIndex, dotIndex + decimal + 1) // 截取小数位
        res = thousandFormat(numStr.slice(0, dotIndex)) + decimals
      }
      return res
    }
  } else {
    return '--'
  }
}

export function timeFormat(time) {
  var relativeTime = require('dayjs/plugin/relativeTime')
  ROOTVUE.$date.extend(relativeTime)
  return ROOTVUE.$date().to(ROOTVUE.$date(time))
}

export function timeFormatSJ(time) {
  return ROOTVUE.$date(time).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * @param {color,theme} Stirng 设置安全区域颜色
 * @description
 */

export function handleSafeZoneColor(color, theme) {
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', color)
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('media', `(prefers-color-scheme: ${theme})`)
  if (window.handleSafeZoneColor) {
    window.handleSafeZoneColor.postMessage(JSON.stringify({ color, theme }))
  } else if (window.webkit) {
    if (
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.handleSafeZoneColor
    ) {
      window.webkit.messageHandlers.handleSafeZoneColor.postMessage({
        color,
        theme
      })
    }
  }
}

/**
 * @param {direction} Stirng 横竖屏 landscape 横屏 portrait 竖屏
 * @description
 */

export function handleToggleScreenDirection(direction) {
  if (window.handleToggleScreenDirection) {
    window.handleToggleScreenDirection.postMessage(direction)
  } else if (window.webkit) {
    if (
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers.showLandscape
    ) {
      switch (direction) {
        case 'landscape':
          window.webkit.messageHandlers.showLandscape.postMessage('')
          break
        case 'portrait':
          window.webkit.messageHandlers.showPortrait.postMessage('')
          break
      }
    }
  }
}
// 切换主题
export function applyTheme(theme) {
  // 设置 CSS 变量
  for (const key in theme.cssVars) {
    document.documentElement.style.setProperty(key, theme.cssVars[key]);
  }

  // 设置 body class
  document.body.classList.remove('light-theme', 'dark-theme');
  document.body.classList.add(`${theme.name}-theme`);
}
// 检查当前主题模式是 "light" 还是 "dark"
export function getCurrentThemeMode() {
  if (typeof window === 'undefined') return 'light'; // SSR 兼容

  const classList = document.body.classList;

  if (classList.contains('dark-theme')) {
    return 'dark';
  }

  if (classList.contains('light-theme')) {
    return 'light';
  }

  // 如果未设置 class，尝试检测系统主题
  
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}