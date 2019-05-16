import axios from '@/libs/api.request'

export const login = ({userName, password}) => {
  const data = {name: userName, password}
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: 'user_info',
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUsers = () => {
  return axios.request({
    url: 'users',
    method: 'get'
  })
}

export const createUser = (name, avatar, password) => {
  const data = {name, avatar, password}
  return axios.request({
    url: 'users',
    data,
    method: 'post'
  })
}

export const updateUser = (id, name, avatar, password) => {
  const data = {name, avatar, password}
  return axios.request({
    url: 'users/' + id,
    data,
    method: 'patch'
  })
}

export const deleteUser = (id) => {
  return axios.request({
    url: 'users/' + id,
    method: 'delete'
  })
}

export const checkName = (id, name) => {
  return axios.request({
    url: 'users/' + id + '/check_name?' + 'name=' + name,
    method: 'get'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
