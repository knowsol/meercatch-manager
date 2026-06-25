'use client'
import { useState, useRef, useEffect } from 'react'
import Table from '../../components/common/Table'
import Pagination from '../../components/common/Pagination'
import DateRangePicker from '../../components/common/DateRangePicker'

const RAW = [
  { no:28, name:'Meercat.ch',       version:'1.0.0.5', os:'Android', deployedAt:'2026.04.28. 오후 01:40', devices:1 },
  { no:27, name:'Meercat.ch',       version:'1.0.0.4', os:'Android', deployedAt:'2026.04.01. 오후 04:44', devices:1 },
  { no:26, name:'Meercat.ch',       version:'1.0.0.3', os:'Android', deployedAt:'2026.03.25. 오후 01:18', devices:1 },
  { no:25, name:'MeerCat.ch',       version:'1.0.0.1', os:'Windows', deployedAt:'2026.03.11. 오전 10:59', devices:0 },
  { no:24, name:'MeerCat.ch',       version:'7.7.0.7', os:'Windows', deployedAt:'2025.10.14. 오후 03:15', devices:1 },
  { no:23, name:'MeerCat.ch 선정성', version:'1.0.0.2', os:'Android', deployedAt:'2025.09.29. 오후 04:27', devices:2 },
  { no:22, name:'MeerCat.ch',       version:'1.0.0.6', os:'Windows', deployedAt:'2025.09.16. 오후 01:19', devices:4 },
  { no:21, name:'MeerCat.ch',       version:'1.0.0.5', os:'Windows', deployedAt:'2025.08.21. 오후 06:14', devices:11 },
  { no:20, name:'MeerCat.ch',       version:'1.0.0.4', os:'Windows', deployedAt:'2025.08.04. 오전 09:52', devices:2 },
  { no:19, name:'MeerCat.ch',       version:'1.0.0.1', os:'WhaleOS', deployedAt:'2025.08.01. 오후 02:47', devices:6 },
  { no:18, name:'MeerCat.ch',       version:'1.0.0.3', os:'WhaleOS', deployedAt:'2025.07.20. 오후 03:11', devices:3 },
  { no:17, name:'MeerCat.ch',       version:'1.0.0.2', os:'WhaleOS', deployedAt:'2025.07.10. 오전 11:05', devices:8 },
  { no:16, name:'Meercat.ch',       version:'1.0.0.2', os:'Android', deployedAt:'2025.06.28. 오후 02:33', devices:5 },
  { no:15, name:'Meercat.ch',       version:'1.0.0.1', os:'Android', deployedAt:'2025.06.15. 오전 10:20', devices:12 },
  { no:14, name:'MeerCat.ch',       version:'7.7.0.6', os:'Windows', deployedAt:'2025.06.01. 오후 04:00', devices:2 },
  { no:13, name:'MeerCat.ch',       version:'7.7.0.5', os:'Windows', deployedAt:'2025.05.18. 오후 01:45', devices:0 },
  { no:12, name:'MeerCat.ch',       version:'7.7.0.4', os:'Windows', deployedAt:'2025.05.05. 오전 09:30', devices:1 },
  { no:11, name:'MeerCat.ch',       version:'7.7.0.3', os:'Windows', deployedAt:'2025.04.22. 오후 03:15', devices:3 },
  { no:10, name:'MeerCat.ch',       version:'7.7.0.2', os:'Windows', deployedAt:'2025.04.08. 오전 11:00', devices:7 },
  { no:9,  name:'MeerCat.ch',       version:'7.7.0.1', os:'Windows', deployedAt:'2025.03.25. 오후 02:20', devices:4 },
  { no:8,  name:'MeerCat.ch 선정성', version:'1.0.0.1', os:'Android', deployedAt:'2025.03.10. 오후 05:00', devices:0 },
  { no:7,  name:'MeerCat.ch',       version:'7.7.0.0', os:'Windows', deployedAt:'2025.03.01. 오전 10:00', devices:9 },
  { no:6,  name:'MeerCat.ch',       version:'1.0.0.9', os:'WhaleOS', deployedAt:'2025.02.15. 오후 01:30', devices:2 },
  { no:5,  name:'MeerCat.ch',       version:'1.0.0.8', os:'WhaleOS', deployedAt:'2025.02.01. 오전 09:00', devices:5 },
  { no:4,  name:'MeerCat.ch',       version:'1.0.0.7', os:'WhaleOS', deployedAt:'2025.01.18. 오후 03:45', devices:1 },
  { no:3,  name:'Meercat.ch',       version:'1.0.0.0', os:'Android', deployedAt:'2025.01.05. 오전 10:30', devices:0 },
  { no:2,  name:'MeerCat.ch',       version:'7.6.0.1', os:'Windows', deployedAt:'2024.12.20. 오후 02:00', devices:3 },
  { no:1,  name:'MeerCat.ch',       version:'7.6.0.0', os:'Windows', deployedAt:'2024.12.01. 오전 09:00', devices:0 },
]

