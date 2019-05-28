import axios from '@/libs/api.request'

export const moneyRecordsStatic = () => {
  return axios.request({
    url: 'money_records/static',
    method: 'get'
  })
}

export const getMoneyRecords = (page, per) => {
  return axios.request({
    url: 'money_records?page=' + page + '&per=' + per,
    method: 'get'
  })
}

export const createMoneyRecord = (happened_at, income_flag, amount, tag, remark, parent_id) => {
  const data = {happened_at, income_flag, amount, tag, remark, parent_id}
  return axios.request({
    url: 'money_records',
    data,
    method: 'post'
  })
}

export const updateMoneyRecord = (id, happened_at, income_flag, amount, tag, remark, parent_id) => {
  const data = {happened_at, income_flag, amount, tag, remark, parent_id}
  return axios.request({
    url: 'money_records/' + id,
    data,
    method: 'patch'
  })
}

export const deleteMoneyRecord = (id) => {
  return axios.request({
    url: 'money_records/' + id,
    method: 'delete'
  })
}

export const getAllTag = () => {
  return axios.request({
    url: 'money_records/all_tag',
    method: 'get'
  })
}
