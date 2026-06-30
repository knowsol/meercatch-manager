'use client'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { SpecBridgeAnnotation, httpAdapter } from '@specbridge-v1/sdk'

const API_URL = process.env.NEXT_PUBLIC_SPECBRIDGE_API_URL
const API_KEY = process.env.NEXT_PUBLIC_SPECBRIDGE_KEY

export default function SpecBridgeWrapper({ children }) {
  const [mounted, setMounted] = useState(false)
  const [constraintTarget, setConstraintTarget] = useState(null)
  const pathname = usePathname() || '/'
  const router = useRouter()
  const storage = useMemo(
    () => (API_URL && API_KEY ? httpAdapter({ baseUrl: API_URL, apiKey: API_KEY }) : null),
    []
  )

  // Callback ref: fires as soon as the dummy div mounts — before useEffect runs
  const dummyRefCallback = useCallback((node) => {
    if (node) setConstraintTarget(node)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Always render the dummy div so it's captured by dummyRefCallback on first render
  const dummyDiv = (
    <div
      ref={dummyRefCallback}
      style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
    />
  )

  if (!mounted || !storage) return <>{dummyDiv}{children}</>

  return (
    <>
      {dummyDiv}
      <SpecBridgeAnnotation
        pageId={pathname}
        storage={storage}
        onNavigate={(pageId) => router.push(pageId)}
        sbConstraintTarget={constraintTarget}
      >
        {children}
      </SpecBridgeAnnotation>
    </>
  )
}
