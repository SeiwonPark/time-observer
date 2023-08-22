import { formatDate, getDateDifference, getDomainNameFromUrl, handleDatesQueue } from '../utils'

const DEFAULT_ICON = '/default.png'
const NOTIFICATION_INTERVAL = 3600 // seconds
let checkInterval: NodeJS.Timeout | null = null
const datesQueue: string[] = []

/**
 * Initail chrome notification doesn't seem to work at initial operation if current
 * notification stack is full. This is to resolve the initial-start issue.
 *
 * _NOTE_: This could not be shown if current notification stack is full. If you clear
 * the all notifications, then it should work as expected.
 */
chrome.notifications.create(`notification-welcome`, {
  type: 'basic',
  iconUrl: DEFAULT_ICON,
  title: '🎉 Welcome!',
  message: 'Want to see detailed features? Please check https://github.com/seiwon-yaehee/time-observer 👈',
})

/**
 * Defines domain name to filter
 */
const blackLists = ['extensions', 'newtab']

chrome.tabs.onActivated.addListener(initObserve)

/**
 * An entry point of 'tabs.onActivated' listener. This will observe
 * all tabs to track each tab usages on every seconds while it's
 * been activated.
 */
async function initObserve(activeInfo: chrome.tabs.TabActiveInfo) {
  try {
    await setTimeInterval(activeInfo.tabId, 1)
  } catch (error) {
    // FIXME: Need to send error log
  }
}

/**
 * Sets time interval for read and save the spent on the active tab.
 * @param {number | null} activeTabId - Unique active tab's ID
 * @param {number} second - Time interval for saving the time
 */
async function setTimeInterval(activeTabId: number | null, second: number = 1): Promise<void> {
  // clear interval if exists
  if (checkInterval) {
    clearInterval(checkInterval)
  }

  checkInterval = setInterval(async () => {
    if (activeTabId === null) {
      return
    }

    const tab = await chrome.tabs.get(activeTabId)

    if (!tab.url) {
      return
    }

    const domain = getDomainNameFromUrl(tab.url)
    const favicon = tab.favIconUrl || DEFAULT_ICON

    if (blackLists.includes(domain)) {
      return
    }

    if (domain) {
      await saveTime(domain, favicon, second)
    }
  }, second * 1000)
}

/**
 * Saves time on every seconds from the active tab.
 *
 * `storage.local` can store up to 10MB (5MB before Chrome 114)
 * but can be increased by requesting the "unlimitedStorage" permission.
 * See {@link https://developer.chrome.com/docs/extensions/reference/storage/#storage-areas}
 *
 * @param {string} domain - Domain name
 * @param {string} favicon - Favicon URL
 * @param {number} second - Time interval for saving the time
 */
async function saveTime(domain: string, favicon: string, second: number): Promise<void> {
  const today = formatDate()
  const data: WeeklyStorageData = await chrome.storage.local.get([today])
  data[today] = data[today] === undefined ? {} : data[today]

  const previousData: DailyStorageItem =
    data[today][domain] !== undefined ? data[today][domain] : { timeSpent: 0, favicon: favicon }

  data[today][domain] = {
    timeSpent: previousData.timeSpent + second,
    favicon: previousData.favicon,
  }

  await chrome.storage.local.set(data)

  const currentTimeSpent = data[today][domain].timeSpent
  if (currentTimeSpent % NOTIFICATION_INTERVAL === 0) {
    sendNotification(domain, currentTimeSpent)

    const notificationData = await chrome.storage.local.get('notifications')
    const notifications = notificationData.notifications || []
    const notification: TimeNotification = {
      date: today,
      domain: domain,
      timeSpent: currentTimeSpent,
      favicon: favicon,
      timestamp: Date.now(),
    }

    notifications.push(notification)

    await chrome.storage.local.set({ notifications })
    await removeExpiredNotification()
  }

  const dateExpired = handleDatesQueue(today, datesQueue)
  if (dateExpired && dateExpired !== '') {
    removeExpiredDate(dateExpired)
  }
}

/**
 * Removes date from Chrome's local storage
 * @param {string} dateExpired - The date to be removed
 */
async function removeExpiredDate(dateExpired: string): Promise<void> {
  if (dateExpired) {
    await chrome.storage.local.remove(dateExpired)
  }
}

/**
 * Sends a notification
 * @param {string} domain - Domain name
 * @param {number} currentTimeSpent - The time spent on the domain
 */
function sendNotification(domain: string, currentTimeSpent: number): void {
  chrome.notifications.create(`notification-${Date.now()}`, {
    type: 'basic',
    iconUrl: DEFAULT_ICON,
    title: domain,
    message: `You have spent ${currentTimeSpent} seconds on ${domain}`,
  })
}

/**
 * Remove notification that has exceeded more than
 */
async function removeExpiredNotification(): Promise<void> {
  const notificationData = await chrome.storage.local.get('notifications')
  const notifications = notificationData.notifications || []
  const filteredNotifications = notifications.filter(
    (notification: TimeNotification) => getDateDifference(notification.date, formatDate()) > 7
  )
  await chrome.storage.local.set({ notifications: filteredNotifications })
}
