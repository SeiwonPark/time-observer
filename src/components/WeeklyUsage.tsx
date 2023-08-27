import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import Check from '../assets/check.svg'
import Clock from '../assets/clock.svg'
import LeftArrow from '../assets/left_arrow.svg'
import { getPast7Days, getPast7Dates, formatTime } from '../utils'
import Chart from './Chart'
import Widget from './Widget'

const Header = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`

const Title = styled.span`
  padding: 0.5em;
  font-size: 28px;
  font-weight: 600;
`

const Domain = styled.span`
  padding: 10px;
  word-wrap: break-word;
  font-size: 20px;
  font-weight: 500;
`

const Margin16 = styled.div`
  margin: 16px;
`

const Nav = styled.nav`
  cursor: pointer;
  padding: 0;
  margin: 0;
`

const WidgetContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 3%;
  margin: 20px 0 20px 0;
`

interface WeeklyUsageProps {
  endpoint: string
  today: string
}

export default function WeeklyUsage({ endpoint, today }: WeeklyUsageProps) {
  const [past7Days, setPast7Days] = useState<string[]>([])
  const [past7DaysData, setPast7DaysData] = useState<DailyStorageItem[]>()
  const [totalTime, setTotalTime] = useState<number>(0)
  const labels = getPast7Dates()
  const navigate = useNavigate()

  useEffect(() => {
    setPast7Days(getPast7Days(today))
  }, [])

  useEffect(() => {
    chrome.storage.local.get(null, (result: WeeklyStorageData) => {
      const pastData: DailyStorageItem[] = past7Days.map((day: string) => {
        const dayData = result[day] && result[day][endpoint]
        return {
          date: day,
          timeSpent: dayData ? dayData.timeSpent : 0,
          favicon: dayData ? dayData.favicon : '',
        }
      })
      setPast7DaysData(pastData)
      saveTotalTime(result)
    })
  }, [past7Days, endpoint])

  const saveTotalTime = (result: WeeklyStorageData) => {
    let tempTotalTime = 0
    for (const day of past7Days) {
      for (const domain in result[day]) {
        tempTotalTime += result[day][domain].timeSpent
      }
    }
    setTotalTime(tempTotalTime)
  }

  const getWeekTotal = (data: DailyStorageItem[] | undefined): number => {
    if (!data) return 0

    return data.reduce((total, currentItem) => {
      return total + currentItem.timeSpent
    }, 0)
  }

  const data: ChartData = {
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

  const options: ChartOptions = {
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
        callbacks: {
          label: function (context: TooltipItem) {
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
        text: `Time you spent on ${endpoint} for the past week`,
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
    <>
      <Header>
        <Nav onClick={() => navigate(-1)}>
          <LeftArrow width={40} height={40} />
        </Nav>
        <Title>Weekly Usage</Title>
      </Header>
      <Margin16>
        <Domain>{endpoint}</Domain>
      </Margin16>
      <WidgetContainer>
        <Widget
          Icon={Check}
          title="Viewer Ratings"
          content={~~((getWeekTotal(past7DaysData) * 100) / totalTime).toFixed(2)}
          unit="percent"
          backgroundColor="#e1f6e6"
        />
        <Widget
          Icon={Clock}
          title="Week Total"
          content={getWeekTotal(past7DaysData)}
          unit="time"
          backgroundColor="#e9e9ff"
        />
      </WidgetContainer>
      <Chart data={data} options={options} />
    </>
  )
}