const OS_LIST = ['Android', 'Windows', 'WhaleOS']

const FILTER_DEFS = [
  { key: 'os', label: 'OS 타입', options: OS_LIST },
]

const COLS_ALL = [
  { key: 'no',         label: 'No.',       width: '80px',  render: v => <span style={{ color: 'var(--t2)' }}>{v}</span> },
  { key: 'name',       label: '앱 이름' },
  { key: 'version',    label: '버전',      width: '120px' },
  { key: 'os',         label: 'OS 타입',   width: '120px', render: v => <span style={{ fontSize: 13 }}>{v}</span> },
  { key: 'deployedAt', label: '배포일' },
  { key: 'devices',    label: '단말기 수', width: '100px', render: v => `${v}대` },
]

const STATUS_TABS = [
  { value: '', label: '전체' },
  { value: 'Android', label: 'Android' },
  { value: 'Windows', label: 'Windows' },
  { value: 'WhaleOS', label: 'WhaleOS' },
]

/* ── helper components ── */

function FilterChip({ label, value, options, onChange, onRemove }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4, height: 32, padding: '0 10px',
          border: '1px solid var(--bd)', borderRadius: 4, background: value ? 'var(--primary-10, #eff6ff)' : 'var(--bg)',
          fontSize: 13, color: value ? 'var(--primary, #2563eb)' : 'var(--t2)', cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        {label}{value ? `: ${value}` : ''}
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 36, left: 0, zIndex: 100, background: 'var(--bg)',
          border: '1px solid var(--bd)', borderRadius: 4, padding: '4px 0', minWidth: 140,
          boxShadow: '0 4px 16px rgba(0,0,0,.12)',
        }}>
          <div
            onClick={() => { onChange(''); setOpen(false) }}
            style={{ padding: '7px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t2)' }}
          >전체</div>
          {options.map(o => (
            <div
              key={o}
              onClick={() => { onChange(o); setOpen(false) }}
              style={{
                padding: '7px 14px', fontSize: 13, cursor: 'pointer',
                color: value === o ? 'var(--primary, #2563eb)' : 'var(--t1)',
                background: value === o ? 'var(--primary-10, #eff6ff)' : 'transparent',
              }}
            >{o}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function AddFilterButton({ available, onAdd }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  if (!available.length) return null
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 4, height: 32, padding: '0 10px',
          border: '1px dashed var(--bd)', borderRadius: 4, background: 'transparent',
          fontSize: 13, color: 'var(--t3)', cursor: 'pointer',
        }}
      >
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        필터 추가
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 36, left: 0, zIndex: 100, background: 'var(--bg)',
          border: '1px solid var(--bd)', borderRadius: 4, padding: '4px 0', minWidth: 140,
          boxShadow: '0 4px 16px rgba(0,0,0,.12)',
        }}>
          {available.map(f => (
            <div
              key={f.key}
              onClick={() => { onAdd(f.key); setOpen(false) }}
              style={{ padding: '7px 14px', fontSize: 13, cursor: 'pointer', color: 'var(--t1)' }}
            >{f.label}</div>
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

/* ── main component ── */

export default function AppVersionList() {
  const [search, setSearch]       = useState('')
  const [query, setQuery]         = useState('')
  const [dateFrom, setDateFrom]   = useState(null)
  const [dateTo, setDateTo]       = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [activeFilters, setActiveFilters] = useState(['os'])
  const [filterValues, setFilterValues]   = useState({ os: '' })
  const [selectedIds, setSelectedIds]     = useState([])
  const [sortKey, setSortKey]   = useState('')
  const [sortDir, setSortDir]   = useState('asc')
  const [page, setPage]         = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [hiddenCols, setHiddenCols] = useState([])

  const toggleCol = key => setHiddenCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  const doSearch = () => { setQuery(search); setPage(1) }

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = RAW.filter(r => {
    if (statusFilter && r.os !== statusFilter) return false
    if (query && !r.name.toLowerCase().includes(query.toLowerCase()) && !r.version.includes(query)) return false
    if (filterValues.os && r.os !== filterValues.os) return false
    return true
  })

  const total = filtered.length

  const statusTabsWithCount = STATUS_TABS.map(tab => ({
    ...tab,
    count: tab.value === '' ? RAW.length : RAW.filter(r => r.os === tab.value).length,
  }))

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0
    const av = a[sortKey], bv = b[sortKey]
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)

  const cols = COLS_ALL.filter(c => !hiddenCols.includes(c.key))

  const availableToAdd = FILTER_DEFS.filter(f => !activeFilters.includes(f.key))

  const allPageIds = paginated.map(r => r.no)
  const allChecked = allPageIds.length > 0 && allPageIds.every(id => selectedIds.includes(id))
  const someChecked = allPageIds.some(id => selectedIds.includes(id))

  const toggleAll = () => {
    if (allChecked) setSelectedIds(ids => ids.filter(id => !allPageIds.includes(id)))
    else setSelectedIds(ids => [...new Set([...ids, ...allPageIds])])
  }
  const toggleRow = id => {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id])
  }

  const checkboxCol = {
    key: '__chk',
    label: (
      <input
        type="checkbox"
        checked={allChecked}
        ref={el => { if (el) el.indeterminate = someChecked && !allChecked }}
        onChange={toggleAll}
      />
    ),
    width: '40px',
    render: (_, row) => (
      <input
        type="checkbox"
        checked={selectedIds.includes(row.no)}
        onChange={() => toggleRow(row.no)}
        onClick={e => e.stopPropagation()}
      />
    ),
  }

  const displayCols = [checkboxCol, ...cols]

  const actionBar = selectedIds.length > 0 ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 13, color: 'var(--t2)' }}>{selectedIds.length}개 선택됨</span>
      <button className="btn btn-outline" style={{ fontSize: 13, height: 30, padding: '0 12px' }}
        onClick={() => setSelectedIds([])}>선택 해제</button>
    </div>
  ) : null

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>관리자 전용</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)' }}>
            앱 버전 관리 <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--t3)', marginLeft: 4 }}>{total}</span>
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            가져오기
          </button>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 4, background: 'var(--bg1)', color: 'var(--t2)', border: '1px solid var(--bd)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            내보내기
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* 상태 탭 묶음 */}
        <div style={{ display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
          {statusTabsWithCount.map((tab, i) => {
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

      {/* TABLE */}
      <Table
        cols={displayCols}
        rows={paginated}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        actionBar={actionBar}
      />

      {/* PAGINATION FOOTER */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 3 }}>
        <ColToggle cols={COLS_ALL} hiddenCols={hiddenCols} onToggle={toggleCol} />
        <div style={{ flex: 1 }}>
          <Pagination page={page} total={total} pageSize={pageSize} onChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </div>
  )
}
