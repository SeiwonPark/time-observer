import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import Stopwatch from '../assets/stopwatch.svg'
import { formatDate, formatTime, getPast7Days } from '../utils'

const Title = styled.h1`
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
`

const CardList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`

const DateTitle = styled.h2`
  padding: 10px 0;
`

const Card = styled.li`
  margin: 8px 0;
  padding: 12px 8px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12px;
  cursor: pointer;
`

const Favicon = styled.img`
  padding: 10px;
`

const CardContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const CardDetail = styled.div`
  padding-left: 8px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 4px;
`

const Domain = styled.span`
  font-size: 12px;
  font-weight: 700;
  padding: 4px;
`

const Badge = styled.div`
  padding: 4px 8px;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #636363;
  font-size: 12px;
  background-color: #f5f5f5;
`

export default function NotificationList() {
  const [groupedNotifications, setGroupedNotifications] = useState<WeeklyTimeNotification>({})

  useEffect(() => {
    chrome.storage.local.get('notifications', (data) => {
      if (data.notifications) {
        const groups = data.notifications.reduce(
          (weeklyNotifications: WeeklyTimeNotification, dailyNotification: TimeNotification) => {
            weeklyNotifications[dailyNotification.date] = weeklyNotifications[dailyNotification.date] || []
            weeklyNotifications[dailyNotification.date].push(dailyNotification)
            return weeklyNotifications
          },
          {}
        )
        setGroupedNotifications(groups)
      }
    })
  }, [])

  return (
    <>
      <Title>Notifications</Title>
      {Object.keys(groupedNotifications).length === 0 ? (
        <span>No notifications found.</span>
      ) : (
        getPast7Days(formatDate())
          .reverse()
          .map((day: string, index: number) => {
            const dayNotifications = groupedNotifications[day]

            if (dayNotifications && dayNotifications.length > 0) {
              return (
                <CardList key={index}>
                  <DateTitle>
                    {day === new Date().toISOString().split('T')[0]
                      ? 'Today'
                      : `Last ${new Date(day).toLocaleDateString('en-US', { weekday: 'long' })}`}
                  </DateTitle>
                  {dayNotifications.reverse().map((notification: TimeNotification, index: number) => (
                    <Card key={index}>
                      <CardContent>
                        <Favicon src={notification.favicon} alt="favicon" width="20" height="20" />
                        <CardDetail>
                          <Domain>{notification.domain}</Domain>
                          <Badge>
                            <Stopwatch color="#636363" width="20" height="20" />
                            {formatTime(notification.timeSpent)}
                          </Badge>
                        </CardDetail>
                      </CardContent>
                    </Card>
                  ))}
                </CardList>
              )
            }
            return null
          })
      )}
    </>
  )
}
