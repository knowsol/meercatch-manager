'use client'
import { useState, useEffect, useRef } from 'react'
import { DUMMY } from '../../data/dummy'
import Table from '../../components/common/Table'
import Pagination from '../../components/common/Pagination'
import { useSchoolScope } from '../../hooks/useSchoolScope'
import SearchableSelect from '../../components/common/SearchableSelect'
import { StatusBadge } from '../../components/common/Badge'

const PAGE_SIZE = 10

function parseGrade(name) { const m = name?.match(/(\d+)학년/); return m ? m[1] : '' }
function parseClass(name) { const m = name?.match(/(\d+)반/);  return m ? m[1] : '' }

// ─── helper components ───────────────────────────────────────────────────────

function FilterChip({ label, value, options, onRemove, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px', borderRadius: 4, fontSize: 12, cursor: 'pointer',
          background: 'var(--ac-subtle, rgba(99,102,241,0.08))',
          border: '1px solid var(--ac)',
          color: 'var(--ac)', userSelect: 'none',
        }}
      >
        <span style={{ color: 'var(--t2)' }}>{label}:</span>
        <span style={{ fontWeight: 600 }}>{options.find(o => o.value === value)?.label ?? value}</span>
        <span
          onClick={e => { e.stopPropagation(); onRemove() }}
          style={{ marginLeft: 2, opacity: 0.6, fontWeight: 700, lineHeight: 1 }}
        >×</span>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 400,
          background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,.2)', minWidth: 160, overflow: 'hidden',
        }}>
          {options.map(o => (
            <div
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false) }}
              style={{
                padding: '9px 14px', fontSize: 13, cursor: 'pointer',
                background: o.value === value ? 'var(--bg3)' : 'transparent',
                color: 'var(--t1)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = o.value === value ? 'var(--bg3)' : 'transparent'}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchableFilterChip({ label, value, values, onSelect, onRemove }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => {
    if (open) { setSearch(''); setTimeout(() => inputRef.current?.focus(), 0) }
  }, [open])

  const filtered = values.filter(v => v.toLowerCase().includes(search.toLowerCase()))

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <span
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0 10px', fontSize: 12, borderRadius: 4, height: 31, border: '1px solid var(--bd)', background: '#fff', cursor: 'pointer', userSelect: 'none', boxSizing: 'border-box' }}
      >
        <span style={{ color: 'var(--t3)' }}>{label}</span>
        {value && <span style={{ color: 'var(--t1)' }}>{value}</span>}
        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: 2, color: 'var(--t3)' }}><polyline points="6 9 12 15 18 9"/></svg>
        <span onClick={e => { e.stopPropagation(); onRemove() }} style={{ marginLeft: 2, color: 'var(--t3)', fontSize: 14, lineHeight: 1 }}>×</span>
      </span>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 400, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.2)', minWidth: 200, overflow: 'hidden' }}>
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--bd)' }}>
            <input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="검색..."
              style={{ width: '100%', fontSize: 12, padding: '5px 8px', boxSizing: 'border-box', border: '1px solid var(--bd)', borderRadius: 4, outline: 'none', background: 'var(--bg2)', color: 'var(--t1)' }} />
          </div>
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {filtered.length === 0
              ? <div style={{ padding: '10px 14px', fontSize: 12, color: 'var(--t3)' }}>검색 결과 없음</div>
              : filtered.map(v => (
                <div key={v} onClick={() => { onSelect(v); setOpen(false) }}
                  style={{ padding: '9px 14px', fontSize: 13, cursor: 'pointer', color: value === v ? '#f97316' : 'var(--t1)', fontWeight: value === v ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {v}
                  {value === v && <svg width="13" height="13" fill="none" stroke="#f97316" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  )
}

function AddFilterButton({ defs, active, onAdd }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const available = defs.filter(d => !active.includes(d.key))
  if (!available.length) return null
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="btn"
        onClick={() => setOpen(o => !o)}
        style={{ fontSize: 12, color: 'var(--t2)', display: 'flex', alignItems: 'center', gap: 4 }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        필터 추가
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 400,
          background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,.2)', minWidth: 160, overflow: 'hidden',
        }}>
          {available.map(d => (
            <div
              key={d.key}
              onClick={() => { onAdd(d.key); setOpen(false) }}
              style={{ padding: '9px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {d.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ColToggle({ cols, hiddenCols, onToggle }) {
  const [open, setOpen] = useState(false)
  const [dropPos, setDropPos] = useState({ bottom: 0, left: 0 })
  const ref = useRef(null)
  const btnRef = useRef(null)
  const toggleable = cols.filter(c => c.label && typeof c.label === 'string')
  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
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
      <button ref={btnRef} onClick={handleToggleOpen} title="열 표시 설정"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, border: 'none', background: 'none', color: hiddenCols.length > 0 ? 'var(--t1)' : 'var(--t3)', cursor: 'pointer', position: 'relative', flexShrink: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--t1)'}
        onMouseLeave={e => e.currentTarget.style.color = hiddenCols.length > 0 ? 'var(--t1)' : 'var(--t3)'}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24" style={{ marginTop: 4 }}>
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
          <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
        {hiddenCols.length > 0 && <span style={{ position: 'absolute', top: 4, right: -2, width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} />}
      </button>
      {open && (
        <div style={{ position: 'fixed', bottom: dropPos.bottom, left: dropPos.left, zIndex: 9999, background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4, boxShadow: '0 6px 20px rgba(0,0,0,0.12)', minWidth: 160, overflow: 'hidden' }}>
          <div style={{ padding: '8px 14px 6px', fontSize: 11, color: 'var(--t3)', fontWeight: 600, borderBottom: '1px solid var(--bd)' }}>열 표시 설정</div>
          {toggleable.map(c => {
            const hidden = hiddenCols.includes(c.key)
            return (
              <div key={c.key} onClick={() => onToggle(c.key)}
                style={{ padding: '8px 14px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0, border: `1.5px solid ${!hidden ? '#111827' : 'var(--bd)'}`, background: !hidden ? '#111827' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

function KebabMenu({ items }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const ref = useRef(null)
  const btnRef = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  function handleOpen(e) {
    e.stopPropagation()
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.right - 140 })
    }
    setOpen(o => !o)
  }
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px',
          color: 'var(--t3)', borderRadius: 4, lineHeight: 1,
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--t1)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
      >
        ···
      </button>
      {open && (
        <div style={{
          position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999,
          background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,.2)', minWidth: 140, overflow: 'hidden',
        }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={e => { e.stopPropagation(); item.onClick(); setOpen(false) }}
              style={{
                padding: '9px 14px', fontSize: 13, cursor: 'pointer',
                color: item.danger ? 'var(--red, #ef4444)' : 'var(--t1)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── constants ────────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { value: '', label: '전체' },
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
]

const COLS_ALL = [
  { key: 'no',          label: 'No.',    always: true },
  { key: 'school',      label: '기관이름' },
  { key: 'name',        label: '그룹명', always: true },
  { key: 'grade',       label: '학년' },
  { key: 'class',       label: '반이름' },
  { key: 'studentCount',label: '학생 수' },
  { key: 'deviceCount', label: '라이선스' },
  { key: 'manager',     label: '그룹관리자' },
  { key: 'loginId',     label: '아이디' },
  { key: 'updatedAt',   label: '생성일' },
  { key: 'actions',     label: '',       always: true },
]

const FILTER_DEFS = [
  {
    key: 'grade',
    label: '학년',
    getOptions: (groups) => {
      const grades = [...new Set(groups.map(g => parseGrade(g.name)).filter(Boolean))].sort((a, b) => +a - +b)
      return grades.map(g => ({ value: g, label: `${g}학년` }))
    },
  },
]

// ─── main component ───────────────────────────────────────────────────────────

export default function ClassList() {
  const { isSchoolAdmin, schoolId } = useSchoolScope()

  // filter state
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch]             = useState('')
  const [query, setQuery]               = useState('')
  const [schoolFilter, setSchoolFilter] = useState('')
  const [filterValues, setFilterValues] = useState({})
  const [activeFilters, setActiveFilters] = useState([])
  const [yearFilter]                    = useState('2026')

  // table state
  const [page, setPage]                 = useState(1)
  const [pageSize, setPageSize]         = useState(PAGE_SIZE)
  const [hiddenCols, setHiddenCols]     = useState([])
  const [sortKey, setSortKey]           = useState('')
  const [sortDir, setSortDir]           = useState('asc')

  // modal state
  const [showAddMenu, setShowAddMenu]         = useState(false)
  const [showAddForm, setShowAddForm]         = useState(false)
  const [showExcelImport, setShowExcelImport] = useState(false)
  const [form, setForm]                       = useState({ name: '', schoolId: '', grade: '', classNum: '' })
  const [excelFile, setExcelFile]             = useState(null)

  const addMenuRef = useRef(null)

  useEffect(() => setPage(1), [search, query, schoolFilter, statusFilter, filterValues])

  useEffect(() => {
    const h = e => { if (addMenuRef.current && !addMenuRef.current.contains(e.target)) setShowAddMenu(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // ── data ──
  const allGroups = DUMMY.groups || []
  const groups = isSchoolAdmin && schoolId
    ? allGroups.filter(g => g.schoolId === schoolId)
    : allGroups

  const schools = [...new Set(groups.map(g => g.schoolId).filter(Boolean))]
    .map(id => DUMMY.schools?.find(s => s.schoolId === id))
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name))

  const studentCountByGroup = (groupId) =>
    (DUMMY.students || []).filter(s => s.groupId === groupId).length

  // ── filter ──
  const filtered = groups.filter(g => {
    if (statusFilter && g.status !== statusFilter) return false
    const q = (query || search).toLowerCase()
    if (q && !g.name.toLowerCase().includes(q)) return false
    if (schoolFilter && String(g.schoolId) !== String(schoolFilter)) return false
    if (filterValues.grade && parseGrade(g.name) !== filterValues.grade) return false
    if (filterValues.class && parseClass(g.name) !== filterValues.class) return false
    return true
  })

  // ── sort ──
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    let av = a[sortKey], bv = b[sortKey]
    if (sortKey === 'studentCount') { av = studentCountByGroup(a.groupId); bv = studentCountByGroup(b.groupId) }
    if (av == null) return 1; if (bv == null) return -1
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : av - bv
    return sortDir === 'asc' ? cmp : -cmp
  })

  const total = filtered.length
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize)

  const activeCount   = groups.filter(g => g.status === 'active').length
  const inactiveCount = groups.filter(g => g.status === 'inactive').length

  // ── column visibility (respect isSchoolAdmin) ──
  const effectiveHiddenCols = hiddenCols
  const effectiveVisible = COLS_ALL.map(c => c.key).filter(k => !effectiveHiddenCols.includes(k))

  const toggleCol = (key) => {
    setHiddenCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  // ── sort handler ──
  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  // ── filter chip helpers ──
  const addFilter = (key) => {
    setActiveFilters(prev => prev.includes(key) ? prev : [...prev, key])
  }
  const removeFilter = (key) => {
    setActiveFilters(prev => prev.filter(k => k !== key))
    setFilterValues(prev => { const next = { ...prev }; delete next[key]; return next })
  }

  // ── search ──
  const doSearch = () => { setQuery(search); setPage(1) }

  // ── reset ──
  const hasFilters = !!(statusFilter || search || schoolFilter || Object.keys(filterValues).length)
  const resetFilters = () => {
    setStatusFilter(''); setSearch(''); setQuery(''); setSchoolFilter('')
    setFilterValues({}); setActiveFilters([])
  }

  // ── cols for ColToggle (exclude school if isSchoolAdmin, exclude always cols) ──
  const colToggleCols = COLS_ALL.filter(c => !c.always)

  return (
    <div style={{ padding: '28px 32px' }}>

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>운영 관리</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            그룹 관리 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <div ref={addMenuRef} style={{ position: 'relative' }}>
            <button
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: '#111827', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
              onClick={() => setShowAddMenu(m => !m)}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              그룹 추가
            </button>
            {showAddMenu && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 180, zIndex: 300,
                background: 'var(--bg1)', border: '1px solid var(--bd)', borderRadius: 4,
                boxShadow: '0 4px 16px rgba(0,0,0,.2)', overflow: 'hidden',
              }}>
                <div
                  style={{ padding: '11px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setShowAddMenu(false); setForm({ name: '', schoolId: '', grade: '', classNum: '' }); setShowAddForm(true) }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  새로운 그룹 추가
                </div>
                <div style={{ height: 1, background: 'var(--bd)' }} />
                <div
                  style={{ padding: '11px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setShowAddMenu(false) }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V8m0 0l-4 4m4-4l4 4M5 4h14"/></svg>
                  그룹 일괄추가
                </div>
                <div style={{ height: 1, background: 'var(--bd)' }} />
                <div
                  style={{ padding: '11px 16px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)', display: 'flex', alignItems: 'center', gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => { setShowAddMenu(false); setExcelFile(null); setShowExcelImport(true) }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  엑셀에서 가져오기
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>


        {/* 학년도 (비활성) */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '0 10px', fontSize: 12, borderRadius: 4, height: 31, border: '1px solid var(--bd)', background: 'var(--bg2)', color: 'var(--t3)', userSelect: 'none', boxSizing: 'border-box', cursor: 'not-allowed', opacity: 0.6 }}>
          <span>학년도</span>
          <span style={{ color: 'var(--t2)' }}>{yearFilter}</span>
        </span>

        {/* 기관이름 (검색 칩) */}
        <SearchableFilterChip
          label="기관이름"
          value={schoolFilter ? schools.find(s => s.schoolId === schoolFilter)?.name || '' : ''}
          values={schools.map(s => s.name)}
          onSelect={name => { const s = schools.find(sc => sc.name === name); setSchoolFilter(s?.schoolId || ''); setPage(1) }}
          onRemove={() => { setSchoolFilter(''); setPage(1) }}
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

      {/* ── TABLE ───────────────────────────────────────────────────────── */}
      <div className="dt-wrap">
        <table className="dt">
          <thead>
            <tr>
              {effectiveVisible.filter(k => k !== 'actions').map(key => {
                const col = COLS_ALL.find(c => c.key === key)
                if (!col) return null
                const sortable = ['name', 'studentCount', 'deviceCount', 'policyCount', 'status'].includes(key)
                return (
                  <th
                    key={key}
                    onClick={sortable ? () => handleSort(key) : undefined}
                    style={{ cursor: sortable ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap' }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {col.label}
                      {sortable && (
                        <span style={{ opacity: sortKey === key ? 1 : 0.3, fontSize: 10 }}>
                          {sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : '↑'}
                        </span>
                      )}
                    </span>
                  </th>
                )
              })}
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {paged.map((g, i) => {
              const school = DUMMY.schools?.find(s => s.schoolId === g.schoolId)
              const studentCount = studentCountByGroup(g.groupId)
              const no = filtered.length - ((page - 1) * pageSize + i)
              return (
                <tr
                  key={g.groupId}
                  className="clickable"
                >
                  {effectiveVisible.includes('no') && (
                    <td style={{ color: 'var(--t3)', fontSize: 12 }}>{no}</td>
                  )}
                  {effectiveVisible.includes('school') && (
                    <td>{school?.name || '-'}</td>
                  )}
                  {effectiveVisible.includes('name') && (
                    <td><span style={{ fontWeight: 600 }}>{g.name}</span></td>
                  )}
                  {effectiveVisible.includes('grade') && (
                    <td>{parseGrade(g.name) ? `${parseGrade(g.name)}학년` : '-'}</td>
                  )}
                  {effectiveVisible.includes('class') && (
                    <td>{parseClass(g.name) ? `${parseClass(g.name)}반` : '-'}</td>
                  )}
                  {effectiveVisible.includes('studentCount') && (
                    <td>{studentCount}명</td>
                  )}
                  {effectiveVisible.includes('deviceCount') && (
                    <td>{g.deviceCount}</td>
                  )}
                  {effectiveVisible.includes('policyCount') && (
                    <td>{g.policyCount}</td>
                  )}
                  {effectiveVisible.includes('status') && (
                    <td><StatusBadge status={g.status === 'active' ? 'active' : 'inactive'} /></td>
                  )}
                  {effectiveVisible.includes('manager') && (
                    <td>{school?.manager || '-'}</td>
                  )}
                  {effectiveVisible.includes('loginId') && (
                    <td style={{ fontSize: 12, color: 'var(--t3)' }}>{school?.loginId || '-'}</td>
                  )}
                  {effectiveVisible.includes('updatedAt') && (
                    <td style={{ color: 'var(--t3)', fontSize: 12 }}>{g.updatedAt || '-'}</td>
                  )}
                  <td onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
                    <KebabMenu items={[
                      { label: '수정', onClick: () => {} },
                      { label: '삭제', onClick: () => {}, danger: true },
                    ]} />
                  </td>
                </tr>
              )
            })}
            {paged.length === 0 && (
              <tr>
                <td colSpan={effectiveVisible.length + 2} style={{ textAlign: 'center', color: 'var(--t3)', padding: '60px 14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <span>검색 결과가 없습니다.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── PAGINATION FOOTER ───────────────────────────────────────────── */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
        <ColToggle cols={colToggleCols} hiddenCols={hiddenCols} onToggle={toggleCol} />
        <div style={{ flex: 1 }}>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>

      {/* ── 새로운 그룹 추가 모달 ─────────────────────────────────────────── */}
      {showAddForm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowAddForm(false) }}
        >
          <div style={{ background: 'var(--bg1)', borderRadius: 4, width: 440, boxShadow: '0 8px 32px rgba(0,0,0,.3)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>새로운 그룹 추가</span>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {!isSchoolAdmin && (
                <div style={{ padding: '28px 32px' }}>
                  <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>학교</label>
                  <SearchableSelect
                    value={form.schoolId}
                    onChange={v => setForm(f => ({ ...f, schoolId: v }))}
                    options={(DUMMY.schools || []).sort((a, b) => a.name.localeCompare(b.name)).map(s => ({ value: s.schoolId, label: s.name }))}
                    placeholder="학교 선택"
                    style={{ width: '100%' }}
                  />
                </div>
              )}
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>학년</label>
                <select className="inp" style={{ width: '100%' }} value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
                  <option value="">학년 선택</option>
                  {[1,2,3,4,5,6].map(g => <option key={g} value={g}>{g}학년</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>반</label>
                <select className="inp" style={{ width: '100%' }} value={form.classNum} onChange={e => setForm(f => ({ ...f, classNum: e.target.value }))}>
                  <option value="">반 선택</option>
                  {[1,2,3,4,5,6,7,8,9,10].map(c => <option key={c} value={c}>{c}반</option>)}
                </select>
              </div>
              {form.grade && form.classNum && (
                <div style={{ padding: '10px 14px', background: 'var(--bg3)', borderRadius: 4, fontSize: 13, color: 'var(--t2)' }}>
                  그룹명: <span style={{ color: 'var(--t1)', fontWeight: 600 }}>{form.grade}학년 {form.classNum}반</span>
                </div>
              )}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--bd)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setShowAddForm(false)} style={{ color: 'var(--t2)' }}>취소</button>
              <button className="btn btn-p" onClick={() => setShowAddForm(false)}>추가</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 엑셀에서 가져오기 모달 ───────────────────────────────────────── */}
      {showExcelImport && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) setShowExcelImport(false) }}
        >
          <div style={{ background: 'var(--bg1)', borderRadius: 4, width: 480, boxShadow: '0 8px 32px rgba(0,0,0,.3)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--bd)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--t1)' }}>엑셀에서 가져오기</span>
              <button onClick={() => setShowExcelImport(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.6 }}>
                엑셀 파일(.xlsx, .xls)을 업로드하면 그룹 목록을 일괄 등록할 수 있습니다.
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>템플릿 다운로드</label>
                <button className="btn" style={{ fontSize: 13, color: 'var(--ac)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  그룹 등록 양식 다운로드
                </button>
              </div>
              <div>
                <label style={{ fontSize: 12, color: 'var(--t2)', marginBottom: 6, display: 'block' }}>파일 업로드</label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 10, padding: '32px 20px', border: `2px dashed ${excelFile ? 'var(--ac)' : 'var(--bd)'}`,
                  borderRadius: 4, cursor: 'pointer', background: excelFile ? 'rgba(99,102,241,0.05)' : 'var(--bg3)',
                  transition: 'all .15s',
                }}>
                  <input type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={e => setExcelFile(e.target.files?.[0] || null)} />
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={excelFile ? 'var(--ac)' : 'var(--t3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  {excelFile
                    ? <span style={{ fontSize: 13, color: 'var(--ac)', fontWeight: 600 }}>{excelFile.name}</span>
                    : <>
                        <span style={{ fontSize: 13, color: 'var(--t2)' }}>파일을 끌어다 놓거나 클릭하여 선택</span>
                        <span style={{ fontSize: 12, color: 'var(--t3)' }}>.xlsx, .xls, .csv</span>
                      </>
                  }
                </label>
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--bd)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn" onClick={() => setShowExcelImport(false)} style={{ color: 'var(--t2)' }}>취소</button>
              <button className="btn btn-p" disabled={!excelFile} style={{ opacity: excelFile ? 1 : 0.4 }} onClick={() => setShowExcelImport(false)}>가져오기</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
