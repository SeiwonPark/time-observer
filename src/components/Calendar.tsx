import React, { useEffect, useState, MouseEvent } from 'react'

import { ContributionCalendar } from 'react-contribution-calendar'
import styled from 'styled-components'

import SlotBottom from '../assets/slot_bottom.svg'
import SlotTop from '../assets/slot_top.svg'
import { formatDate, getDaysBefore } from '../utils'

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Title = styled.h3`
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
`

const Wrapper = styled.div`
  border-radius: 20px;
  background-color: #fff;
`

const Container = styled.div`
  padding: 10px 15px 20px 5px;

  ::-webkit-scrollbar {
    width: 20px;
    height: 10px;
  }
`

const SlotContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const SlotButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
`

const Spacer = styled.div`
  width: 100%;
  height: 10px;
`

const Slot = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 12px 0 12px;
  padding: 12px;
  border-radius: 12px;
  background-color: #fff;
`

const SlotTopButton = styled(SlotTop)`
  cursor: pointer;
  path {
    fill: #cacaca;
  }

  &:hover path {
    fill: #000;
  }
`

const SlotBottomButton = styled(SlotBottom)`
  cursor: pointer;
  path {
    fill: #cacaca;
  }

  &:hover path {
    fill: #000;
  }
`

const SlotText = styled.span`
  padding: 4px;
  font-size: 20px;
  font-weight: bold;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
`

const EmojiGroup = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin: 0;
`

const Emoji = styled.li`
  padding: 4px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
`

const EmojiText = styled.span`
  padding-left: 4px;
  font-weight: regular;
`

export default function Calendar() {
  const THEME = { level0: '🫥', level1: '😃', level2: '🙂', level3: '😕', level4: '😢' }
  const today = formatDate()
  const [calendarData, setCalendarData] = useState<CalendarData[]>([])
  const [threshold, setThreshold] = useState<number>(3)
  const [levelCounts, setLevelCounts] = useState<{ [key: number]: number }>({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 })

  useEffect(() => {
    chrome.storage.local.get('calendar', (data) => {
      if (data.calendar) {
        const transformedData = transformCalendarData(data.calendar)
        setCalendarData(transformedData)
      }
    })
  }, [threshold, today])

  const transformCalendarData = (data: CalendarStorageData) => {
    const levelCount: { [key: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }

    const transformedData = Object.keys(data).map((date: string) => {
      let level = 0
      if (data[date] === 0) {
        level = 0
      } else if (data[date] < 1 * threshold) {
        level = 1
      } else if (data[date] < 2 * threshold) {
        level = 2
      } else if (data[date] < 3 * threshold) {
        level = 3
      } else {
        level = 4
      }

      levelCount[level] = (levelCount[level] || 0) + 1

      return {
        [date]: {
          level: level,
        },
      }
    })

    setLevelCounts(levelCount)

    return transformedData
  }

  const handleClick = (e: MouseEvent, operand: string) => {
    e.preventDefault()

    if (operand === '+') {
      setThreshold(Math.min(threshold + 1, 4))
    } else if (operand === '-') {
      setThreshold(Math.max(threshold - 1, 1))
    }
  }

  return (
    <>
      <TitleContainer>
        <Title>Calendar for the past 100 days</Title>
      </TitleContainer>
      <Wrapper>
        <Container>
          <ContributionCalendar
            data={calendarData}
            start={getDaysBefore(100, today)}
            end={today}
            cx={14}
            cy={14}
            theme={'emoji_negative'}
          />
        </Container>
      </Wrapper>
      <Spacer />
      <TitleContainer>
        <Title>Face changes every</Title>
        <SlotContainer>
          <Slot>
            <SlotText>{threshold}</SlotText>
            <SlotButtonContainer>
              <SlotTopButton width={20} height={10} onClick={(e) => handleClick(e, '+')} />
              <SlotBottomButton width={20} height={10} onClick={(e) => handleClick(e, '-')} />
            </SlotButtonContainer>
          </Slot>
        </SlotContainer>
        <Title>hours</Title>
      </TitleContainer>
      <EmojiGroup>
        <Emoji>
          {THEME.level0}
          <EmojiText>No data, {Math.min(100, levelCounts[0])} days</EmojiText>
        </Emoji>
        <Emoji>
          {THEME.level1}
          <EmojiText>
            Less than {1 * threshold} hours, {levelCounts[1]} days
          </EmojiText>
        </Emoji>
        <Emoji>
          {THEME.level2}
          <EmojiText>
            Less than {2 * threshold} hours, {levelCounts[2]} days
          </EmojiText>
        </Emoji>
        <Emoji>
          {THEME.level3}
          <EmojiText>
            Less than {3 * threshold} hours, {levelCounts[3]} days
          </EmojiText>
        </Emoji>
        <Emoji>
          {THEME.level4}
          <EmojiText>
            More than {3 * threshold} hours, {levelCounts[4]} days
          </EmojiText>
        </Emoji>
      </EmojiGroup>
    </>
  )
}
