import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

import Close from '../assets/close.svg'
import Stopwatch from '../assets/stopwatch.svg'
import { formatDate, formatTime, getFullDateString, getPast7Days } from '../utils'
import ToggleButton from './ToggleButton'

const EmptyText = styled.span`
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #999999;
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const EditText = styled.span`
  margin-left: auto;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
`

const CardList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`

const DateTitle = styled.h2``

const Card = styled.li`
  position: relative;
  margin: 8px 4px;
  padding: 12px 8px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12px;
`

const CloseButton = styled(Close)`
  position: absolute;
  width: 18px;
  height: 18px;
  padding: 4px;
  top: -5px;
  right: -7px;
  cursor: pointer;
`

const Favicon = styled.img`
  padding: 10px;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
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
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
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
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
`

const Spacer = styled.div`
  width: 100%;
  height: 80px;
`

export default function NotificationList() {
  const today = formatDate()
  const [groupedNotifications, setGroupedNotifications] = useState<WeeklyTimeNotification>({})
  const [toggled, setToggled] = useState<boolean>(false)

  useEffect(() => {
    chrome.storage.local.get('notifications', (data: WeeklyTimeNotification) => {
      if (data.notifications) {
        const groups = data.notifications
          .sort((a: TimeNotification, b: TimeNotification) => a.timestamp - b.timestamp)
          .reduce((weeklyNotifications: WeeklyTimeNotification, dailyNotification: TimeNotification) => {
            weeklyNotifications[dailyNotification.date] = weeklyNotifications[dailyNotification.date] || []
            weeklyNotifications[dailyNotification.date].push(dailyNotification)
            return weeklyNotifications
          }, {})
        setGroupedNotifications(groups)
      }
    })
  }, [today])

  const removeNotification = (date: string, domain: string, timeSpent: number) => {
    chrome.storage.local.get('notifications', (data: WeeklyTimeNotification) => {
      if (data.notifications) {
        const updatedNotifications = data.notifications.filter(
          (notification: TimeNotification) =>
            !(notification.date === date && notification.domain === domain && notification.timeSpent === timeSpent)
        )

        chrome.storage.local.set({ notifications: updatedNotifications }, () => {
          const updatedGroups = { ...groupedNotifications }
          updatedGroups[date] = updatedGroups[date].filter(
            (notification: TimeNotification) =>
              !(notification.domain === domain && notification.timeSpent === timeSpent)
          )

          if (updatedGroups[date].length === 0) {
            delete updatedGroups[date]
          }

          setGroupedNotifications(updatedGroups)
        })
      }
    })
  }

  const getLatestDate = () => {
    const dates = Object.keys(groupedNotifications)
    return dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : null
  }

  return (
    <>
      {Object.keys(groupedNotifications).length === 0 ? (
        <EmptyText>All messages are read.</EmptyText>
      ) : (
        getPast7Days(formatDate())
          .reverse()
          .map((day: string, index: number) => {
            const dayNotifications = groupedNotifications[day]

            if (dayNotifications && dayNotifications.length > 0) {
              return (
                <CardList key={index}>
                  {day === today || day === getLatestDate() ? (
                    <TitleContainer>
                      <DateTitle>{day === today ? 'Today' : `Last ${getFullDateString(day)}`}</DateTitle>
                      <EditText>Edit</EditText>
                      <ToggleButton toggle={setToggled} />
                    </TitleContainer>
                  ) : (
                    <DateTitle>{`Last ${getFullDateString(day)}`}</DateTitle>
                  )}
                  {dayNotifications
                    .slice()
                    .reverse()
                    .map((notification: TimeNotification, index: number) => (
                      <Card key={index}>
                        {toggled && (
                          <CloseButton
                            onClick={() =>
                              removeNotification(notification.date, notification.domain, notification.timeSpent)
                            }
                          />
                        )}
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
      <Spacer />
    </>
  )
}
