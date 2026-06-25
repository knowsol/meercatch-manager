'use client'
import { useState, useRef, useEffect } from 'react'

const PAGE_SIZES = [10, 20, 30, 50, 100]

function btnStyle(active) {
  return {
    minWidth: 30, padding: '4px 8px', borderRadius: 4,
    border: '1px solid ' + (active ? '#111827' : 'var(--bd)'),
    background: active ? '#111827' : 'var(--bg1)',
    color: active ? '#fff' : 'var(--t1)',
    cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
    lineHeight: 1.4,
  }
}

function navStyle(disabled) {
  return {
    minWidth: 30, padding: '4px 8px', borderRadius: 4,
    border: '1px solid var(--bd)', background: 'var(--bg1)',
    color: disabled ? 'var(--t3)' : 'var(--t1)',
    cursor: disabled ? 'not-allowed' : 'pointer', fontSize: 13,
    lineHeight: 1.4,
  }
}

function PageSizeDropdown({ pageSize, onChangeSize }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 3,
          padding: 0, border: 'none', background: 'none',
          fontSize: 13, color: 'var(--t3)', cursor: 'pointer',
        }}
      >
        {pageSize}개 표시
        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginTop: 1 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 4px)', left: 0, zIndex: 400,
          background: 'var(--bg1)', border: '1px solid var(--bd)',
          borderRadius: 4, boxShadow: '0 -4px 16px rgba(0,0,0,0.12)',
          overflow: 'hidden', minWidth: 110,
        }}>
          {PAGE_SIZES.map(size => (
            <div
              key={size}
              onClick={() => { onChangeSize(size); setOpen(false) }}
              style={{
                padding: '8px 14px', fontSize: 13, cursor: 'pointer',
                color: size === pageSize ? '#111827' : 'var(--t1)',
                fontWeight: size === pageSize ? 700 : 400,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {size}개
              {size === pageSize && (
                <svg width="12" height="12" fill="none" stroke="#111827" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Pagination({ page, total, pageSize = 10, onChange, onPageSizeChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const getPages = () => {
    let start = Math.max(1, page - 2)
    let end = Math.min(totalPages, page + 2)
    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, 5)
      else start = Math.max(1, end - 4)
    }
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const pages = getPages()
  const displayCount = Math.min(pageSize, total - (page - 1) * pageSize)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {onPageSizeChange && (
          <PageSizeDropdown pageSize={pageSize} onChangeSize={(size) => { onPageSizeChange(size); onChange(1) }} />
        )}
        <span style={{ fontSize: 13, color: 'var(--t3)' }}>
          전체 {total}개
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button onClick={() => onChange(1)} disabled={page === 1} style={navStyle(page === 1)}>«</button>
        <button onClick={() => onChange(page - 1)} disabled={page === 1} style={navStyle(page === 1)}>‹</button>

        {pages[0] > 1 && (
          <>
            <button onClick={() => onChange(1)} style={btnStyle(false)}>1</button>
            {pages[0] > 2 && <span style={{ color: 'var(--t3)', fontSize: 13, padding: '0 2px' }}>…</span>}
          </>
        )}

        {pages.map(p => (
          <button key={p} onClick={() => onChange(p)} style={btnStyle(p === page)}>{p}</button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <span style={{ color: 'var(--t3)', fontSize: 13, padding: '0 2px' }}>…</span>}
            <button onClick={() => onChange(totalPages)} style={btnStyle(false)}>{totalPages}</button>
          </>
        )}

        <button onClick={() => onChange(page + 1)} disabled={page === totalPages} style={navStyle(page === totalPages)}>›</button>
        <button onClick={() => onChange(totalPages)} disabled={page === totalPages} style={navStyle(page === totalPages)}>»</button>
      </div>
    </div>
  )
}
