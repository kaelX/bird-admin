const moment = require('moment')
const dateFormat = 'YYYY-MM-DD'

export const parseDateFlag = (flag) => {
  if (flag === 'lastMonth') {
    return lastMonthDate()
  } else if (flag === 'lastWeek') {
    return lastWeekDate()
  } else if (flag === 'currentMonth') {
    return currentMonthDate()
  } else if (flag === 'currentWeek') {
    return currentWeekDate()
  } else if (flag === 'pastWeek') {
    return pastWeekDate()
  } else if (flag === 'pastMonth') {
    return pastMonthDate()
  } else if (flag === 'pastQuater') {
    return pastQuaterDate()
  } else if (flag === 'pastYear') {
    return pastYearDate()
  } else {
    return lastMonthDate()
  }
}

export const lastMonthDate = () => {
  var re = moment().month(moment().month() - 1)
  return [re.startOf('month').format(dateFormat), re.endOf('month').format(dateFormat)]
}

export const currentMonthDate = () => {
  var re = moment().month(moment().month())
  return [re.startOf('month').format(dateFormat), re.endOf('month').format(dateFormat)]
}

export const lastWeekDate = () => {
  var re = moment().week(moment().week() - 1)
  return [re.startOf('week').format(dateFormat), re.endOf('week').format(dateFormat)]
}

export const currentWeekDate = () => {
  var re = moment().week(moment().week())
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

export const parseDate = (date) => {
  return moment(date).format(dateFormat)
}
