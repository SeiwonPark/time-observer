/**
 * Converts date object to a formatted string "YYYY-MM-DD".
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 * @example
 * // returns "2023-07-30"
 * formatDate()
 */
export const formatDate = (date: Date = new Date()): string => {
  const localTime = new Date(date.getTime()).toLocaleDateString().split('/')
  return `${localTime[2]}-${String(localTime[0]).padStart(2, '0')}-${String(localTime[1]).padStart(2, '0')}`
}

/**
 * Converts seconds to a formatted string "hh:mm:ss".
 * @param {number} time - Time in seconds
 * @returns {string} Formatted time string
 * @example
 * // Returns "01:01:02"
 * formatTime(3662)
 */
export const formatTime = (time: number): string => {
  const hours = (~~(time / 3600)).toString().padStart(2, '0')
  const minutes = (~~((time % 3600) / 60)).toString().padStart(2, '0')
  const seconds = (time % 60).toString().padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}

/**
 * Converts a timestamp to a formatted string "hh:mm:ss YYYY-MM-DD".
 * @param {number} timestamp - The timestamp value.
 * @returns {string} Formatted date string.
 */
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${hours}:${minutes}:${seconds} ${year}-${month}-${day}`
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
    past7Days.unshift(formatDate(tempDate))
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
  const past7Days = getPast7Days(formatDate())
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

/**
 * Gets the full date name out of given date string.
 * @param {string} day - `YYYY-MM-DD` format date string.
 * @returns Full date name of the day.
 * @example
 * // Returns "Saturday"
 * getFullDateString('2023-07-08')
 */
export const getFullDateString = (day: string): string => {
  return new Date(day).toLocaleDateString('en-US', { weekday: 'long' })
}

/**
 * Gets the date string by the number of days before of the starting date.
 * @param {number} day - The number of days before the starting date.
 * @param {string | Date} from - The starting date to calculate from.
 * @returns {string} The date string formatted `YYYY-MM-DD`.
 */
export const getDaysBefore = (day: number, from: string | Date = new Date()): string => {
  const date = new Date(from)
  return formatDate(new Date(date.getTime() - day * 24 * 60 * 60 * 1000))
}
