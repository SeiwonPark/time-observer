import React, { useState, useEffect } from 'react'

import WeeklyUsage from 'components/WeeklyUsage'
import { useLocation } from 'react-router-dom'

import { Layout } from '../components/Layout'

export default function CardDetailsPage() {
  const [endpoint, setEndpoint] = useState<string>('')
  const route = useLocation()

  useEffect(() => {
    setEndpoint(route.pathname.replace('/', ''))
  }, [])

  return (
    <Layout>
      <h1>{endpoint}</h1>
      <WeeklyUsage endpoint={endpoint} today={route.state} />
    </Layout>
  )
}
