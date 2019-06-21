export const CreateFlag = 0

export const isCreating = (id) => {
  return id === CreateFlag
}

export const isSuc = (data) => {
  return data.code === 0
}

export const toParam = (url, obj) => {
  return url + '?' + Object.entries(obj).map(([key, val]) => `${key}=${val}`).join('&')
}
