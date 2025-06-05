import HttpRequest from '@/axios/axios.js'
import CONFIG from '@/config/config.js'
let baseURL =
  CONFIG.ENV === 'DEVELOP'
    ? `${CONFIG.API_ROOT_MAP[CONFIG.ENV]}${CONFIG.API_ROOT_MAP['PREFIX']}`
    : window.location.origin  +  CONFIG.API_ROOT_MAP['PREFIX']

const axios = new HttpRequest(baseURL)
export default axios
