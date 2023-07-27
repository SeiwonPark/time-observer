interface InitialTimes {
  [key: string]: number
}

interface StorageItem {
  timeSpent: number
  favicon: string
}

interface StorageData {
  [key: string]: StorageItem
}
