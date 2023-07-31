import { it, describe, expect, vi, afterEach, beforeEach } from 'vitest'

import { formatDate, formatTime, getPast7days } from '../utils'

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
})
