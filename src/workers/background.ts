const initialTimes: InitialTimes = {}

chrome.tabs.onActivated.addListener(initObserve)

/**
 * An entry point of 'tabs.onActivated' listener. This will observe
 * all tabs to track each tab usages while it's been activated.
 */
async function initObserve() {
  try {
    const currentTabInfo = await getCurrentTabInfo()
    const domain = await getDomainNameFromUrl(currentTabInfo.url!)
    const favicon = currentTabInfo.favIconUrl!

    if (domain) {
      await saveTime(domain, favicon)
    }
  } catch (error) {
    // FIXME: Need to send error log
    console.log('An error occured')
  }
}

/**
 * Get currently active tab's informations.
 * @returns {Promise<chrome.tabs.Tab>} All tab informations
 */
async function getCurrentTabInfo(): Promise<chrome.tabs.Tab> {
  const tabList = await chrome.tabs.query({ active: true, currentWindow: true })
  return tabList[0]
}

/**
 * Check if the chrome local storage has the key.
 * @param {string} key Domain name
 */
async function checkExistsByKey(key: string): Promise<boolean> {
  const data = await chrome.storage.local.get([key])
  return data.key !== '' && data.key !== undefined && data.key !== null
}

/**
 * Returns domain name from the given url.
 * @param {string} url Full URL
 * @returns {string} Domain name
 */
async function getDomainNameFromUrl(url: string): Promise<string> {
  const match = url.match(/:\/\/(.[^/]+)/)
  return match ? match[1] : ''
}

/**
 * Saves time when the currently active tab's domain address is changed.
 *
 * `storage.local` can store up to 10MB (5MB before Chrome 114)
 * but can be increased by requesting the "unlimitedStorage" permission.
 * See {@link https://developer.chrome.com/docs/extensions/reference/storage/#storage-areas}
 *
 * @param {string} key Domain name
 * @param {string} favicon Favicon URL
 */
async function saveTime(key: string, favicon: string): Promise<void> {
  for (let k in initialTimes) {
    if (initialTimes.hasOwnProperty(k) && initialTimes[k] !== undefined && initialTimes[k] !== 0) {
      const data = await chrome.storage.local.get([k])
      const previousData = data[k] !== undefined ? data[k] : { timeSpent: 0, favicon: '' }

      const timeSpent = (new Date().getTime() - initialTimes[k]) / 1000
      await chrome.storage.local.set({
        [k]: {
          timeSpent: timeSpent + previousData.timeSpent,
          favicon: previousData.favicon,
        },
      })
      initialTimes[k] = 0
    }
  }
  initialTimes[key] = new Date().getTime()
  await initializeFavicon(key, favicon)
}

/**
 * Sets favicon url only if it's not set.
 * @param {string} key Domain name
 * @param {string} favicon Favicon URL
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
