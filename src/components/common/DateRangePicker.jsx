'use client'
import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import { format } from 'date-fns'

const CSS = `
.rdp-root {
  --rdp-accent-color: #f97316;
  --rdp-accent-background-color: rgba(249,115,22,0.12);
  --rdp-day-width: 34px;
  --rdp-day-height: 34px;
  --rdp-week-number-width: 34px;
  --rdp-outside-opacity: 0.3;
  --rdp-range_middle-background-color: rgba(249,115,22,0.10);
  --rdp-range_middle-color: inherit;
  font-family: 'Pretendard', sans-serif;
  font-size: 13px;
}
.rdp-root * { box-sizing: border-box; }

.rdp-months { display: flex; gap: 16px; }

.rdp-month_caption {
  display: flex; align-items: center; justify-content: center;
  padding: 0 0 10px;
  font-size: 14px; font-weight: 600; color: var(--t1);
}

.rdp-nav {
  display: flex; align-items: center; justify-content: space-between;
  position: absolute; top: 12px; left: 12px; right: 12px;
}
.rdp-month { position: relative; padding-top: 36px; }

.rdp-button_previous, .rdp-button_next {
  width: 28px; height: 28px; border-radius: 4px;
  border: 1px solid var(--bd); background: var(--bg2);
  color: var(--t2); cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 14px; line-height: 1;
}
.rdp-button_previous:hover, .rdp-button_next:hover { background: var(--bg3); color: var(--t1); }

.rdp-weekdays { display: flex; }
.rdp-weekday {
  width: var(--rdp-day-width); height: 28px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600; color: var(--t3);
}

.rdp-week { display: flex; }

.rdp-day {
  width: var(--rdp-day-width); height: var(--rdp-day-height);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; cursor: pointer; border-radius: 4px; color: var(--t1);
  transition: background 0.1s;
  position: relative;
}
.rdp-day:hover:not(.rdp-selected):not(.rdp-range_start):not(.rdp-range_end) {
  background: var(--bg3);
}

.rdp-day_button {
  width: 100%; height: 100%; border: none; background: none;
  cursor: pointer; color: inherit; font-size: inherit; font-family: inherit;
  border-radius: 4px; display: flex; align-items: center; justify-content: center;
}

.rdp-today:not(.rdp-selected) .rdp-day_button {
  color: #f97316; font-weight: 700;
}

.rdp-selected .rdp-day_button,
.rdp-range_start .rdp-day_button,
.rdp-range_end .rdp-day_button {
  background: #f97316; color: #fff; font-weight: 600; border-radius: 4px;
}

.rdp-range_middle {
  background: rgba(249,115,22,0.10);
  border-radius: 0;
}
.rdp-range_middle .rdp-day_button { background: none; color: var(--t1); }

.rdp-range_start { border-radius: 4px 0 0 4px; background: rgba(249,115,22,0.10); }
.rdp-range_end   { border-radius: 0 4px 4px 0; background: rgba(249,115,22,0.10); }
.rdp-range_start.rdp-range_end { border-radius: 4px; background: none; }

.rdp-outside { opacity: 0.3; }
.rdp-disabled { opacity: 0.25; cursor: not-allowed; }
.rdp-hidden { visibility: hidden; }
.rdp-root *:focus { outline: none !important; box-shadow: none !important; }
.rdp-root *:focus-visible { outline: none !important; box-shadow: none !important; }
.rdp-day_button { border: 1px solid transparent !important; }
.rdp-day_button:focus, .rdp-day_button:focus-visible { border-color: var(--bd) !important; }
`

export default function DateRangePicker({ from, to, onChange }) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState({ from: from || undefined, to: to || undefined })
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (r) => {
    setRange(r || { from: undefined, to: undefined })
    if (r?.from && r?.to) {
      onChange?.({ from: format(r.from, 'yyyy-MM-dd'), to: format(r.to, 'yyyy-MM-dd') })
    } else if (!r) {
      onChange?.({ from: '', to: '' })
    }
  }

  const clear = (e) => {
    e.stopPropagation()
    setRange({ from: undefined, to: undefined })
    onChange?.({ from: '', to: '' })
    setOpen(false)
  }

  const label = range?.from
    ? range?.to
      ? `${format(range.from, 'yyyy.MM.dd')} ~ ${format(range.to, 'yyyy.MM.dd')}`
      : `${format(range.from, 'yyyy.MM.dd')} ~`
    : '등록일 선택'

  const hasValue = !!(range?.from || range?.to)

  return (
    <div ref={ref} style={{ position: 'relative', userSelect: 'none' }}>
      <style>{CSS}</style>

      {/* 트리거 버튼 */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 10px', fontSize: 12, borderRadius: 4,
          border: '1px solid var(--bd)',
          background: '#fff',
          color: hasValue ? 'var(--t1)' : 'var(--t3)',
          cursor: 'pointer', whiteSpace: 'nowrap',
          transition: 'border-color 0.15s',
        }}
      >
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {label}
        {hasValue && (
          <span onClick={clear} style={{ marginLeft: 2, color: 'var(--t3)', lineHeight: 1, fontSize: 14 }}>×</span>
        )}
      </button>

      {/* 캘린더 팝오버 */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 500,
          background: 'var(--bg1)', border: '1px solid var(--bd)',
          borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
          padding: '16px 12px',
        }}>
          <DayPicker mode="range" locale={ko} selected={range} onSelect={handleSelect} numberOfMonths={2} />
          <div style={{
            display: 'flex', justifyContent: 'flex-end', gap: 6,
            marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--bd)',
          }}>
            <button
              onClick={clear}
              style={{ padding: '5px 14px', fontSize: 12, borderRadius: 4, border: '1px solid var(--bd)', background: 'none', color: 'var(--t2)', cursor: 'pointer' }}
            >초기화</button>
            <button
              onClick={() => setOpen(false)}
              style={{ padding: '5px 14px', fontSize: 12, borderRadius: 4, border: 'none', background: '#f97316', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
            >확인</button>
          </div>
        </div>
      )}
    </div>
  )
}
