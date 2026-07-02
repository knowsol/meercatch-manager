'use client'
import { useEffect } from 'react'
import { ThemeProvider } from '../context/ThemeContext'
import { AuthProvider } from '../context/AuthContext'
import { PanelProvider } from '../context/PanelContext'
import { SchoolProvider } from '../context/SchoolContext'

function TokenLoader() {
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('meercatch_tokens') || '{}')
      Object.entries(saved).forEach(([key, val]) => {
        document.documentElement.style.setProperty(key, String(val))
      })
    } catch {}
  }, [])
  return null
}

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SchoolProvider>
          <PanelProvider>
            <TokenLoader />
            {children}
          </PanelProvider>
        </SchoolProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
