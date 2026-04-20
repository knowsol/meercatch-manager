'use client'
import { ThemeProvider } from '../context/ThemeContext'
import { AuthProvider } from '../context/AuthContext'
import { PanelProvider } from '../context/PanelContext'

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PanelProvider>
          {children}
        </PanelProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
