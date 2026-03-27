import React, { useEffect } from 'react'
import { AuthProvider } from './components/ArchitectureGuide'
import { ChatProvider } from './components/ArchitectureGuide'
import { MainLayout } from './components/ArchitectureGuide'
import { healthCheck } from './lib/supabaseClient'

/**
 * STRATIGRAPH App Component
 * 
 * Ana uygulama bileşeni - tüm providers'ı sarmalayan wrapper
 */
const App: React.FC = () => {
  useEffect(() => {
    // Supabase bağlantısını kontrol et
    healthCheck().then(isHealthy => {
      if (!isHealthy) {
        console.warn('⚠️ Supabase sağlık kontrolü başarısız. Detaylar konsola bakın.')
      } else {
        console.log('✅ Supabase bağlantı hazır')
      }
    })
  }, [])

  return (
    <AuthProvider>
      <ChatProvider>
        <MainLayout />
      </ChatProvider>
    </AuthProvider>
  )
}

export default App
