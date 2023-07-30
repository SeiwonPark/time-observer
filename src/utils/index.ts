/**
 * Sorts data from chrome's local storage by its key 'timeSpent' from the 'StorageItem'.
 */
export const sortByTimeSpent = (a: [string, StorageItem], b: [string, StorageItem]) => b[1].timeSpent - a[1].timeSpent

/**
 * Returns formatted times
 * @param {number} time - Time in seconds
 *
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
 * Returns domain name from the given url.
 * @param {string} url - Full URL
 * @returns {string} Domain name
 */
export const getDomainNameFromUrl = (url: string): string => {
  const match = url.match(/:\/\/(?:www\.)?(.[^/]+)/)
  return match ? match[1] : ''
}
