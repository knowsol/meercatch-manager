import '../styles/global.css'
import Providers from '../components/Providers'
import AuthGuard from '../components/AuthGuard'

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
          <AuthGuard>{children}</AuthGuard>
        </Providers>
      </body>
    </html>
  )
}
