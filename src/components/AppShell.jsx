'use client'
import { useAuth } from '../context/AuthContext'
import Layout from './layout/Layout'
import Login from '../views/auth/Login'

export default function AppShell({ children }) {
  const { loggedIn } = useAuth()
  if (!loggedIn) return <Login />
  return <Layout>{children}</Layout>
}
