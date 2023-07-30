interface StorageItem {
  timeSpent: number
  favicon: string
}

interface StorageList {
  [key: string]: StorageItem
}

interface StorageData {
  [key: string]: StorageList
}
