import '../styles/global.css'
import Providers from '../components/Providers'
import AppShell from '../components/AppShell'

export const metadata = {
  title: 'Meercat.ch - Manager',
  description: '미어캐치 매니저 페이지 입니다.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
