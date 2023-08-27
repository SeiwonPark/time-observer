import React from 'react'

import { Layout } from '../components/Layout'
import NotificationList from '../components/NotificationList'

export default function NotificationsPage() {
  return (
    <Layout>
      <h1>Notifications</h1>
      <NotificationList />
    </Layout>
  )
}
