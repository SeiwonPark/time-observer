import React from 'react'

import { ContributionCalendar } from 'react-contribution-calendar'

import { Layout } from '../components/Layout'

export default function SettingsPage() {
  return (
    <Layout>
      {/* FIXME: Set to collect anual data */}
      <ContributionCalendar cx={12} cy={12} onCellClick={(e, data) => console.log(data)} />
    </Layout>
  )
}
