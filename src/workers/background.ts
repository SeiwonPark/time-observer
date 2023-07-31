import { formatDate, getDomainNameFromUrl, handleDatesQueue } from '../utils'

const defaultFavicon = '/default.png'
let checkInterval: NodeJS.Timeout | null = null
const datesQueue: string[] = []

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
    console.log('An error occured')
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
    const favicon = tab.favIconUrl || defaultFavicon

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
  sendNotification(domain, currentTimeSpent)

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
  const interval = 10 // FIXME: currently sends notification for every 10 seconds
  if (currentTimeSpent % interval !== 0) {
    return
  }

  const hours = currentTimeSpent / interval

  chrome.notifications.create('notification', {
    type: 'basic',
    iconUrl: './default.png',
    title: domain,
    message: 'You have spent ' + hours + ' hour(s) on ' + domain,
  })
}
