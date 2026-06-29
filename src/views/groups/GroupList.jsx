'use client'
import { useState, useRef, useEffect } from 'react'
import { DUMMY } from '../../data/dummy'
import { useSchoolScope } from '../../hooks/useSchoolScope'
import Table from '../../components/common/Table'
import { PanelLayout } from '../../components/common/Panel'
import Pagination from '../../components/common/Pagination'
import DateRangePicker from '../../components/common/DateRangePicker'
import { DayPicker } from 'react-day-picker'
import { ko } from 'date-fns/locale'
import { format, parse, isValid } from 'date-fns'

const SCHOOL_TYPES = ['전체', '초등학교', '중학교', '고등학교', '기타']

const PAGE_SIZE = 10

const FILTER_DEFS = {
  '학교구분': { key: 'type',    multi: true,  values: ['초등학교', '중학교', '고등학교', '기타'] },
  '지역':     { key: '_region', multi: false, values: ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '기타'] },
}

function getRegion(address) {
  if (!address) return '기타'
  const m = address.match(/^(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)/)
  return m ? m[1] : '기타'
}

/* ─── 단일 날짜 선택 피커 ─── */
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

/* ─── 필터 칩 ─── */
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

/* ─── 열 표시/숨김 토글 ─── */
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

/* ─── + 필터 추가 버튼 ─── */
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

/* ─── Checkbox ─── */
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

/* ─── KebabMenu ─── */
function KebabMenu({ row }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const ref = useRef(null)
  const btnRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleOpen(e) {
    e.stopPropagation()
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.right - 120 })
    }
    setOpen(o => !o)
  }

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
        ref={btnRef}
        onClick={handleOpen}
        style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid transparent', borderRadius: 4, background: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 16, letterSpacing: 1 }}
        onMouseEnter={e => { e.currentTarget.style.border = '1px solid var(--bd)'; e.currentTarget.style.color = 'var(--t1)' }}
        onMouseLeave={e => { e.currentTarget.style.border = '1px solid transparent'; e.currentTarget.style.color = 'var(--t3)' }}
      >···</button>

      {open && (
        <div style={{
          position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999,
          background: 'var(--bg1)', border: '1px solid var(--bd)',
          borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          width: 'max-content', overflow: 'hidden', textAlign: 'left',
        }}>
          {menuItem('수정')}
          {menuItem('삭제', '#ef4444')}
        </div>
      )}
    </div>
  )
}

/* ─── DetailRow ─── */
function DetailRow({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid var(--bd)' }}>
      <div style={{ width: 110, flexShrink: 0, fontSize: 12, color: 'var(--t3)', fontWeight: 500 }}>{label}</div>
      <div style={{ flex: 1, fontSize: 13, color: value === '-' || !value ? 'var(--t3)' : 'var(--t1)', fontFamily: mono ? 'inherit' : undefined }}>{value || '-'}</div>
    </div>
  )
}

/* ─── SchoolEditModal ─── */
function SchoolEditModal({ info, onSave, onClose }) {
  const [manager, setManager] = useState(info.manager || '')
  const [loginId, setLoginId] = useState(info.loginId || '')
  const [email,   setEmail]   = useState(info.email   || '')
  const [contact, setContact] = useState(info.contact || '')

  const field = (label, value, onChange, mono) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
      <div style={{ width: 72, fontSize: 13, color: 'var(--t2)', flexShrink: 0 }}>{label}</div>
      <input className="inp" value={value} onChange={e => onChange(e.target.value)}
        style={{ flex: 1, fontFamily: mono ? 'inherit' : undefined }} />
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 4, padding: '28px 28px 24px', width: 420, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>관리자 정보 수정</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--t3)', lineHeight: 1 }}>×</button>
        </div>
        <div style={{ fontSize: 13, color: 'var(--t3)', marginBottom: 24 }}>관리자 정보만 수정할 수 있습니다.</div>
        {field('관리자', manager, setManager)}
        {field('아이디', loginId, setLoginId, true)}
        {field('이메일', email,   setEmail)}
        {field('연락처', contact, setContact)}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
          <button className="btn" onClick={onClose} style={{ minWidth: 64 }}>취소</button>
          <button className="btn" style={{ background: '#1f2937', color: '#fff', border: 'none', minWidth: 64 }}
            onClick={() => { onSave({ manager, loginId, email, contact }); onClose(); }}>저장</button>
        </div>
      </div>
    </div>
  )
}

