'use client'
import { useState, useRef, useEffect } from 'react'
import Table from '../../components/common/Table'
import { Badge } from '../../components/common/Badge'
import Pagination from '../../components/common/Pagination'
import DateRangePicker from '../../components/common/DateRangePicker'
import { DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import { format, parse, isValid } from 'date-fns'
import { fmtDT } from '../../components/common/helpers'
import { DUMMY } from '../../data/dummy'

const PAGE_SIZE = 10

const FILTER_DEFS = {
  '유형':     { key: 'pauseType', multi: true,  values: ['자율학습', '방과후', '야간자율', '기타'] },
  '학교유형':  { key: '_schoolType', multi: false, values: ['중학교', '고등학교', '초등학교'] },
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
          cursor: 'pointer', position: 'relative', flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--t1)'}
        onMouseLeave={e => e.currentTarget.style.color = hiddenCols.length > 0 ? 'var(--t1)' : 'var(--t3)'}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{ marginTop: 4 }}>
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
        {hiddenCols.length > 0 && <span style={{ position: 'absolute', top: 4, right: -2, width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} />}
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
          {menuItem('상세 보기')}
          {menuItem('삭제', '#ef4444')}
        </div>
      )}
    </div>
  )
}

let nextId = 1

export default function PauseHistory() {
  const [search, setSearch]     = useState('')
  const [query, setQuery]       = useState('')
  const [statusFilter, setStatusFilter] = useState('전체')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo]     = useState('')
  const [chips, setChips]       = useState([])
  const [checked, setChecked]   = useState(new Set())
  const [selectedId, setSelectedId] = useState(null)
  const [page, setPage]         = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [sortKey, setSortKey]   = useState(null)
  const [sortDir, setSortDir]   = useState('asc')
  const [lastAddedId, setLastAddedId] = useState(null)
  const [hiddenCols, setHiddenCols] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ph_hidden_cols') || '[]') } catch { return [] }
  })

  const toggleCol = (key) => setHiddenCols(prev => {
    const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    localStorage.setItem('ph_hidden_cols', JSON.stringify(next))
    return next
  })

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

  const getSchool = (p) => {
    const grp = DUMMY.groups.find(g => g.groupId === p.groupId)
    return grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null
  }

  const filtered = DUMMY.pauses.filter(p => {
    // status tab
    if (statusFilter === '진행중' && p.status !== 'ACTIVE') return false
    if (statusFilter === '만료' && p.status !== 'EXPIRED') return false
    if (statusFilter === '취소' && p.status !== 'CANCELLED') return false

    // search
    if (query && !p.requester.toLowerCase().includes(query.toLowerCase())) return false

    // date range on startAt
    const startDate = p.startAt ? p.startAt.slice(0, 10) : ''
    if (dateFrom && startDate < dateFrom) return false
    if (dateTo && startDate > dateTo) return false

    // chips
    for (const chip of chips) {
      const def = FILTER_DEFS[chip.label]
      if (def.key === '_schoolType') {
        const sch = getSchool(p)
        if (chip.value && (!sch || sch.type !== chip.value)) return false
      } else if (def.multi) {
        if (chip.value.length > 0 && !chip.value.includes(p[def.key])) return false
      } else {
        if (chip.value && p[def.key] !== chip.value) return false
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

  const STATUS_TABS = [
    { label: '전체',  value: '전체',    count: DUMMY.pauses.length },
    { label: '진행중', value: '진행중',  count: DUMMY.pauses.filter(p => p.status === 'ACTIVE').length },
    { label: '만료',  value: '만료',    count: DUMMY.pauses.filter(p => p.status === 'EXPIRED').length },
    { label: '취소',  value: '취소',    count: DUMMY.pauses.filter(p => p.status === 'CANCELLED').length },
  ]

  const COLS_ALL = [
    { key: 'groupId',      label: '학교' },
    { key: 'pauseType',    label: '유형' },
    { key: 'requester',    label: '요청자' },
    { key: 'startAt',      label: '시작' },
    { key: 'endAt',        label: '종료' },
    { key: 'reason',       label: '사유' },
    { key: 'cancelReason', label: '취소사유' },
    { key: 'status',       label: '상태' },
  ]

  const COLS = [
    { key: '_check', label: () => {
        const allChecked = rows.length > 0 && rows.every(r => checked.has(r.pauseId || r.id))
        const someChecked = rows.some(r => checked.has(r.pauseId || r.id))
        return (
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked && !allChecked}
            onChange={() => setChecked(prev => {
              const next = new Set(prev)
              if (allChecked) rows.forEach(r => next.delete(r.pauseId || r.id))
              else rows.forEach(r => next.add(r.pauseId || r.id))
              return next
            })}
          />
        )
      }, width: 40, align: 'center', render: (_, row) => {
        const rid = row.pauseId || row.id
        return (
          <Checkbox
            checked={checked.has(rid)}
            onChange={() => {}}
            onClick={e => { e.stopPropagation(); setChecked(prev => { const next = new Set(prev); next.has(rid) ? next.delete(rid) : next.add(rid); return next }) }}
          />
        )
      }},
    { key: 'no', label: 'No.', width: 56, align: 'center', render: (_, r, i) => <span style={{ color: 'var(--t3)', fontSize: 12 }}>{(page - 1) * pageSize + i + 1}</span> },
    { key: 'groupId', label: '학교', render: v => {
        const grp = DUMMY.groups.find(g => g.groupId === v)
        const sch = grp ? DUMMY.schools.find(s => s.schoolId === grp.schoolId) : null
        return sch ? sch.name : '—'
      }},
    { key: 'pauseType', label: '유형', sortable: true },
    { key: 'requester', label: '요청자', sortable: true },
    { key: 'startAt', label: '시작', nowrap: true, sortable: true, render: v => fmtDT(v) },
    { key: 'endAt', label: '종료', nowrap: true, sortable: true, render: v => fmtDT(v) },
    { key: 'reason', label: '사유' },
    { key: 'cancelReason', label: '취소사유', render: v => v || '—' },
    { key: 'status', label: '상태', width: 90, render: v => {
        if (v === 'ACTIVE') return <Badge cls="bdg-warn">진행중</Badge>
        if (v === 'EXPIRED') return <Badge cls="bdg-muted">만료</Badge>
        return <Badge cls="bdg-muted">취소</Badge>
      }},
    { key: '_action', label: '', width: 48, align: 'center', render: (_, row) => <KebabMenu row={row} /> },
  ].filter(c => !hiddenCols.includes(c.key))

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* 페이지 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>운영 관리</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            탐지 중단 이력 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 20V8m0 0l-4 4m4-4l4 4M5 4h14"/></svg>
            가져오기
          </button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14"/></svg>
            내보내기
          </button>
        </div>
      </div>

      {/* 필터 바 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* 상태 탭 묶음 */}
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {STATUS_TABS.map((tab, i) => {
            const active = statusFilter === tab.value
            return (
              <button key={tab.value} onClick={() => { setStatusFilter(tab.value); setPage(1) }}
                style={{
                  padding: '7px 14px', fontSize: 13,
                  border: `1px solid ${active ? 'var(--t1)' : 'var(--bd)'}`,
                  marginLeft: i === 0 ? 0 : -1,
                  background: active ? 'var(--t1)' : 'var(--bg2)',
                  color: active ? '#fff' : 'var(--t2)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                  fontWeight: active ? 600 : 400,
                  position: 'relative', zIndex: active ? 1 : 0,
                }}>
                {tab.label} <span style={{ fontSize: 11, opacity: 0.75 }}>{tab.count}</span>
              </button>
            )
          })}
        </div>

        {/* 구분선 */}
        <div style={{ width: 1, height: 20, background: 'var(--bd)', margin: '0 4px' }} />

        {/* 날짜 범위 피커 */}
        <DateRangePicker from={dateFrom} to={dateTo} onChange={({ from, to }) => { setDateFrom(from); setDateTo(to); setPage(1) }} />

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
          onClearAll={() => { setSearch(''); setQuery(''); setStatusFilter('전체'); setDateFrom(''); setDateTo(''); setChips([]); setPage(1) }}
        />

        {/* 검색 입력 (우측 정렬) */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input className="inp"
              style={{ width: 220, paddingTop: 7, paddingBottom: 7, paddingRight: search ? 60 : 36, background: '#fff' }}
              placeholder="검색어 입력"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
            />
            {search && (
              <button onClick={() => { setSearch(''); setQuery(''); setPage(1) }}
                style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.03)', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--t3)', fontSize: 11 }}>×</button>
            )}
            <button onClick={doSearch}
              style={{ position: 'absolute', right: 1, top: 1, bottom: 1, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', borderRadius: '0 4px 4px 0' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <Table
        cols={COLS}
        rows={rows}
        selectedId={selectedId}
        onRowClick={row => setSelectedId(prev => prev === (row.pauseId || row.id) ? null : (row.pauseId || row.id))}
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
            setSearch(''); setQuery(''); setStatusFilter('전체')
            setDateFrom(''); setDateTo(''); setChips([]); setPage(1)
          },
        }}
      />

      {/* 페이지네이션 푸터 */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
        <ColToggle cols={COLS_ALL} hiddenCols={hiddenCols} onToggle={toggleCol} />
        <div style={{ flex: 1 }}>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </div>
  )
}
