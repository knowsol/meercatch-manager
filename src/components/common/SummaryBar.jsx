'use client'

const COLOR_MAP = {
  ok:   '#22c55e',
  err:  '#ef4444',
  warn: '#f97316',
  muted:'#94a3b8',
  blue: '#3b82f6',
}

export default function SummaryBar({ items = [] }) {
  if (!items.length) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'baseline', gap: 6,
          padding: '0 20px',
          borderRight: i < items.length - 1 ? '1px solid var(--bd)' : 'none',
          ...(i === 0 ? { paddingLeft: 0 } : {}),
        }}>
          <span style={{ fontSize: 12, color: 'var(--t3)', whiteSpace: 'nowrap' }}>{item.label}</span>
          <span style={{
            fontSize: 20, fontWeight: 700, lineHeight: 1,
            color: item.color ? (COLOR_MAP[item.color] || item.color) : 'var(--t1)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {item.value?.toLocaleString?.() ?? item.value}
          </span>
          {item.unit && (
            <span style={{ fontSize: 12, color: 'var(--t3)' }}>{item.unit}</span>
          )}
        </div>
      ))}
    </div>
  )
}