/* ─── SchoolDetail (side panel content) ─── */
function SchoolDetail({ school: initialSchool, onClose }) {
  const [school, setSchool] = useState(initialSchool)
  const [editing, setEditing] = useState(false)

  const groups       = DUMMY.groups.filter(g => g.schoolId === school.schoolId)
  const studentTotal = groups.reduce((sum, g) => sum + (g.studentCount || 0), 0)
  const deviceTotal  = groups.reduce((sum, g) => sum + (g.deviceCount  || 0), 0)

  function handleSave(updated) {
    setSchool(prev => ({ ...prev, ...updated }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {editing && (
        <SchoolEditModal
          info={{ manager: school.manager, loginId: school.loginId, email: school.email, contact: school.contact }}
          onSave={handleSave}
          onClose={() => setEditing(false)}
        />
      )}

      {/* 헤더 */}
      <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)', marginBottom: 3 }}>{school.name}</div>
            <div style={{ fontSize: 12, color: 'var(--t3)' }}>{school.type} · {getRegion(school.address)}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button className="btn" onClick={() => setEditing(true)}>수정</button>
            <button className="btn" style={{ color: 'var(--err)' }}>삭제</button>
            <button onClick={onClose} style={{ marginLeft: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>✕</button>
          </div>
        </div>

        {/* 통계 */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[{ label: '학급 수', value: groups.length }, { label: '학생 수', value: studentTotal }, { label: '단말기 수', value: deviceTotal }].map(k => (
            <div key={k.label} style={{ flex: 1, background: '#ffffff', border: '1px solid var(--bd)', borderRadius: 4, padding: '10px 14px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 3 }}>{k.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ac)' }}>{k.value}</div>
            </div>
          ))}
        </div>

        <div style={{ borderBottom: '1px solid var(--bd)' }} />
      </div>

      {/* 탭 콘텐츠 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{ background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, padding: '0 14px', marginBottom: 16 }}>
          <DetailRow label="학교 구분" value={school.type} />
          <DetailRow label="주소"      value={school.address} />
          <DetailRow label="학교 코드" value={school.schoolCode} mono />
          <DetailRow label="생성일"    value={school.createdAt} />
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t3)', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>관리자 정보</div>
        <div style={{ background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, padding: '0 14px' }}>
          <DetailRow label="관리자" value={school.manager} />
          <DetailRow label="아이디" value={school.loginId} mono />
          <DetailRow label="이메일" value={school.email} />
          <DetailRow label="연락처" value={school.contact} />
        </div>
      </div>
    </div>
  )
}

/* ─── AddSchoolModal ─── */
function AddSchoolModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: '#fff', borderRadius: 4, padding: '32px 28px 24px', width: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
        <div style={{ fontSize: 17, fontWeight: 700, textAlign: 'center', marginBottom: 24, color: 'var(--t1)' }}>새로운 학교 추가하기</div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
          <div style={{ flex: 1, border: '1.5px solid var(--bd)', borderRadius: 4, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--ac)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--bd)'}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'var(--t3)' }}>+</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--t1)', textAlign: 'center' }}>새로운 학교 추가하기</div>
            <div style={{ fontSize: 12, color: 'var(--t3)', textAlign: 'center', lineHeight: 1.5 }}>관리할 수 있는 새로운 학교를 단건으로 추가해 보세요.</div>
          </div>
          <div style={{ flex: 1, border: '1.5px solid #16a34a', borderRadius: 4, padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', background: '#f0fdf4' }}>
            <div style={{ width: 48, height: 48, borderRadius: 4, background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div style={{ fontWeight: 600, fontSize: 14, color: '#16a34a', textAlign: 'center' }}>엑셀에서 가져오기</div>
            <div style={{ fontSize: 12, color: 'var(--t3)', textAlign: 'center', lineHeight: 1.5 }}>엑셀에 학교 정보를 등록해 다수의 학교를 등록해 보세요.</div>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-s" style={{ minWidth: 80 }} onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  )
}

/* ─── chip id counter ─── */
let nextChipId = 1

/* ─── Main Component ─── */
export default function GroupList() {
  const { isSchoolAdmin, schoolId } = useSchoolScope()
  const [search, setSearch]       = useState('')
  const [query, setQuery]         = useState('')
  const [selected, setSelected]   = useState(null)
  const [page, setPage]           = useState(1)
  const [pageSize, setPageSize]   = useState(PAGE_SIZE)
  const [showModal, setShowModal] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const addMenuRef = useRef(null)
  useEffect(() => {
    function handleClick(e) { if (addMenuRef.current && !addMenuRef.current.contains(e.target)) setShowAddMenu(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  const [schoolType, setSchoolType] = useState('전체')
  const [sortKey, setSortKey]     = useState(null)
  const [sortDir, setSortDir]     = useState('asc')
  const [hiddenCols, setHiddenCols] = useState(() => {
    try { return JSON.parse(localStorage.getItem('grouplist_hidden_cols') || '[]') } catch { return [] }
  })

  const toggleCol = (key) => setHiddenCols(prev => {
    const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    localStorage.setItem('grouplist_hidden_cols', JSON.stringify(next))
    return next
  })

  if (isSchoolAdmin && schoolId) {
    const mySchool = DUMMY.schools.find(s => s.schoolId === schoolId)
    if (mySchool) return <SchoolDetail school={mySchool} onClose={() => {}} />
  }

  const filtered = DUMMY.schools.filter(s => {
    if (schoolType !== '전체' && s.type !== schoolType) return false
    if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false
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

  const handleClose = () => setSelected(null)

  const COLS_ALL = [
    { key: 'name',       label: '기관이름' },
    { key: 'type',       label: '학교구분' },
    { key: 'manager',    label: '관리자' },
    { key: 'loginId',    label: '아이디' },
    { key: 'email',      label: '이메일' },
    { key: 'contact',    label: '연락처' },
    { key: 'schoolCode', label: '학교코드' },
    { key: 'createdAt',  label: '생성일' },
  ]

  const COLS = [
    { key: 'no', label: 'No.', width: 56, align: 'center', render: (_, r, i) => <span style={{ color: 'var(--t3)', fontSize: 12 }}>{total - ((page - 1) * pageSize + i)}</span> },
    { key: 'name',       label: '기관이름',  sortable: true, render: (v, row) => (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: '#3b82f6', fontWeight: 500 }}>{v}</span>
        <a
          href={row.orgUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
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
      </span>
    ) },
    { key: 'type',       label: '학교구분',  sortable: true },
    { key: 'manager',    label: '관리자',    render: v => <span style={{ color: !v || v === '-' ? 'var(--t3)' : 'var(--t1)' }}>{v || '-'}</span> },
    { key: 'loginId',    label: '아이디',    render: v => <span style={{ fontSize: 12 }}>{v}</span> },
    { key: 'email',      label: '이메일',    render: v => <span style={{ color: !v || v === '-' ? 'var(--t3)' : 'var(--t1)' }}>{v || '-'}</span> },
    { key: 'contact',    label: '연락처',    render: v => <span style={{ color: !v || v === '-' ? 'var(--t3)' : 'var(--t1)' }}>{v || '-'}</span> },
    { key: 'schoolCode', label: '학교코드',  render: v => <span style={{ fontSize: 12 }}>{v}</span> },
    { key: 'createdAt',  label: '생성일',    sortable: true, nowrap: true, render: v => <span style={{ color: 'var(--t2)', fontSize: 12 }}>{v}</span> },

  ].filter(c => !hiddenCols.includes(c.key))

  const STATUS_TABS = SCHOOL_TYPES.map(t => ({
    label: t,
    value: t,
    count: t === '전체' ? DUMMY.schools.length : DUMMY.schools.filter(s => s.type === t).length,
  }))

  return (
    <div style={{ padding: '28px 32px' }}>
      {showModal && <AddSchoolModal onClose={() => setShowModal(false)} />}

      {/* 페이지 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>운영 관리</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            기관 관리 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <div ref={addMenuRef} style={{ position: 'relative' }}>
            <button
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
              onClick={() => setShowAddMenu(m => !m)}
              onMouseEnter={e => e.currentTarget.style.background = '#1f2937'}
              onMouseLeave={e => e.currentTarget.style.background = '#111827'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              기관 추가
            </button>
            {showAddMenu && (
              <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.12)', minWidth: 180, zIndex: 200, overflow: 'hidden' }}>
                <div
                  style={{ padding: '11px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setShowAddMenu(false); setShowModal(true) }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  새로운 기관 추가
                </div>
                <div style={{ height: 1, background: 'var(--bd)' }} />
                <div
                  style={{ padding: '11px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setShowAddMenu(false)}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V8m0 0l-4 4m4-4l4 4M5 4h14"/></svg>
                  엑셀에서 가져오기
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 필터 바 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* 학교 구분 탭 */}
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {STATUS_TABS.map((tab, i) => {
            const active = schoolType === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => { setSchoolType(tab.value); setPage(1) }}
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

        {/* 검색 (우측) */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              className="inp"
              style={{ width: 220, paddingTop: 7, paddingBottom: 7, paddingRight: search ? 60 : 36, background: '#fff' }}
              placeholder="기관명으로 검색"
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

      {/* 테이블 */}
      <Table
        disableInactive
        cols={COLS}
        rows={rows}
        selectedId={selected?.schoolId}
        onRowClick={row => setSelected(prev => prev?.schoolId === row.schoolId ? null : row)}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        emptyContext={{
          query,
          onReset: () => { setSearch(''); setQuery(''); setSchoolType('전체'); setPage(1) },
        }}
      />

      {/* 페이지네이션 */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
        <ColToggle cols={COLS_ALL} hiddenCols={hiddenCols} onToggle={toggleCol} />
        <div style={{ flex: 1 }}>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>

      {/* 상세 패널 */}
      {selected && (
        <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.12)', zIndex: 200, overflowY: 'auto' }}>
          <SchoolDetail school={selected} onClose={handleClose} />
        </div>
      )}
    </div>
  )
}
