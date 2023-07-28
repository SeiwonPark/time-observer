const initialTimes: InitialTimes = {}
let checkInterval: NodeJS.Timeout | null = null

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

    const domain = await getDomainNameFromUrl(tab.url)
    const favicon = tab.favIconUrl || ''

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
 * @param {string} key - Domain name
 * @param {string} favicon - Favicon URL
 * @param {number} second - Time interval for saving the time
 */
async function saveTime(key: string, favicon: string, second: number): Promise<void> {
  const data = await chrome.storage.local.get([key])
  const previousData = data[key] !== undefined ? data[key] : { timeSpent: 0, favicon: '' }

  await chrome.storage.local.set({
    [key]: {
      timeSpent: previousData.timeSpent + second,
      favicon: previousData.favicon || favicon,
    },
  })

  initialTimes[key] = new Date().getTime()
  await initializeFavicon(key, favicon)
}

/**
 * Returns domain name from the given url.
 * @param {string} url - Full URL
 * @returns {string} Domain name
 */
async function getDomainNameFromUrl(url: string): Promise<string> {
  const match = url.match(/:\/\/(.[^/]+)/)
  return match ? match[1] : ''
}

/**
 * Sets favicon url only if it's not set.
 * @param {string} key - Domain name
 * @param {string} favicon - Favicon URL
 */
async function initializeFavicon(key: string, favicon: string): Promise<void> {
  const data = await chrome.storage.local.get([key])
  if (data[key] === undefined || data[key].favicon === '') {
    await chrome.storage.local.set({
      [key]: {
        timeSpent: 0,
        favicon: favicon,
      },
    })
  }
}
