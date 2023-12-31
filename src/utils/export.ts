/**
 * Convert DailyStorageList data to CSV.
 * @param {DailyStorageList} data - Time spent data for each URL object
 * @returns {string} CSV Formatted data
 */
function convertDailyDataToCSV(data: DailyStorageList): string {
  const header = 'URL,Time Spent(minutes)'

  // Convert each item into a CSV row
  const csvRows = Object.entries(data).map(([key, item]) => {
    const { date = '', timeSpent } = item
    return `${key},${timeSpent}`
  })
  return [header, ...csvRows].join('\n')
}

/**
 * Download DailyStorageList data by CSV.
 * @param {DailyStorageList} data - Time spent data for each URL object
 * @param {filename} string - Filename for download
 */
export function downloadDailyDataCSV(data: DailyStorageList, filename: string): void {
  if (!data) {
    console.error('No LogData')
    return
  }
  const csvContent = convertDailyDataToCSV(data)
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
