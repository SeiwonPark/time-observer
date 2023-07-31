import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'

import { formatDate, formatTime, getDomainNameFromUrl, getPast7days, sortByTimeSpent } from '../utils'

describe('Utils Test', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-07-08'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('formatDate returns formatted date without parameter', () => {
    const date = formatDate()
    expect(date).toBe('2023-07-08')
  })

  it('formatDate returns formatted date with parameter', () => {
    const date = formatDate(new Date(2023, 0, 1))
    expect(date).toBe('2023-01-01')
  })

  it('formatTime returns formatted time', () => {
    const time = formatTime(3662)
    expect(time.trim()).toBe('01h 01m 02s')
  })

  it('getPast7days returns an array of the past 7 dates including today in order', () => {
    const today = formatDate()
    const dates = getPast7days(today)
    // in order
    expect(dates).toEqual([
      '2023-07-02',
      '2023-07-03',
      '2023-07-04',
      '2023-07-05',
      '2023-07-06',
      '2023-07-07',
      '2023-07-08',
    ])

    // not in order
    expect(dates).not.toEqual([
      '2023-07-08',
      '2023-07-02',
      '2023-07-03',
      '2023-07-04',
      '2023-07-05',
      '2023-07-06',
      '2023-07-07',
    ])
  })

  it('getDomainNameFromUrl returns domain from the given URL', () => {
    const https = getDomainNameFromUrl('https://www.youtube.com')
    expect(https).toBe('youtube.com')

    const http = getDomainNameFromUrl('http://google.com')
    expect(http).toBe('google.com')

    const deepLink = getDomainNameFromUrl('https://some.deep.link.domain.com/some/path')
    expect(deepLink).toBe('some.deep.link.domain.com')

    const invalid = getDomainNameFromUrl('THIS IS NOT A URL')
    expect(invalid).toBe('')
  })

  it('sortByTimeSpent sorts the given array by timeSpent in descending order', () => {
    const data: [string, DailyStorageItem][] = [
      ['youtube.com', { timeSpent: 200, favicon: '/default.png' }],
      ['google.com', { timeSpent: 100, favicon: '/default.png' }],
      ['some.domain.com', { timeSpent: 300, favicon: '/default.png' }],
    ]

    const sortedData = data.sort(sortByTimeSpent)

    expect(sortedData).toEqual([
      ['some.domain.com', { timeSpent: 300, favicon: '/default.png' }],
      ['youtube.com', { timeSpent: 200, favicon: '/default.png' }],
      ['google.com', { timeSpent: 100, favicon: '/default.png' }],
    ])
  })
})
