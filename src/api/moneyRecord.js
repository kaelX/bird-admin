import axios from '@/libs/api.request'
import {toParam} from '@/api/common'

export const moneyRecordsStatic = () => {
  return axios.request({
    url: 'money_records/static',
    method: 'get'
  })
}

export const staticTagPercent = (start_at, end_at, subjects, personal_share_flag) => {
  return axios.request({
    url: toParam('money_records/static_tag_percent', {start_at, end_at, subjects, personal_share_flag}),
    method: 'get'
  })
}

export const getMoneyRecords = (page, per) => {
  return axios.request({
    url: 'money_records?page=' + page + '&per=' + per,
    method: 'get'
  })
}

export const createMoneyRecord = (happened_at, income_flag, amount, tag, subject, personal_share, remark, parent_id) => {
  const data = {happened_at, income_flag, amount, tag, subject, personal_share, remark, parent_id}
  return axios.request({
    url: 'money_records',
    data,
    method: 'post'
  })
}

export const updateMoneyRecord = (id, happened_at, income_flag, amount, tag, subject, personal_share, remark, parent_id) => {
  const data = {happened_at, income_flag, amount, tag, subject, personal_share, remark, parent_id}
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

export const options = () => {
  return axios.request({
    url: 'money_records/options',
    method: 'get'
  })
}
