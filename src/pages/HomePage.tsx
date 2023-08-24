import React from 'react'

import DailyUsage from '../components/DailyUsage'
import { Layout } from '../components/Layout'

export default function HomePage() {
  return (
    <Layout>
      <h1>Time Observer</h1>
      <DailyUsage />
    </Layout>
  )
}
