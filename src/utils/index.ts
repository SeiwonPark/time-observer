/**
 * Sorts data from chrome's local storage by its key 'timeSpent' from the 'StorageItem'.
 */
export const sortByTimeSpent = (a: [string, StorageItem], b: [string, StorageItem]) => b[1].timeSpent - a[1].timeSpent
