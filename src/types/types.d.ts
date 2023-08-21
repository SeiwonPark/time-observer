/**
 * Daily storage data for each website
 */
interface DailyStorageItem {
  date?: string
  timeSpent: number
  favicon: string
}

/**
 * Daily storage data for all websites
 */
interface DailyStorageList {
  [key: string]: DailyStorageItem
}

/**
 * Weekly storage data for all websites
 */
interface WeeklyStorageData {
  [key: string]: DailyStorageList
}
