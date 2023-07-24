let initialTimes: InitialTimes = {}

chrome.tabs.onActivated.addListener(getCurrentTabInfo)

async function getCurrentTabInfo() {
  try {
    const tabInfo = await chrome.tabs.query({ active: true, currentWindow: true })
    const domain = await getDomainNameFromUrl(tabInfo[0].url!)

    if (domain) {
      // FIXME: this only tracks 'www.youtube.com'
      if (domain.includes('www.youtube.com')) {
        initialTimes[domain] = new Date().getTime()
      } else {
        await saveTime('www.youtube.com')
      }
    }
  } catch (error) {
    // FIXME: Need to send error log
    console.log('An error occured')
  }
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
 * Saves time when the currently active tab's domain address is changed
 *
 * `storage.local` can store up to 10MB. (5MB before Chrome 114)
 * but can be increased by requesting the "unlimitedStorage" permission.
 * See {@link https://developer.chrome.com/docs/extensions/reference/storage/#storage-areas}
 */
async function saveTime(key: string) {
  const data = await chrome.storage.local.get([key])
  const timeSpent = (new Date().getTime() - initialTimes[key]) / 1000
  const previousTime = data[key] || 0
  await chrome.storage.local.set({ [key]: timeSpent + previousTime })
}
