import { UPDATE_CALENDAR_INTERVAL } from 'constants/number'

import { formatDate, getDateDifference, getDomainNameFromUrl, handleDatesQueue } from '../utils'

const DEFAULT_ICON = '/default.png'
const NOTIFICATION_INTERVAL = 3600 // seconds
let checkInterval: NodeJS.Timeout | null = null
let calendar: CalendarStorageData = {}
const datesQueue: string[] = []
const placeholderData: CalendarStorageData = {}

/**
 * Initail chrome notification doesn't seem to work at initial operation if current
 * notification stack is full. This is to resolve the initial-start issue.
 *
 * _NOTE_: This could not be shown if current notification stack is full. If you clear
 * the all notifications, then it should work as expected.
 */
chrome.notifications.create('notification-welcome', {
  type: 'basic',
  iconUrl: DEFAULT_ICON,
  title: '🎉 Welcome!',
  message: 'Want to see detailed features? Please check https://github.com/encaffeine/time-observer 👈',
})
chrome.storage.local.set({
  notifications: [
    {
      date: formatDate(),
      domain: 'Welcome',
      timeSpent: 0,
      favicon: DEFAULT_ICON,
      timestamp: Date.now(),
    },
  ],
})
chrome.storage.local.get('calendar', (data) => {
  if (data.calendar) {
    calendar = data.calendar
  } else {
    const today = new Date()

    for (let i = 0; i <= 100; ++i) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() - i)

      const formattedDate = formatDate(currentDate)
      placeholderData[formattedDate] = 0
    }

    chrome.storage.local.set({ calendar: placeholderData })
    calendar = placeholderData
  }
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
  const notificationStorageData = await chrome.storage.local.get('notifications')
  const notifications: TimeNotification[] = notificationStorageData.notifications || []
  let notification: TimeNotification = {
    date: '',
    domain: '',
    timeSpent: 0,
    favicon: '',
    timestamp: 0,
  }

  data[today] = data[today] === undefined ? {} : data[today]

  const previousData: DailyStorageItem =
    data[today][domain] !== undefined ? data[today][domain] : { timeSpent: 0, favicon: favicon }

  data[today][domain] = {
    timeSpent: previousData.timeSpent + second,
    favicon: previousData.favicon,
  }

  await chrome.storage.local.set(data)

  const currentTimeSpent = data[today][domain].timeSpent
  if (currentTimeSpent !== 0 && currentTimeSpent % NOTIFICATION_INTERVAL === 0) {
    notification = sendNotification(domain, currentTimeSpent, previousData.favicon || DEFAULT_ICON)
    notifications.push(notification)
    await chrome.storage.local.set({ notifications: notifications })
  }

  const dateExpired = handleDatesQueue(today, datesQueue, 7)
  if (dateExpired && dateExpired !== '') {
    removeExpiredDate(dateExpired)
    await removeExpiredNotification()
  }

  if (currentTimeSpent !== 0 && currentTimeSpent % UPDATE_CALENDAR_INTERVAL == 0) {
    await updateCalendarData(today, second)
  }
}

/**
 * Updates the calendar data with the given date and time spent.
 * @param {string} date - The date for which to update the time spent.
 * @param {number} interval - The time spent on the date. (increments by every UPDATE_CALENDAR_INTERVALs)
 */
async function updateCalendarData(date: string, interval: number): Promise<void> {
  const prevTimeSpent = calendar[date] || 0
  calendar[date] = prevTimeSpent + interval

  if (Object.keys(calendar).length > 100) {
    const earliestDate = Object.keys(calendar).sort()[0]
    delete calendar[earliestDate]
  }

  await chrome.storage.local.set({ calendar })
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
 * @param {string} favicon - Favicon URL
 */
function sendNotification(domain: string, currentTimeSpent: number, favicon: string): TimeNotification {
  const time = currentTimeSpent / NOTIFICATION_INTERVAL

  chrome.notifications.create(`notification-${Date.now()}`, {
    type: 'basic',
    iconUrl: DEFAULT_ICON,
    title: domain,
    message: `You have spent ${time} ${time === 1 ? 'hour' : 'hours'} on ${domain}`,
  })

  return {
    date: formatDate(),
    domain: domain,
    timeSpent: currentTimeSpent,
    favicon: favicon,
    timestamp: Date.now(),
  }
}

/**
 * Remove notification that has exceeded more than 7 days
 */
async function removeExpiredNotification(): Promise<void> {
  const notificationStorageData = await chrome.storage.local.get('notifications')
  const notifications = notificationStorageData.notifications || []
  const filteredNotifications = notifications.filter(
    (notification: TimeNotification) => getDateDifference(notification.date, formatDate()) > 7
  )
  await chrome.storage.local.set({ notifications: filteredNotifications })
}
