'use client'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { SpecBridgeAnnotation, httpAdapter } from '@specbridge-v1/sdk'

const API_URL = process.env.NEXT_PUBLIC_SPECBRIDGE_API_URL
const API_KEY = process.env.NEXT_PUBLIC_SPECBRIDGE_KEY

export default function SpecBridgeWrapper({ children }) {
  const pathname = usePathname() || '/'
  const storage = useMemo(
    () => (API_URL && API_KEY ? httpAdapter({ baseUrl: API_URL, apiKey: API_KEY }) : null),
    []
  )

  if (!storage) return <>{children}</>

  return (
    <SpecBridgeAnnotation pageId={pathname} storage={storage}>
      {children}
    </SpecBridgeAnnotation>
  )
}
