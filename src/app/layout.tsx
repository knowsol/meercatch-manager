import '../styles/global.css';
import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Providers from '../components/Providers';
import AppShell from '../components/AppShell';

export const metadata: Metadata = {
  title: 'Meercat.ch - Manager',
  description: '미어캐치 매니저 페이지 입니다.',
  icons: { icon: '/favicon.ico' },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
