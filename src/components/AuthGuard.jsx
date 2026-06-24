'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import AppShell from './AppShell'

export default function AuthGuard({ children }) {
  const { loggedIn, hydrated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  useEffect(() => {
    if (!hydrated) return
    if (!loggedIn && !isLoginPage) router.replace('/login')
    if (loggedIn && isLoginPage) router.replace('/')
  }, [hydrated, loggedIn, isLoginPage, router])

  if (!hydrated) return null
  if (isLoginPage) return children
  if (!loggedIn) return null

  return <AppShell>{children}</AppShell>
}
