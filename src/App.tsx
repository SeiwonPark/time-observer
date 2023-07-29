import React from 'react'

import { MemoryRouter, Routes, Route } from 'react-router-dom'

import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'
import WeeklyDetailsPage from './pages/WeeklyDetailsPage'

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:id" element={<WeeklyDetailsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notification" element={<NotificationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>
  )
}
