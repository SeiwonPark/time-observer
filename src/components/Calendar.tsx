import React, { useEffect, useState } from 'react'

import { ContributionCalendar } from 'react-contribution-calendar'
import styled from 'styled-components'

import { formatDate, getDaysBefore } from '../utils'

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Title = styled.h2``

const Wrapper = styled.div`
  padding: 8px 0 0 0;
  border-radius: 20px;
  background-color: white;
`

const Container = styled.div`
  padding: 10px 15px 20px 5px;

  ::-webkit-scrollbar {
    width: 20px;
    height: 10px;
  }
`

const InfoIcon = styled.span`
  display: inline-block;
  color: lightgray;
  font-size: 11px;
  border-radius: 50%;
  border: 2px solid lightgray;
  width: 11px;
  height: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

export default function Calendar() {
  const THEME = { level0: '😃', level1: '🙂', level2: '😕', level3: '😢', level4: '🫥' }
  const [calendarData, setCalendarData] = useState<CalendarData[]>([])

  useEffect(() => {
    chrome.storage.local.get('calendar', (data) => {
      if (data.calendar) {
        const transformedData = transformCalendarData(data.calendar)
        setCalendarData(transformedData)
      }
    })
  }, [])

  const transformCalendarData = (data: CalendarStorageData) => {
    return Object.keys(data).map((date: string) => {
      let level = 0

      if (data[date] < 3) {
        level = 0
      } else if (data[date] < 6) {
        level = 1
      } else if (data[date] < 9) {
        level = 2
      } else if (data[date] < 12) {
        level = 3
      } else {
        level = 4
      }

      return {
        [date]: {
          level: level,
        },
      }
    })
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
            start={getDaysBefore(100)}
            end={formatDate()}
            cx={14}
            cy={14}
            theme={'emoji_negative'}
          />
        </Container>
      </Wrapper>
      <div>
        <ul>
          <li>{THEME.level0}</li>
          <li>{THEME.level1}</li>
          <li>{THEME.level2}</li>
          <li>{THEME.level3}</li>
          <li>{THEME.level4}</li>
        </ul>
      </div>
      <InfoIcon>i</InfoIcon>
    </>
  )
}
