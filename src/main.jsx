import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import App from './App.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import ExplorePage from './pages/ExplorePage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
      </Routes>
      <SpeedInsights />
    </BrowserRouter>
  </React.StrictMode>,
)
