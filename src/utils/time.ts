/**
 * Returns formatted date
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 * @example
 * // returns "2023-07-30"
 * formatDate()
 */
export const formatDate = (date: Date = new Date()): string => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
}

/**
 * Returns formatted times
 * @param {number} time - Time in seconds
 * @returns {string} Formatted time string
 * @example
 * // Returns "01h 01m 02s"
 * formatTime(3662)
 */
export const formatTime = (time: number): string => {
  const hours = (~~(time / 3600)).toString().padStart(2, '0')
  const minutes = (~~((time % 3600) / 60)).toString().padStart(2, '0')
  const seconds = (time % 60).toString().padStart(2, '0')

  return `${hours}h ${minutes}m ${seconds}s`
}

/**
 * Returns past 7 days from today
 * @param {string} today - Date string for today
 * @returns {string[]} Date list of the past 7 days from today
 * @example
 * // Returns ['2023-08-15', '2023-08-16', '2023-08-17', '2023-08-18', '2023-08-19', '2023-08-20', '2023-08-21']
 * getPast7Days('2023-08-21')
 */
export const getPast7Days = (today: string): string[] => {
  const date = new Date(today)
  const past7Days = []

  for (let i = 0; i < 7; ++i) {
    const tempDate = new Date(date)
    tempDate.setDate(date.getDate() - i)
    past7Days.unshift(tempDate.toISOString().split('T')[0])
  }

  return past7Days
}

/**
 * Returns past 7 dates from today
 * @returns {string[]} Date list of the past 7 days from today
 * @example
 * // Returns ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'] (on '2023-08-21')
 * getPast7Dates()
 */
export const getPast7Dates = (): string[] => {
  const DATES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const past7Days = getPast7Days(new Date().toISOString().split('T')[0])
  const past7Dates = []

  for (let i = 0; i < 7; ++i) {
    past7Dates.push(DATES[new Date(past7Days[i]).getDay()])
  }

  return past7Dates
}

/**
 * Calculates the date difference between the two dates.
 * @param {string} date1 - `YYYY-MM-DD` format date string.
 * @param {string} date2 - `YYYY-MM-DD` format date string.
 * @returns {number} Integer value of date difference between the two dates.
 */
export const getDateDifference = (date1: string, date2: string): number => {
  const diffMilliseconds = Math.abs(new Date(date1).getTime() - new Date(date2).getTime())
  return ~~(diffMilliseconds / (24 * 60 * 60 * 1000))
}
