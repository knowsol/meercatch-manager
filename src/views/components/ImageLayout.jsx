'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Table, { EmptyState } from '../../components/common/Table'
import { PanelLayout } from '../../components/common/Panel'
import { StatusBadge } from '../../components/common/Badge'
import { usePanel } from '../../context/PanelContext'
import Pagination from '../../components/common/Pagination'
import DateRangePicker from '../../components/common/DateRangePicker'
import { DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import { format, parse, isValid } from 'date-fns'

const DUMMY_DATA = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  no: i + 1,
  name: ['홍길동', '김철수', '이영희', '박민준', '최수연', '정다은', '강호준', '윤서영', '임재혁', '오지수'][i % 10],
  role: ['관리자', '담당자', '열람자'][i % 3],
  org: ['부산광역시교육청', '해운대중학교', '동래고등학교', '사직중학교', '경남고등학교', '연제초등학교'][i % 6],
  email: `user${i + 1}@meercatch.kr`,
  phone: `010-${String(1000 + i * 37).slice(0,4)}-${String(5000 + i * 53).slice(0,4)}`,
  lastLogin: i % 5 === 0 ? null : `2025-${String((i % 3) + 10).padStart(2,'0')}-${String((i % 28) + 1).padStart(2,'0')}`,
  deviceCount: (i % 6) + 1,
  status: i % 4 === 0 ? 'inactive' : 'active',
  keywords: [['게임','꽁머니','도박','성인','폭력','마약'][i % 6], ['꽁머니','게임','성인','마약','폭력','도박'][(i + 2) % 6]].slice(0, (i % 3) + 1),
  createdAt: `2025-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  thumb: `item${i + 1}`,
  orgUrl: i % 3 !== 0 ? `https://example.com/org/${i + 1}` : null,
}))

const PAGE_SIZE = 10

const FILTER_DEFS = {
  '역할':        { key: 'role',      multi: true,  values: ['관리자', '담당자', '열람자'] },
  '소속기관':     { key: 'org',       multi: false, values: ['부산광역시교육청', '해운대중학교', '동래고등학교', '사직중학교', '경남고등학교', '연제초등학교'] },
  '마지막 로그인': { key: 'lastLogin', type: 'date' },
}

