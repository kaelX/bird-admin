const moment = require('moment')
const dateFormat = 'YYYY-MM-DD'

export const parseDateFlag = (flag) => {
  if (flag === '0') {
    return lastMonthDate()
  } else if (flag === '1') {
    return lastWeekDate()
  } else if (flag === '2') {
    return pastWeekDate()
  } else if (flag === '3') {
    return pastMonthDate()
  } else if (flag === '4') {
    return pastQuaterDate()
  } else if (flag === '5') {
    return pastYearDate()
  } else {
    return lastMonthDate()
  }
}

export const lastMonthDate = () => {
  var re = moment().month(moment().month() - 1)
  return [re.startOf('month').format(dateFormat), re.endOf('month').format(dateFormat)]
}

export const lastWeekDate = () => {
  var re = moment().week(moment().week() - 1)
  return [re.startOf('week').format(dateFormat), re.endOf('week').format(dateFormat)]
}

export const pastWeekDate = () => {
  return [moment().subtract(7, 'days').format(dateFormat), moment().subtract(1, 'days').format(dateFormat)]
}

export const pastMonthDate = () => {
  return [moment().subtract(30, 'days').format(dateFormat), moment().subtract(1, 'days').format(dateFormat)]
}

export const pastQuaterDate = () => {
  return [moment().subtract(90, 'days').format(dateFormat), moment().subtract(1, 'days').format(dateFormat)]
}

export const pastYearDate = () => {
  return [moment().subtract(365, 'days').format(dateFormat), moment().subtract(1, 'days').format(dateFormat)]
}
