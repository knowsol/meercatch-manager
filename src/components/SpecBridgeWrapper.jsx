'use client'
import { useMemo, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { SpecBridgeAnnotation, httpAdapter } from '@specbridge-v1/sdk'

const API_URL = process.env.NEXT_PUBLIC_SPECBRIDGE_API_URL
const API_KEY = process.env.NEXT_PUBLIC_SPECBRIDGE_KEY

export default function SpecBridgeWrapper({ children }) {
  const [mounted, setMounted] = useState(false)
  const [sbConstraintTarget, setSbConstraintTarget] = useState(null)
  const pathname = usePathname() || '/'
  const router = useRouter()
  const storage = useMemo(
    () => (API_URL && API_KEY ? httpAdapter({ baseUrl: API_URL, apiKey: API_KEY }) : null),
    []
  )

  useEffect(() => {
    setMounted(true)
    setSbConstraintTarget(document.querySelector('.app') || document.body)
  }, [])

  if (!mounted || !storage) return <>{children}</>

  return (
    <SpecBridgeAnnotation
      pageId={pathname}
      storage={storage}
      onNavigate={(pageId) => router.push(pageId)}
      sbConstraintTarget={sbConstraintTarget}
    >
      {children}
    </SpecBridgeAnnotation>
  )
}
