/**
 * Sorts data from chrome's local storage by its key 'timeSpent' from the 'DailyStorageItem'.
 */
export const sortByTimeSpent = (a: [string, DailyStorageItem], b: [string, DailyStorageItem]) =>
  b[1].timeSpent - a[1].timeSpent

/**
 * Handles dates to save only the last 7 days' data. This will push if `today` doesn't exist
 * in current queue. And this will pop if the current queue length is larger than 7.
 * @param {string} today - Today's date
 * @param {string[]} datesQueue - The queue containing dates
 */
export const handleDatesQueue = (today: string, datesQueue: string[]): string | undefined => {
  if (!datesQueue.includes(today)) {
    datesQueue.push(today)
  }

  return datesQueue.length > 7 ? datesQueue.shift() : ''
}
