import React from 'react'

import { MemoryRouter, Routes, Route } from 'react-router-dom'

import CardDetailsPage from './pages/CardDetailsPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import NotificationsPage from './pages/NotificationsPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:id" element={<CardDetailsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notification" element={<NotificationsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MemoryRouter>
  )
}
