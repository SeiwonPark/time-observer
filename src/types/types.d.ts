/**
 * Daily storage data for each website
 */
interface DailyStorageItem {
  timeSpent: number
  favicon: string
}

/**
 * Daily storage data for all websites
 */
interface DailyStorageList {
  [key: string]: StorageItem
}

/**
 * Weekly storage data for all websites
 */
interface WeeklyStorageData {
  [key: string]: StorageList
}
