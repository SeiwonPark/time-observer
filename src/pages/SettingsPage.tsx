import React from 'react'

import { ContributionCalendar } from 'react-contribution-calendar'

import { Layout } from '../components/Layout'

export default function SettingsPage() {
  return (
    <Layout>
      <h1>Settings</h1>
      {/* FIXME: Set to collect anual data */}
      <ContributionCalendar cx={12} cy={12} theme={'emoji_negative'} />
    </Layout>
  )
}
