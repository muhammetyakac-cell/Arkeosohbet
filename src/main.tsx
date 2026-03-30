import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { inject } from '@vercel/analytics'

// Inject Vercel Analytics
inject()

// Health check (Development only)
if (import.meta.env.DEV) {
  console.log('🏛️ STRATIGRAPH v1.0 - Archaeology Chat Platform')
  console.log('📡 Checking Supabase connection...')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