/* 단일 날짜 선택 피커 (필터 칩 내부용) */
function SingleDayPicker({ value, onChange, onClose }) {
  const parsed = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined
  const [selected, setSelected] = useState(parsed && isValid(parsed) ? parsed : undefined)

  const handleClear = () => { setSelected(undefined); onChange(''); onClose?.() }
  const handleConfirm = () => { if (selected) onChange(format(selected, 'yyyy-MM-dd')); onClose?.() }

  return (
    <>
      <style>{`
        .sdp .rdp-root { --rdp-accent-color: #f97316; --rdp-accent-background-color: rgba(249,115,22,0.12); --rdp-day-width:34px; --rdp-day-height:34px; font-family:'Pretendard',sans-serif; font-size:13px; }
        .sdp .rdp-root * { box-sizing:border-box; }
        .sdp .rdp-month { position:relative; padding-top:36px; }
        .sdp .rdp-month_caption { display:flex; align-items:center; justify-content:center; padding:0 0 10px; font-size:14px; font-weight:600; color:var(--t1); }
        .sdp .rdp-nav { display:flex; align-items:center; justify-content:space-between; position:absolute; top:12px; left:12px; right:12px; }
        .sdp .rdp-button_previous, .sdp .rdp-button_next { width:28px; height:28px; border-radius:4px; border:1px solid var(--bd); background:var(--bg2); color:var(--t2); cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:14px; }
        .sdp .rdp-button_previous:hover, .sdp .rdp-button_next:hover { background:var(--bg3); color:var(--t1); }
        .sdp .rdp-weekdays { display:flex; }
        .sdp .rdp-weekday { width:34px; height:28px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:600; color:var(--t3); }
        .sdp .rdp-week { display:flex; }
        .sdp .rdp-day { width:34px; height:34px; display:flex; align-items:center; justify-content:center; font-size:13px; cursor:pointer; border-radius:4px; color:var(--t1); }
        .sdp .rdp-day:hover:not(.rdp-selected) { background:var(--bg3); }
        .sdp .rdp-day_button { width:100%; height:100%; border:1px solid transparent !important; background:none; cursor:pointer; color:inherit; font-size:inherit; font-family:inherit; border-radius:4px; display:flex; align-items:center; justify-content:center; }
        .sdp .rdp-today:not(.rdp-selected) .rdp-day_button { color:#f97316; font-weight:700; }
        .sdp .rdp-selected .rdp-day_button { background:#f97316; color:#fff; font-weight:600; border-radius:4px; }
        .sdp .rdp-outside { opacity:0.3; }
        .sdp .rdp-root *:focus, .sdp .rdp-root *:focus-visible { outline:none !important; box-shadow:none !important; }
        .sdp .rdp-day_button:focus, .sdp .rdp-day_button:focus-visible { border-color:var(--bd) !important; }
      `}</style>
      <div className="sdp">
        <DayPicker mode="single" locale={ko} selected={selected} onSelect={setSelected} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--bd)' }}>
        <button onClick={handleClear} style={{ padding: '5px 14px', fontSize: 12, borderRadius: 4, border: '1px solid var(--bd)', background: 'none', color: 'var(--t2)', cursor: 'pointer' }}>초기화</button>
        <button onClick={handleConfirm} style={{ padding: '5px 14px', fontSize: 12, borderRadius: 4, border: 'none', background: '#f97316', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>확인</button>
      </div>
    </>
  )
}

/* 드롭다운을 가진 필터 칩 */
function FilterChip({ chip, onSelect, onRemove, autoOpen }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (autoOpen) setOpen(true)
  }, [])
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const def = FILTER_DEFS[chip.label]
  const isDate = def.type === 'date'
  const isMulti = def.multi
  const selected = isMulti ? (chip.value || []) : chip.value

  const displayValue = isDate
    ? chip.value || null
    : isMulti
      ? selected.length > 0 ? selected.join(', ') : null
      : selected || null

  const handleClick = (val) => {
    if (isMulti) {
      const next = selected.includes(val)
        ? selected.filter(v => v !== val)
        : [...selected, val]
      onSelect(next)
    } else {
      onSelect(val)
      setOpen(false)
    }
  }

  const isChecked = (val) => isMulti ? selected.includes(val) : selected === val

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <span
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '0 10px', fontSize: 12, borderRadius: 4, height: 31,
          border: '1px solid var(--bd)', background: '#fff',
          cursor: 'pointer', userSelect: 'none', boxSizing: 'border-box',
        }}
      >
        <span style={{ color: 'var(--t3)' }}>{chip.label}</span>
        {displayValue && <span style={{ color: 'var(--t1)' }}>{displayValue}</span>}
        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 2, color: 'var(--t3)' }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
        <span
          onClick={e => { e.stopPropagation(); onRemove() }}
          style={{ marginLeft: 2, color: 'var(--t3)', fontSize: 14, lineHeight: 1 }}
        >×</span>
      </span>

      {open && isDate && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 400,
          background: 'var(--bg1)', border: '1px solid var(--bd)',
          borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          padding: '16px 12px',
        }}>
          <SingleDayPicker
            value={chip.value || null}
            onChange={val => onSelect(val)}
            onClose={() => setOpen(false)}
          />
        </div>
      )}

      {open && !isDate && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 400,
          background: 'var(--bg1)', border: '1px solid var(--bd)',
          borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          minWidth: 160, overflow: 'hidden',
        }}>
          {def.values.map(val => {
            const checked = isChecked(val)
            return (
              <div
                key={val}
                onClick={() => handleClick(val)}
                style={{
                  padding: '9px 14px', fontSize: 13, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: checked ? '#f97316' : 'var(--t1)',
                  fontWeight: checked ? 600 : 400,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {isMulti && (
                  <span style={{
                    width: 15, height: 15, borderRadius: 3, flexShrink: 0,
                    border: `1.5px solid ${checked ? '#f97316' : 'var(--bd)'}`,
                    background: checked ? '#f97316' : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {checked && <svg width="9" height="9" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                  </span>
                )}
                {val}
                {!isMulti && checked && (
                  <svg width="13" height="13" fill="none" stroke="#f97316" strokeWidth="2.5" viewBox="0 0 24 24" style={{ marginLeft: 'auto' }}><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* 열 표시/숨김 토글 */
function ColToggle({ cols, hiddenCols, onToggle }) {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ bottom: 0, left: 0 })
  const ref = useRef(null)
  const btnRef = useRef(null)
  const toggleable = cols.filter(c => c.label && typeof c.label === 'string')

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleToggleOpen() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setDropPos({ bottom: window.innerHeight - rect.top + 4, left: rect.left })
    }
    setOpen(o => !o)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        onClick={handleToggleOpen}
        title="열 표시 설정"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, border: 'none', background: 'none',
          color: hiddenCols.length > 0 ? 'var(--t1)' : 'var(--t3)',
          cursor: 'pointer', transition: 'color 0.15s',
          position: 'relative', flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--t1)'}
        onMouseLeave={e => e.currentTarget.style.color = hiddenCols.length > 0 ? 'var(--t1)' : 'var(--t3)'}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{ marginTop: 4 }}>
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
        {hiddenCols.length > 0 && (
          <span style={{
            position: 'absolute', top: 4, right: -2,
            width: 6, height: 6, borderRadius: '50%',
            background: '#f97316',
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: dropPos.bottom, left: dropPos.left, zIndex: 9999,
          background: 'var(--bg1)', border: '1px solid var(--bd)',
          borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
          minWidth: 160, overflow: 'hidden',
        }}>
          <div style={{ padding: '8px 14px 6px', fontSize: 11, color: 'var(--t3)', fontWeight: 600, borderBottom: '1px solid var(--bd)' }}>열 표시 설정</div>
          {toggleable.map(c => {
            const hidden = hiddenCols.includes(c.key)
            return (
              <div
                key={c.key}
                onClick={() => onToggle(c.key)}
                style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  width: 15, height: 15, borderRadius: 3, flexShrink: 0,
                  border: `1.5px solid ${!hidden ? '#111827' : 'var(--bd)'}`,
                  background: !hidden ? '#111827' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {!hidden && <svg width="9" height="9" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                </span>
                <span style={{ color: hidden ? 'var(--t3)' : 'var(--t1)' }}>{c.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* + 필터 추가 버튼 + 드롭다운 */
function AddFilterButton({ activeLabels, onAdd, onClearAll }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const available = Object.keys(FILTER_DEFS).filter(l => !activeLabels.includes(l))
  const allUsed = available.length === 0

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => allUsed ? onClearAll?.() : setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 10px', fontSize: 12, borderRadius: 4, border: '1px dashed var(--bd)', background: 'none', color: allUsed ? '#ef4444' : 'var(--t3)', cursor: 'pointer' }}
      >
        {allUsed ? '전체 제거' : '+ 필터 추가'}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 400,
          background: 'var(--bg1)', border: '1px solid var(--bd)',
          borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          minWidth: 140, overflow: 'hidden',
        }}>
          {available.map(label => (
            <div
              key={label}
              onClick={() => { onAdd(label); setOpen(false) }}
              style={{ padding: '9px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Checkbox({ checked, indeterminate, onChange, onClick, disabled }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.indeterminate = !!indeterminate }, [indeterminate])
  return (
    <div style={{ position: 'relative', width: 18, height: 18, flexShrink: 0, cursor: disabled ? 'not-allowed' : 'pointer' }} onClick={onClick}>
      <input ref={ref} type="checkbox" checked={checked} onChange={onChange} disabled={disabled}
        style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: disabled ? 'not-allowed' : 'pointer', margin: 0 }}
      />
      <div style={{
        width: 18, height: 18, borderRadius: 4,
        border: `1.5px solid ${disabled ? 'var(--bd)' : checked ? '#111827' : 'var(--bd)'}`,
        background: disabled ? 'var(--bg3)' : checked ? '#111827' : '#fff',
        cursor: disabled ? 'not-allowed' : undefined,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', transition: 'all 0.1s',
      }}>
        {indeterminate && !checked
          ? <div style={{ width: 8, height: 1.5, background: '#fff', borderRadius: 1 }} />
          : checked && <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ marginTop: -1 }}><polyline points="20 6 9 17 4 12"/></svg>
        }
      </div>
    </div>
  )
}

function CircleProgress({ value, max = 100, size = 36 }) {
  const color = value >= 80 ? '#22c55e' : value >= 50 ? '#f97316' : '#ef4444'
  const r = (size - 4) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(Math.max(value / max, 0), 1)
  const dash = pct * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg3)" strokeWidth="3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: 10, fontWeight: 700, fill: 'var(--t1)', fontFamily: 'Pretendard, sans-serif' }}
      >{value}</text>
    </svg>
  )
}

function ThumbCell({ seed }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div
      style={{ position: 'relative', width: 52, height: 38, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', flexShrink: 0, background: '#1e293b' }}
      onClick={e => { e.stopPropagation(); setRevealed(r => !r) }}
      title={revealed ? '클릭하여 블러 처리' : '클릭하여 이미지 확인'}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${seed}/52/38`}
        alt="썸네일"
        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: revealed ? 'none' : 'blur(5px)', transition: 'filter 0.2s', transform: 'scale(1.15)' }}
      />
      {!revealed && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textShadow: '0 0 4px rgba(0,0,0,0.6)' }}>
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5ZM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
          </svg>
        </div>
      )}
    </div>
  )
}

function GridThumb({ seed }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div
      style={{ position: 'relative', width: '100%', aspectRatio: '3/2', overflow: 'hidden', background: '#1e293b', flexShrink: 0 }}
      onClick={e => { e.stopPropagation(); setRevealed(r => !r) }}
      title={revealed ? '클릭하여 블러 처리' : '클릭하여 이미지 확인'}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${seed}/360/240`}
        alt="썸네일"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: revealed ? 'none' : 'blur(6px)', transition: 'filter 0.2s', transform: 'scale(1.08)' }}
      />
      {!revealed && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textShadow: '0 0 4px rgba(0,0,0,0.6)' }}>
          <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5ZM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"/>
          </svg>
        </div>
      )}
    </div>
  )
}

function KebabMenu({ row }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const menuItem = (label, color, onClick) => (
    <div
      onClick={() => { onClick?.(); setOpen(false) }}
      style={{ padding: '8px 10px', fontSize: 13, cursor: 'pointer', color: color || 'var(--t1)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >{label}</div>
  )

  return (
    <div ref={ref} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid transparent', borderRadius: 4, background: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 16, letterSpacing: 1 }}
        onMouseEnter={e => { e.currentTarget.style.border = '1px solid var(--bd)'; e.currentTarget.style.color = 'var(--t1)' }}
        onMouseLeave={e => { e.currentTarget.style.border = '1px solid transparent'; e.currentTarget.style.color = 'var(--t3)' }}
      >···</button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0, zIndex: 500,
          background: 'var(--bg1)', border: '1px solid var(--bd)',
          borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          width: 'max-content', overflow: 'hidden', textAlign: 'left',
        }}>
          {menuItem('수정')}
          {menuItem('삭제', '#ef4444')}
          <div style={{ height: 1, background: 'var(--bd)', margin: '2px 10px' }} />
          {menuItem('비밀번호 초기화')}
        </div>
      )}
    </div>
  )
}

function DetailPanel({ row }) {
  const { closePanel } = usePanel()
  const field = (label, value) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ width: 90, flexShrink: 0, fontSize: 12, color: 'var(--t3)', fontWeight: 500 }}>{label}</div>
      <div style={{ flex: 1, fontSize: 13, color: 'var(--t1)' }}>{value || '-'}</div>
    </div>
  )
  return (
    <PanelLayout
      title="상세 정보"
      body={
        <div style={{ padding: '8px 0' }}>
          {field('이름', row.name)}
          {field('역할', row.role)}
          {field('소속기관', row.org)}
          {field('상태', <StatusBadge status={row.status} />)}
          {field('등록일', row.createdAt)}
        </div>
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn" onClick={closePanel}>닫기</button>
          <button className="btn btn-p">수정</button>
        </div>
      }
    />
  )
}

