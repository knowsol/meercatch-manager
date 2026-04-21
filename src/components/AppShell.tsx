'use client';
import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './layout/Layout';
import Login from '../views/auth/Login';

interface AppShellProps {
  children: ReactNode;
}

/** 스토리지 복원 전 — 서버/클라이언트 동일 마크업으로 hydration 유지 */
function AuthShellPlaceholder() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)',
      }}
      aria-hidden
    />
  );
}

export default function AppShell({ children }: AppShellProps) {
  const { loggedIn, hydrated } = useAuth();
  if (!hydrated) return <AuthShellPlaceholder />;
  if (!loggedIn) return <Login />;
  return <Layout>{children}</Layout>;
}
