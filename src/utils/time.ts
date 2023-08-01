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
  const hours = ~~(time / 3600)
  const minutes = ~~((time % 3600) / 60)
  const seconds = time % 60

  return `
    ${hours.toString().padStart(2, '0')}h 
    ${minutes.toString().padStart(2, '0')}m 
    ${seconds.toString().padStart(2, '0')}s
  `
}

/**
 * Returns past 7 days from today
 * @param {string} today - Date string for today
 * @returns {string[]} Date list of the past 7 days from today
 */
export const getPast7days = (today: string): string[] => {
  const date = new Date(today)
  let past7days = []

  for (let i = 0; i < 7; i++) {
    let tempDate = new Date(date)
    tempDate.setDate(date.getDate() - i)
    past7days.unshift(tempDate.toISOString().split('T')[0])
  }

  return past7days
}
