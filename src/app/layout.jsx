import '../styles/global.css'
import dynamic from 'next/dynamic'
import Providers from '../components/Providers'
import AuthGuard from '../components/AuthGuard'

const SpecBridgeWrapper = dynamic(() => import('../components/SpecBridgeWrapper'), { ssr: false })

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
          <SpecBridgeWrapper>
            <AuthGuard>{children}</AuthGuard>
          </SpecBridgeWrapper>
        </Providers>
      </body>
    </html>
  )
}
