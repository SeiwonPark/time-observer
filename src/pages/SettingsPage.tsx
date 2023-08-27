import React from 'react'

import Calendar from 'components/Calendar'

import { Layout } from '../components/Layout'

export default function SettingsPage() {
  return (
    <Layout>
      <h1>Settings</h1>
      <Calendar />
    </Layout>
  )
}
