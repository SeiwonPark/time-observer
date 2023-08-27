/**
 * Sorts data from chrome's local storage by its key 'timeSpent' from the 'DailyStorageItem'.
 */
export const sortByTimeSpent = (a: [string, DailyStorageItem], b: [string, DailyStorageItem]) =>
  b[1].timeSpent - a[1].timeSpent

/**
 * Handles dates to save only the last number of days' data. This will push if `today` doesn't exist
 * in current queue. And this will pop the oldest element if the length of current queue is larger
 * than the given size.
 * @param {string} today - Today's date.
 * @param {string[]} datesQueue - The queue containing dates.
 * @param {number} size - The length of queue to store the data.
 */
export const handleDatesQueue = (today: string, datesQueue: string[], size: number): string | undefined => {
  if (!datesQueue.includes(today)) {
    datesQueue.push(today)
  }

  return datesQueue.length > size ? datesQueue.shift() : ''
}
