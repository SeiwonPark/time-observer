/**
 * Returns domain name from the given url.
 * @param {string} url - Full URL
 * @returns {string} Domain name
 */
export const getDomainNameFromUrl = (url: string): string => {
  const match = url.match(/:\/\/(?:www\.)?(.[^/]+)/)
  return match ? match[1] : ''
}
