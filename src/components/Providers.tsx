'use client';
import { ReactNode } from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { PanelProvider } from '../context/PanelContext';
import QueryProvider from '../lib/api/QueryProvider';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <PanelProvider>
            {children}
          </PanelProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
