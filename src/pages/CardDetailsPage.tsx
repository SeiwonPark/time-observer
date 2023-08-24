import React, { useState, useEffect } from 'react'

import { useLocation } from 'react-router-dom'

import { Layout } from '../components/Layout'
import WeeklyUsage from '../components/WeeklyUsage'

export default function CardDetailsPage() {
  const [endpoint, setEndpoint] = useState<string>('')
  const route = useLocation()

  useEffect(() => {
    setEndpoint(route.pathname.replace('/', ''))
  }, [])

  return (
    <Layout>
      <WeeklyUsage endpoint={endpoint} today={route.state} />
    </Layout>
  )
}
