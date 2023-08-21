import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import LeftArrow from '../assets/left_arrow.svg'
import { getPast7Days, getPast7Dates, formatTime } from '../utils'
import Chart from './Chart'

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
  const [past7Days, setPast7Days] = useState<string[]>([])
  const [past7DaysData, setPast7DaysData] = useState<DailyStorageItem[]>()
  const labels = getPast7Dates()
  const navigate = useNavigate()

  useEffect(() => {
    setPast7Days(getPast7Days(props.today))
  }, [])

  useEffect(() => {
    chrome.storage.local.get(null, (result: WeeklyStorageData) => {
      const pastData: { date: string; timeSpent: number; favicon: string }[] = past7Days.map((day) => {
        const dayData = result[day] && result[day][props.endpoint]
        return {
          date: day,
          timeSpent: dayData ? dayData.timeSpent : 0,
          favicon: dayData ? dayData.favicon : '',
        }
      })
      setPast7DaysData(pastData)
    })
  }, [past7Days, props.endpoint])

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'time',
        data: past7DaysData ? past7DaysData.map((item) => item.timeSpent) : [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.4)',
        tension: 0.4,
      },
    ],
  }

  const options = {
    interaction: {
      mode: 'index',
      axis: 'x',
      intersect: false,
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        events: ['mousemove', 'mouseout', 'touchstart', 'touchmove'],
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || ''
            if (label) {
              const formattedTime = formatTime(context.parsed.y)
              return `${label}: ${formattedTime}`
            } else {
              return label
            }
          },
        },
      },
      title: {
        display: true,
        text: `Time you spent on ${props.endpoint} for the past week`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days of the Week',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Time Spent (seconds)',
        },
      },
    },
  }

  return (
    <Margin4>
      <Nav onClick={() => navigate(-1)}>
        <LeftArrow width={40} />
      </Nav>
      <Chart data={data} options={options} />
    </Margin4>
  )
}
