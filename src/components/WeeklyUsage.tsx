import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { getPast7days } from '../utils'

// FIXME: group common components i.e. src/components/common/ or src/components/ui/
const Margin4 = styled.div`
  margin: 4px;
`

const Nav = styled.nav`
  width: fit-content;
  cursor: pointer;
  padding: 0.5em;
  font-size: 1.618em;
`

interface WeeklyUsageProps {
  endpoint: string
  today: string
}

export default function WeeklyUsage(props: WeeklyUsageProps) {
  const [past7days, setPast7days] = useState<string[]>([])
  const [past7daysData, setPast7daysData] = useState<DailyStorageList>({})
  const navigate = useNavigate()

  useEffect(() => {
    setPast7days(getPast7days(props.today))
  }, [])

  useEffect(() => {
    chrome.storage.local.get(null, (result: WeeklyStorageData) => {
      const pastData: { date: string; timeSpent: number; favicon: string }[] = []
      past7days.forEach((day) => {
        if (result[day] && props.endpoint in result[day]) {
          const temp = {
            date: day,
            ...result[day][props.endpoint],
          }
          pastData.push(temp)
        }
      })
      setPast7daysData(pastData)
    })
  }, [past7days, props.endpoint])

  return (
    <Margin4>
      <Nav onClick={() => navigate(-1)}>&larr;</Nav>
      <ul>
        {Object.values(past7daysData).map((dailyItemData: DailyStorageItem, index) => (
          <li key={index}>{JSON.stringify(dailyItemData)}</li>
        ))}
      </ul>
    </Margin4>
  )
}
