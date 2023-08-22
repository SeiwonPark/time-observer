import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { formatTime, formatTimestamp } from 'utils'

import { Layout } from '../components/Layout'

const Margin4 = styled.div`
  margin: 4px;
`

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

const CardList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`

const Card = styled.li`
  margin: 8px 4px;
  padding: 1em;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  cursor: pointer;
`

const CardContent = styled.div`
  display: flex;
  flex-direction: row;
`

const CardDetail = styled.div`
  padding-left: 8px;
  display: flex;
  flex-direction: column;
`

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<TimeNotification[]>([])

  useEffect(() => {
    chrome.storage.local.get('notifications', (data) => {
      if (data.notifications) {
        setNotifications(data.notifications)
      }
    })
  }, [])

  return (
    <Layout>
      <Margin4>
        <Header>
          <Title>Notifications</Title>
        </Header>
        {notifications.length === 0 ? (
          <span>No notifications found.</span>
        ) : (
          <CardList>
            {notifications.map((notification: TimeNotification, index: number) => (
              <Card key={index}>
                <CardContent>
                  <img src={notification.favicon} alt="favicon" width="24" height="24" />
                  <CardDetail>
                    <strong>{notification.domain}</strong>
                    <span>{`Spent ${formatTime(notification.timeSpent)} on ${formatTimestamp(
                      notification.timestamp
                    )}`}</span>
                  </CardDetail>
                </CardContent>
              </Card>
            ))}
          </CardList>
        )}
      </Margin4>
    </Layout>
  )
}