function GridView({ rows, onRowClick, selectedId, checked, onCheck, onClearCheck, emptyContext }) {
  const activeRows = rows.filter(r => r.status !== 'inactive')
  const allChecked = activeRows.length > 0 && activeRows.every(r => checked.has(r.id))
  const someChecked = activeRows.some(r => checked.has(r.id))

  function handleCheckAll() {
    if (allChecked) {
      onClearCheck()
    } else {
      activeRows.forEach(r => onCheck(r.id, true))
    }
  }

  return (
    <div style={{ borderTop: '2px solid var(--t1)', borderBottom: '1px solid var(--bd)' }}>
      {/* 액션 바 */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 14px', borderBottom: '1px solid var(--bd)',
        background: checked.size > 0 ? 'var(--bg2)' : 'var(--bg1)',
        height: 37, overflow: 'hidden',
      }}>
        {/* 전체 선택 체크박스 */}
        <span
          onClick={handleCheckAll}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 15, height: 15, borderRadius: 3, flexShrink: 0, cursor: 'pointer',
            border: `1.5px solid ${allChecked || someChecked ? '#f97316' : 'var(--bd)'}`,
            background: allChecked ? '#f97316' : '#fff',
          }}
        >
          {allChecked && <svg width="9" height="9" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
          {!allChecked && someChecked && <span style={{ width: 7, height: 2, background: '#f97316', borderRadius: 1, display: 'block' }} />}
        </span>

        {checked.size > 0 ? (
          <>
            <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600 }}>{checked.size}개 선택됨</span>
            <div style={{ width: 1, height: 12, background: 'var(--bd)' }} />
            {[
              { label: '내보내기', icon: <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"/> },
              { label: '삭제', icon: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></> },
            ].map(({ label, icon }) => (
              <button key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', fontSize: 12, borderRadius: 4,
                border: '1px solid var(--bd)', background: 'transparent',
                color: label === '삭제' ? '#ef4444' : 'var(--t2)',
                cursor: 'pointer',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{icon}</svg>
                {label}
              </button>
            ))}
            <button
              onClick={onClearCheck}
              style={{ fontSize: 12, color: 'var(--t3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--t1)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
            >취소</button>
          </>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--t3)' }}>전체 선택</span>
        )}
      </div>

      {/* 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--bd)' }}>
        {rows.length === 0 ? (
          <div style={{ gridColumn: '1/-1' }}>
            <EmptyState emptyContext={emptyContext} wrapperStyle={{ borderTop: 'none', background: '#fff' }} />
          </div>
        ) : rows.map(row => {
          const isSelected = selectedId === row.id
          const isChecked = checked.has(row.id)
          const isInactive = row.status === 'inactive'
          return (
            <div
              key={row.id}
              onClick={() => !isInactive && onRowClick && onRowClick(row)}
              style={{
                background: isSelected ? 'rgba(251,146,60,0.06)' : 'var(--bg1)',
                cursor: isInactive ? 'not-allowed' : onRowClick ? 'pointer' : 'default',
                opacity: isInactive ? 0.45 : 1,
                display: 'flex', flexDirection: 'column',
                transition: 'background 0.15s',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isInactive && !isSelected) e.currentTarget.style.background = 'var(--bg2)' }}
              onMouseLeave={e => { if (!isInactive) e.currentTarget.style.background = isSelected ? 'rgba(251,146,60,0.06)' : 'var(--bg1)' }}
            >
              {/* 체크박스 — 비활성 제외 */}
              {!isInactive && (
                <div
                  onClick={e => { e.stopPropagation(); onCheck(row.id) }}
                  style={{ position: 'absolute', top: 8, left: 8, zIndex: 2, cursor: 'pointer' }}
                >
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 16, height: 16, borderRadius: 4,
                    border: `1.5px solid ${isChecked ? '#f97316' : 'rgba(0,0,0,0.2)'}`,
                    background: isChecked ? '#f97316' : 'rgba(255,255,255,0.85)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}>
                    {isChecked && <svg width="9" height="9" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                  </span>
                </div>
              )}

              <GridThumb seed={row.thumb} />

              <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
                  <StatusBadge status={row.status} />
                </div>
                <span style={{ fontSize: 11, color: 'var(--t3)' }}>{row.role}</span>
                <span style={{ fontSize: 11, color: 'var(--t3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.org}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

let nextId = 1

export default function ImageLayout() {
  const { openPanel } = usePanel()
  const [search, setSearch]   = useState('')
  const [query, setQuery]     = useState('')
  const [status, setStatus]   = useState('전체')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')
  const [chips, setChips]     = useState([]) // [{ id, label, value }]
  const [checked, setChecked] = useState(new Set())
  const [selectedId, setSelectedId] = useState(null)
  const [page, setPage]       = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')
  const [viewMode, setViewMode] = useState('table')
  const [hiddenCols, setHiddenCols] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tg_hidden_cols') || '[]') } catch { return [] }
  })
  const toggleCol = (key) => setHiddenCols(prev => {
    const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    localStorage.setItem('tg_hidden_cols', JSON.stringify(next))
    return next
  })

  const [lastAddedId, setLastAddedId] = useState(null)

  const addChip = (label) => {
    const def = FILTER_DEFS[label]
    const id = nextId++
    setChips(prev => [...prev, { id, label, value: def.multi ? [] : '' }])
    setLastAddedId(id)
  }

  const selectChipValue = (id, value) => {
    setChips(prev => prev.map(c => c.id === id ? { ...c, value } : c))
    setPage(1)
  }

  const removeChip = (id) => {
    setChips(prev => prev.filter(c => c.id !== id))
    setPage(1)
  }

  const filtered = DUMMY_DATA.filter(r => {
    if (status !== '전체' && ((status === '활성' && r.status !== 'active') || (status === '비활성' && r.status !== 'inactive'))) return false
    if (query && !r.name.includes(query) && !r.org.includes(query)) return false
    if (dateFrom && r.createdAt < dateFrom) return false
    if (dateTo && r.createdAt > dateTo) return false
    for (const chip of chips) {
      const def = FILTER_DEFS[chip.label]
      if (def.type === 'date') {
        if (chip.value && r[def.key] !== chip.value) return false
      } else if (def.multi) {
        if (chip.value.length > 0 && !chip.value.includes(r[def.key])) return false
      } else {
        if (chip.value && r[def.key] !== chip.value) return false
      }
    }
    return true
  })

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey] ?? ''
        const bv = b[sortKey] ?? ''
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv), 'ko')
        return sortDir === 'asc' ? cmp : -cmp
      })
    : filtered

  const total = sorted.length
  const rows  = sorted.slice((page - 1) * pageSize, page * pageSize)

  const doSearch = () => { setQuery(search); setPage(1) }

  const handleRowClick = (row) => {
    setSelectedId(prev => prev === row.id ? null : row.id)
    openPanel(<DetailPanel row={row} />)
  }

  const COLS_ALL = [
    { key: 'thumb',       label: '썸네일' },
    { key: 'name',        label: '이름' },
    { key: 'role',        label: '역할' },
    { key: 'org',         label: '소속기관' },
    { key: 'email',       label: '이메일' },
    { key: 'phone',       label: '연락처' },
    { key: 'lastLogin',   label: '마지막 로그인' },
    { key: 'deviceCount', label: '디바이스 수' },
    { key: 'status',      label: '상태' },
    { key: '_progress',   label: '달성률' },
    { key: 'keywords',    label: '탐지키워드' },
    { key: 'createdAt',   label: '등록일' },
  ]

  const COLS = [
    { key: '_check', label: () => {
        const allChecked = rows.length > 0 && rows.every(r => checked.has(r.id))
        const someChecked = rows.some(r => checked.has(r.id))
        return (
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            onChange={() => setChecked(prev => {
              const next = new Set(prev)
              if (allChecked) rows.forEach(r => next.delete(r.id))
              else rows.forEach(r => next.add(r.id))
              return next
            })}
          />
        )
      }, width: 40, align: 'center', render: (_, row) => {
        const disabled = row.status === 'inactive'
        return (
          <Checkbox
            checked={checked.has(row.id)}
            disabled={disabled}
            onChange={() => {}}
            onClick={e => { e.stopPropagation(); if (!disabled) setChecked(prev => { const next = new Set(prev); next.has(row.id) ? next.delete(row.id) : next.add(row.id); return next }) }}
          />
        )
      }},
    { key: 'no',          label: 'No.',       width: 56, align: 'center', render: (_, r, i) => <span style={{ color: 'var(--t3)', fontSize: 12 }}>{(page - 1) * pageSize + i + 1}</span> },
    { key: 'thumb',       label: '썸네일', width: 70, align: 'center', render: (v) => <ThumbCell seed={v} /> },
    { key: 'name',        label: '이름',       sortable: true },
    { key: 'role',        label: '역할',       sortable: true },
    { key: 'org', label: '소속기관', render: (v, row) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        {v}
        {row.orgUrl && (
          <a
            href={row.orgUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            title="외부 링크 열기"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 18, height: 18, borderRadius: 3, flexShrink: 0,
              color: 'var(--t3)', border: '1px solid var(--bd)', background: 'var(--bg2)',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.borderColor = 'var(--t2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.borderColor = 'var(--bd)' }}
          >
            <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        )}
      </span>
    ) },
    { key: 'email',       label: '이메일',     render: v => <span style={{ color: 'var(--t2)', fontSize: 12 }}>{v}</span> },
    { key: 'phone',       label: '연락처',     nowrap: true },
    { key: 'lastLogin',   label: '마지막 로그인', nowrap: true, sortable: true, render: v => <span style={{ color: v ? 'var(--t1)' : 'var(--t3)', fontSize: 12 }}>{v || '—'}</span> },
    { key: 'deviceCount', label: '디바이스 수', align: 'center', sortable: true, render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { key: 'status',      label: '상태',       render: v => <StatusBadge status={v} /> },
    { key: '_progress', label: '달성률', width: 60, align: 'center', render: (_, row) => <CircleProgress value={Math.min(row.deviceCount * 15, 99)} /> },
    { key: 'keywords',    label: '탐지키워드',  render: v => (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'nowrap' }}>
          {(v || []).map(kw => (
            <span key={kw} style={{ padding: '2px 7px', fontSize: 11, borderRadius: 4, background: 'rgba(249,115,22,0.08)', color: '#ea580c', border: '1px solid rgba(249,115,22,0.2)', whiteSpace: 'nowrap' }}>{kw}</span>
          ))}
        </div>
      )},
    { key: 'createdAt',   label: '등록일',     nowrap: true, sortable: true },
    { key: '_buttons',    label: '',           nowrap: true, render: (_, row) => (
      <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
        <button className="btn btn-sm btn-outline">이동</button>
        <button className="btn btn-sm btn-d">삭제</button>
      </div>
    )},
    { key: '_action',     label: '',           width: 48, align: 'center', render: (_, row) => <KebabMenu row={row} /> },
  ].filter(c => !hiddenCols.includes(c.key))

  const STATUS_TABS = [
    { label: '전체',  value: '전체',  count: DUMMY_DATA.length },
    { label: '활성',  value: '활성',  count: DUMMY_DATA.filter(r => r.status === 'active').length },
    { label: '비활성', value: '비활성', count: DUMMY_DATA.filter(r => r.status === 'inactive').length },
  ]

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* 페이지 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>참고자료</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            이미지 레이아웃 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          {[
            { icon: <path d="M12 20V8m0 0l-4 4m4-4l4 4M5 4h14"/>, label: '가져오기' },
            { icon: <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"/>, label: '내보내기' },
          ].map(({ icon, label }) => (
            <button
              key={label}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'background 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.color = 'var(--t1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg1)'; e.currentTarget.style.color = 'var(--t2)' }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{icon}</svg>
              {label}
            </button>
          ))}
          <button
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
            onMouseLeave={e => e.currentTarget.style.background = '#111827'}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
            추가
          </button>
        </div>
      </div>

      {/* 필터 바 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* 상태 탭 (묶음) */}
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {STATUS_TABS.map((tab, i) => {
            const active = status === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => { setStatus(tab.value); setPage(1) }}
                style={{
                  padding: '7px 14px', fontSize: 13,
                  border: `1px solid ${active ? 'var(--t1)' : 'var(--bd)'}`,
                  marginLeft: i === 0 ? 0 : -1,
                  background: active ? 'var(--t1)' : 'var(--bg2)',
                  color: active ? '#fff' : 'var(--t2)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                  fontWeight: active ? 600 : 400,
                  position: 'relative', zIndex: active ? 1 : 0,
                }}
              >
                {tab.label} <span style={{ fontSize: 11, opacity: 0.75 }}>{tab.count}</span>
              </button>
            )
          })}
        </div>

        {/* 구분선 */}
        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

        {/* 날짜 피커 */}
        <DateRangePicker
          from={dateFrom}
          to={dateTo}
          onChange={({ from, to }) => { setDateFrom(from); setDateTo(to); setPage(1) }}
        />

        {/* 구분선 */}
        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

        {/* 동적 필터 칩 */}
        {chips.map(chip => (
          <FilterChip
            key={chip.id}
            chip={chip}
            onSelect={val => selectChipValue(chip.id, val)}
            onRemove={() => removeChip(chip.id)}
            autoOpen={chip.id === lastAddedId}
          />
        ))}

        {/* + 필터 추가 */}
        <AddFilterButton
          activeLabels={chips.map(c => c.label)}
          onAdd={addChip}
          onClearAll={() => { setSearch(''); setQuery(''); setStatus('전체'); setDateFrom(''); setDateTo(''); setChips([]); setPage(1) }}
        />

        {/* 검색 (우측) */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* 뷰 토글 */}
        <div style={{ display: 'flex', border: '1px solid var(--bd)', borderRadius: 4, overflow: 'hidden' }}>
          {[
            { mode: 'table', icon: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></> },
            { mode: 'grid',  icon: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></> },
          ].map(({ mode, icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                width: 32, height: 29, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer', transition: 'background 0.15s, color 0.15s',
                background: viewMode === mode ? 'var(--t1)' : 'var(--bg1)',
                color: viewMode === mode ? 'var(--bg1)' : 'var(--t3)',
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">{icon}</svg>
            </button>
          ))}
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            className="inp"
            style={{ width: 220, paddingTop: 7, paddingBottom: 7, paddingRight: search ? 60 : 36, background: '#fff' }}
            placeholder="이름, 소속기관 검색"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
          />
          {search && (
            <button
              onClick={() => { setSearch(''); setQuery(''); setPage(1) }}
              style={{
                position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)',
                width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%',
                cursor: 'pointer', color: 'var(--t3)', fontSize: 11, lineHeight: 1, padding: 0, transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
            >×</button>
          )}
          <button
            onClick={doSearch}
            style={{
              position: 'absolute', right: 1, top: 1, bottom: 1,
              width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)',
              borderRadius: '0 4px 4px 0',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--t1)'; e.currentTarget.style.background = 'var(--bg2)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--t3)'; e.currentTarget.style.background = 'none' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
        </div>
      </div>

      {/* 테이블 / 그리드 */}
      {viewMode === 'grid' ? (
        <GridView
          rows={rows}
          onRowClick={handleRowClick}
          selectedId={selectedId}
          checked={checked}
          onCheck={(id, forceAdd) => setChecked(prev => {
            const next = new Set(prev)
            if (forceAdd) { next.add(id) }
            else { next.has(id) ? next.delete(id) : next.add(id) }
            return next
          })}
          onClearCheck={() => setChecked(new Set())}
          emptyContext={{
            query,
            chips,
            onReset: () => {
              setSearch(''); setQuery(''); setStatus('전체')
              setDateFrom(''); setDateTo(''); setChips([]); setPage(1)
            },
          }}
        />
      ) : (
      <Table
        cols={COLS}
        rows={rows}
        selectedId={selectedId}
        onRowClick={handleRowClick}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        actionBar={checked.size > 0 && (
          <>
            <span style={{ fontSize: 12, color: 'var(--t2)', fontWeight: 600 }}>{checked.size}개 선택됨</span>
            <div style={{ width: 1, height: 12, background: 'var(--bd)' }} />
            {[
              { label: '내보내기', icon: <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"/> },
              { label: '삭제', icon: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></> },
            ].map(({ label, icon }) => (
              <button key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', fontSize: 12, borderRadius: 4,
                border: '1px solid var(--bd)', background: 'transparent',
                color: label === '삭제' ? '#ef4444' : 'var(--t2)',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">{icon}</svg>
                {label}
              </button>
            ))}
            <button
              onClick={() => setChecked(new Set())}
              style={{ fontSize: 12, color: 'var(--t3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--t1)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
            >취소</button>
          </>
        )}
        emptyContext={{
          query,
          chips,
          onReset: () => {
            setSearch(''); setQuery(''); setStatus('전체')
            setDateFrom(''); setDateTo(''); setChips([]); setPage(1)
          },
        }}
      />
      )}

      {/* 페이지네이션 */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
        <ColToggle cols={COLS_ALL} hiddenCols={hiddenCols} onToggle={toggleCol} />
        <div style={{ flex: 1 }}>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </div>
  )
}
