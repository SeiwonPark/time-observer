/**
 * Sorts data from chrome's local storage by its key 'timeSpent' from the 'DailyStorageItem'.
 */
export const sortByTimeSpent = (a: [string, DailyStorageItem], b: [string, DailyStorageItem]) =>
  b[1].timeSpent - a[1].timeSpent
