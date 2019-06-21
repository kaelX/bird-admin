import axios from '@/libs/api.request'

export const getRouterReq = (access) => {
  return axios.request({
    url: 'get_router',
    params: {
      access
    },
    method: 'get'
  })
}

export const ping = () => {
  return axios.request({
    url: 'ping',
    method: 'get'
  })
}
