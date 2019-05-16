import HttpRequest from '@/libs/axios'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
const {apiVersion} = config
const axios = new HttpRequest(baseUrl + apiVersion)
export default axios
